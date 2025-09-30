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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2">🎯 Stolen Titles</h1>
          <p className="text-lg opacity-90">
            Your personal web browsing collection
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <span>{totalCount} titles stolen</span>
            <span>•</span>
            <span>{dates.length} days recorded</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search titles or URLs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading your stolen titles...</div>
          </div>
        ) : filteredDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg
              className="w-20 h-20 mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl">
              {searchQuery
                ? 'No titles match your search'
                : 'No titles stolen yet. Start browsing!'}
            </p>
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