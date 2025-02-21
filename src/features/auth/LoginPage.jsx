import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
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
    <div className="min-h-screen bg-gradient-to-br from-primary-500/40 to-secondary-500/40 
      flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-block p-2 bg-white rounded-2xl shadow-md mb-4">
            <BuildingOffice2Icon className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {t('appName')}
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl shadow-xl rounded-2xl p-8 
          border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('welcomeBack')}
            </h2>
            <p className="mt-2 text-gray-600">
              {t('loginSubtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center 
                  pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 
                    rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                    transition-all duration-200 bg-white/50 backdrop-blur-sm
                    hover:border-gray-400"
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center 
                  pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 
                    rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                    transition-all duration-200 bg-white/50 backdrop-blur-sm
                    hover:border-gray-400"
                  placeholder={t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border 
                border-transparent rounded-lg shadow-md text-white bg-primary-600 
                hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-primary-500 font-medium transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg
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
                  <span className="px-2 bg-white text-gray-500">
                    {t('demoAccess')}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 
                text-sm text-gray-600">
                <p className="font-medium mb-2">{t('demoCredentials')}:</p>
                <p className="font-mono">admin@example.com</p>
                <p className="font-mono">password</p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} {t('appName')}. {t('allRightsReserved')}</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage