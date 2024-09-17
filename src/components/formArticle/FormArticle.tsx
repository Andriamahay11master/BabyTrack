import './formArticle.scss';
import {taille} from '../../data/article';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import Alert from '../alert/Alert';
interface FormArticleProps {
    stateForm : boolean
    uidUser : string
    referenceArticle? : string
}

export default function FormArticle({stateForm, uidUser, referenceArticle} : FormArticleProps) {

    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('1 mois');
    const [prixA, setPrixA] = useState(0);
    const [prixV, setPrixV] = useState(0);
    const [quantite, setQuantite] = useState(1);
    const [date, setDate] = useState<Timestamp | null>(Timestamp.fromDate(new Date()));
    const [success, setSuccess] = useState(false);

    const addArticle = async () => {
        if(date){
            await addDoc(collection(db, 'article'), {
                reference: reference,
                description: description,
                taille: size,
                prixA: prixA,
                prixV: prixV,
                benefice: prixV - prixA,
                dateA: date,
                dateV: date,
                stock: 1,
                etat: false,
                uidUser: uidUser
            })
            setSuccess(true);
            resetForm();
            await setTimeout(() => {
                setSuccess(false);
            }, 1000);
        }
        
    }

    const resetForm = () => {
        setReference('');
        setDescription('');
        setSize('1 mois');
        setPrixA(0);
        setPrixV(0);
        setQuantite(1);
        setDate(null);
    }
    const setArticle = () => {
        console.log('Set Article');
    }

    const onChangeReference = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReference(e.target.value);
    }

    const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    }

    const onChangePrixA = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Vérifier si la valeur contient uniquement des chiffres
        if (/^\d*$/.test(inputValue)) {
            setPrixA(Number(inputValue)); // Si c'est un nombre, on le met à jour
        } else {
            setPrixA(0); // Sinon, on met une chaîne vide
        }
    }

    const onChangePrixV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Vérifier si la valeur contient uniquement des chiffres
        if (/^\d*$/.test(inputValue)) {
            setPrixV(Number(inputValue)); // Si c'est un nombre, on le met à jour
        } else {
            setPrixV(0); // Sinon, on met une chaîne vide
        }
    }


    return (
        <div className="form-block">
            <h3 className="title-h3">Nouveau Article</h3>
            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="referenceArticle">Référence</label>
                    <input type="text" placeholder="Saisissez votre référence" id="referenceArticle" value={reference} onChange={onChangeReference}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" placeholder="Saisissez votre description" id="description" value={description} onChange={onChangeDescription}/>
                </div>
                <div className="form-group">
                    <label htmlFor="taille">Taille</label>
                    <select name="taille" id="taille" value={size} onChange={(e) => setSize(e.target.value)}>
                        {taille.map((item, index) => <option key={index} value={item}>{item}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="quantite">Quantité</label>
                    <select name="quantite" id="quantite" value={quantite} onChange={(e) => setQuantite(parseInt(e.target.value))}>
                        {Array.from(Array(10).keys()).map((item, index) => <option key={index} value={item + 1}>{item + 1}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="prix">Prix d'achat</label>
                    <input type="text" placeholder="Saisissez votre prix d'achat" id="prix" pattern='\d*' value={prixA} onChange={onChangePrixA}/>
                </div>
                <div className="form-group">
                    <label htmlFor="prixV">Prix de vente</label>
                    <input type="text" placeholder="Saisissez votre prix de vente" id="prixV" pattern='\d*' value={prixV} onChange={onChangePrixV}/>
                </div>
                <div className="form-group form-submit">
                    <button type="button" className='btn btn-primary' onClick={stateForm ? addArticle : setArticle}>{stateForm ? "Enregistrer" : "Modifier"}</button>
                </div>
            </form>
            <Alert icon="icon-checkmark" type="success" message="Enregistrement article reussi" state={success ? true : false}/>
        </div>
    )
}

