import { useState, useEffect } from 'react';
import { PageRecord } from '../types';
import { getTodayRecords } from '../utils/storage';
import { TitleCard } from '../components/TitleCard';

export const Popup = () => {
  const [todayRecords, setTodayRecords] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayRecords();
  }, []);

  const loadTodayRecords = async () => {
    try {
      const records = await getTodayRecords();
      setTodayRecords(records);
    } catch (error) {
      console.error('Failed to load records:', error);
    } finally {
      setLoading(false);
    }
  };

  const openFullPage = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('stolen-titles.html') });
  };

  return (
    <div className="w-96 h-[500px] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <h1 className="text-xl font-bold mb-1">Stolen Titles</h1>
        <p className="text-sm opacity-90">
          Today: {todayRecords.length} titles collected
        </p>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : todayRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              className="w-16 h-16 mb-4 opacity-50"
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
            <p className="text-center">
              No titles stolen yet today.
              <br />
              Start browsing!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayRecords.map((record, index) => (
              <TitleCard key={`${record.url}-${index}`} record={record} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
        <button
          onClick={openFullPage}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          View All Stolen Titles
        </button>
      </div>
    </div>
  );
};