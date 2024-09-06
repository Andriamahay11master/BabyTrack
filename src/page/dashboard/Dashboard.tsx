import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Header from '../../components/header/Header'
import Kpi from '../../components/kpi/Kpi'
import { breadcrumbDashboard } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import { kpi } from '../../data/kpi'

import './dashboard.scss'
import React, { useState } from 'react'
export default function Dashboard() {
    const [salesSold, setSalesSold] = useState(Array<SalesType>);
    const [salesNotSold, setSalesNotSold] = useState(Array<SalesType>);
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
                            <h2 className="title-h2 detailKpi-title">Aricles non vendus</h2>
                            <Sales dataList={salesNotSold}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}