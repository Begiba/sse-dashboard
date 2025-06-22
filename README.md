# 📊 SSE Dashboard

**SSE** is a **powerful, simple, and efficient** way to handle **server-to-client real-time updates** without the overhead of WebSockets or polling.

A real-time dashboard using **Server-Sent Events (SSE)** to display simulated system metrics (CPU, Memory, Jobs) powered by:

- ⚛️ React + Vite (Client)
- 🚀 Node.js + Express (Server)
- 🧠 Redis (Persistence)
- 🐳 Docker Compose (Environment)

## 📦 Features

- Real-time metrics with SSE
- Tabbed navigation for CPU, Memory, and Jobs
- Responsive charting with Recharts
- Redis-backed history (last 30 events)
- Fully containerized with Docker

---

## 🧰 Technologies

| Layer    | Tech                                   |
|----------|----------------------------------------|
| Frontend | React + Vite + Tailwind CSS + Recharts |
| Backend  | Node.js + Express + Redis client       |
| Realtime | Server-Sent Events (SSE)               |
| Infra    | Docker + Docker Compose                |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Begiba/sse-dashboard.git
cd sse-dashboard
````

### 2. Start the app with Docker Compose

```bash
docker-compose up --build
```

### 3. Access the services

- Client (Dashboard): [http://localhost:3313](http://localhost:3313/)
  
- Server (SSE + API): [http://localhost:4123](http://localhost:4123/)
  
- Redis: `redis://localhost:6379`
  

---

## 🗂️ Project Structure

```
sse-dashboard/
├── client/           # React dashboard (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── MetricChart.jsx
│   │   └── App.jsx
│   ├── Dockerfile
│   └── vite.config.js
├── server/           # Express SSE server
│   ├── index.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 📈 Sample Event Payload

```json
{
  "timestamp": "2025-06-17T14:45:10.324Z",
  "cpu": 21,
  "memory": 78,
  "jobs": 8
}
```

---

## 🛠️ Development Notes

### TailwindCSS Setup (in client)

If Tailwind isn't installed yet, run:

```bash
cd client
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then add to `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

And in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📜 License

MIT — feel free to use, modify, and share.

---

## 🙌 Acknowledgments

Thanks to [Redis](https://redis.io/), [Recharts](https://recharts.org/), and [Vite](https://vitejs.dev/) for making this fast and easy to build.

---

## 👨‍💻 Author  
#Enjoy Coding (Began BALAKRISHNAN) ❤️

---

