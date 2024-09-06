import * as React from 'react';
import './formArticle.scss';

export default function FormArticle() {
    const [stateForm, setStateForm] = React.useState(false);

    const taille = [
        "1 mois",
        "2 mois",
        "3 mois",
        "4 mois",
        "5 mois",
        "6 mois",
        "7 mois",
        "8 mois",
        "9 mois",
        "10 mois",
        "11 mois",
        "12 mois",
        "13 mois",
        "14 mois",
        "15 mois",
        "16 mois",
        "17 mois",
        "18 mois",
        "19 mois",
        "20 mois",
        "21 mois",
        "22 mois",
        "23 mois",
        "24 mois",
        "3 ans",
        "4 ans",
        "5 ans",
        "6 ans",
        "7 ans",
        "8 ans",
        "9 ans",
        "10 ans",
    ];

    const addArticle = () => {
        console.log('Add article');
    }

    const setArticle = () => {
        console.log('Set Article');
    }

    React.useEffect(() => {
        setStateForm(true)
    })
    
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

