import { useState, useEffect } from 'react';
import './header.scss';
import { Navigate, NavLink, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
// import { auth } from './firebase';

interface HeaderProps {
    linkMenu: {name: string, href: string}[]
    userMail: string
}

export default function Header({linkMenu, userMail} : HeaderProps) {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const location = useLocation();

    const closeMenu = () => {
        setTimeout(() => {
            setNavbarOpen(false);
        }, 300)
      }

      useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 1200 && navbarOpen) {
                setNavbarOpen(false);
            }
        }
 
        handleResize();
 
        window.addEventListener("resize", handleResize);
 
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [navbarOpen]);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            localStorage.setItem("isLoggedIn", 'false');
            <Navigate to="/login"/>
        })
    };

    return (
        <header className={`sectHeader sectHeader--fixed${navbarOpen ? ' show-menu' : ''}`}>
            <div className="headerIntern"> 
                <div className="container-transverse">
                    <div className="headerIntern-left">
                        <div className="cntLogoMobile">
                                <NavLink to="/dashboard" title='link to dashboard'>
                                    <figure>
                                        <img src="/SimplySweet.jpg" alt="Logo Site" width={200} height={200} title='SimplySweet logo image'/>
                                    </figure>
                                    <span className='cntLogo-text'>SimplySweet</span>
                                </NavLink>
                        </div>
                        <div className={`headerInternContent${navbarOpen ? ' show-menu' : ''}`}>
                            <div className="cntlogo">
                                <NavLink to="/dashboard" title='link to dashboard'>
                                    <figure>
                                        <img src="/SimplySweet.jpg" alt="Logo Site" width={200} height={200} title='SimplySweet logo image'/>
                                    </figure>
                                </NavLink>
                            </div>
                            <p className='usermail-mobile'>{userMail}</p>
                            <div className="boxNavIntern"> 
                                <nav className="menuNav"> 
                                    <div className="cntNavBox"> 
                                        <ul className="cntNav">
                                            {linkMenu.map((link, index) => {
                                                const isActive = location.pathname === link.href || (location.pathname === '/' && index === 0)
                                                
                                                return (
                                                    <li key={link.name}>
                                                        <NavLink
                                                            className={isActive ? 'cntNav-link active' : 'cntNav-link'}
                                                            to={link.href}
                                                            onClick={closeMenu} title='Link menu'>
                                                            {link.name}
                                                        </NavLink>
                                                    </li>
                                                
                                                )
                                            })}
                                        </ul> 
                                    </div> 
                                </nav>  
                            </div>

                            <div className="block-bottom-mobile">
                                <button className="btn btn-icon tooltip" data-title='Se déconnecter' onClick={handleSignOut}>
                                    <i className="icon-log-out"></i>
                                </button>
                            </div>
                        </div> 
                        <div className="btnBox">
                            <button className="btn btn-icon btn-mobile" onClick={()=>setNavbarOpen(!navbarOpen)} aria-label="open navBar">
                                <i className={navbarOpen ? "icon-close" : "icon-burger"}></i>
                            </button>
                        </div>  
                    </div>
                    <div className="headerIntern-right">
                        <div className="profil">
                            {userMail && 
                            <div className='profil-block'>
                                <div className="profil-image">
                                    <img src="/user.png" alt="Avatar" width={25} height={25} title='Avatar image'/>
                                </div>
                                <p>{userMail}</p>
                            </div>}
                            <button className="btn btn-icon tooltip" data-title='Se déconnecter' onClick={handleSignOut}>
                                <i className="icon-log-out"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>   
        </header>
    )
  }
  