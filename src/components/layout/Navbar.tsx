import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, LogOut, LayoutDashboard, Shield, UserCircle, ChevronDown, Menu, X, BookOpen, GraduationCap, Calendar, FlaskConical, Info } from 'lucide-react';

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
                alignItems: 'center',
                height: '100%',
                width: '100%',
                position: 'relative',
                padding: '0 1rem'
            }}>

                {/* LEFT SIDE: User Profile / Login (Absolute Left) */}
                <div style={{
                    position: 'absolute', left: '1rem', zIndex: 1003, display: 'flex', alignItems: 'center', height: '100%'
                }}>
                    <div ref={menuRef} style={{ position: 'relative' }}>
                        {!loading && (
                            user ? (
                                <div>
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                            padding: '0.35rem 0.75rem', borderRadius: '9999px', color: 'white', cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-accent)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                                        }}>
                                            {profile?.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={16} color="white" />}
                                        </div>
                                        <ChevronDown size={14} className="desktop-only" />
                                    </button>

                                    {/* User Dropdown */}
                                    {isMenuOpen && (
                                        <div className="animate-fade-in" style={{
                                            position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '220px',
                                            backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                                            padding: '0.5rem', zIndex: 10001, border: '1px solid var(--color-border)', color: 'var(--color-text-primary)'
                                        }}>
                                            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                                                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.1rem' }}>{profile?.full_name}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{profile?.role === 'professor' ? profile.rank : 'طالب علم'}</p>
                                            </div>
                                            <Link to={`/professors/${user.id}`} onClick={() => setIsMenuOpen(false)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: 'var(--radius-md)' }}>
                                                <UserCircle size={18} color="var(--color-primary)" /> <span>الملف الشخصي</span>
                                            </Link>
                                            <Link to={profile?.role === 'professor' ? "/dashboard" : "/student-dashboard"} onClick={() => setIsMenuOpen(false)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: 'inherit', borderRadius: 'var(--radius-md)' }}>
                                                <LayoutDashboard size={18} color="var(--color-primary)" /> <span>لوحة التحكم</span>
                                            </Link>
                                            {profile?.is_admin && (
                                                <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', color: '#C5A059', fontWeight: 'bold', borderRadius: 'var(--radius-md)' }} className="dropdown-item">
                                                    <Shield size={18} color="#C5A059" /> <span>لوحة الإدارة</span>
                                                </Link>
                                            )}
                                            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                                                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="dropdown-item text-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', width: '100%', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'right', borderRadius: 'var(--radius-md)' }}>
                                                    <LogOut size={18} /> <span>تسجيل الخروج</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" style={{
                                    textDecoration: 'none', backgroundColor: '#c5a059', color: '#1a1a1a', padding: '0.5rem 1rem',
                                    borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'nowrap'
                                }}>تسجيل الدخول</Link>
                            )
                        )}
                    </div>
                </div>

                {/* CENTER: Logo (Absolute Center) */}
                <div style={{
                    position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 1002, textAlign: 'center'
                }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
                        <div className="navbar-logo-text" style={{ fontSize: '1.25rem', fontWeight: '900', color: '#c5a059', lineHeight: '1.1' }}>مَنْصَة مَكْتَب</div>
                        <div className="navbar-logo-sub" style={{ fontSize: '0.8rem', opacity: 0.8, letterSpacing: '1px' }}>الأكاديمية</div>
                    </Link>
                </div>

                {/* RIGHT SIDE: Hamburger (Universal) */}
                <div style={{
                    position: 'absolute', right: '1rem', zIndex: 1003, display: 'flex', alignItems: 'center', height: '100%'
                }}>
                    <button
                        className="mobile-hamburger"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{ color: 'white', padding: '0.25rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

            </div>

            {/* Universal Side Drawer (RTL) */}
            <div className={`drawer-backdrop ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div className="drawer-panel" onClick={e => e.stopPropagation()}>
                    <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        <h3 style={{ color: '#c5a059', margin: 0, fontSize: '1.2rem' }}>القائمة الرئيسية</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Unit A: Production */}
                        <div className="menu-group">
                            <span className="group-title">الإنتاج العلمي</span>
                            <div className="group-links">
                                <Link to="/hub/production" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link"><BookOpen size={18} /> نظرة عامة</Link>
                                <Link to="/works" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link sub-link">الأعمال العلمية</Link>
                                <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link sub-link">المجتمع العلمي</Link>
                            </div>
                        </div>

                        {/* Unit B: Environment */}
                        <div className="menu-group">
                            <span className="group-title">البيئة الأكاديمية</span>
                            <div className="group-links">
                                <Link to="/hub/environment" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link"><GraduationCap size={18} /> نظرة عامة</Link>
                                <Link to="/professors" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link sub-link">الأساتذة</Link>
                                <Link to="/students" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link sub-link">الطلاب</Link>
                            </div>
                        </div>

                        {/* Unit C: R&D */}
                        <div className="menu-group">
                            <span className="group-title">البحث والتطوير</span>
                            <div className="group-links">
                                <Link to="/hub/research" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link"><FlaskConical size={18} /> نظرة عامة</Link>
                            </div>
                        </div>

                        {/* Unit D: Activities */}
                        <div className="menu-group">
                            <span className="group-title">الأنشطة</span>
                            <div className="group-links">
                                <Link to="/hub/activities" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link"><Calendar size={18} /> نظرة عامة</Link>
                            </div>
                        </div>

                        {/* Unit E: About */}
                        <div className="menu-group">
                            <span className="group-title">عن المنصة</span>
                            <div className="group-links">
                                <Link to="/hub/about" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link"><Info size={18} /> نظرة عامة</Link>
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link sub-link">الرئيسية</Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                .nav-link:hover { color: #c5a059; }
                .dropdown-item:hover { background-color: var(--color-surface-alt); }

                /* Drawer Backdrop */
                .drawer-backdrop {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background-color: rgba(0,0,0,0.5); /* Dim Background */
                    z-index: 9998;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                    backdrop-filter: blur(4px);
                }
                .drawer-backdrop.open {
                    opacity: 1;
                    pointer-events: all;
                }

                /* Drawer Panel (RTL Slide) */
                .drawer-panel {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 320px;
                    max-width: 80vw;
                    background: rgba(0, 0, 51, 0.95);
                    backdrop-filter: blur(16px);
                    box-shadow: -4px 0 20px rgba(0,0,0,0.5);
                    z-index: 9999;
                    transform: translateX(100%); /* Hidden (Right) */
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    padding: 2rem;
                    overflow-y: auto;
                    border-left: 1px solid rgba(197, 160, 89, 0.2);
                }
                .drawer-backdrop.open .drawer-panel {
                    transform: translateX(0); /* Visible */
                }

                /* Menu Styles */
                .group-title {
                    display: block;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: rgba(255,255,255,0.5);
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                }
                .drawer-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: white;
                    text-decoration: none;
                    padding: 0.5rem 0;
                    font-size: 1.1rem;
                    font-weight: 500;
                    transition: color 0.2s;
                }
                .drawer-link:hover { color: #c5a059; }
                .sub-link {
                    padding-right: 2rem; /* Indent */
                    font-size: 0.95rem;
                    opacity: 0.8;
                }

                /* Ensure Hamburger is ALWAYS Visible */
                .mobile-hamburger { display: flex !important; }

            `}</style>
        </nav>
    );
};

export default Navbar;
