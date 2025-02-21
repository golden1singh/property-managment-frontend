import { useTranslation } from 'react-i18next';

export const SelectInput = ({ 
  name, 
  label, 
  icon, 
  options = [], 
  required = true,
  formData,
  handleInputChange,
  handleBlur,
  errors,
  touched,
  placeholder,
  disabled = false,
  selectedPlot = null,
  helperText = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className="col-span-full sm:col-span-3 lg:col-span-2">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative rounded-lg shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`h-5 w-5 ${
              errors[name] && touched[name] 
                ? 'text-red-400' 
                : disabled 
                  ? 'text-gray-300'
                  : 'text-gray-400'
            }`}>
              {icon}
            </span>
          </div>
        )}
        <select
          id={name}
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
          required={required}
          disabled={disabled}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-10 py-2.5 
            border rounded-lg text-sm
            appearance-none
            transition-colors
            duration-200
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white cursor-pointer'}
            ${errors[name] && touched[name]
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400'
            }
            ${disabled && 'opacity-60'}
          `}
        >
          <option value="" disabled>{placeholder || t('select')}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg 
            className={`h-4 w-4 fill-current ${disabled ? 'text-gray-300' : 'text-gray-500'}`} 
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>

        {/* Error message */}
        {errors[name] && touched[name] && (
          <p className="mt-1 text-sm text-red-600">
            {errors[name]}
          </p>
        )}

        {/* Helper text */}
        {/* {helperText || (disabled && name === 'roomNumber' && !selectedPlot && (
          <p className="mt-1 text-sm text-gray-500">
            {t('selectPlotFirst')}
          </p>
        ))} */}
      </div>
    </div>
  );
}; 