import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './capturePhoto.scss';

function CapturePhoto() {

    const [isPopinOpen, setIsPopinOpen] = useState(false); // New state for popin visibility
    const webcamRef = useRef<Webcam | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string |null>(null);

  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot(); // Capture photo
    setCapturedPhoto(imageSrc);
  };

  const closePopin = () => {
    setIsPopinOpen(false);
  };

  if(!isPopinOpen) return null;

  return (
    <div className='capturePhoto'>
        <button className='btn btn-icon' onClick={closePopin}><i className='icon-close'></i></button>
        <div className="captureContent">
            <div className="capturePhotoTop">
                {!capturedPhoto ? (
                    <div className='capture-col'>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                        />
                        <button className="btn btn-primary" onClick={capture}>Prendre une photo</button>
                    </div>
                ) : (
                    <div className='capture-col'>
                        <h3 className='title-h3'>Aperçu de votre photo:</h3>
                        <img className="image-capture" src={capturedPhoto} alt="photo capturé" />
                        <button className="btn btn-primary" onClick={() => setCapturedPhoto(null)}>Choisir cette photo</button>
                    </div>
                    )}
            </div>
            {capturedPhoto && <div className="capturePhotoAction"><button className="btn btn-primary" onClick={() => setCapturedPhoto(null)}>Prendre une nouvelle photo</button></div>}
        </div>
    </div>
  );
}

export default CapturePhoto;
