export const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center mb-4 sm:mb-6">
    <span className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500 mr-2">
      {icon}
    </span>
    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
      {title}
    </h3>
  </div>
); 