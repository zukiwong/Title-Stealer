interface StaticPreviewProps {
  backgroundImage?: string | null;
  maskImage?: string | null;
}

export const StaticPreview = ({ backgroundImage, maskImage }: StaticPreviewProps) => {
  // 默认图片
  const defaultBgImage = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80";
  const defaultMaskImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80";

  const displayBgImage = backgroundImage || defaultBgImage;
  const displayMaskImage = maskImage || defaultMaskImage;

  return (
    <div className="relative w-full h-36 rounded-lg overflow-hidden border border-white/20 bg-black">
      {/* 背景图 */}
      <img
        src={displayBgImage}
        alt="Background preview"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

      {/* 中间文字 - 应用遮罩图 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1
          className="text-5xl font-bold leading-none tracking-tight text-transparent bg-clip-text bg-center bg-cover"
          style={{
            fontFamily: 'Poppins, sans-serif',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            backgroundImage: `url('${displayMaskImage}')`,
            filter: 'contrast(1.25) brightness(1.1)',
          }}
        >
          PREVIEW
        </h1>
      </div>

      {/* 标签 */}
      <div className="absolute top-2 right-2">
        <span className="text-white/50 text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}>
          Preview
        </span>
      </div>
    </div>
  );
};
