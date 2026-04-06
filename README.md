# AI Interview Prep

AI Interview Prep is a full-stack interview practice platform that helps users prepare for technical roles with tailored question sets, AI-generated explanations, and a personal revision workspace.

The project is split into:

- `frontend` - React + Vite client
- `backend` - Express + MongoDB API

## Features

- User signup and login with JWT-based authentication
- Personalized interview sessions by role, experience, company, and topics
- AI-generated interview questions
- AI-powered concept explanations for difficult questions
- Save, review, and update question notes
- Personal dashboard for managing prep sessions
- Responsive UI for desktop and mobile

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Framer Motion

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Google GenAI SDK

## Project Structure

```text
NIGHT-CODING-MARATHON-2.0/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vercel.json
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── vercel.json
└── README.md
```

## Environment Variables

Create local env files from the examples:

### Frontend

File: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:9001
```

For production on Vercel, set:

```env
VITE_API_BASE_URL=https://your-backend-project.vercel.app
```

### Backend

File: `backend/.env`

```env
PORT=9001
CLIENT_URLS=http://localhost:5173,https://your-frontend-project.vercel.app
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
AI_REQUEST_TIMEOUT_MS=15000
```

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd NIGHT-CODING-MARATHON-2.0
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:9001`

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm run dev
npm start
```

## API Overview

Base URL:

- Local: `http://localhost:9001`
- Production: `https://your-backend-project.vercel.app`

### Public routes

- `GET /` - API home route
- `GET /api/health` - health check
- `POST /api/auth/signup` - create account
- `POST /api/auth/login` - login user

### Protected routes

- `GET /api/auth/me` - get current user
- `POST /api/sessions` - create session
- `GET /api/sessions` - get all sessions
- `GET /api/sessions/:id` - get session details
- `POST /api/ai/generate-questions` - generate interview questions
- `POST /api/ai/generate-explanation` - generate concept explanation
- `PATCH /api/questions/:id` - update question data

## Deployment

This repo is set up to deploy frontend and backend as separate Vercel projects.

### Frontend Vercel config

- Builds the Vite app
- Uses `dist` as the output directory
- Rewrites all routes to `index.html` for SPA routing

### Backend Vercel config

- Deploys `index.js` as a Node serverless function
- Routes all requests to the Express app
- Skips `app.listen()` on Vercel
- Connects to MongoDB on incoming API requests

### Deploy steps

1. Import `frontend` as one Vercel project.
2. Import `backend` as another Vercel project.
3. Add frontend env var:

```env
VITE_API_BASE_URL=https://your-backend-project.vercel.app
```

4. Add backend env vars:

```env
CLIENT_URLS=https://your-frontend-project.vercel.app
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
AI_REQUEST_TIMEOUT_MS=15000
```

5. Redeploy both projects after saving env vars.

## Notes

- Do not commit real secrets to GitHub.
- Rotate any secret that has already been exposed publicly.
- If login or signup fails after deployment, first verify `VITE_API_BASE_URL` and `CLIENT_URLS`.

## Future Improvements

- Add unit and integration tests
- Add refresh token support
- Add interview history analytics
- Add markdown export or PDF export for notes
- Add role-based prompt templates

## Author

Built for interview preparation and practice workflows using React, Express, MongoDB, and AI-assisted question generation.
