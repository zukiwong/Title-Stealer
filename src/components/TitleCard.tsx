import { PageRecord } from '../types';

interface TitleCardProps {
  record: PageRecord;
  onDelete?: () => void;
}

export const TitleCard = ({ record, onDelete }: TitleCardProps) => {
  const handleClick = () => {
    chrome.tabs.create({ url: record.url });
  };

  return (
    <div className="group relative border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div onClick={handleClick} className="flex items-start gap-3 p-3 cursor-pointer">
        {record.favicon && (
          <img
            src={record.favicon}
            alt=""
            className="w-4 h-4 mt-0.5 flex-shrink-0 object-contain opacity-60"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm text-gray-900 truncate">
            {record.title || 'Untitled'}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-1">{record.url}</p>
          <p className="text-xs text-gray-400 mt-1">{record.time}</p>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
          title="Delete"
        >
          <span className="text-xs">×</span>
        </button>
      )}
    </div>
  );
};