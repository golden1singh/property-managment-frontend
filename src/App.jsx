import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Header from './components/common/Header'
import AppRoutes from './routes'
import { ToastContainer } from 'react-toastify'




function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <ThemeProvider>
     <LanguageProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
          {isAuthenticated && <Header />}
          <ToastContainer />
          <main className={`${isAuthenticated?"pt-16":""} min-h-screen dark:text-dark-text-primary`}>
            <AppRoutes />
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App