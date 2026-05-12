import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, X, Image as ImageIcon, CheckCircle2, 
  AlertCircle, Loader2, GripVertical, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { uploadService } from '../../services/uploadService';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const SortablePhoto = ({ id, url, isMain, onRemove, publicId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative aspect-square rounded-xl overflow-hidden group border-2",
        isMain ? "border-primary shadow-lg shadow-primary/10" : "border-border",
        isDragging && "opacity-50"
      )}
    >
      <img 
        src={url} 
        alt="Product" 
        className="w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 bg-white/20 hover:bg-white/40 rounded-lg backdrop-blur-sm text-white cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(id, publicId)}
          className="p-2 bg-destructive/80 hover:bg-destructive rounded-lg backdrop-blur-sm text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {isMain && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-[8px] font-bold uppercase tracking-widest rounded-md shadow-lg">
          Main
        </div>
      )}
    </div>
  );
};

const ImageUploader = ({ productId, onUploadSuccess, onDelete, existingImages = [] }) => {
  const [images, setImages] = useState(existingImages.map(img => ({
    id: img.id || Math.random().toString(),
    url: img.url,
    publicId: img.publicId,
    isMain: img.isMain || false
  })));
  
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update isMain based on new order (first image is main)
        return newItems.map((item, index) => ({
          ...item,
          isMain: index === 0
        }));
      });
    }
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleUpload(files);
  };

  const handleUpload = async (files) => {
    if (images.length + files.length > 8) {
      toast.error("Maximum 8 images allowed");
      return;
    }

    const newUploadingFiles = files.map(file => ({
      name: file.name,
      progress: 0,
      id: Math.random().toString(),
      error: null
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadId = newUploadingFiles[i].id;

      try {
        const response = await uploadService.uploadImage(
          file, 
          'products', 
          productId,
          (progress) => {
            setUploadingFiles(prev => prev.map(u => 
              u.id === uploadId ? { ...u, progress } : u
            ));
          }
        );

        if (response.data.success) {
          const result = response.data.data;
          const newImage = {
            id: result.publicId,
            url: result.secureUrl,
            publicId: result.publicId,
            isMain: images.length === 0 && i === 0
          };
          
          setImages(prev => [...prev, newImage]);
          onUploadSuccess?.(result);
          
          setUploadingFiles(prev => prev.filter(u => u.id !== uploadId));
        }
      } catch (error) {
        setUploadingFiles(prev => prev.map(u => 
          u.id === uploadId ? { ...u, error: "Upload failed" } : u
        ));
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const removeImage = async (id, publicId) => {
    try {
      await uploadService.deleteImage(publicId);
      setImages(prev => {
        const filtered = prev.filter(img => img.id !== id);
        // Ensure at least one main image if list not empty
        return filtered.map((img, idx) => ({
          ...img,
          isMain: idx === 0
        }));
      });
      onDelete?.(publicId);
      toast.success("Image removed");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const removeUploading = (id) => {
    setUploadingFiles(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <ImageIcon size={16} className="text-primary" /> Product Imagery
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground uppercase">
          {images.length} / 8 Images
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map(img => img.id)}
            strategy={rectSortingStrategy}
          >
            {images.map((img) => (
              <SortablePhoto
                key={img.id}
                id={img.id}
                url={img.url}
                publicId={img.publicId}
                isMain={img.isMain}
                onRemove={removeImage}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Uploading States */}
        {uploadingFiles.map((file) => (
          <div key={file.id} className="relative aspect-square rounded-xl overflow-hidden bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center p-4">
            {file.error ? (
              <div className="text-center space-y-2">
                <AlertCircle className="mx-auto text-destructive" size={24} />
                <p className="text-[8px] font-bold text-destructive uppercase">Error</p>
                <button onClick={() => removeUploading(file.id)} className="text-[8px] font-bold text-muted-foreground hover:text-foreground uppercase underline">Dismiss</button>
              </div>
            ) : (
              <div className="w-full space-y-3">
                <div className="flex items-center justify-center">
                  <Loader2 className="text-primary animate-spin" size={24} />
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-background rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <p className="text-[8px] font-bold text-center text-muted-foreground uppercase">{file.progress}%</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Button */}
        {images.length < 8 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Add Image</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      <div className="p-4 bg-muted/50 rounded-2xl border border-border flex items-start gap-3">
        <Upload className="text-primary shrink-0 mt-0.5" size={16} />
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-foreground uppercase tracking-wider">Guidelines</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Drag images to reorder. The first image will be your primary display. 
            Accepts JPEG, PNG, WebP (Max 5MB per file).
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
