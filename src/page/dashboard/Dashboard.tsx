import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Header from '../../components/header/Header'
import Kpi from '../../components/kpi/Kpi'
import Sales from '../../components/sales/Sales'
import { breadcrumbDashboard } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import { kpi } from '../../data/kpi'
import { SalesType } from '../../models/Sales'
import {formatNumber} from '../../data/function';
import {yearNow, monthNow} from '../../data/article'
import './dashboard.scss'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import { months } from '../../data/article'
import { onAuthStateChanged } from 'firebase/auth'
import Splashscreen from '../splashscreen/Splashscreen'
import { Navigate } from 'react-router-dom'
export default function Dashboard() {
    const [salesSold, setSalesSold] = useState(Array<SalesType>);
    const [salesNotSold, setSalesNotSold] = useState(Array<SalesType>);
    const [userUID, setUserUID] = React.useState('');
    const [userMail, setUserMail] = React.useState('');
    
    const inputFilterRefYearArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterYearArticle, setInputFilterYearArticle] = React.useState(yearNow.toString());
    const inputFilterRefMonthArticle = React.createRef<HTMLSelectElement>();
    const [inputFilterMonthArticle, setInputFilterMonthArticle] = React.useState(monthNow.toString());

    //Get Sales sold in database
    const getArticleSold = async (month: number, year: number) => {
        try{
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
            const q = query(collection(db, "article"), where("uidUser", "==", userUID), where("dateA", ">=", startOfMonth),
            where("dateA", "<=", endOfMonth), where("etat", "==", true), orderBy("reference", "asc"));

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
            setSalesSold(newData);
        }catch(error){
            console.log(error);
        }
    }

    //Get Sales not sold in database
    const getArticleNotSold = async (month: number, year: number) => {
        try{
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
            const q = query(collection(db, "article"), where("uidUser", "==", userUID), where("dateA", ">=", startOfMonth),
            where("dateA", "<=", endOfMonth), where("etat", "==", false));
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
            setSalesNotSold(newData);
        }catch(error){
            console.log(error);
        }
    }

    //GetTotalArticle sold
    const salesSoldTotal = salesSold.reduce((a, b) => {
        return a + b.prixVente
    }, 0);

    //GetTotalBenefice on article sold
    const salesBenefice = salesSold.reduce((a, b) => {
        return a + (b?.benefice || 0)
    }, 0)
    
    //Update KPI depending on list database
    // Création d'un objet de correspondance pour les valeurs des KPI
    const kpiValues: { [key: string]: number } = {
        'Articles vendus': salesSold.length,
        'Articles non vendus': salesNotSold.length,
        'Bénéfices': salesBenefice,
        'Ventes Totales': salesSoldTotal
    };

    // Mise à jour des KPI en utilisant la correspondance basée sur le titre
    // Mise à jour des KPI avec formatage conditionnel
    const updateKpi = kpi.map((item) => {
        let value: string | number = kpiValues[item.title] ?? item.value;

        // Appliquer formatNumber uniquement pour 'Bénéfices' et 'Ventes Totales'
        if (item.title === 'Bénéfices' || item.title === 'Ventes Totales') {
            value = formatNumber(value.toString());
        }

        return {
            ...item,
            value
        };
    });

    //ON Change select year filter
    const handleFilterYearArticle = () => {
        const selectedStateArticle = inputFilterRefYearArticle.current?.value || '';
        setInputFilterYearArticle(selectedStateArticle);
        //list Sales
        if(selectedStateArticle === yearNow.toString()){
            getArticleSold(Number(inputFilterMonthArticle), Number(inputFilterYearArticle));
            getArticleNotSold(Number(inputFilterMonthArticle), Number(inputFilterYearArticle));
        }else{
            getArticleSold(Number(inputFilterMonthArticle), parseInt(selectedStateArticle));
            getArticleNotSold(Number(inputFilterMonthArticle), parseInt(selectedStateArticle));
        }
    }

    //ON Change select month filter
    const handleFilterMonthArticle = () => {
        const selectedStateArticle = inputFilterRefMonthArticle.current?.value || '';
        setInputFilterMonthArticle(selectedStateArticle);
        //list Sales
        if(selectedStateArticle === monthNow.toString()){
            getArticleSold(Number(inputFilterMonthArticle), Number(inputFilterYearArticle));
            getArticleNotSold(Number(inputFilterMonthArticle), Number(inputFilterYearArticle));
        }else{
            getArticleSold(parseInt(selectedStateArticle), Number(inputFilterYearArticle));
            getArticleNotSold(parseInt(selectedStateArticle), Number(inputFilterYearArticle));
        }
    }


    useEffect(() => {
        getArticleSold(Number(inputFilterMonthArticle), Number(inputFilterYearArticle));
        getArticleNotSold(Number(inputFilterMonthArticle), Number(inputFilterYearArticle));
        
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
    }, [inputFilterMonthArticle, inputFilterYearArticle, userMail]);
    return (
        <>
        {(userMail !== '') ? (
            <>
            <Header linkMenu={headerNav} userMail={userMail}/>
            <div className='main-page'>
                <div className="container">
                    <div className="main-page-top">
                        <Breadcrumb items={breadcrumbDashboard}/>
                        <div className="filter-main">
                            <span>Choisissez le mois et l'année :</span>
                            <select name="filter-month" id="filter-month" ref={inputFilterRefMonthArticle} onChange={handleFilterMonthArticle} value={inputFilterMonthArticle}>
                                {months.map((month:string, index:number) => (<option key={index} value={index + 1}>{month}</option>))}
                            </select> 
                            <select name="filter-year" id="filter-year" ref={inputFilterRefYearArticle} onChange={handleFilterYearArticle} value={inputFilterYearArticle}>
                                {Array.from(Array(10).keys()).map((index) => <option key={index} value={2024 + index}>{2024 + index}</option>)}
                            </select> 
                        </div>
                    </div>
                    <div className="main-section listKpi">
                            {updateKpi.map((item, index) => <Kpi key={index} icon={item.icon} title={item.title} value={item.value} currency={item.currency} />)}
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
        ) : (
            <Splashscreen/>
        )}
        </>
    )
}

Dashboard.requireAuth = true