import Header from '../../components/header/Header'
import { headerNav } from '../../data/header'
import './statistics.scss'
export default function Statistics() {
    return (
        <div className='main-page'>
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>
            <div className="container">
                <h1>Page Statistics</h1>
            </div>
        </div>
    )
}