
import './Lightbox.scss';

interface LightboxProps {
    imageSrc: string
}
export default function Lightbox({imageSrc} : LightboxProps) {
    return (
        <div className="lightbox">
            <button className="btn btn-icon"><i className="icon-close"></i></button>
            <div className="lightBox-image">
                <img src={imageSrc} alt="Lightbox photo" title="Lightbox photo"/>
            </div>
        </div> 
    )
}