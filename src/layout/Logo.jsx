import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const Logo = () => {
  const { t } = useTranslation()

  return (
    <Link to="/dashboard" className="flex items-center">
      <div className="flex items-center flex-shrink-0">
        <img 
          src={logo} 
          alt={t('appName')} 
          className="h-10 w-auto object-contain" 
        />
        <span className="ml-3 text-xl font-bold text-gray-900">
          {t('appName')}
        </span>
      </div>
    </Link>
  )
}

export default Logo 