import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white shadow-inner dark:bg-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-primary-600">
              Smart Resume Analyzer
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Improve your resume and career prospects
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} Smart Resume Analyzer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;