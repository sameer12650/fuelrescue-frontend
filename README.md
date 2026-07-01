# 🔥 FuelRescue — Frontend

> Emergency fuel delivery platform built with React + Vite

![FuelRescue](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🚀 About

FuelRescue is a full-stack emergency fuel delivery platform that allows users to book fuel delivery from anywhere — even without internet, via SMS.

This repository contains the **React frontend** of the application.

---

## ✨ Features

- 🏠 **Landing Page** — Hero section, how-it-works, SMS feature showcase
- 🔐 **Auth System** — Login and Register with JWT authentication
- ⛽ **Fuel Booking Form** — Book petrol/diesel with auto GPS location detection
- 📍 **Live Tracking** — Real-time delivery status timeline (auto-polls every 10s)
- 🛠️ **Admin Dashboard** — Manage all requests, assign delivery partners, update status
- 📱 **SMS Booking UI** — Displays SMS format for offline booking (`SOS PETROL 5`)

---

## 🖥️ Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing homepage |
| Auth | `/auth` | Login / Register |
| Book Fuel | `/book` | Fuel booking form |
| Track | `/track/:id` | Live delivery tracking |
| Admin | `/admin` | Admin dashboard |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router DOM | Client-side routing |
| CSS (custom) | Styling — dark theme |
| Fetch API | HTTP requests to backend |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- npm

### Steps

```bash
# Clone the repo
git clone https://github.com/sameer12650/fuelrescue-frontend.git
cd fuelrescue-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173`

> ⚠️ Make sure the backend server is running on port 8080 before using the app.

---

## 🔗 API Proxy

Vite is configured to proxy all `/api/*` requests to the backend:

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── Auth.jsx          # Login/Register
│   ├── BookFuel.jsx      # Booking form
│   ├── TrackRequest.jsx  # Live tracking
│   └── AdminDashboard.jsx # Admin panel
├── styles/
│   ├── auth.css
│   ├── book.css
│   ├── track.css
│   ├── admin.css
│   └── home.css
└── App.jsx               # Routes
```

---

## 🔗 Related

- **Backend Repo:** [fuelrescue-backend](https://github.com/sameer12650/fuelrescue-backend)

---

## 👨‍💻 Author

**Sameer** — [@sameer12650](https://github.com/sameer12650)
