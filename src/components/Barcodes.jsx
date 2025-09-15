import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function Barcodes() {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState('');
  const [toast, setToast] = useState('');

  // Helper to show a temporary toast message
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000); // Hide after 2 seconds
  };

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let selectedDeviceId;

    codeReader.listVideoInputDevices()
      .then(videoInputDevices => {
        // Select the rear camera if available
        selectedDeviceId = videoInputDevices.length > 1
          ? videoInputDevices[videoInputDevices.length - 1].deviceId
          : videoInputDevices[0].deviceId;

        // Start continuous scanning
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              const scannedValue = result.getText();
              setBarcode(scannedValue);
              showToast(`Scanned: ${scannedValue}`);
              const audio = new Audio('/ding.mp3');
              audio.play();
            }
            if (err && err.name !== 'NotFoundException') {
              console.error(err);
            }
          }
        );
      })
      .catch(err => console.error(err));

    // Cleanup camera on unmount
    return () => codeReader.reset();
  }, []);

  return (
    <section className="panel" style={{ position: 'relative' }}>
      <h2 style={{ marginTop: 0 }}>Scan Barcode</h2>

      <div style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', borderRadius: '12px', background: '#000' }}
        />

        {/* Camera button overlay */}
        <button
          className="btn"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}
          onClick={() => console.log('Manual scan trigger (optional)')}
        >
          📷 Scan
        </button>

        {/* Toast notification */}
        {toast && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            zIndex: 20,
          }}>
            {toast}
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px' }}>
        <strong>Last Scanned Barcode:</strong> {barcode || 'None'}
      </div>

      <p style={{ color: 'var(--muted)', marginTop: '8px' }}>
        The scanned number will eventually be sent to your database to query item information.
      </p>
    </section>
  );
}
