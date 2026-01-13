import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage, FindJobPage, JobDetailPage, JobAppliesPage, FollowedCompaniesPage, MessagePage, AIEvaluatePage, CompanyDetailPage } from './pages'
import { PostJobPage, PersonalProfilePage, CreateCompanyPage, CompanyProfilePage } from './pages'
import { ResetPasswordPage, AuthPage, ApplicantsPage, DashboardPage } from './pages'
import { AdminHomePage, UserManagementPage } from './pages'
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
    path: 'jobseeker/company/:companyId',
    element: <CompanyDetailPage />
  },
  {
    path: 'employer/home',
    element: <HomePage />
  },
  {
    path: 'employer/findjob',
    element: <FindJobPage />
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
    element: <CompanyProfilePage />
  },
  {
    path: 'employer/dashboard',
    element: <DashboardPage />
  },
  {
    path: 'employer/job/:jobId',
    element: <JobDetailPage />
  },
  {
    path: 'employer/company/:companyId',
    element: <CompanyDetailPage />
  },
  // Admin routes
  {
    path: 'admin/home',
    element: <AdminHomePage />
  },
  {
    path: 'admin/users',
    element: <UserManagementPage />
  },
  {
    path: 'admin/jobs',
    element: <FindJobPage />
  },
  {
    path: 'admin/companies',
    element: <AdminHomePage />
  },
  {
    path: 'admin/stats',
    element: <AdminHomePage />
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
