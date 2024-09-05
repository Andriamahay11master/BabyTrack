import Header from '../../components/header/Header'
import { headerNav } from '../../data/header'
import './listArticle.scss'
export default function ListArticle() {
    return (
        <div className='main-page'>
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>
            <h1>Page List Article</h1>
        </div>
    )
}