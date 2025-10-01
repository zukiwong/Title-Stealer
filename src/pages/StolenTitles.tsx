import { useState, useEffect } from 'react';
import { StoredRecords } from '../types';
import { getAllRecords, getAllDates, deleteRecord } from '../utils/storage';
import { DateSection } from '../components/DateSection';

export const StolenTitles = () => {
  const [records, setRecords] = useState<StoredRecords>({});
  const [dates, setDates] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllRecords();
  }, []);

  const loadAllRecords = async () => {
    try {
      const allRecords = await getAllRecords();
      const allDates = await getAllDates();
      setRecords(allRecords);
      setDates(allDates);
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (date: string, url: string) => {
    await deleteRecord(date, url);
    await loadAllRecords();
  };

  const filteredDates = dates.filter((date) => {
    if (!searchQuery) return true;
    const dateRecords = records[date] || [];
    return dateRecords.some(
      (record) =>
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getFilteredRecords = (date: string) => {
    if (!searchQuery) return records[date] || [];
    return (records[date] || []).filter(
      (record) =>
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const totalCount = dates.reduce(
    (sum, date) => sum + (records[date]?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 z-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Stolen Titles</h1>
              <p className="text-sm text-gray-600">
                Your personal web browsing collection
              </p>
              <div className="mt-3 flex gap-3 text-sm text-gray-600">
                <span>{totalCount} titles</span>
                <span>•</span>
                <span>{dates.length} days</span>
              </div>
            </div>
            <button
              onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('statistics.html') })}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm transition-colors"
            >
              Statistics & Word Cloud
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <input
          type="text"
          placeholder="Search titles or URLs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-400 text-sm"
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading your stolen titles...</div>
          </div>
        ) : filteredDates.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-xl text-gray-600 mb-2">
                {searchQuery
                  ? 'No titles match your search'
                  : 'No titles stolen yet'}
              </p>
              <p className="text-gray-500">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start browsing to collect titles!'}
              </p>
            </div>
          </div>
        ) : (
          filteredDates.map((date) => {
            const filteredRecords = getFilteredRecords(date);
            if (filteredRecords.length === 0) return null;
            return (
              <DateSection
                key={date}
                date={date}
                records={filteredRecords}
                onDelete={(url) => handleDelete(date, url)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};