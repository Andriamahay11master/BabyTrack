import React, { useEffect } from 'react'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import FormArticle from '../../components/formArticle/FormArticle'
import Header from '../../components/header/Header'
import { breadcrumbAddArticle } from '../../data/breadcrumb'
import { headerNav } from '../../data/header'
import './addArticle.scss'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate } from 'react-router-dom'
import Splashscreen from '../splashscreen/Splashscreen'

interface AddArticleProps {
    state: boolean
    referenceArticle?: string
}
export default function AddArticle({state, referenceArticle} : AddArticleProps) {
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
                                {referenceArticle ? <FormArticle stateForm={state} uidUser={userUID} referenceArticle={referenceArticle}/> : <FormArticle stateForm={state} uidUser={userUID}/>}
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