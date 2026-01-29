'use client';

// Minimal component for QR Code generation (Mock/Placeholder)
export default function QRCodeGenerator({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="w-48 h-48 bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl mb-4">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <span className="text-[10px] text-gray-400 font-mono uppercase">QR: {value.substring(0, 20)}...</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600">Scan to open in ProphetBase App</p>
    </div>
  );
}
