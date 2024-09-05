import { useState, useEffect } from 'react';
import './header.scss';
import { useLocation } from 'react-router-dom';
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

    // const handleSignOut = () => {
    //     signOut(auth).then(() => {
    //         localStorage.setItem("isLoggedIn", 'false');
    //         router.push('/login');
    //     })
    // };

    return (
        <header className={`sectHeader sectHeader--fixed${navbarOpen ? ' show-menu' : ''}`}>
            <div className="headerIntern"> 
                <div className="container-transverse">
                    <div className="headerIntern-left">
                        <div className="cntLogoMobile">
                                <a href="/" title='link to home'>
                                    <figure>
                                        <img src="/BabyTrack.jpg" alt="Logo Site" width={200} height={200} title='BabyTrack logo image'/>
                                    </figure>
                                    <span className='cntLogo-text'>BabyTrack</span>
                                </a>
                        </div>
                        <div className={`headerInternContent${navbarOpen ? ' show-menu' : ''}`}>
                            <div className="cntlogo">
                                <a href="/" title='link to home'>
                                    <figure>
                                        <img src="/BabyTrack.jpg" alt="Logo Site" width={200} height={200} title='BabyTrack logo image'/>
                                    </figure>
                                </a>
                            </div>
                            <p className='usermail-mobile'>{userMail}</p>
                            <div className="boxNavIntern"> 
                                <nav className="menuNav"> 
                                    <div className="cntNavBox"> 
                                        <ul className="cntNav">
                                            {linkMenu.map((link) => {
                                                const isActive = location.pathname === link.href
                                                
                                                return (
                                                    <li key={link.name}>
                                                        <a
                                                            className={isActive ? 'cntNav-link active' : 'cntNav-link'}
                                                            href={link.href}
                                                            onClick={closeMenu} title='Link menu'>
                                                            {link.name}
                                                        </a>
                                                    </li>
                                                
                                                )
                                            })}
                                        </ul> 
                                    </div> 
                                </nav>  
                            </div>

                            <div className="block-bottom-mobile">
                                <button className="btn btn-link" title='Bouton to login'>
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
                                    <img src="/images/user.png" alt="Avatar" width={25} height={25} title='Avatar image'/>
                                </div>
                                <p>{userMail}</p>
                            </div>}
                            <button className="btn btn-link" title='Bouton to login'>
                                <i className="icon-log-out"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>   
        </header>
    )
  }
  