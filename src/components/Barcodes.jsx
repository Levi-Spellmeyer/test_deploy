import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function Barcodes() {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState('');
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let selectedDeviceId;

    codeReader.listVideoInputDevices()
      .then(videoInputDevices => {
        // Select the rear camera if available
        selectedDeviceId = videoInputDevices.length > 1
          ? videoInputDevices.length - 1
          : 0;

        codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
          if (result && !scanned) {
            const scannedText = result.getText();
            setBarcode(scannedText);
            setScanned(true);

            // Play a ding on successful scan
            const audio = new Audio('/ding.mp3');
            audio.play();

            // Show an alert with the scanned number
            alert(`Scanned Barcode: ${scannedText}`);

            // Optional: reset scanned after 1 second to allow continuous scanning
            setTimeout(() => setScanned(false), 1000);
          }

          if (err && !(err.name === 'NotFoundException')) {
            console.error(err);
          }
        });
      })
      .catch(err => console.error(err));

    return () => codeReader.reset(); // Stop camera on unmount
  }, [scanned]);

  return (
    <section className="panel">
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
          onClick={() => setScanned(false)} // optional manual scan trigger
        >
          📷 Scan
        </button>
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
