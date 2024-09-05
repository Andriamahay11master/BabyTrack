import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Header from '../../components/header/Header'
import { breadcrumbDashboard } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import './dashboard.scss'
export default function Dashboard() {
    return (
        <>
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>
            <div className='main-page'>
                <div className="container">
                    <div className="main-page-top">
                        <Breadcrumb items={breadcrumbDashboard}/>
                    </div>
                    <h1>Page Dashboard</h1>
                </div>
            </div>
        </>
        
    )
}