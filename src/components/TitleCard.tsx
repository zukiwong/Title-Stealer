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
    <div className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div onClick={handleClick} className="flex items-start gap-3">
        {record.favicon && (
          <img
            src={record.favicon}
            alt=""
            className="w-5 h-5 mt-1 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate mb-1">
            {record.title || 'Untitled'}
          </h3>
          <p className="text-xs text-gray-500 truncate">{record.url}</p>
          <p className="text-xs text-gray-400 mt-1">{record.time}</p>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 text-red-600 rounded p-1"
          title="Delete"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};