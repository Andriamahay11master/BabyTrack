import './formArticle.scss';
import {taille} from '../../data/article';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
interface FormArticleProps {
    stateForm : boolean
}

export default function FormArticle({stateForm} : FormArticleProps) {

    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('');
    const [prixA, setPrixA] = useState(0);
    const [prixV, setPrixV] = useState(0);
    const [date, setDate] = useState(new Date());
    const [success, setSuccess] = useState(false);

    const addArticle = async () => {
        await addDoc(collection(db, 'articles'), {
            reference: reference,
            description: description,
            taille: size,
            prixA: prixA,
            prixV: prixV,
            benefice: prixV - prixA,
            date: Timestamp.fromDate(new Date(date.toString())),
            stock: false,
            etat: false
        })
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
                    <input type="text" placeholder="Saisissez votre référence" id="referenceArticle" value={reference}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" placeholder="Saisissez votre description" id="description" value={description}/>
                </div>
                <div className="form-group">
                    <label htmlFor="taille">Taille</label>
                    <select name="taille" id="taille" value={size}>
                        {taille.map((item, index) => <option key={index} value={item}>{item}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="prix">Prix d'achat</label>
                    <input type="text" placeholder="Saisissez votre prix d'achat" id="prix" value={prixA}/>
                </div>
                <div className="form-group">
                    <label htmlFor="prixV">Prix de vente</label>
                    <input type="text" placeholder="Saisissez votre prix de vente" id="prixV" value={prixV}/>
                </div>
                <div className="form-group form-submit">
                    <button type="button" className='btn btn-primary' onClick={stateForm ? addArticle : setArticle}>{stateForm ? "Enregistrer" : "Modifier"}</button>
                </div>
            </form>
        </div>
    )
}

