import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { fetchPlots,  updatePlot, deletePlot, createPlot } from './plotsSlice'
import PlotList from './components/PlotList'
import PlotForm from './components/PlotForm'

const PlotManagement = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { plots, loading } = useSelector((state) => state.plots)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    plotNumber: '',
    address: '',
    totalRooms: '',
    description: ''
  })

  useEffect(() => {
    dispatch(fetchPlots())
  }, [dispatch])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.id) {
      dispatch(updatePlot({ id: formData.id, data: formData }))
    } else {
      dispatch(createPlot(formData))
    }
    resetForm()
  }

  const handleEdit = (plot) => {
    setFormData(plot)
    setShowAddForm(true)
  }

  const handleDelete = (plotId) => {
    if (window.confirm(t('plots.deleteConfirmation'))) {
      dispatch(deletePlot(plotId))
    }
  }

  const resetForm = () => {
    setFormData({
      plotNumber: '',
      address: '',
      totalRooms: '',
      description: ''
    })
    setShowAddForm(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('plots.title')}
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            {t('plots.addPlot')}
          </button>
        </div>

        {showAddForm && (
          <PlotForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        <PlotList
          plots={plots}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}

export default PlotManagement 