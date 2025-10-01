import { useEffect, useRef, useState } from 'react';
import cloud from 'd3-cloud';
import { WordFrequency } from '../utils/keywords';

interface WordCloudProps {
  words: WordFrequency[];
  width?: number;
  height?: number;
  shape?: 'circle' | 'square' | 'heart' | 'star' | 'cloud';
  onWordClick?: (word: string) => void;
}

export const WordCloud = ({
  words,
  width = 800,
  height = 600,
  shape = 'circle',
  onWordClick
}: WordCloudProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cloudWords, setCloudWords] = useState<any[]>([]);

  useEffect(() => {
    console.log('☁️ WordCloud received words:', words.length);
    if (words.length === 0) {
      setCloudWords([]);
      return;
    }

    // 计算字体大小范围 - 使用更小的字体
    const maxValue = Math.max(...words.map(w => w.value));
    const minValue = Math.min(...words.map(w => w.value));
    const fontSizeScale = (value: number) => {
      const minSize = 14;
      const maxSize = 60;
      if (maxValue === minValue) return 30; // 如果所有词频相同，使用中等大小
      return minSize + ((value - minValue) / (maxValue - minValue)) * (maxSize - minSize);
    };

    console.log('☁️ Generating word cloud layout...');
    console.log('☁️ Font size range:', fontSizeScale(minValue), 'to', fontSizeScale(maxValue));

    // 生成词云布局
    const layout = cloud()
      .size([width, height])
      .words(
        words.slice(0, 50).map(w => ({ // 限制最多50个词
          text: w.text,
          size: fontSizeScale(w.value),
          value: w.value
        }))
      )
      .padding(8) // 增加间距
      .rotate(() => 0) // 暂时不旋转，方便调试
      .fontSize(d => d.size!)
      .spiral('archimedean') // 使用螺旋布局
      .on('end', (layoutWords) => {
        console.log('☁️ Word cloud layout completed:', layoutWords.length, 'words positioned out of', words.length);
        if (layoutWords.length < words.slice(0, 50).length) {
          console.warn('⚠️ Some words could not be positioned. Try increasing canvas size or reducing font size.');
        }
        setCloudWords(layoutWords);
      });

    layout.start();
  }, [words, width, height, shape]);

  // 颜色方案 - 大部分白色，前几个高频词有低饱和度颜色
  const getColor = (index: number, totalWords: number) => {
    // 前10%的词有颜色
    if (index < Math.max(3, totalWords * 0.1)) {
      const colors = [
        '#fbbf24', // 黄色
        '#60a5fa', // 蓝色
        '#f87171', // 红色
        '#a78bfa', // 紫色
        '#34d399', // 绿色
      ];
      return colors[index % colors.length];
    }
    // 其他词都是白色
    return '#ffffff';
  };

  if (words.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width, height, backgroundColor: '#1a1a1a' }}
      >
        <div className="text-center text-gray-400">
          <p className="text-sm">No keywords found</p>
        </div>
      </div>
    );
  }

  // 如果词云还在生成中
  if (cloudWords.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width, height, backgroundColor: '#1a1a1a' }}
      >
        <div className="text-center text-gray-400">
          <p className="text-sm">Generating word cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <g transform={`translate(${width / 2},${height / 2})`}>
        {cloudWords.map((word, index) => (
          <text
            key={word.text}
            style={{
              fontSize: `${word.size}px`,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '700',
              fill: getColor(index, cloudWords.length),
              cursor: onWordClick ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
            textAnchor="middle"
            transform={`translate(${word.x},${word.y})rotate(${word.rotate})`}
            onClick={() => onWordClick?.(word.text)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `translate(${word.x}px,${word.y}px)rotate(${word.rotate}deg) scale(1.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = `translate(${word.x}px,${word.y}px)rotate(${word.rotate}deg) scale(1)`;
            }}
          >
            {word.text}
          </text>
        ))}
      </g>
    </svg>
  );
};