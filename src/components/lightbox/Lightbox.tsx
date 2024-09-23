
import './lightbox.scss';

interface LightboxProps {
    state: boolean,
    imageSrc: string,
    onClose: () => void
}
export default function Lightbox({state, imageSrc, onClose} : LightboxProps) {
    return (
        <div className={state ? "lightbox show" : "lightbox"}>
            <button className="btn btn-icon" onClick={onClose}><i className="icon-close"></i></button>
            <div className="lightbox-image">
                <img src={imageSrc} alt="Lightbox photo" title="Lightbox photo"/>
            </div>
        </div> 
    )
}