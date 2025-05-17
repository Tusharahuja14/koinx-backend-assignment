# KoinX Backend Assignment 🚀

This project contains a backend system built with Node.js, Express, MongoDB, and NATS Streaming to manage cryptocurrency statistics and user portfolios.

## 🧩 Project Structure

koinx-assignment/
├── api-server/ # Main API server for handling crypto stats & portfolios
├── worker-server/ # Worker that listens to NATS events and updates data
├── portfolio-server/ # (Optional) Additional service to manage user portfolios
└── shared/ # Shared utilities like NATS wrappers


---

## 📦 Tech Stack

- **Node.js**
- **Express**
- **MongoDB** (via Mongoose)
- **NATS Streaming** (Event Queue)
- **node-cron** (for scheduled jobs)

---

## ⚙️ Setup Instructions

1. **Clone the repo:**

```bash
git clone https://github.com/Tusharahuja14/koinx-backend-assignment.git
cd koinx-backend-assignment


Install dependencies:

For each service (api-server, worker-server, etc.), run:

bash
Copy
Edit
cd api-server   # or worker-server
npm install


Environment Variables:

Create a .env file inside api-server/ and add:

env
Copy
Edit
PORT=5001
MONGO_URI=mongodb://localhost:27017/koinx-db
NATS_URL=nats://localhost:4222

Run NATS locally (Docker):

bash
Copy
Edit
docker run -p 4222:4222 -ti nats:latest
Start the API server:

bash
Copy
Edit
cd api-server
npm start
Start the Worker server:

bash
Copy
Edit
cd worker-server
npm run dev
🔁 Workflow
api-server fetches and stores live crypto data.

On startup or API trigger, it publishes an event to crypto.stats.updated.

worker-server listens to NATS and runs scheduled jobs every 15 mins to update or process crypto stats.

📬 API Endpoints (api-server)
GET / → Health check

GET /test → Test route

GET /cryptos → Get stored crypto stats

POST /portfolio → Save user portfolio

GET /portfolio/:id → Get user portfolio by ID

📡 NATS Event Topics
crypto.stats.updated → Published by API server

crypto.update → Listened by worker to refresh data on demand

✅ Status
 API server with MongoDB

 Worker service using cron + NATS

 Event-driven communication

 Manual publisher script for local testing

