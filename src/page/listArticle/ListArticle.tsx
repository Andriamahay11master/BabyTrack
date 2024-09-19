import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Header from '../../components/header/Header'
import { breadcrumbListArticle } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import { SalesType } from '../../models/Sales'
import './listArticle.scss'
import ExportCSV from '../../components/csv/ExportCSV'
import ExportExcel from '../../components/excel/ExportExcel'
import { collection, getDocs, query, orderBy, updateDoc, where, deleteDoc } from "firebase/firestore";
import { auth, db } from '../../firebase'
import { formatNumber } from '../../data/function'
import Alert from '../../components/alert/Alert'
import {months} from '../../data/article'
import {yearNow, monthNow} from '../../data/article'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate, useNavigate } from 'react-router-dom';
import Splashscreen from '../splashscreen/Splashscreen'
import Footer from '../../components/footer/Footer'

export default function ListArticle() {

    const navigate = useNavigate();
    const [userUID, setUserUID] = React.useState('');
    const [userMail, setUserMail] = React.useState('');
   
    const [sales, setSales] = useState(Array<SalesType>);
    const inputFilterRefStateArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterStateArticle, setInputFilterStateArticle] = React.useState('ALL');
    const inputFilterRefYearArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterYearArticle, setInputFilterYearArticle] = React.useState(yearNow.toString());
    const inputFilterRefMonthArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterMonthArticle, setInputFilterMonthArticle] = React.useState(monthNow.toString());
    const [successSold, setSuccessSold] = useState(false);
    const [successRemoveArticle, setSuccessRemoveArticle] = useState(false);

    //GetArticlesBYMonth&Year
    const getArticlesByMonthYear = async (month: number, year: number, state: string) => {
        try {
            let startOfMonth = null, endOfMonth = null;
            if (month === 13) {
                // Si month est égal à 13, définir la plage pour toute l'année
                startOfMonth = new Date(year, 0, 1, 0, 0, 0); // 1er janvier de l'année spécifiée
                endOfMonth = new Date(year, 11, 31, 23, 59, 59); // 31 décembre de l'année spécifiée
            } else {
                // Calculer le premier et le dernier jour du mois spécifié
                startOfMonth = new Date(year, month - 1, 1, 0, 0, 0); // Mois 0-indexé
                endOfMonth = new Date(year, month, 0, 23, 59, 59); // Dernier jour du mois
            }
            let q = null;
            if(state === 'Vendu'){
                q = query(
                    collection(db, "article"),
                    where("uidUser", "==", userUID),
                    where("dateA", ">=", startOfMonth),
                    where("dateA", "<=", endOfMonth),
                    where("etat", "==", true),
                    orderBy("dateA", "asc")
                );
            }
            else if(state === 'Non Vendu' ){
                q = query(
                    collection(db, "article"),
                    where("uidUser", "==", userUID),
                    where("dateA", ">=", startOfMonth),
                    where("dateA", "<=", endOfMonth),
                    where("etat", "==", false),
                    orderBy("dateA", "asc")
                );
            }
            else {
                // Créer une requête Firebase pour filtrer uniquement les articles du mois et de l'année spécifiés
                q = query(
                    collection(db, "article"),
                    where("uidUser", "==", userUID),
                    where("dateA", ">=", startOfMonth),
                    where("dateA", "<=", endOfMonth),
                    orderBy("dateA", "asc")
                );
            }
            
            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map(doc => {
                const dateA = new Date(doc.data().dateA.seconds * 1000);
                const dayLA = dateA.toDateString();
                const dateV = new Date(doc.data().dateV.seconds * 1000);
                const dayLV = dateV.toDateString();
    
                return {
                    idsales: doc.data().reference,
                    imageUrl : doc.data().imageUrl,
                    description: doc.data().description,
                    taille: doc.data().taille,
                    prixAchat: doc.data().prixA,
                    prixVente: doc.data().prixV,
                    benefice: doc.data().benefice,
                    dateA: dayLA.toString(),
                    dateB: dayLV.toString(),
                    etat: doc.data().etat,
                };
            });
            setSales(newData);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    };

    useEffect(() => {
        getArticlesByMonthYear(Number(inputFilterMonthArticle),Number(inputFilterYearArticle), inputFilterStateArticle);

        onAuthStateChanged(auth, (user) => {
            if (user) {
              const email = user.email;
              const uid = user.uid
              setUserMail(email ?? '');
              setUserUID(uid ?? '');
            } else {
                <Navigate to="/login"/>
            }
          });
    }, [inputFilterMonthArticle, inputFilterYearArticle, inputFilterStateArticle, userMail, successRemoveArticle]);

    const deleteArticle = (id: string) => {
        try{
            const q = query(collection(db, "article"), where("reference", "==", id));
            getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref);
                })
            })   
            setSuccessRemoveArticle(true);
            getArticlesByMonthYear(Number(inputFilterMonthArticle), Number(inputFilterYearArticle), inputFilterStateArticle);
            setTimeout(() => {
                setSuccessRemoveArticle(false);
            }, 1000);
        }
        catch (error){ 
            console.error("Error adding document: ", error);
        }
    }

    //function article sold
    const soldArticle = (id: string) => {
        try{
            const q = query(collection(db, "article"), where("reference", "==", id));
            getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    updateDoc(doc.ref, {
                        etat: true
                    });
                });
            });
            setSuccessSold(true);
            getArticlesByMonthYear(Number(inputFilterMonthArticle), Number(inputFilterYearArticle), inputFilterStateArticle);
            setTimeout(() => {
                setSuccessSold(false);
            }, 1000);
        }
        catch (error){ 
            console.error("Error adding document: ", error);
        }
    }

    //ON Change select state filter
    const handleFilterStateArticle = () => {
        const selectedStateArticle = inputFilterRefStateArticle.current?.value || '';
        setInputFilterStateArticle(selectedStateArticle);
        //list Sales
        if(inputFilterYearArticle !== yearNow.toString() && inputFilterMonthArticle !== monthNow.toString()){
            getArticlesByMonthYear(Number(inputFilterMonthArticle), Number(inputFilterYearArticle), selectedStateArticle);
        }
        else if(inputFilterYearArticle !== yearNow.toString() && inputFilterMonthArticle === monthNow.toString()){
            getArticlesByMonthYear(monthNow, Number(inputFilterYearArticle), selectedStateArticle);
        }
        else if(inputFilterYearArticle === yearNow.toString() && inputFilterMonthArticle !== monthNow.toString()){
            getArticlesByMonthYear(Number(inputFilterMonthArticle), yearNow, selectedStateArticle);
        }
        else{
            getArticlesByMonthYear(monthNow, yearNow, selectedStateArticle);
        }
    }

    //ON Change select year filter
    const handleFilterYearArticle = () => {
        const selectedStateArticle = inputFilterRefYearArticle.current?.value || '';
        setInputFilterYearArticle(selectedStateArticle);
        //list Sales
        if(selectedStateArticle === yearNow.toString()){
            getArticlesByMonthYear(monthNow, yearNow, inputFilterStateArticle);
        }else{
            getArticlesByMonthYear(parseInt(selectedStateArticle), yearNow, inputFilterStateArticle);
        }
    }

    //ON Change select month filter
    const handleFilterMonthArticle = () => {
        const selectedStateArticle = inputFilterRefMonthArticle.current?.value || '';
        setInputFilterMonthArticle(selectedStateArticle);
        //list Sales
        if(selectedStateArticle === monthNow.toString()){
            getArticlesByMonthYear(monthNow, yearNow, inputFilterStateArticle);
        }else{
            getArticlesByMonthYear(monthNow, parseInt(selectedStateArticle), inputFilterStateArticle);
        }
    }

    const salesExportExcel = sales.map(sale => ({
        ...sale,
        etat: sale.etat ? 'Vendu' : 'Non Vendu'
    }));

    //call Component FormArticle for update one article
    const updateFormArticle = (id: string) => {
        navigate(`/setArticle/${id}`);
    };

    return (
        <>
        {(userMail !== '') ? (
            <>
                <Header linkMenu={headerNav} userMail={userMail}/>    
                <div className='main-page'>
                    <div className="container">
                        <div className="main-page-top">
                            <Breadcrumb items={breadcrumbListArticle}/>
                        </div>
                        <div className="section-list">
                            <div className="table-filter">
                                <ExportCSV data={sales} />
                                <ExportExcel data={salesExportExcel} nameFile='sales' nameSheet='Sales'/>
                                <select name="filter-month" id="filter-month" ref={inputFilterRefMonthArticle} onChange={handleFilterMonthArticle} value={inputFilterMonthArticle}>
                                    {months.map((month:string, index:number) => (<option key={index} value={index + 1}>{month}</option>))}
                                </select> 
                                <select name="filter-year" id="filter-year" ref={inputFilterRefYearArticle} onChange={handleFilterYearArticle} value={inputFilterYearArticle}>
                                    {Array.from(Array(10).keys()).map((index) => <option key={index} value={2024 + index}>{2024 + index}</option>)}
                                </select> 
                                <select name="filter-state" id="filter-state" ref={inputFilterRefStateArticle} onChange={handleFilterStateArticle} value={inputFilterStateArticle}>
                                <option value="Vendu">Vendu</option>
                                <option value="Non Vendu">Non Vendu</option>
                                <option value="ALL">Tous</option>
                                </select> 
                            </div>
                            <div className="list-block list-view">
                                <table className='list-table'>
                                        <thead>
                                            <tr>
                                                <th>Réference</th>
                                                <th>Image</th>
                                                <th>Description</th>
                                                <th>Taille</th>
                                                <th>Prix d'achat</th>
                                                <th>Prix de vente</th>
                                                <th>Bénéfice</th>
                                                <th>Etat</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sales.map((list, index) => (
                                                <tr key={index}>
                                                    <td>{list.idsales}</td>
                                                    <td><img src={list.imageUrl}/></td>
                                                    <td>{list.description}</td>
                                                    <td>{list.taille}</td>
                                                    <td>{list.prixAchat ? formatNumber(list.prixAchat.toString()) + ' MGA' : 0}</td>
                                                    <td>{list.prixVente ? formatNumber(list.prixVente.toString()) + ' MGA' : 0}</td>
                                                    <td>{list.benefice ? formatNumber(list.benefice.toString()) + ' MGA' : 0}</td>
                                                    <td>{list.etat ? 'Vendu' : 'Non vendu'}</td>
                                                    <td><div className="action-box"><button type="button" className='btn btn-icon tooltip' onClick={() => soldArticle(list.idsales)} data-title="Marquer comme vendu"> <i className="icon-checkmark"></i></button> <button type="button" className='btn btn-icon tooltip' onClick={() => updateFormArticle(list.idsales)} data-title="Modifier l'article"> <i className="icon-pencil"></i></button> <button className="btn btn-icon tooltip" onClick={() => deleteArticle(list.idsales)} data-title="Supprimer l'article"><i className="icon-bin2"></i></button></div></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Alert icon="icon-checkmark" type="success" message="Article vendu" state={successSold ? true : false}/>
                    <Alert icon="icon-checkmark" type="danger" message="Article supprimé" state={successRemoveArticle ? true : false}/>
                </div>
                <Footer copyright="Simply Sweet"/>
             </>
        ) : (
            <Splashscreen/>
        )}
        </>
    )
}

ListArticle.requireAuth = true