import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Header from '../../components/header/Header'
import { breadcrumbListArticle } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import { SalesType } from '../../models/Sales'
import './listArticle.scss'
import ExportCSV from '../../components/csv/ExportCSV'
export default function ListArticle() {
    const [sales, setSales] = useState(Array<SalesType>);
    const inputFilterRefStateArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterStateArticle, setInputFilterStateArticle] = React.useState('ALL');

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

    useEffect(() => {
        getSalesSold();
        getSalesNotSold();
    }, [])

    const updateForm = (id : string) => {
        console.log(id);
    }

    const deleteArticle = (id: string) => {
        console.log(id);
    }

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
                                                <td>{list.prixAchat}</td>
                                                <td>{list.prixVente}</td>
                                                <td>{list.benefice}</td>
                                                <td>{list.etat ? 'vendu' : 'Non vendu'}</td>
                                                <td><div className="action-box"><button type="button" className='btn btn-icon' onClick={() => updateForm(list.idsales)}> <i className="icon-pencil"></i></button> <button className="btn btn-icon" onClick={() => deleteArticle(list.idsales)}><i className="icon-bin2"></i></button></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}