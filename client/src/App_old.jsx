// client/src/App.jsx
import { useEffect, useState, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MAX_DATA_POINTS = 1000;

function App() {
  const [metrics, setMetrics] = useState([]);
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState(null);
  const evtSourceRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    // Load history on mount
    fetch('http://localhost:4123/history', { signal: controller.signal, mode:'cors' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const parsed = data.map(entry => ({
          ...entry,
          timestamp: new Date(entry.timestamp).toLocaleTimeString(),
          memoryUsage: parseFloat(entry.memoryUsage),
          cpuUsage: parseFloat(entry.cpuUsage),
        }));
        setMetrics(parsed);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError('❌ Failed to load metrics history. Is the server running and CORS enabled?');
        }
      });

    try {
      evtSourceRef.current = new EventSource('http://localhost:4123/events');
      evtSourceRef.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          const formatted = {
            ...data,
            timestamp: new Date(data.timestamp).toLocaleTimeString(),
            memoryUsage: parseFloat(data.memoryUsage),
            cpuUsage: parseFloat(data.cpuUsage),
          };

          setMetrics(prev => {
            const next = [...prev, formatted];
            return next.length > MAX_DATA_POINTS ? next.slice(-MAX_DATA_POINTS) : next;
          });

          if (formatted.cpuUsage > 80 || formatted.memoryUsage > 200) {
            setAlert('⚠️ High resource usage detected!');
          } else {
            setAlert(null);
          }
        } catch (parseErr) {
          console.error('Failed to parse SSE data:', parseErr);
        }
      };

      evtSourceRef.current.onerror = (e) => {
        console.error('SSE connection failed', e);
        setError('❌ Real-time updates unavailable. Check if the SSE server is running and CORS headers are configured.');
        evtSourceRef.current.close();
      };
    } catch (sseInitErr) {
      console.error('Failed to initialize SSE:', sseInitErr);
      setError('❌ Unable to connect to SSE server.');
    }

    return () => {
      controller.abort();
      if (evtSourceRef.current) evtSourceRef.current.close();
    };
  }, []);

  return (
    <div className="App" style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🩺 Real-Time Monitoring Dashboard</h1>

      {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
      {alert && <div style={{ color: 'orange', fontWeight: 'bold' }}>{alert}</div>}

      <div className="charts">
        <h2>⚙️ CPU Usage</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={metrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpuUsage" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>

        <h2>🧠 Memory Usage</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={metrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis unit="MB" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="memoryUsage" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>

        <h2>📋 Job Status</h2>
        <ul>
          {metrics.slice(-5).reverse().map((m, i) => (
            <li key={i}>{m.timestamp} - {m.jobStatus}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
