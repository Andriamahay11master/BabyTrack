import './formArticle.scss';
import {taille} from '../../data/article';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp, where, getDocs, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Alert from '../alert/Alert';
import { useNavigate } from 'react-router-dom';
interface FormArticleProps {
    stateForm : boolean
    uidUser : string
    referenceArticle? : string
}

export default function FormArticle({stateForm, uidUser, referenceArticle} : FormArticleProps) {

    const navigate = useNavigate();
    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('1 mois');
    const [prixA, setPrixA] = useState(0);
    const [prixV, setPrixV] = useState(0);
    const [quantite, setQuantite] = useState(1);
    const [date, setDate] = useState<Timestamp | null>(Timestamp.fromDate(new Date()));
    const [success, setSuccess] = useState(false);
    const [update, setUpdate] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    //Affiche les valeurs de l'article pour chaque champs
    const displayValueArticle = async (id : string ) => {
        try{
            const q = query(collection(db, "article"), where("reference", "==", id));
            getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setReference(doc.data().reference);
                    setDescription(doc.data().description);
                    setSize(doc.data().taille);
                    setPrixA(doc.data().prixA);
                    setPrixV(doc.data().prixV);
                    setQuantite(doc.data().stock);
                    setDate(doc.data().dateA);
                })
            })
        }
        catch(error){
            console.error("Error fetching documents: ", error);
        }
    }

    const updateArticle = async () => {
        if (date) {
            try {
                const q = query(collection(db, "article"), where("reference", "==", referenceArticle));
                const querySnapshot = await getDocs(q);
    
                // Parcourt les documents retournés et met à jour chacun
                const updatePromises = querySnapshot.docs.map(async (doc) => {
                    await updateDoc(doc.ref, {
                        reference: reference,
                        description: description,
                        taille: size,
                        prixA: prixA,
                        prixV: prixV,
                        benefice: prixV - prixA,
                        dateA: date,
                        dateV: date,
                        stock: quantite,
                        etat: false
                    });
                });
    
                // Attends que toutes les mises à jour soient effectuées
                await Promise.all(updatePromises);
    
                // Si la mise à jour est réussie, mets à jour l'état et affiche l'alerte
                setUpdate(true);
                resetForm();  // Réinitialise le formulaire
    
                // Affiche l'alerte de succès avant la redirection
                setTimeout(() => {
                    setUpdate(false);
                    navigate('/listArticle'); 
                }, 1000);
    
            } catch (error) {
                console.error("Erreur lors de la mise à jour de l'article : ", error);
                // Vous pouvez ajouter une gestion d'erreur ici, comme afficher un message d'erreur à l'utilisateur
            }
        } else {
            // Si la date n'est pas fournie, vous pouvez afficher une alerte ou un message ici
            alert("La date est requise pour mettre à jour l'article.");
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

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
          const img = event.target.files[0];
          setSelectedImage(URL.createObjectURL(img)); // Preview the selected image
        }
      };

    useEffect(() => {
        if(referenceArticle){
            displayValueArticle(referenceArticle);
        }
    }, [referenceArticle])

    return (
        <div className="form-block">
            <h3 className="title-h3">Nouveau Article</h3>
            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="imageArticle">Charger ou prendre une photo</label>
                    <input type="file" name="imageArticle" id="imageArticle" accept="image/*"capture="environment" onChange={handleImageChange}/>
                </div>
                {selectedImage && (
                    <div className='form-group image-preview'>
                        <span>Aperçu : </span>
                        <img src={selectedImage} alt="Image selectionné" className="image-preview__image" />
                    </div>
                )}
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
                    <button type="button" className='btn btn-primary' onClick={stateForm ? addArticle : updateArticle}>{stateForm ? "Enregistrer" : "Modifier"}</button>
                </div>
            </form>
            <Alert icon="icon-checkmark" type="success" message="Enregistrement article reussi" state={success ? true : false}/>
            <Alert icon="icon-checkmark" type="success" message="Modification article reussi" state={update ? true : false}/>
        </div>
    )
}

