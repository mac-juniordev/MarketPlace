// Import React hooks
import { useState, useRef } from 'react';
// Import motion
import { motion } from 'framer-motion';
// Import icons
import { Upload, X, Image as ImageIcon } from 'lucide-react';

// Image upload component
export default function ImageUpload({ images, setImages, maxImages = 5 }) {
  // Ref for file input
  const fileInputRef = useRef(null);
  // State for uploading
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > maxImages) {
      alert(`You can upload a maximum of ${maxImages} images`);
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        // Upload to backend
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5269/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        setImages((prev) => [...prev, data.url]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-gray-700">
        Listing Images
      </label>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {/* Image previews */}
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
          >
            <img
              src={image}
              alt={`Listing image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Upload button */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            ) : (
              <>
                <Upload size={24} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-500">
                  Upload
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="mt-2 text-xs text-gray-400">
        Up to {maxImages} images. JPEG, PNG, or WebP. Max 5MB each.
      </p>
    </div>
  );
}