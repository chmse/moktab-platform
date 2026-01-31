import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, LogOut, LayoutDashboard, Shield, UserCircle, ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, profile, loading, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <nav style={{
            backgroundColor: '#000033',
            color: 'white',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '0.75rem 0',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: 'var(--shadow-sm)',
            borderBottom: '1px solid rgba(197, 160, 89, 0.3)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Mobile Menu Toggle (Left on Desktop, Right on Mobile due to RTL?) No, Left on RTL layout means right visually usually. 
                    Let's stick to flex order. 
                    Structure: [User Menu/Toggle] [Links] [Logo]
                */}

                {/* Mobile Toggle Button */}
                <button
                    className="mobile-only"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ color: 'white', padding: '0.5rem' }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Desktop: User Menu (Left) | Mobile: Always visible on top-left if login button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {/* User Menu Area (Always visible on mobile bar for Login) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} ref={menuRef} className="navbar-user-area">
                    {!loading && (
                        user ? (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        padding: '0.4rem 0.75rem',
                                        borderRadius: 'var(--radius-full)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="hover-bright"
                                >
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--color-accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <UserIcon size={16} color="white" />
                                        )}
                                    </div>
                                    <span className="desktop-only" style={{ fontWeight: '500', fontSize: '0.85rem' }}>{profile?.full_name}</span>
                                    <ChevronDown size={14} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </button>

                                {/* Dropdown Menu */}
                                {isMenuOpen && (
                                    <div className="animate-fade-in" style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 10px)',
                                        left: 0,
                                        width: '220px',
                                        backgroundColor: 'white',
                                        borderRadius: 'var(--radius-lg)',
                                        boxShadow: 'var(--shadow-lg)',
                                        padding: '0.5rem',
                                        zIndex: 1001,
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                                            <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.1rem' }}>{profile?.full_name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                {profile?.role === 'professor' ? profile.rank : 'طالب علم'}
                                            </p>
                                        </div>

                                        <Link to={`/professors/${user.id}`} onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: 'var(--radius-md)' }} className="dropdown-item">
                                            <UserCircle size={18} color="var(--color-primary)" />
                                            <span>الملف الشخصي</span>
                                        </Link>

                                        <Link
                                            to={profile?.role === 'professor' ? "/dashboard" : "/student-dashboard"}
                                            onClick={() => setIsMenuOpen(false)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: 'var(--radius-md)' }}
                                            className="dropdown-item"
                                        >
                                            <LayoutDashboard size={18} color="var(--color-primary)" />
                                            <span>لوحة التحكم</span>
                                        </Link>

                                        {profile?.is_admin && (
                                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: '#C5A059', fontWeight: 'bold', borderRadius: 'var(--radius-md)' }} className="dropdown-item">
                                                <Shield size={18} color="#C5A059" />
                                                <span>لوحة الإدارة</span>
                                            </Link>
                                        )}

                                        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                                            <button
                                                onClick={() => { signOut(); setIsMenuOpen(false); }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'right', borderRadius: 'var(--radius-md)' }}
                                                className="dropdown-item text-danger"
                                            >
                                                <LogOut size={18} />
                                                <span>تسجيل الخروج</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" style={{
                                textDecoration: 'none',
                                backgroundColor: '#c5a059',
                                color: '#1a1a1a',
                                padding: '0.4rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease'
                            }} className="hover-bright">
                                تسجيل الدخول
                            </Link>
                        )
                    )}
                </div>

                {/* Desktop-only Nav Links */}
                <ul className="nav-links desktop-only" style={{ display: 'flex', gap: '1.5rem', margin: 0, alignItems: 'center', listStyle: 'none' }}>
                    <li><Link to="/" className="nav-link">الرئيسية</Link></li>
                    <li><Link to="/professors" className="nav-link">الأساتذة</Link></li>
                    <li><Link to="/students" className="nav-link">الطلاب</Link></li>
                    <li><Link to="/community" className="nav-link">المجتمع العلمي</Link></li>
                    <li><Link to="/works" className="nav-link">الأعمال العلمية</Link></li>
                    <li><Link to="/about" className="nav-link">عن المنصة</Link></li>
                </ul>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`nav-content-mobile ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <ul className="mobile-nav-links">
                    <li><Link to="/" className="nav-link">الرئيسية</Link></li>
                    <li><Link to="/professors" className="nav-link">الأساتذة</Link></li>
                    <li><Link to="/students" className="nav-link">الطلاب</Link></li>
                    <li><Link to="/community" className="nav-link">المجتمع العلمي</Link></li>
                    <li><Link to="/works" className="nav-link">الأعمال العلمية</Link></li>
                    <li><Link to="/about" className="nav-link">عن المنصة</Link></li>
                </ul>

                {/* Logo (Right - RTL) */}
                <div className="navbar-logo" style={{ fontWeight: '800', letterSpacing: '0.5px', zIndex: 1002 }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--color-accent)' }}>مَنْصَة</span>
                        <span>مَكْتَب</span>
                        <span className="logo-academy" style={{ opacity: 0.9 }}>الأكاديمية</span>
                    </Link>
                </div>
            </div>

            <style>{`
                .dropdown-item:hover {
                    background-color: var(--color-surface-alt);
                }
                .dropdown-item.text-danger:hover {
                    background-color: #fef2f2;
                }
                .hover-bright:hover {
                    filter: brightness(1.1);
                }
                
                .navbar-logo {
                    font-size: 1.5rem;
                }
                .logo-academy {
                    font-size: 1.2rem;
                }
                
                /* Mobile Menu Styles */
                @media (max-width: 768px) {
                    .navbar-logo {
                        font-size: 1.1rem;
                    }
                    .logo-academy {
                        font-size: 0.9rem;
                    }
                    
                    .nav-content-mobile {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: #000033;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 2rem;
                        transform: translateY(-100%);
                        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        z-index: 999;
                    }
                    
                    .nav-content-mobile.mobile-open {
                        transform: translateY(0);
                    }
                    
                    .mobile-nav-links {
                        flex-direction: column;
                        gap: 2rem;
                        text-align: center;
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        display: flex;
                    }
                    
                    .mobile-nav-links .nav-link {
                        font-size: 1.5rem;
                        font-weight: 700;
                    }

                    .navbar-user-area {
                        gap: 0.5rem !important;
                    }
                }
                
                @media (min-width: 769px) {
                    .mobile-only {
                        display: none !important;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
