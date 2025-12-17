import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LoginForm } from './components/auth/LoginForm'
import { RegisterForm } from './components/auth/RegisterForm'
import { ResetPasswordForm } from './components/auth/ResetPasswordForm'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage, JobPage, JobAppliesPage, FollowedCompaniesPage, MessagePage, ProfilePage, AIEvaluatePage } from './pages'

import './index.css'
import App from './App.tsx'

const router = createBrowserRouter([
  {
    path: 'login',
    element: <LoginForm />
  },
  {
    path: 'register',
    element: <RegisterForm />
  },
  {
    path: '',
    element: <App />
  },
  {
    path: 'resetpassword',
    element: <ResetPasswordForm />
  },
  {
    path: 'home',
    element: <HomePage />
  },
  {
    path: 'findjob',
    element: <JobPage />
  },
  {
    path: 'jobapplies',
    element: <JobAppliesPage />
  },
  {
    path: 'followcompanies',
    element: <FollowedCompaniesPage />
  },
  {
    path: 'messages',
    element: <MessagePage />
  },
  {
    path: 'profile',
    element: <ProfilePage />
  },
  {
    path: 'aiEvaluation',
    element: <AIEvaluatePage />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
