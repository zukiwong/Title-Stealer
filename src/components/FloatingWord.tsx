import { motion } from 'framer-motion';

interface FloatingWordProps {
  text: string;
  value: number;
  index: number;
  totalWords: number;
  maxValue: number;
  minValue: number;
}

export const FloatingWord = ({ text, value, index, totalWords, maxValue, minValue }: FloatingWordProps) => {
  // 根据词频计算字体大小
  const getFontSize = () => {
    const ratio = (value - minValue) / (maxValue - minValue || 1);
    const minSize = 16;
    const maxSize = 80;
    return minSize + ratio * (maxSize - minSize);
  };

  // 颜色方案 - 全部白色，根据频率调整透明度
  const getOpacity = () => {
    if (index < Math.max(3, totalWords * 0.1)) {
      return 0.8; // 高频词更明显
    }
    return 0.6; // 其他词稍微淡一些
  };

  // 随机位置
  const position = {
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
  };

  // 随机动画
  const getRandomAnimation = () => {
    const animations = [
      {
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0],
        scale: [1, 1.05, 1]
      },
      {
        x: [0, 5, -5, 0],
        opacity: [0.7, 1, 0.7]
      },
      {
        rotate: [0, 1, -1, 0],
        scale: [1, 1.02, 1]
      }
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  };

  const fontSize = getFontSize();
  const opacity = getOpacity();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [opacity * 0.5, opacity, opacity * 0.7],
        scale: 1,
        ...getRandomAnimation()
      }}
      transition={{
        delay: index * 0.05,
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className="absolute pointer-events-none select-none"
      style={position}
    >
      <span
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '700',
          color: `rgba(255, 255, 255, ${opacity})`,
          textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          filter: 'blur(0.5px)',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>

      {/* 光晕效果 */}
      <span
        className="absolute inset-0 -z-10"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '700',
          color: 'rgba(255, 255, 255, 0.2)',
          filter: 'blur(2px)',
          transform: 'scale(1.1)',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </motion.div>
  );
};
