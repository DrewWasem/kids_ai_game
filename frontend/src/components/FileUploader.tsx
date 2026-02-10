import React, { useCallback, useRef, useState } from 'react';

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number;
}

export default function FileUploader({ onUpload, accept, maxSize = 10 * 1024 * 1024 }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    if (file.size > maxSize) { setError(`File too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`); return; }
    setUploading(true);
    try { await onUpload(file); } catch (e) { setError(e instanceof Error ? e.message : 'Upload failed'); }
    finally { setUploading(false); }
  }, [onUpload, maxSize]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
      }`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {uploading ? (
        <p className="text-gray-500">Uploading...</p>
      ) : (
        <div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Drop a file here or click to browse</p>
          {accept && <p className="text-xs text-gray-400 mt-1">Accepted: {accept}</p>}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
