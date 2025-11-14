import { PixelCrop } from 'react-image-crop';

export function getCroppedImg(
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string,
): Promise<File> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return Promise.reject(new Error('Canvas context не доступний'));
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas порожній'));
                return;
            }
            const file = new File([blob], fileName, { type: blob.type });
            resolve(file);
        }, 'image/jpeg'); // Ви можете змінити на image/png
    });
}
