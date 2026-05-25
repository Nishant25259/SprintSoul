# SprintSoul — MERN Stack

Premium sneaker e-commerce app built with MongoDB, Express, React (Vite), and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Backend
```bash
cd server
npm install
node seed.js        # Seeds products + admin user
npm run dev         # Starts on http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev         # Starts on http://localhost:5173
```

## 🔐 Admin Credentials
- **Email:** `admin@sprintsoul.co`
- **Password:** `Admin@123`

## 📁 Structure
```
SprintSoul-1/
├── client/     # React + Vite frontend
├── server/     # Express + Node backend
└── shoes/      # Product images (served as static files)
```

## API Endpoints
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/products | Public |
| POST/PUT/DELETE | /api/products | Admin |
| GET/POST/PUT/DELETE | /api/cart | User |
| POST | /api/cart/checkout | User |
| GET | /api/admin/orders | Admin |
| PATCH | /api/admin/orders/:id | Admin |
| GET | /api/admin/stats | Admin |
| GET | /api/admin/users | Admin |
