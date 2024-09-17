import React, { useEffect } from 'react'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import FormArticle from '../../components/formArticle/FormArticle'
import Header from '../../components/header/Header'
import { breadcrumbAddArticle } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import './addArticle.scss'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate, useParams } from 'react-router-dom'
import Splashscreen from '../splashscreen/Splashscreen'

interface AddArticleProps {
    state: boolean
}
export default function AddArticle({state} : AddArticleProps) {
    const { id } = useParams<{ id: string }>(); // Récupère l'ID de l'URL
    const [userUID, setUserUID] = React.useState('');
    const [userMail, setUserMail] = React.useState('');

    useEffect(() => {
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
    })
    return (
        <>
        {(userMail !== '') ? (
            <>
                <Header linkMenu={headerNav} userMail={userMail}/>
                <div className='main-page'>
                    <div className="container">
                        <div className="main-page-top">
                            <Breadcrumb items={breadcrumbAddArticle}/>
                        </div>
                        <div className="main-section page-form">
                            <div className="section-form">
                                {id ? <FormArticle stateForm={state} uidUser={userUID} referenceArticle={id}/> : <FormArticle stateForm={state} uidUser={userUID}/>}
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

AddArticle.requireAuth = true