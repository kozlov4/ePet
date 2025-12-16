import { toast } from 'react-toastify';

/**
 * Copy text to clipboard and show toast notification
 * @param text - Text to copy
 * @param successMessage - Optional success message (default: "Скопійовано!")
 */
export async function copyToClipboard(
    text: string,
    successMessage: string = 'Скопійовано!',
): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(successMessage, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    } catch (err) {
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            toast.success(successMessage, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (fallbackErr) {
            toast.error('Не вдалося скопіювати', {
                position: 'top-right',
                autoClose: 2000,
            });
        }
    }
}
