import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Header from '../../components/header/Header'
import { breadcrumbStatistics } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import './statistics.scss'
export default function Statistics() {
    return (
        <>  
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>    
            <div className='main-page'>
                <div className="container">
                    <div className="main-page-top">
                        <Breadcrumb items={breadcrumbStatistics}/>
                    </div>
                    <h1>Page Statistics</h1>
                </div>
            </div>
        </>
        
    )
}