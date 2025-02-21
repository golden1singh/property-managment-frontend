import { useTranslation } from "react-i18next";

export const FormInput = ({ 
  name, 
  label, 
  type = "text", 
  icon, 
  required = true, 
  formData, 
  handleInputChange, 
  handleBlur, 
  errors, 
  touched,
  options = {},
  placeholder,
  min,
  max,
  disabled = false
}) => {
  // Get today's date in YYYY-MM-DD format for date inputs
    const today = new Date().toISOString().split('T')[0];
    const {t}=useTranslation()

  // Determine if this is a date input that should have min date
  const shouldHaveMinDate = type === 'date' && (
    name === 'moveInDate' || 
    name === 'leaseStartDate' || 
    name === 'leaseEndDate'
  );

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
        <input
          type={type}
          name={name}
          id={name}
          required={required}
          disabled={disabled}
          value={formData[name] || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={shouldHaveMinDate ? today : min}
          max={max}
          placeholder={placeholder}
          data-error={errors[name] && touched[name]}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 
            border rounded-lg transition-all duration-200
            shadow-sm text-sm
            ${disabled 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
              : 'bg-white placeholder:text-gray-400'
            }
            ${errors[name] && touched[name]
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400'
            }
            ${type === 'date' && 'cursor-pointer'}
            ${disabled && 'opacity-60'}
          `}
          {...options}
        />
        {errors[name] && touched[name] && (
          <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
        )}
        
        {/* Helper text for date inputs */}
        {/* {type === 'date' && shouldHaveMinDate && (
          <p className="mt-1 text-xs text-gray-500">
            {t('futureDateOnly')}
          </p>
        )} */}
      </div>
    </div>
  );
}; 