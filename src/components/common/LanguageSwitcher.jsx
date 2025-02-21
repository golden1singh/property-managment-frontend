import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <select
      onChange={changeLanguage}
      value={i18n.language}
      className="rounded-md bg-gray-700 text-white px-3 py-2 text-sm"
    >
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
    </select>
  )
}

export default LanguageSwitcher