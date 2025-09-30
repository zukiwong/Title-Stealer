import { PageRecord } from '../types';
import { TitleCard } from './TitleCard';
import { formatDate } from '../utils/date';

interface DateSectionProps {
  date: string;
  records: PageRecord[];
  onDelete?: (url: string) => void;
}

export const DateSection = ({ date, records, onDelete }: DateSectionProps) => {
  return (
    <div className="mb-8">
      <div className="sticky top-0 bg-gray-50 py-3 px-4 mb-4 rounded-lg border-b-2 border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">
          {formatDate(date)}
        </h2>
        <p className="text-sm text-gray-500">
          {records.length} {records.length === 1 ? 'title' : 'titles'} stolen
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record, index) => (
          <TitleCard
            key={`${record.url}-${index}`}
            record={record}
            onDelete={onDelete ? () => onDelete(record.url) : undefined}
          />
        ))}
      </div>
    </div>
  );
};