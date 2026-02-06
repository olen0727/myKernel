import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
    value?: string;
    onChange: (base64: string) => void;
    className?: string;
    placeholder?: string;
}

const MAX_WIDTH = 1200;
const QUALITY = 0.8;

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    value,
    onChange,
    className = "",
    placeholder = "點擊或拖放檔案，或直接貼上圖片/連結"
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // --- Image Processing Logic ---
    const processImage = useCallback((file: File | Blob) => {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            // Create an image to resize it
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize logic
                if (width > MAX_WIDTH) {
                    height = (height * MAX_WIDTH) / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const resizedBase64 = canvas.toDataURL('image/jpeg', QUALITY);
                    onChange(resizedBase64);
                    toast.success('圖片處理完成');
                } else {
                    toast.error('圖片處理失敗');
                }
                setIsLoading(false);
            };
            img.onerror = () => {
                toast.error('無法讀取圖片');
                setIsLoading(false);
            };
            img.src = result;
        };
        reader.onerror = () => {
            toast.error('讀取檔案失敗');
            setIsLoading(false);
        };
        reader.readAsDataURL(file);
    }, [onChange]);

    const fetchImageFromUrl = useCallback(async (url: string) => {
        // Validating URL format mostly for safety, though fetch will fail if invalid
        try {
            new URL(url);
        } catch {
            // Not a valid URL, ignore
            return false;
        }

        setIsLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            if (!blob.type.startsWith('image/')) {
                toast.error('URL 指向的不是圖片');
                setIsLoading(false);
                return true; // Return true because it WAS a URL, just failed
            }
            processImage(blob);
            return true;
        } catch (error) {
            console.error("Fetch image error:", error);
            // Don't show error immediately as it might be regular text paste
            // But if it looks like a URL, user might expect it to work
            toast.error('無法抓取圖片 (可能受 CORS 限制)', {
                description: '建議將圖片下載後上傳，或使用截圖貼上。'
            });
            setIsLoading(false);
            return true;
        }
    }, [processImage]);


    // --- Event Handlers ---

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processImage(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processImage(e.dataTransfer.files[0]);
        }
    };

    const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
        // 1. Check for Files (Screenshots)
        if (e.clipboardData.files.length > 0) {
            e.preventDefault();
            const file = e.clipboardData.files[0];
            if (file.type.startsWith('image/')) {
                processImage(file);
            } else {
                toast.error('貼上的檔案非圖片格式');
            }
            return;
        }

        // 2. Check for Text (URL)
        const text = e.clipboardData.getData('text');
        if (text) {
            // Simple heuristic to check if it might be a valid URL without regex complexity
            if (text.startsWith('http://') || text.startsWith('https://')) {
                const handled = await fetchImageFromUrl(text);
                if (handled) e.preventDefault();
            }
        }
    }, [processImage, fetchImageFromUrl]);

    const handleRemove = () => {
        onChange('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className={className}>
            {value ? (
                <div className="relative group rounded-md overflow-hidden border border-border bg-muted/30">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full max-h-[300px] object-contain mx-auto"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                        >
                            <X className="w-4 h-4 mr-2" />
                            移除圖片
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className={`
                        relative flex flex-col items-center justify-center h-[200px] 
                        border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
                        ${isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30'}
                        ${isLoading ? 'pointer-events-none opacity-70' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    // Capture paste events in the container
                    onPaste={handlePaste}
                    onClick={() => inputRef.current?.click()}
                    tabIndex={0} // Make div focusable to receive paste
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {isLoading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="text-sm font-medium">處理圖片中...</p>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-4 mb-4">
                                <div className="bg-background p-3 rounded-full shadow-sm text-primary">
                                    <Upload className="w-6 h-6" />
                                </div>
                            </div>

                            <p className="text-sm font-medium mb-1">
                                {placeholder}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 bg-background/50 px-3 py-1 rounded-full border">
                                <span className="flex items-center"><ImageIcon className="w-3 h-3 mr-1" /> Jpeg, Png</span>
                                <span>•</span>
                                <span className="flex items-center"><LinkIcon className="w-3 h-3 mr-1" /> Ctrl+V 貼上</span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
