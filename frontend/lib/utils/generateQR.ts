/**
 * Generates a QR code data URL for a given text/URL
 * Note: This is a placeholder. In production, use a library like 'qrcode'
 * @param text - Text or URL to encode
 * @param size - QR code size in pixels (default: 256)
 * @returns Promise that resolves to data URL
 */
export async function generateQR(
    text: string,
    size: number = 256
): Promise<string> {
    // Placeholder implementation
    // In production, install and use: npm install qrcode @types/qrcode
    // import QRCode from 'qrcode';
    // return await QRCode.toDataURL(text, { width: size });

    // For now, return a placeholder
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
}
