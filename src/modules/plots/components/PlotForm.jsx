import { useTranslation } from 'react-i18next';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

const PlotForm = ({ formData, onChange, onSubmit, onCancel }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 bg-white shadow sm:rounded-lg border border-slate-200">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-50 rounded-lg">
            <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">
            {formData.id ? t('plots.editPlot') : t('plots.addNewPlot')}
          </h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Plot Number */}
            <div className="relative">
              <label htmlFor="plotNumber" className="block text-sm font-medium text-slate-700 mb-2">
                {t('plots.plotNumber')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="plotNumber"
                id="plotNumber"
                required
                value={formData.plotNumber}
                onChange={onChange}
                placeholder={t('plots.enterPlotNumber')}
                className="block w-full px-4 py-3 rounded-lg border border-slate-200 
                focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                placeholder-slate-400 transition-all duration-200
                hover:border-slate-300"
              />
            </div>

            {/* Total Rooms */}
            <div className="relative">
              <label htmlFor="totalRooms" className="block text-sm font-medium text-slate-700 mb-2">
                {t('plots.totalRooms')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalRooms"
                id="totalRooms"
                required
                min="1"
                value={formData.totalRooms}
                onChange={onChange}
                placeholder={t('plots.enterTotalRooms')}
                className="block w-full px-4 py-3 rounded-lg border border-slate-200 
                focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                placeholder-slate-400 transition-all duration-200
                hover:border-slate-300"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                {t('plots.address')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                value={formData.address}
                onChange={onChange}
                placeholder={t('plots.enterAddress')}
                className="block w-full px-4 py-3 rounded-lg border border-slate-200 
                focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                placeholder-slate-400 transition-all duration-200
                hover:border-slate-300"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                {t('plots.description')}
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={onChange}
                placeholder={t('plots.enterDescription')}
                className="block w-full px-4 py-3 rounded-lg border border-slate-200 
                focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                placeholder-slate-400 transition-all duration-200 resize-none
                hover:border-slate-300"
              />
              <p className="mt-2 text-sm text-slate-500">
                {t('plots.descriptionHelp')}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg border border-slate-200 text-sm font-medium 
              text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500
              transition-all duration-200"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white 
              bg-primary-600 hover:bg-primary-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
              transition-all duration-200"
            >
              {formData.id ? t('common.update') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlotForm; 