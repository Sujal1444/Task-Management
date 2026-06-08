# Task Manager MERN Application

A production-ready task management web app built with React, Express, MongoDB, JWT authentication, and Tailwind CSS.

## Features

- User registration, login, profile lookup, and logout
- JWT protected API routes
- bcrypt password hashing
- User-scoped task CRUD
- Future task due-date selection
- Toggle task status between Pending and Completed
- Dashboard statistics for total, pending, and completed tasks
- Search by title or description
- Filter by status
- Server-side pagination with page-size selector
- Newest/oldest sorting
- Responsive UI with loading states, toast notifications, empty states, and delete confirmation

## Project Structure

```text
task-manager/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.js
└── docs/
    └── screenshots/
```

## Prerequisites

- Node.js 20 or newer
- MongoDB Atlas cluster or local MongoDB instance
- npm

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Development

Install backend dependencies:

```bash
cd server
npm install
npm run dev
```

Install frontend dependencies in a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Endpoints

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

Tasks:

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

`GET /api/tasks` supports these query params:

- `page`: page number
- `limit`: page size, max 50
- `search`: title or description search
- `status`: `Pending` or `Completed`
- `sort`: `newest` or `oldest`

Task payloads include `dueDate`, an ISO date value that must be today or later.

## Deployment Guide

Backend deployment:

1. Deploy the `server` folder to Render, Railway, Fly.io, or another Node host.
2. Set `NODE_ENV=production`.
3. Set `MONGO_URI` to your MongoDB Atlas connection string.
4. Set a strong `JWT_SECRET`.
5. Set `CLIENT_URL` to your deployed frontend URL.
6. Run `npm install` and start with `npm start`.

Frontend deployment:

1. Deploy the `client` folder to Vercel, Netlify, or any static host.
2. Set `VITE_API_URL` to the deployed backend API URL ending in `/api`.
3. Build with `npm run build`.
4. Publish the generated `client/dist` directory.

## Screenshots

Place production screenshots in:

```text
docs/screenshots/
├── login.png
├── register.png
├── dashboard-empty.png
├── dashboard-tasks.png
└── dashboard-mobile.png
```

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWTs are required for all task endpoints.
- Task queries are scoped by `userId`, so users can only access their own tasks.
- Request validation is handled with `express-validator`.
- Helmet, CORS, rate limiting, and centralized error handling are enabled on the API.
