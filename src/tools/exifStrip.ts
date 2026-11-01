/**
 * EXIF and Metadata Stripping Utility
 * Re-encodes images using browser HTMLCanvasElement to strip out
 * camera EXIF metadata, GPS coordinates, and private device tags before upload.
 */

export async function stripExifMetadata(file: File): Promise<{ blob: Blob; dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file for EXIF stripping.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file format.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not obtain 2D canvas context.'));
        }

        // Draw image onto canvas (canvas pixel re-encoding automatically strips EXIF)
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas toBlob conversion failed.'));
            }
            const dataUrl = canvas.toDataURL('image/png');
            resolve({
              blob,
              dataUrl,
              width: img.width,
              height: img.height,
            });
          },
          'image/png',
          0.95
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
