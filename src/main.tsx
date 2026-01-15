import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage, FindJobPage, JobDetailPage, JobAppliesPage, MessagePage, AIEvaluatePage, CompanyDetailPage, CompaniesPage } from './pages'
import { PostJobPage, PersonalProfilePage, CreateCompanyPage, CompanyProfilePage } from './pages'
import { ResetPasswordPage, AuthPage, ApplicantsPage, VerifyEmailPage } from './pages'
import { AdminHomePage, UserManagementPage, JobManagementPage, CompanyManagementPage, AdminProfilePage } from './pages'
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
    path: 'reset-password',
    element: <ResetPasswordPage />
  },
  {
    path: 'verify-email',
    element: <VerifyEmailPage />
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
    path: 'jobseeker/companies',
    element: <CompaniesPage />
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
    path: 'employer/messages',
    element: <MessagePage />
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
    element: <JobManagementPage />
  },
  {
    path: 'admin/companies',
    element: <CompanyManagementPage />
  },
  {
    path: 'admin/messages',
    element: <MessagePage />
  },
  {
    path: 'admin/profile',
    element: <AdminProfilePage />
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
