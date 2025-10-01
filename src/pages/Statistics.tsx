import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllRecords, getIgnoredKeywords, getBackgroundImage, getTextMaskImage } from '../utils/storage';
import { extractKeywords, getTitlesByDateRange, WordFrequency } from '../utils/keywords';
import { FloatingWord } from '../components/FloatingWord';
import { BlurredOverlay } from '../components/BlurredOverlay';
import { StoredRecords } from '../types';

export const Statistics = () => {
  const [records, setRecords] = useState<StoredRecords>({});
  const [keywords, setKeywords] = useState<WordFrequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ignoredKeywords, setIgnoredKeywords] = useState<string[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textMaskImage, setTextMaskImage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (Object.keys(records).length > 0) {
      updateKeywords();
    }
  }, [records, timeRange, ignoredKeywords]);

  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const loadData = async () => {
    try {
      const allRecords = await getAllRecords();
      const keywords = await getIgnoredKeywords();
      const bgImage = await getBackgroundImage();
      const maskImage = await getTextMaskImage();
      setRecords(allRecords);
      setIgnoredKeywords(keywords);
      setBackgroundImage(bgImage);
      setTextMaskImage(maskImage);
    } catch (error) {
      // Silent error
    } finally {
      setLoading(false);
    }
  };

  const updateKeywords = () => {
    const dates = Object.keys(records).sort();
    if (dates.length === 0) return;

    let startDate: string | undefined;
    const today = new Date().toISOString().split('T')[0];

    switch (timeRange) {
      case 'today':
        startDate = today;
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      default:
        startDate = undefined;
    }

    const titles = getTitlesByDateRange(records, startDate);
    const words = extractKeywords(titles, ignoredKeywords);
    setKeywords(words);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  const maxValue = keywords.length > 0 ? Math.max(...keywords.map(w => w.value)) : 1;
  const minValue = keywords.length > 0 ? Math.min(...keywords.map(w => w.value)) : 1;
  const topWord = keywords.length > 0 ? keywords[0].text.toUpperCase() : 'BROWSE';

  // 默认图片
  const defaultBackgroundImage = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80";
  const defaultTextMaskImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80";
  const displayBackgroundImage = backgroundImage || defaultBackgroundImage;
  const displayTextMaskImage = textMaskImage || defaultTextMaskImage;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <img
          src={displayBackgroundImage}
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
      </div>

      {/* 中间大文字 - 图片填充效果 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative"
        >
          <h1
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold leading-none tracking-tight text-transparent bg-clip-text bg-center bg-cover px-4"
            style={{
              fontFamily: 'Poppins, sans-serif',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              backgroundImage: `url('${displayTextMaskImage}')`,
              filter: 'contrast(1.25) brightness(1.1)',
            }}
          >
            {topWord}
          </h1>

          {/* 文字背后的模糊效果 */}
          <div
            className="absolute inset-0 text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold leading-none tracking-tight text-white/20 backdrop-blur-sm -z-10 px-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {topWord}
          </div>
        </motion.div>
      </div>

      {/* 标题 - 左上角 */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-xl font-semibold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Title Stealer
        </h1>
        <p className="text-xs text-gray-400">Titles stolen from your browsing</p>
      </div>

      {/* 时间筛选 - 右上角 */}
      <div className="absolute top-8 right-8 z-20">
        <div className="relative">
          {/* 当前选中的显示 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="px-2 py-1 text-white/50 text-xs border-0 border-b border-white/20 hover:text-white/70 hover:border-white/40 transition-all cursor-pointer bg-transparent focus:outline-none"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '300',
              minWidth: '100px',
              textAlign: 'left',
            }}
          >
            {timeRange === 'today' && 'Today'}
            {timeRange === 'week' && 'Past Week'}
            {timeRange === 'month' && 'Past Month'}
            {timeRange === 'all' && 'All Time'}
          </button>

          {/* 下拉选项 */}
          {isDropdownOpen && (
            <div
              className="absolute top-full right-0 mt-2"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Past Week' },
                { value: 'month', label: 'Past Month' },
                { value: 'all', label: 'All Time' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTimeRange(option.value as any);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '300',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 浮动词云 */}
      {keywords.slice(1, 81).map((word, index) => (
        <FloatingWord
          key={word.text}
          text={word.text}
          value={word.value}
          index={index}
          totalWords={keywords.length}
          maxValue={maxValue}
          minValue={minValue}
        />
      ))}

      {/* 模糊光晕效果 */}
      <BlurredOverlay
        position={{ top: '20%', left: '10%' }}
        size="w-32 h-32"
        delay={2}
      />
      <BlurredOverlay
        position={{ bottom: '30%', right: '15%' }}
        size="w-24 h-24"
        delay={2.5}
      />
      <BlurredOverlay
        position={{ top: '60%', left: '70%' }}
        size="w-28 h-28"
        delay={3}
      />
      <BlurredOverlay
        position={{ top: '40%', right: '20%' }}
        size="w-20 h-20"
        delay={3.5}
      />
      <BlurredOverlay
        position={{ bottom: '15%', left: '25%' }}
        size="w-36 h-36"
        delay={4}
      />
      <BlurredOverlay
        position={{ top: '10%', right: '40%' }}
        size="w-16 h-16"
        delay={4.5}
      />
      <BlurredOverlay
        position={{ bottom: '60%', right: '5%' }}
        size="w-22 h-22"
        delay={5}
      />

      {/* 径向渐变叠加层增加深度 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  );
};
