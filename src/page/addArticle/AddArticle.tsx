import Header from '../../components/header/Header'
import { headerNav } from '../../data/header'
import './addArticle.scss'
export default function AddArticle() {
    return (
        <div className='main-page'>
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>
            <div className="container">
                <h1>Page Add Article</h1>
            </div>
        </div>
    )
}