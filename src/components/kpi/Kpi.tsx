import { IconType } from 'react-icons';
import * as Icons from 'react-icons/fa';
import './kpi.scss';

interface KpiProps{
    icon ?: string
    title : string,
    value : number | string
    currency ?: string
}

export default function Kpi({icon, title, value, currency} : KpiProps) {
    const IconComponent:  IconType| null = icon ? Icons[icon as keyof typeof Icons] : null; // Récupérer l'icône dynamiquement

    return (
       <div className="kpi-item">
            <div className="kpi-col">
                {IconComponent && <IconComponent />}
            </div>
            <div className="kpi-col">
            <h3 className="title-h3 kpi-title">{title}</h3>
                <p className='kpi-text'>{value} {currency && <span>{currency}</span>}</p>
            </div>
       </div>
    )
}