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
            height: '70px',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            borderBottom: '1px solid rgba(197, 160, 89, 0.3)',
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '100%',
                width: '100%'
            }}>

                {/* LEFT SIDE: Controls (Hamburger + User/Login) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Hamburger Menu (Visible ONLY on Mobile) */}
                    <button
                        className="mobile-only"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ color: 'white', padding: '0.5rem', display: 'flex', alignItems: 'center' }}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* User Profile / Login (Visible on Mobile & Desktop) */}
                    <div ref={menuRef} style={{ position: 'relative' }}>
                        {!loading && (
                            user ? (
                                <div>
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'rgba(255,255,255,0.1)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '9999px',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}
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
                                        <ChevronDown size={14} className="desktop-only" />
                                    </button>

                                    {/* Desktop User Dropdown */}
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
                                            zIndex: 10001,
                                            border: '1px solid var(--color-border)',
                                            color: 'var(--color-text-primary)'
                                        }}>
                                            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                                                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.1rem' }}>{profile?.full_name}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                                    {profile?.role === 'professor' ? profile.rank : 'طالب علم'}
                                                </p>
                                            </div>

                                            <Link to={`/professors/${user.id}`} onClick={() => setIsMenuOpen(false)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: 'var(--radius-md)' }}>
                                                <UserCircle size={18} color="var(--color-primary)" />
                                                <span>الملف الشخصي</span>
                                            </Link>

                                            <Link to={profile?.role === 'professor' ? "/dashboard" : "/student-dashboard"} onClick={() => setIsMenuOpen(false)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: 'var(--radius-md)' }}>
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
                                                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="dropdown-item text-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'right', borderRadius: 'var(--radius-md)' }}>
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
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'nowrap'
                                }}>
                                    تسجيل الدخول
                                </Link>
                            )
                        )}
                    </div>
                </div>

                {/* CENTER: Desktop Navigation (HIDDEN ON MOBILE) */}
                <ul className="nav-links desktop-only" style={{ display: 'flex', gap: '1.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
                    <li><Link to="/" className="nav-link">الرئيسية</Link></li>
                    <li><Link to="/professors" className="nav-link">الأساتذة</Link></li>
                    <li><Link to="/students" className="nav-link">الطلاب</Link></li>
                    <li><Link to="/community" className="nav-link">المجتمع العلمي</Link></li>
                    <li><Link to="/works" className="nav-link">الأعمال العلمية</Link></li>
                    <li><Link to="/about" className="nav-link">عن المنصة</Link></li>
                </ul>

                {/* RIGHT SIDE: Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'white' }}>
                    <div style={{ textAlign: 'right', lineHeight: '1.1' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#c5a059' }}>مَنْصَة مَكْتَب</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8, letterSpacing: '1px' }}>الأكاديمية</div>
                    </div>
                </Link>

            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'center' }}>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">الرئيسية</Link>
                    <Link to="/professors" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">الأساتذة</Link>
                    <Link to="/students" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">الطلاب</Link>
                    <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">المجتمع العلمي</Link>
                    <Link to="/works" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">الأعمال العلمية</Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">عن المنصة</Link>
                </div>
            </div>

            <style>{`
                .desktop-only { display: flex; }
                .mobile-only { display: none; }
                
                .nav-link {
                    color: rgba(255,255,255,0.8);
                    font-weight: 500;
                    transition: color 0.2s;
                }
                .nav-link:hover { color: #c5a059; }

                .dropdown-item:hover { background-color: var(--color-surface-alt); }
                
                /* Mobile Styles */
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { display: flex !important; }
                    
                    .mobile-menu-overlay {
                        position: fixed;
                        top: 70px; /* Below Navbar */
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0,0,51,0.98);
                        backdrop-filter: blur(10px);
                        z-index: 9998;
                        transform: translateY(-100%);
                        transition: transform 0.3s ease-in-out;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        pointer-events: none;
                    }
                    
                    .mobile-menu-overlay.open {
                        transform: translateY(0);
                         opacity: 1;
                        pointer-events: all;
                    }
                    
                    .mobile-link {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: white;
                        text-decoration: none;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
