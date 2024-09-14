import React from "react";
import { Link, Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../../firebase";
import Splashscreen from "../splashscreen/Splashscreen";


interface SigninProps {
    user: User | null
}
export default function Login({user} : SigninProps) {
    
    const [showPassword, setShowPassword] = React.useState(false);
    const [emailu, setEmailu] = React.useState('');
    const [passwordu, setPasswordu] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [errorExist, setErrorExist] = React.useState(false);
    const [errorForm, setErrorForm] = React.useState('');
    const [codeError, setCodeError] = React.useState('');

    const connectAccount = (e : React.FormEvent) => {
        e.preventDefault();
        if(!emailu && !passwordu) return;
        signInWithEmailAndPassword(auth, emailu, passwordu)
        .then((userCredential) => {
            const user = userCredential.user;
            // Set user data in localStorage
            localStorage.setItem('userBabyTrack', JSON.stringify(user));
            // Optionally, you can set a flag to indicate the user is logged in
            localStorage.setItem('isLoggedIn', 'true');
            setSuccess(true);
            console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            // const errorMessage = error.message;
            console.log(errorCode, error.message)
            setErrorExist(true)
            setCodeError(errorCode)
            manageMessageError();
        });
    }

    const manageMessageError = () => {
        switch(codeError) {
            case 'auth/invalid-email':
                setErrorForm('Invalid email');
                break;
            case 'auth/missing-password':
                setErrorForm('Missing password');
                break;
            case 'auth/invalid-credential':
                setErrorForm('Invalid credential');
                break;
            default:
                setErrorForm('Invalid email or password');
                break;
        }
    }

    const onChangeEmail = (e : React.ChangeEvent<HTMLInputElement>) => {
        setEmailu(e.target.value);
        if(errorExist) setErrorExist(false);
    }

    const onChangePassword = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPasswordu(e.target.value);
        if(errorExist) setErrorExist(false);
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    if(user && localStorage.getItem('isLoggedIn') === 'true') {
        console.log("********sign in",localStorage.getItem('isLoggedIn'));
        return <Navigate to="/" />
    }

    return (
        <div className="form-block-gabarit">
            <div className="form-block-content">
                <h1 className="title-h1">Bienvenue</h1>
                <div className="form-content">
                    <h2 className="title-h2">Login</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email"><i className="icon-mail"></i>Votre email :</label>
                            <input type="email" id="email" placeholder="Saisissez votre email" onChange={onChangeEmail}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><i className="icon-lock"></i>Votre mot de passe :</label>
                            <div className="form-group-password">
                                <input type={showPassword ? "text" : "password"} id="password" placeholder="Saisissez votre mot de passe" onChange={onChangePassword}/>
                                <i className={showPassword ? "icon-eye-off" : "icon-eye"} onClick={toggleShowPassword}></i>
                            </div>
                            {(errorExist && errorForm) && <p className="error-form">{errorForm}</p>}
                        </div>
                        <div className="form-group form-forgot">
                            <Link className="btn btn-link" to="/forgotPassword">Mot de passe oublié</Link>
                        </div>
                        <div className="form-group form-submit">
                            <button className="btn btn-primary" onClick={connectAccount}>Connexion</button>
                        </div>
                    </form>
                    <p>Vous n'avez pas de compte ? <Link className="btn btn-link" to="/signup">Créer un compte</Link></p>
                </div>
            </div>
            {success && <Splashscreen />}
        </div>
    );
}