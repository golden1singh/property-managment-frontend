const ServiceCard = ({ icon: Icon, title, description, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
      <div className={`inline-flex items-center justify-center p-3 ${color} bg-opacity-10 rounded-xl mb-4`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default ServiceCard 