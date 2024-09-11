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

export default function ListArticle() {
    const [sales, setSales] = useState(Array<SalesType>);
    const inputFilterRefStateArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterStateArticle, setInputFilterStateArticle] = React.useState('ALL');
    const [successSold, setSuccessSold] = useState(false);

    const handleFilterStateArticle = () => {
        const selectedStateArticle = inputFilterRefStateArticle.current?.value || '';
        setInputFilterStateArticle(selectedStateArticle);
        //list Sales
    }

    
    //Get Sales sold in database
    const getSalesSold = () => {
        setSales([
            {
                idsales: 'NE 001',
                description: 'T-shirt 1',
                taille: 'L',
                prixAchat: 2000,
                prixVente: 4000,
                benefice: 2000,
                etat: true
            },
            {
                idsales: 'NE 002',
                description: 'T-shirt 2',
                taille: 'L',
                prixAchat: 2000,
                prixVente: 4000,
                benefice: 2000,
                etat: true
            }
        ])
    }

    //Get Sales not sold in database
    const getSalesNotSold = () => {
        setSales([
            {
                idsales: 'NE 003',
                description: 'T-shirt 3',
                taille: 'L',
                prixAchat: 2000,
                prixVente: 4000,
                benefice: 2000,
                etat: false
            },
            {
                idsales: 'NE 004',
                description: 'T-shirt 4',
                taille: 'L',
                prixAchat: 2000,
                prixVente: 4000,
                benefice: 2000,
                etat: false
            },
            {
                idsales: 'NE 004',
                description: 'T-shirt 4',
                taille: 'L',
                prixAchat: 2000,
                prixVente: 4000,
                benefice: 2000,
                etat: false
            },
            {
                idsales: 'NE 005',
                description: 'T-shirt 5',
                taille: 'L',
                prixAchat: 2000,
                prixVente: 4000,
                benefice: 2000,
                etat: false
            },
            {
                idsales: 'NE 006',
                description: 'T-shirt 6',
                taille: 'L',
                prixAchat: 2000,
                prixVente: 4000,
                benefice: 2000,
                etat: false
            },
            {
                idsales: 'NE 007',
                description: 'T-shirt 7',
                taille: 'L',
                prixAchat: 2000,
                prixVente: 4000,
                benefice: 2000,
                etat: false
            }
        ])
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

    useEffect(() => {
        getSalesSold();
        getSalesNotSold();
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
                                                <td><div className="action-box"><button type="button" className='btn btn-icon' onClick={() => soldArticle(list.idsales)}> <i className="icon-checkmark"></i></button> <button type="button" className='btn btn-icon' onClick={() => updateForm(list.idsales)}> <i className="icon-pencil"></i></button> <button className="btn btn-icon" onClick={() => deleteArticle(list.idsales)}><i className="icon-bin2"></i></button></div></td>
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