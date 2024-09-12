import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Header from '../../components/header/Header'
import { breadcrumbListArticle } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import { SalesType } from '../../models/Sales'
import './listArticle.scss'
import ExportCSV from '../../components/csv/ExportCSV'
import ExportExcel from '../../components/excel/ExportExcel'
import { collection, getDocs, query, orderBy, updateDoc, where } from "firebase/firestore";
import { db } from '../../firebase'
import { formatNumber } from '../../data/function'
import Alert from '../../components/alert/Alert'
import {months} from '../../data/article'

export default function ListArticle() {
    const [sales, setSales] = useState(Array<SalesType>);
    const inputFilterRefStateArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterStateArticle, setInputFilterStateArticle] = React.useState('ALL');
    const inputFilterRefYearArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterYearArticle, setInputFilterYearArticle] = React.useState('ALL');
    const inputFilterRefMonthArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterMonthArticle, setInputFilterMonthArticle] = React.useState('ALL');
    const [successSold, setSuccessSold] = useState(false);

    //Get Sales sold in database
    const getArticleByState = async (state: string) => {
        try{
            const q = query(collection(db, "article"), where("etat", "==", state === 'Vendu' ? true : false));
            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map(doc => {
                const dateA = new Date(doc.data().dateA.seconds * 1000);
                const dateV = new Date(doc.data().dateV.seconds * 1000);
                return {
                    idsales: doc.data().reference,
                    description: doc.data().description,
                    taille: doc.data().taille,
                    prixAchat: doc.data().prixA,
                    prixVente: doc.data().prixV,
                    benefice: doc.data().benefice,
                    dateA: dateA.toDateString(),
                    dateV: dateV.toDateString(),
                    etat: doc.data().etat
                }
            });
            setSales(newData);
        }catch(error){
            console.log(error);
        }
    }

    //Get Articles
    const getArticles = async () => {
        try {
            const q = query(collection(db, "article"), orderBy("reference", "asc"));
            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map(doc => {
                const dateA = new Date(doc.data().dateA.seconds * 1000);
                const dayLA = dateA.toDateString();
                const dateV = new Date(doc.data().dateV.seconds * 1000);
                const dayLV = dateV.toDateString();
    
                return {
                    idsales: doc.data().reference,
                    description: doc.data().description,
                    taille: doc.data().taille,
                    prixAchat: doc.data().prixA,
                    prixVente: doc.data().prixV,
                    benefice: doc.data().benefice,
                    dateA: dayLA.toString(),
                    dateB: dayLV.toString(),
                    etat: doc.data().etat,
                }
            });
            setSales(newData);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    }

    //GetArticlesBYMonth&Year
    const getArticlesByMonthYear = async (month: number, year: number) => {
        try {
            // Calculer le premier jour du mois et l'année spécifiés
            const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0); // Les mois sont 0-indexés dans JavaScript
            // Calculer le dernier jour du mois
            const endOfMonth = new Date(year, month, 0, 23, 59, 59); // 0 jour du mois suivant revient au dernier jour du mois courant
    
            // Créer une requête Firebase pour filtrer uniquement les articles du mois et de l'année spécifiés
            const q = query(
                collection(db, "article"),
                where("dateA", ">=", startOfMonth),
                where("dateA", "<=", endOfMonth),
                orderBy("dateA", "asc")
            );
    
            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map(doc => {
                const dateA = new Date(doc.data().dateA.seconds * 1000);
                const dayLA = dateA.toDateString();
                const dateV = new Date(doc.data().dateV.seconds * 1000);
                const dayLV = dateV.toDateString();
    
                return {
                    idsales: doc.data().reference,
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
        getArticles();
    }, [])

    const updateForm = (id : string) => {
        console.log(id);
    }

    const deleteArticle = (id: string) => {
        console.log(id);
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
            getArticles();
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
        if(selectedStateArticle === 'ALL'){
            getArticles();
        }else{
            getArticleByState(selectedStateArticle);
        }
    }

    //ON Change select year filter
    const handleFilterYearArticle = () => {
        const selectedStateArticle = inputFilterRefYearArticle.current?.value || '';
        setInputFilterYearArticle(selectedStateArticle);
        //list Sales
        if(selectedStateArticle === 'ALL'){
            getArticles();
        }else{
            getArticleByState(selectedStateArticle);
        }
    }

    //ON Change select month filter
    const handleFilterMonthArticle = () => {
        const selectedStateArticle = inputFilterRefMonthArticle.current?.value || '';
        setInputFilterYearArticle(selectedStateArticle);
        //list Sales
        if(selectedStateArticle === 'ALL'){
            getArticles();
        }else{
            getArticleByState(selectedStateArticle);
        }
    }

    const salesExportExcel = sales.map(sale => ({
        ...sale,
        etat: sale.etat ? 'Vendu' : 'Non Vendu'
    }));

    return (
        <>
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>    
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
                                                <td>{list.description}</td>
                                                <td>{list.taille}</td>
                                                <td>{list.prixAchat ? formatNumber(list.prixAchat.toString()) + 'MGA' : 0}</td>
                                                <td>{list.prixVente ? formatNumber(list.prixVente.toString()) + 'MGA' : 0}</td>
                                                <td>{list.benefice ? formatNumber(list.benefice.toString()) + 'MGA' : 0}</td>
                                                <td>{list.etat ? 'Vendu' : 'Non vendu'}</td>
                                                <td><div className="action-box"><button type="button" className='btn btn-icon tooltip' onClick={() => soldArticle(list.idsales)} data-title="Marquer comme vendu"> <i className="icon-checkmark"></i></button> <button type="button" className='btn btn-icon tooltip' onClick={() => updateForm(list.idsales)} data-title="Modifier l'article"> <i className="icon-pencil"></i></button> <button className="btn btn-icon tooltip" onClick={() => deleteArticle(list.idsales)} data-title="Supprimer l'article"><i className="icon-bin2"></i></button></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Alert icon="icon-checkmark" type="success" message="Article vendu" state={successSold ? true : false}/>
            </div>
        </>
    )
}