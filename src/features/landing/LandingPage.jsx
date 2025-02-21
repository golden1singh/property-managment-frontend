import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  HomeIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DocumentChartBarIcon,
  LanguageIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import userIcon from '../../assets/userIcon.jpg'
import logo from '../../assets/logo.png'

const LandingPage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const features = [
    {
      title: t('features.propertyManagement.title'),
      description: t('features.propertyManagement.description'),
      icon: HomeIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: t('features.tenantTracking.title'),
      description: t('features.tenantTracking.description'),
      icon: UserGroupIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: t('features.paymentProcessing.title'),
      description: t('features.paymentProcessing.description'),
      icon: CurrencyRupeeIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: t('features.analytics.title'),
      description: t('features.analytics.description'),
      icon: ChartBarIcon,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: t('features.security.title'),
      description: t('features.security.description'),
      icon: ShieldCheckIcon,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: t('features.reporting.title'),
      description: t('features.reporting.description'),
      icon: DocumentChartBarIcon,
      color: 'bg-teal-100 text-teal-600'
    }
  ]

  const stats = [
    { id: 1, name: t('stats.activeUsers'), value: '2,000+' },
    { id: 2, name: t('stats.propertiesManaged'), value: '5,000+' },
    { id: 3, name: t('stats.monthlyTransactions'), value: '₹50K+' },
    { id: 4, name: t('stats.customerSatisfaction'), value: '98%' }
  ]

  const testimonials = [
    {
      content: t('testimonials.testimonial1.content'),
      author: t('testimonials.testimonial1.author'),
      role: t('testimonials.testimonial1.role'),
      image: userIcon
    },
    {
      content: t('testimonials.testimonial2.content'),
      author: t('testimonials.testimonial2.author'),
      role: t('testimonials.testimonial2.role'),
      image: userIcon
    }
  ]

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <img 
                src={logo} 
                alt={t('appName')} 
                className="h-16 w-auto object-contain" 
                style={{ filter: 'brightness(0) saturate(100%)' }}
              />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <button
                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 
                  group relative flex items-center"
                aria-label="Switch Language"
              >
                <LanguageIcon className="h-5 w-5 text-gray-600 group-hover:text-primary-600" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                  bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 
                  group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {i18n.language === 'en' ? 'हिंदी' : 'English'}
                </span>
              </button>

              {/* Login Button */}
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-5 py-2 border border-transparent 
                  rounded-lg text-sm font-medium text-white 
                  bg-primary-600 hover:bg-primary-700
                  transition-colors duration-200"
              >
                <UserIcon className="h-4 w-4 mr-2" />
                {t('login')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="/images/hero-bg.jpg"
            alt="Modern building"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50" />
        </div>

        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="rounded-md bg-primary-600 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200"
              >
                {t('getStarted')}
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#features"
                className="rounded-md bg-white/10 px-8 py-3 text-lg font-semibold text-white hover:bg-white/20 transition-all duration-200"
              >
                {t('learnMore')}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              {t('featuresTitle')}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('featuresSubtitle')}
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('featuresDescription')}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className={`rounded-lg p-2 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary-600">
              {t('testimonials.title')}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('testimonials.subtitle')}
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <motion.figure
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl bg-gray-50 p-8 text-sm leading-6"
                >
                  <blockquote className="text-gray-900">
                    <p>"{testimonial.content}"</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <img
                      className="h-10 w-10 rounded-full bg-gray-50"
                      src={testimonial.image}
                      alt=""
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('ctaTitle')}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              {t('ctaDescription')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="rounded-md bg-white px-8 py-3 text-lg font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
              >
                {t('getStartedNow')}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="bg-gray-900" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">{t('solutions')}</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        {t('propertyManagement')}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        {t('tenantTracking')}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        {t('paymentProcessing')}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">{t('support')}</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        {t('pricing')}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        {t('documentation')}
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-white">
                        {t('guides')}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2024 {t('appName')}. {t('allRightsReserved')}.
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  )
}

export default LandingPage