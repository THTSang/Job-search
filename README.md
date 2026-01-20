# Job Search Platform

A modern job search web application built with React, TypeScript, and Vite. The platform connects job seekers with employers, featuring AI-powered CV evaluation, real-time messaging, and comprehensive job management.

## Features

### For Job Seekers
- Browse and search for jobs
- Apply to job postings
- AI-powered CV evaluation and feedback
- Real-time messaging with employers
- Personal profile management with skills and experience

### For Employers
- Create and manage company profiles
- Post job listings
- View and manage applicants
- Real-time messaging with candidates

### For Admins
- User management
- Company management
- Job posting moderation

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **UI Library:** Material-UI (MUI)
- **State Management:** Zustand
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Real-time:** WebSocket (STOMP + SockJS)
- **Markdown:** react-markdown

## Project Structure

```
src/
├── api/            # API service modules
├── assets/         # Static assets (images, etc.)
├── components/     # Reusable UI components
│   ├── applicant/  # Applicant-related components
│   ├── auth/       # Authentication components
│   ├── common/     # Shared components (LoadingSpinner, etc.)
│   ├── finder/     # Search/filter components
│   ├── header/     # Header components by role
│   └── job/        # Job-related components
├── pages/          # Page components
│   ├── admin/      # Admin pages
│   ├── auth/       # Authentication pages
│   ├── employer/   # Employer pages
│   ├── jobseeker/  # Job seeker pages
│   └── shared/     # Shared pages (HomePage, JobDetail, etc.)
├── services/       # WebSocket and other services
├── styles/         # CSS stylesheets
└── utils/          # Utility functions and interfaces
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone -b frontend https://github.com/THTSang/Job-search.git
cd Job-search
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Environment

The application automatically detects the environment:

- **Development:** Uses Vite proxy for API calls
- **Production:** Connects directly to the backend API

## API Endpoints

| Service | URL |
|---------|-----|
| Main API | `https://job-search.duckdns.org/api` |
| AI Service | `https://cv-evaluation-52g3.onrender.com` |

## Deployment

The frontend is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Connect to Vercel
3. Deploy with default settings

Production URL: [https://job-search-seven-blond.vercel.app](https://job-search-seven-blond.vercel.app)

## License

This project is private and not licensed for public use.
