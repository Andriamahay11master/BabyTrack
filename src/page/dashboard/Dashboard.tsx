import Header from '../../components/header/Header'
import { headerNav } from '../../data/header'
import './dashboard.scss'
export default function Dashboard() {
    return (
        <div className='main-page'>
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>
            <h1>Page Dashboard</h1>
        </div>
    )
}