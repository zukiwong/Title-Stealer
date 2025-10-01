import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, ArrowLeft } from 'lucide-react';
import { getAllRecords, getIgnoredKeywords, saveIgnoredKeywords, clearAllRecords } from '../utils/storage';

const popupWords = [
  'STEAL', 'COLLECT', 'CAPTURE', 'HARVEST', 'GATHER', 'SAVE', 'STORE',
  'BROWSE', 'CLICK', 'VISIT', 'READ', 'VIEW', 'EXPLORE', 'DISCOVER'
];

// 浮动词组件
function FloatingWordSmall({ text, delay, position }: any) {
  const getRandomAnimation = () => {
    const animations = [
      { y: [0, -5, 0], rotate: [0, 1, -1, 0], scale: [1, 1.03, 1] },
      { x: [0, 3, -3, 0], opacity: [0.5, 0.8, 0.5] },
      { rotate: [0, 0.5, -0.5, 0], scale: [1, 1.01, 1] }
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.4, 0.5, 0.4],
        scale: 1,
        ...getRandomAnimation()
      }}
      transition={{
        delay,
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className="absolute pointer-events-none select-none"
      style={position}
    >
      <span
        className="text-xs font-medium text-white/50 tracking-wider"
        style={{
          textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {text}
      </span>
    </motion.div>
  );
}

export const Popup = () => {
  const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const records = await getAllRecords();
    const count = Object.values(records).reduce((sum, arr) => sum + arr.length, 0);
    setWordCount(count);
  };

  const handleViewCollection = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('statistics.html') });
  };

  return (
    <div className="w-[400px] h-[600px] relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* 背景图片模糊 */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-20 blur-sm grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-gray-900/90" />
      </div>

      {/* 顶部菜单按钮 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex justify-end p-4"
      >
        <button
          onClick={() => setCurrentPage(currentPage === 'main' ? 'settings' : 'main')}
          className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors"
        >
          {currentPage === 'settings' ? <ArrowLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      {/* 主内容 */}
      {currentPage === 'main' ? (
        <MainPage wordCount={wordCount} onViewCollection={handleViewCollection} />
      ) : (
        <SettingsPage wordCount={wordCount} />
      )}

      {/* 底部渐变叠加层 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

function MainPage({ wordCount, onViewCollection }: { wordCount: number; onViewCollection: () => void }) {
  return (
    <div className="relative z-10 px-6 py-4 flex flex-col h-full">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-6"
      >
        <h1
          className="text-5xl font-bold leading-none tracking-tight text-white drop-shadow-lg"
          style={{
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          TITLE
          <br />
          STEALER
        </h1>
      </motion.div>

      {/* 副标题 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-8"
      >
        <p className="text-sm leading-relaxed text-white/80 tracking-wide" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}>
          COLLECT WORDS AS YOU BROWSE
          <br />
          WATCH THEM GROW INTO ART
        </p>
      </motion.div>

      {/* 浮动词 */}
      {popupWords.map((word, index) => (
        <FloatingWordSmall
          key={`popup-${word}`}
          text={word}
          delay={index * 0.1 + 0.6}
          position={{
            top: `${20 + Math.random() * 40}%`,
            left: `${10 + Math.random() * 60}%`,
          }}
        />
      ))}

      {/* 模糊光晕 */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-1/3 right-8 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md"
        style={{
          filter: 'blur(8px)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 70%, transparent 100%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 2.5, delay: 1.2 }}
        className="absolute bottom-1/3 left-4 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md"
        style={{
          filter: 'blur(6px)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 70%, transparent 100%)',
        }}
      />

      {/* 主按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-auto mb-8"
      >
        <button
          onClick={onViewCollection}
          className="w-full py-6 bg-white hover:bg-white/90 text-black rounded-full text-lg tracking-wider font-medium transition-all"
          style={{
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          VIEW STOLEN TITLES
        </button>
      </motion.div>

      {/* 底部统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="flex justify-between items-center text-white/70 mt-auto pb-4"
      >
        <span className="text-sm tracking-wide" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}>
          {wordCount} words captured
        </span>
      </motion.div>
    </div>
  );
}

function SettingsPage({ wordCount }: { wordCount: number }) {
  const [ignoredKeywords, setIgnoredKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  // 加载屏蔽词列表
  useEffect(() => {
    loadIgnoredKeywords();
  }, []);

  const loadIgnoredKeywords = async () => {
    const keywords = await getIgnoredKeywords();
    setIgnoredKeywords(keywords);
  };

  const handleAddKeyword = async () => {
    const keyword = newKeyword.trim().toLowerCase();
    if (keyword && !ignoredKeywords.includes(keyword)) {
      const newList = [...ignoredKeywords, keyword];
      setIgnoredKeywords(newList);
      await saveIgnoredKeywords(newList);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = async (keyword: string) => {
    const newList = ignoredKeywords.filter(k => k !== keyword);
    setIgnoredKeywords(newList);
    await saveIgnoredKeywords(newList);
  };

  const handleClearAllWords = async () => {
    if (confirm('Are you sure you want to remove all collected words? This action cannot be undone.')) {
      await clearAllRecords();
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 px-6 py-4 flex flex-col h-full overflow-y-auto"
    >
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-3xl tracking-tight text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Settings</h1>
        <p className="text-sm text-white/60 mt-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}>
          Manage your word collection
        </p>
      </motion.div>

      {/* 忽略关键词 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4 mb-8"
      >
        <div>
          <p className="text-white text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>Ignored Keywords</p>
          <p className="text-sm text-white/60 mt-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}>
            Words to exclude from your collection
          </p>
        </div>

        {/* 添加输入框 */}
        <div className="flex gap-2">
          <input
            placeholder="Add keyword to ignore..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none rounded-md text-sm"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}
          />
          <button
            onClick={handleAddKeyword}
            className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/20 rounded-md"
          >
            +
          </button>
        </div>

        {/* 关键词列表 */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {ignoredKeywords.map((keyword) => (
            <motion.div
              key={keyword}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10"
            >
              <span className="text-sm text-white" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}>{keyword}</span>
              <button
                onClick={() => handleRemoveKeyword(keyword)}
                className="text-white/60 hover:text-white text-lg"
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 分隔线 */}
      <div className="border-t border-white/20 my-6" />

      {/* 删除按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <button
          onClick={handleClearAllWords}
          className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30 rounded-md text-sm"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Remove All Words
        </button>
      </motion.div>

      {/* 底部统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="pt-4 border-t border-white/20 mt-auto"
      >
        <div className="flex justify-between text-sm text-white/60" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}>
          <span>Total ignored: {ignoredKeywords.length}</span>
          <span>Collection: {wordCount} words</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
