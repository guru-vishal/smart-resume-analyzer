import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary-600">
            Smart Resume Analyzer
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Analyze your resume and improve your chances
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout;