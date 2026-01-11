import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage, FindJobPage, JobDetailPage, JobAppliesPage, FollowedCompaniesPage, MessagePage, AIEvaluatePage } from './pages'
import { PostJobPage, PersonalProfilePage, CreateCompanyPage, EmployerCompanyProfilePage } from './pages'
import { ResetPasswordPage, AuthPage, ApplicantsPage, DashboardPage } from './pages'
import './index.css'
import App from './App.tsx'

const router = createBrowserRouter([
  {
    path: 'auth',
    element: <AuthPage />
  },
  {
    path: '',
    element: <App />
  },
  {
    path: 'reset',
    element: <ResetPasswordPage />
  },
  {
    path: 'jobseeker/home',
    element: <HomePage />
  },
  {
    path: 'jobseeker/findjob',
    element: <FindJobPage />
  },
  {
    path: 'jobseeker/jobapplies',
    element: <JobAppliesPage />
  },
  {
    path: 'jobseeker/followcompanies',
    element: <FollowedCompaniesPage />
  },
  {
    path: 'jobseeker/messages',
    element: <MessagePage />
  },
  {
    path: 'jobseeker/personalprofile',
    element: <PersonalProfilePage />
  },
  {
    path: 'jobseeker/aiEvaluation',
    element: <AIEvaluatePage />
  },
  {
    path: 'jobseeker/job/:jobId',
    element: <JobDetailPage />
  },
  {
    path: 'employer/home',
    element: <HomePage />
  },
  {
    path: 'employer/postjob',
    element: <PostJobPage />
  },
  {
    path: 'employer/applicantmanagement',
    element: <ApplicantsPage />
  },
  {
    path: 'employer/createcompany',
    element: <CreateCompanyPage />
  },
  {
    path: 'employer/companyprofile',
    element: <EmployerCompanyProfilePage />
  },
  {
    path: 'employer/dashboard',
    element: <DashboardPage />
  },
  {
    path: 'employer/job/:jobId',
    element: <JobDetailPage />
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
