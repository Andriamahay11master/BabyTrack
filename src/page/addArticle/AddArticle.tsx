import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import FormArticle from '../../components/formArticle/FormArticle'
import Header from '../../components/header/Header'
import { breadcrumbAddArticle } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import './addArticle.scss'
export default function AddArticle() {
    return (
        <>  
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>
            <div className='main-page'>
                <div className="container">
                    <div className="main-page-top">
                        <Breadcrumb items={breadcrumbAddArticle}/>
                    </div>
                    <div className="main-section page-form">
                        <div className="section-form">
                            <FormArticle stateForm={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}