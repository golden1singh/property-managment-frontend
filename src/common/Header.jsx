import { Fragment, useState } from 'react'
import { Disclosure, Menu, Transition, RadioGroup } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  LanguageIcon,
  ComputerDesktopIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  CheckIcon,
  ChevronRightIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useDispatch } from 'react-redux'
import { logout } from '../modules/auth/authSlice'
import MobileHeader from '../layout/MobileHeader'
import { navigation as navigationlist } from './GlobalText'
import React from 'react'

const Header = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { i18n, languages } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: t('rooms'), href: '/rooms', current: location.pathname === '/rooms' },
    { name: t('tenants'), href: '/tenants', current: location.pathname === '/tenants' },
    { name: t('payments'), href: '/payments', current: location.pathname === '/payments' },
    { name: t('utilities'), href: '/utilities', current: location.pathname === '/utilities' },
  ]

  const themes = [
    { name: 'light', icon: SunIcon },
    { name: 'dark', icon: MoonIcon },
    { name: 'system', icon: ComputerDesktopIcon }
  ]

  const handleThemeChange = (newTheme, close) => {
    setTheme(newTheme)
    close()
  }

  const handleLanguageChange = (lng, close) => {
    i18n.changeLanguage(lng)
    close()
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Disclosure as="nav" className="bg-white dark:bg-gray-800 shadow-md">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                {/* Left side - Logo and Navigation */}
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/dashboard" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {t('appName')}
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                          item.current
                            ? 'border-primary-500 text-gray-900 dark:text-white'
                            : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right side - Settings and User Menu */}
                <div className="flex items-center space-x-4">
                  {/* Settings Menu */}
                  <Menu as="div" className="relative">
                    {({ close }) => (
                      <>
                        <Menu.Button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none">
                          <Cog6ToothIcon className="h-6 w-6" />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
                            {/* Settings Header */}
                            <div className="px-4 py-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t('settings.title')}
                              </h3>
                            </div>

                            {/* Theme Settings */}
                            <div className="px-4 py-3">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                                {t('settings.theme')}
                              </h4>
                              <RadioGroup 
                                value={theme} 
                                onChange={(newTheme) => handleThemeChange(newTheme, close)}
                                className="space-y-2"
                              >
                                {themes.map(({ name, icon: Icon }) => (
                                  <RadioGroup.Option
                                    key={name}
                                    value={name}
                                    className={({ active, checked }) =>
                                      `${active ? 'ring-2 ring-primary-500' : ''}
                                       ${checked ? 'bg-primary-50 dark:bg-primary-900' : 'bg-white dark:bg-gray-700'}
                                       relative flex cursor-pointer rounded-lg px-4 py-3 focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`
                                    }
                                  >
                                    {({ checked }) => (
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                          <Icon 
                                            className={`h-5 w-5 mr-3 ${
                                              checked ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                                            }`}
                                          />
                                          <span className={`text-sm ${
                                            checked ? 'text-primary-900 dark:text-primary-100 font-medium' : 'text-gray-700 dark:text-gray-300'
                                          }`}>
                                            {t(`settings.${name}`)}
                                          </span>
                                        </div>
                                        {checked && (
                                          <div className="text-primary-600 dark:text-primary-400">
                                            <CheckIcon className="h-5 w-5" />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </RadioGroup.Option>
                                ))}
                              </RadioGroup>
                            </div>

                            {/* Language Settings */}
                            <div className="px-4 py-3">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                                {t('settings.language')}
                              </h4>
                              <div className="space-y-2">
                                {languages.map((lang) => (
                                  <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code, close)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm
                                      ${i18n.language === lang.code 
                                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-100' 
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                      }
                                      transition-colors`}
                                  >
                                    <span>{lang.name}</span>
                                    {i18n.language === lang.code && (
                                      <CheckIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>

                  {/* User Menu */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex rounded-full bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${
                                active ? 'bg-gray-100 dark:bg-gray-600' : ''
                              } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                            >
                              {t('profile')}
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {handleLogout()}}
                              className={`${
                                active ? 'bg-gray-100 dark:bg-gray-600' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                            >
                              {t('logout')}
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
               
              </div>
            </div>

            {/* Mobile menu */}
            <Disclosure.Panel className="sm:hidden bg-white border-t border-gray-200">
              <div className="space-y-1 py-2">
                {navigationlist.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`flex items-center w-full px-4 py-3 text-base font-medium transition-colors duration-200 ${
                      item.current
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 border-l-4 border-transparent'
                    }`}
                  >
                    {/* Icon - Render as a component */}
                    <span className={`mr-3 ${item.current ? 'text-primary-500' : 'text-gray-400'}`}>
                      {React.createElement(item.icon, { className: 'h-5 w-5' })}
                    </span>
                    
                    {/* Name in Sentence Case */}
                    <span>
                      {item.name.charAt(0).toUpperCase() + 
                       item.name.slice(1).toLowerCase()}
                    </span>
                    
                    {/* Active indicator */}
                    {item.current && (
                      <span className="ml-auto">
                        <ChevronRightIcon className="h-5 w-5 text-primary-500" />
                      </span>
                    )}
                  </Disclosure.Button>
                ))}
              </div>

              
            </Disclosure.Panel>
             {/* <MobileHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default Header