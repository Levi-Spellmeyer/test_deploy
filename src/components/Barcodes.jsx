import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';

export default function Barcodes() {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState('');
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const hints = new Map();
    // Specify barcode formats you want to scan
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.QR_CODE
    ]);

    const codeReader = new BrowserMultiFormatReader(hints);
    let selectedDeviceId;

    setScanning(true);

    codeReader.listVideoInputDevices()
      .then(videoInputDevices => {
        // Select rear camera if available
        selectedDeviceId = videoInputDevices.length > 1
          ? videoInputDevices[videoInputDevices.length - 1].deviceId
          : videoInputDevices[0].deviceId;

        codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
          if (result && !scanned) {
            setBarcode(result.getText());
            setScanned(true);
            setScanning(false);

            // Play a ding on successful scan
            const audio = new Audio('/ding.mp3');
            audio.play();

            // Optional: reset scanned after 1 second for continuous scanning
            setTimeout(() => setScanned(false), 1000);
            setScanning(true);
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
          onClick={() => {
            setScanned(false); // reset for manual scan
            setScanning(true);
          }}
        >
          📷 Scan
        </button>
        {scanning && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            Scanning...
          </span>
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
