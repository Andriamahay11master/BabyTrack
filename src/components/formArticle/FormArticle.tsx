import './formArticle.scss';
import {taille} from '../../data/article';
import { db, storage } from '../../firebase';
import { collection, addDoc, Timestamp, where, getDocs, query, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import Alert from '../alert/Alert';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import CapturePhoto from '../capture/CapturePhoto';
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
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(null);
    const [openCamera, setOpenCamera] = useState(false);

    // État pour le chargement
    const [isLoading, setIsLoading] = useState(false);

    const addArticle = async () => {
        if(!date && !selectedImage) return;

        setIsLoading(true);

        try{
            // Référence vers Firebase Storage
            const storageRef = ref(storage, `images/${reference}_${Date.now()}`); // Nom unique pour chaque image

            // Upload de l'image
            const response = await fetch(selectedImage!); // Récupère l'image en tant que blob
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);

            // Obtenir l'URL de téléchargement de l'image
            const imageUrl = await getDownloadURL(storageRef);

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
                uidUser: uidUser,
                imageUrl : imageUrl
            })
            setSuccess(true);
            resetForm();
            await setTimeout(() => {
                setSuccess(false);
            }, 1000);
        }
        catch(error){
            console.log(error);
        }
        finally {
            setIsLoading(false); // Arrête le chargement une fois terminé
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
                    
                    // Récupérer l'ancienne image et l'enregistrer
                    const imageUrl = doc.data().imageUrl;
                    setSelectedImage(imageUrl);
                    setPreviousImageUrl(imageUrl);
                })
            })
        }
        catch(error){
            console.error("Error fetching documents: ", error);
        }
    }

    const updateArticle = async () => {
        if(!date) return;
        
        setIsLoading(true);
        
        try {
            let imageUrl = previousImageUrl;
            // Si une nouvelle image est sélectionnée, on l'upload dans Firebase Storage
            if (selectedImage && selectedImage !== previousImageUrl) {
                const storageRef = ref(storage, `images/${reference}_${Date.now()}`);
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                await uploadBytes(storageRef, blob);

                imageUrl = await getDownloadURL(storageRef);
            }
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
                    etat: false,
                    imageUrl : imageUrl
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
        } finally {
            setIsLoading(false); // Arrêt le chargement une fois terminé
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
        setSelectedImage(null);

        // Réinitialise l'input de fichier en vidant sa valeur
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

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

      const takePhoto = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOpenCamera(true)
      }

    useEffect(() => {
        if(referenceArticle){
            displayValueArticle(referenceArticle);
        }
    }, [referenceArticle])

    return (
        <div className="form-block">
            <h3 className="title-h3">Nouveau Article</h3>
            <form action="" className={isLoading ? 'form-content loading' : 'form-content'}>
                <div className="form-group form-file">
                    <label htmlFor="imageArticle">Charger ou prendre une photo</label>
                    <input type="file" ref={fileInputRef} name="imageArticle" id="imageArticle" accept="image/*"capture="environment" onChange={handleImageChange}/>
                    <button className='btn btn-primary' onClick={takePhoto}>Prendre une photo</button>
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
                    <button type="button" className="btn btn-primary" onClick={stateForm ? addArticle : updateArticle}>{stateForm ? "Enregistrer" : "Modifier"}</button>
                </div>
            </form>
            <Alert icon="icon-checkmark" type="success" message="Enregistrement article reussi" state={success ? true : false}/>
            <Alert icon="icon-checkmark" type="success" message="Modification article reussi" state={update ? true : false}/>
            {openCamera && <CapturePhoto/>}
        </div>
    )
}

