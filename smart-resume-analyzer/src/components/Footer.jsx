import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="shadow-inner bg-primary-600 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-white">
              Smart Resume Analyzer
            </Link>
            <p className="text-sm text-white">
              Improve your resume and career prospects
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-white">
              &copy; {currentYear} Smart Resume Analyzer.<br /> Made by <strong><a target='_blank' href="https://github.com/guru-vishal">@guru-vishal</a></strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;