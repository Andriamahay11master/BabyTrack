import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Header from '../../components/header/Header'
import { breadcrumbListArticle } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import './listArticle.scss'
export default function ListArticle() {
    return (
        <>
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>    
            <div className='main-page'>
                <div className="container">
                    <div className="main-page-top">
                        <Breadcrumb items={breadcrumbListArticle}/>
                    </div>
                    <h1>Page List Article</h1>
                </div>
            </div>
        </>
    )
}