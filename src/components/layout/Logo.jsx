import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Logo = () => {
  const { t } = useTranslation()

  return (
    <Link to="/dashboard" className="flex items-center">
      <div className="flex items-center flex-shrink-0 text-primary-600">
        {/* You can add your logo image here */}
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <span className="ml-2 text-xl font-bold">{t('appName')}</span>
      </div>
    </Link>
  )
}

export default Logo 