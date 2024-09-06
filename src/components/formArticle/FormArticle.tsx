import './formArticle.scss';
import {taille} from '../../data/article';

interface FormArticleProps {
    stateForm : boolean
}

export default function FormArticle({stateForm} : FormArticleProps) {

    const addArticle = () => {
        console.log('Add article');
    }

    const setArticle = () => {
        console.log('Set Article');
    }

    return (
        <div className="form-block">
            <h3 className="title-h3">Nouveau Article</h3>
            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="referenceArticle">Référence</label>
                    <input type="text" placeholder="Saisissez votre référence" id="referenceArticle"/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" placeholder="Saisissez votre description" id="description"/>
                </div>
                <div className="form-group">
                    <label htmlFor="taille">Taille</label>
                    <select name="taille" id="taille">
                        {taille.map((item, index) => <option key={index} value={item}>{item}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="prix">Prix</label>
                    <input type="text" placeholder="Saisissez votre prix" id="prix"/>
                </div>
                <div className="form-group form-submit">
                    <button type="button" className='btn btn-primary' onClick={stateForm ? setArticle : addArticle}>{stateForm ? "Enregistrer" : "Modifier"}</button>
                </div>
            </form>
        </div>
    )
}

