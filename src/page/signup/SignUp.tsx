import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from "../../firebase";
import { Link } from 'react-router-dom';
import { Poppin } from '../../components/poppin/Poppin';

export default function Signup() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [sucess, setSucess] = useState(false);

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password);
    setSucess(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};

const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
};
  
  return (
    <>
    <div className="form-block-gabarit">
             <div className="form-block-content form-signup">
                <div className="logo-block">
                    <span className="logo"></span>
                </div>
                <h1 className="title-h1">Créer un compte</h1>
                <p className="form-desc">Renseignez votre adresse email et votre mot de passe</p>
                <div className="form-content">
                        <div className="form-group">
                            <label htmlFor="email"><i className="icon-mail"></i>Votre email</label>
                            <input type="email" id="email" placeholder="Saississez votre email" value={email} onChange={ (e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><i className="icon-lock"></i>Votre mot de passe</label>
                            <div className="input-pass">
                                <input type={showPassword ? "text" : "password"} id="password" placeholder="Saisissez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                <i className={`icon ${showPassword ? "icon-eye-off" : "icon-eye"}`} onClick={togglePasswordVisibility}></i>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmation-password"><i className="icon-lock"></i>Confirmez votre mot de passe</label>
                            <div className="input-pass">
                                <input type={showPasswordConfirmation ? "text" : "password"} id="confirmation-password" placeholder="Saisissez a nouveau votre mot de passe" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)}/>
                                <i className={`icon ${showPasswordConfirmation ? "icon-eye-off" : "icon-eye"}`} onClick={togglePasswordConfirmationVisibility}></i>
                            </div>
                        </div>  
                        <div className="form-group form-submit">
                            <button className={(email && password && passwordAgain) &&  (password === passwordAgain) ? "btn btn-primary" : "btn btn-primary disabled"} onClick={signup} disabled={(!email || !password || !passwordAgain) || (password !== passwordAgain)}>Créer un compte</button>
                        </div>
                    <p className="text-signup">Avez vous deja un compte ? <Link className="btn btn-link" to="/login">Se connecter</Link></p>
                </div>
            </div>
            {sucess && <Poppin title="Compte créé" message="Votre compte a été bien enregistré" linkBtn="/login" valBtn="Se connecter"/>}
        </div>
    </>
  )
}