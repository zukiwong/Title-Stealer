import { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageUploaderProps {
  onImageChange: (base64Image: string | null) => void;
  currentImage?: string | null;
}

export const ImageUploader = ({ onImageChange, currentImage }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 压缩图片
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 限制最大宽度为 1920px，保持比例
          const maxWidth = 1920;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // 压缩质量
          let quality = 0.8;
          let base64 = canvas.toDataURL('image/jpeg', quality);

          // 如果还是太大（> 500KB），继续降低质量
          while (base64.length > 500 * 1024 && quality > 0.3) {
            quality -= 0.1;
            base64 = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      alert('Please upload a valid image file (JPG, PNG, or WebP)');
      return;
    }

    // 检查文件大小（< 10MB 原始文件）
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file is too large. Please upload an image smaller than 10MB.');
      return;
    }

    setIsProcessing(true);
    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
      onImageChange(compressed);
    } catch (error) {
      console.error('Failed to process image:', error);
      alert('Failed to process image. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="space-y-4 mb-8"
    >
      <div>
        <p className="text-white text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Background Image
        </p>
        <p className="text-sm text-white/60 mt-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}>
          Customize the word cloud background (Recommended: 1920×1080 or 16:9)
        </p>
      </div>

      {/* 预览区域 */}
      {preview && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/20">
          <img
            src={preview}
            alt="Background preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '300' }}>
              Preview
            </span>
          </div>
        </div>
      )}

      {/* 按钮组 */}
      <div className="flex gap-2">
        <label className="flex-1">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          <div className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-center rounded-md cursor-pointer transition-colors text-sm border border-white/20">
            {isProcessing ? 'Processing...' : preview ? 'Change Image' : 'Upload Image'}
          </div>
        </label>

        {preview && (
          <button
            onClick={handleRemove}
            className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30 rounded-md text-sm"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Remove
          </button>
        )}
      </div>
    </motion.div>
  );
};
