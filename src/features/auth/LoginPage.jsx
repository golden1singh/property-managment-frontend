import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  LockClosedIcon, 
  AtSymbolIcon,
  BuildingOffice2Icon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { loginUser } from './authSlice'

const LoginPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const result = await dispatch(loginUser(formData))
      if (loginUser.fulfilled.match(result)) {
        navigate('/dashboard')
      }
    } catch (error) {
      setError(t('loginError'))
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-lg mb-6">
            <BuildingOffice2Icon className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {t('appName')}
          </h1>
          {/* <p className="text-lg text-gray-600 font-medium">
            {t('propertyManagement')}
          </p> */}
        </div>

        {/* Login Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              {t('welcomeBack')}
            </h2>
            <p className="mt-2 text-gray-600">
              {t('loginSubtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <AtSymbolIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                    transition-all duration-200 bg-white
                    hover:border-gray-400 text-gray-900 placeholder-gray-500"
                  placeholder={t('emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <LockClosedIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                    transition-all duration-200 bg-white
                    hover:border-gray-400 text-gray-900 placeholder-gray-500"
                  placeholder={t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border 
                border-transparent rounded-lg shadow-lg text-white bg-primary-600 
                hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-primary-500 font-medium transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl
                active:transform active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent 
                  rounded-full animate-spin" />
              ) : (
                t('login')
              )}
            </button>

            {/* Demo Credentials */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600 font-medium">
                    {t('demoAccess')}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-700 mb-2">{t('demoCredentials')}:</p>
                <p className="font-mono text-gray-800">admin@example.com</p>
                <p className="font-mono text-gray-800">admin123</p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 font-medium">
          <p>&copy; {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved')}</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage