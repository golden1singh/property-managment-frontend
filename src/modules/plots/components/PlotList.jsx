import { useTranslation } from 'react-i18next';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  HomeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const PlotList = ({ plots, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (!plots?.length) {
    return (
      <div className="mt-6 bg-white shadow rounded-lg border border-slate-200 p-8 text-center">
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-medium text-slate-900">{t('plots.noPlots')}</h3>
        <p className="mt-2 text-sm text-slate-500">{t('plots.addPlotMessage')}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white shadow rounded-lg border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-medium text-slate-900">{t('plots.listTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('plots.listDescription')}</p>
      </div>
      <ul className="divide-y divide-slate-200">
        {plots.map((plot) => (
          <li 
            key={plot.id} 
            className="px-6 py-5 hover:bg-slate-50 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 truncate">
                      {t('plots.plotNumber')}: {plot.plotNumber}
                    </h3>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <MapPinIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{plot.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <HomeIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        <span>
                          {plot.occupiedRooms}/{plot.totalRooms} {t('plots.roomsOccupied')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {plot.description && (
                  <div className="mt-2 flex items-start gap-1.5">
                    <InformationCircleIcon className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600 line-clamp-2">{plot.description}</p>
                  </div>
                )}
              </div>
              <div className="ml-6 flex items-center gap-3">
                <button
                  onClick={() => onEdit(plot)}
                  className="p-2 text-slate-600 hover:text-primary-600 rounded-lg
                    hover:bg-primary-50 transition-colors duration-150"
                  title={t('common.edit')}
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(plot.id)}
                  className="p-2 text-slate-600 hover:text-red-600 rounded-lg
                    hover:bg-red-50 transition-colors duration-150"
                  title={t('common.delete')}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-500">
          {t('plots.totalPlots')}: <span className="font-medium text-slate-700">{plots.length}</span>
        </p>
      </div>
    </div>
  );
};

export default PlotList; 