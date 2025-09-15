import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function Barcodes() {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState('');

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
        codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
          if (result) {
            const scannedValue = result.getText();
            setBarcode(scannedValue);
            console.log('Scanned barcode:', scannedValue);
            alert(`Scanned barcode: ${scannedValue}`);
            // Play a ding sound on successful scan
            const audio = new Audio('/ding.mp3');
            audio.play();
          }
          if (err && !(err.name === 'NotFoundException')) {
            console.error(err);
          }
        });
      })
      .catch(err => console.error(err));

    return () => codeReader.reset(); // Stop camera when component unmounts
  }, []);

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>Scan Barcode</h2>
      <div style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', borderRadius: '12px', background: '#000' }}
        />
        {/* Optional Camera Button Overlay */}
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