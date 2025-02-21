import React from 'react'
import { useTranslation } from 'react-i18next'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

// Separate fallback component using hooks
const ErrorFallback = ({ error }) => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <ExclamationTriangleIcon 
              className="mx-auto h-12 w-12 text-red-500" 
              aria-hidden="true" 
            />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {t('errorBoundary.title', 'Oops! Something went wrong')}
            </h3>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                {t('errorBoundary.message', 'We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.')}
              </p>
              {error && process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
                  <p className="text-sm text-red-700 font-mono">
                    {error.toString()}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('errorBoundary.refresh', 'Refresh Page')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary 