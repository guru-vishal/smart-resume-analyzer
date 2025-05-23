import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-800">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout;