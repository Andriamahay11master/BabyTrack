import { useState } from 'react';
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from 'react-router-dom';
import { Poppin } from '../../components/poppin/Poppin';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const resetEmail = () => {
    sendPasswordResetEmail(auth, email);
    setSuccess(true);
  };

  return (
    <>
        <div className="form-block-gabarit">
             <div className="form-block-content">
                <h1 className="title-h1">Modification mot de passe</h1>
                  <div className="form-content">
                    <div className="form-group">
                        <label htmlFor="email"><i className="icon-mail"></i>Email</label>
                        <input type="email" id="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="form-group form-submit">
                        <button className={email ? "btn btn-primary" : "btn btn-primary disabled"} onClick={resetEmail} disabled={!email}>Envoyer</button>
                    </div>
                  </div>
                  <Link className="btn btn-link" to="/login">Se connecter à nouveau</Link>
            </div>
            {success && <Poppin title="Email envoyé" message="Un email vous a été envoyé pour modifier votre mot de passe" linkBtn="/login" valBtn="Se connecter"/>}
        </div>
    </>
  )
}