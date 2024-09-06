import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Header from '../../components/header/Header'
import Kpi from '../../components/kpi/Kpi'
import Sales from '../../components/sales/Sales'
import { breadcrumbDashboard } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import { kpi } from '../../data/kpi'
import { SalesType } from '../../models/Sales'

import './dashboard.scss'
import { useEffect, useState } from 'react'
export default function Dashboard() {
    const [salesSold, setSalesSold] = useState(Array<SalesType>);
    const [salesNotSold, setSalesNotSold] = useState(Array<SalesType>);

    //Get Sales sold in database
    const getSalesSold = () => {
        setSalesSold([
            {
                idsales: 'NE 001',
                description: 'T-shirt 1',
                taille: 'L',
                prixAchat: 2000,
                prixVente:4000,
                etat: true
            },
            {
                idsales: 'NE 002',
                description: 'T-shirt 2',
                taille: 'L',
                prixAchat: 2000,
                prixVente:4000,
                etat: true
            }
        ])
    }

    //Get Sales not sold in database
    const getSalesNotSold = () => {
        setSalesNotSold([
            {
                idsales: 'NE 003',
                description: 'T-shirt 3',
                taille: 'L',
                prixAchat: 2000,
                prixVente:4000,
                etat: false
            },
            {
                idsales: 'NE 004',
                description: 'T-shirt 4',
                taille: 'L',
                prixAchat: 2000,
                prixVente:4000,
                etat: false
            },
            {
                idsales: 'NE 004',
                description: 'T-shirt 4',
                taille: 'L',
                prixAchat: 2000,
                prixVente:4000,
                etat: false
            },
            {
                idsales: 'NE 005',
                description: 'T-shirt 5',
                taille: 'L',
                prixAchat: 2000,
                prixVente:4000,
                etat: false
            },
            {
                idsales: 'NE 006',
                description: 'T-shirt 6',
                taille: 'L',
                prixAchat: 2000,
                prixVente:4000,
                etat: false
            },
            {
                idsales: 'NE 007',
                description: 'T-shirt 7',
                taille: 'L',
                prixAchat: 2000,
                prixVente:4000,
                etat: false
            }
        ])
    }

    useEffect(() => {
        getSalesSold();
        getSalesNotSold();
    }, [])
    return (
        <>
            <Header linkMenu={headerNav} userMail="hirimanana@yahoo.fr"/>
            <div className='main-page'>
                <div className="container">
                    <div className="main-page-top">
                        <Breadcrumb items={breadcrumbDashboard}/>
                    </div>
                    <div className="main-section listKpi">
                            {kpi.map((item, index) => <Kpi key={index} icon={item.icon} title={item.title} value={item.value} currency={item.currency} />)}
                    </div>
                    <div className='main-section detailKpi'>
                        <div className="detailKpi-item">
                            <h2 className="title-h2 detailKpi-title">Articles vendus</h2>
                            <Sales dataList={salesSold}/>
                        </div>
                        <div className="detailKpi-item">
                            <h2 className="title-h2 detailKpi-title">Articles non vendus</h2>
                            <Sales dataList={salesNotSold}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}