import { motion } from 'framer-motion';

interface BlurredOverlayProps {
  position: {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
  };
  size: string;
  delay: number;
}

export const BlurredOverlay = ({ position, size, delay }: BlurredOverlayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.3, 0.8, 0.4],
        scale: [0, 1.2, 0.8, 1.1, 0.9],
        rotate: [0, 180, 360]
      }}
      transition={{
        delay,
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className={`absolute ${size} pointer-events-none`}
      style={position}
    >
      {/* 主模糊圆 */}
      <div
        className="w-full h-full rounded-full bg-white/10 backdrop-blur-md"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 70%, transparent 100%)',
          filter: 'blur(8px)',
        }}
      />

      {/* 内层光晕 */}
      <div
        className="absolute inset-2 rounded-full bg-white/5"
        style={{
          filter: 'blur(4px)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)',
        }}
      />

      {/* 外层光晕 */}
      <div
        className="absolute -inset-4 rounded-full bg-white/5"
        style={{
          filter: 'blur(12px)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
};
