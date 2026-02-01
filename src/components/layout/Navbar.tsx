import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, LogOut, LayoutDashboard, Shield, UserCircle, ChevronDown, Menu, X, BookOpen, GraduationCap, Calendar, FlaskConical, Info, Cpu } from 'lucide-react';

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
                                            width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                            border: '2px solid #c5a059' // GOLD BORDER
                                        }}>
                                            {profile?.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={24} color="#c5a059" />}
                                        </div>
                                        <ChevronDown size={18} color="#c5a059" className="desktop-only" />
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
                                    textDecoration: 'none', backgroundColor: 'transparent', border: '2px solid #c5a059', color: '#c5a059', padding: '0.4rem 1.25rem',
                                    borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem'
                                }}>
                                    <UserIcon size={20} />
                                    <span>تسجيل الدخول</span>
                                </Link>
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
                        style={{ color: '#c5a059', padding: '0.25rem', display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                        {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

            </div>

            {/* Universal Side Drawer (RTL) */}
            <div className={`drawer-backdrop ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div className="drawer-panel" onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link">
                            <LayoutDashboard size={22} color="#c5a059" />
                            <span>الرئيسية</span>
                        </Link>
                        <Link to="/hub/production" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link">
                            <BookOpen size={22} color="#c5a059" />
                            <span>الإنتاج العلمي</span>
                        </Link>
                        <Link to="/hub/environment" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link">
                            <GraduationCap size={22} color="#c5a059" />
                            <span>البيئة الأكاديمية</span>
                        </Link>
                        <Link to="/hub/research" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link">
                            <FlaskConical size={22} color="#c5a059" />
                            <span>البحث والتطوير</span>
                        </Link>
                        <Link to="/hub/ai" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link">
                            <Cpu size={22} color="#c5a059" />
                            <span>الذكاء الاصطناعي</span>
                        </Link>
                        <Link to="/hub/activities" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link">
                            <Calendar size={22} color="#c5a059" />
                            <span>الأنشطة والفعاليات</span>
                        </Link>
                        <Link to="/hub/about" onClick={() => setIsMobileMenuOpen(false)} className="drawer-link">
                            <Info size={22} color="#c5a059" />
                            <span>عن المنصة</span>
                        </Link>
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
                    background: rgba(2, 6, 23, 0.85); /* #020617 with opacity */
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    box-shadow: -10px 0 40px rgba(0,0,0,0.4);
                    z-index: 9999;
                    transform: translateX(100%); /* Hidden (Right) */
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    padding: 2.5rem 2rem;
                    overflow-y: auto;
                    border-left: 1px solid rgba(197, 160, 89, 0.2);
                }
                .drawer-backdrop.open .drawer-panel {
                    transform: translateX(0); /* Visible */
                }

                .drawer-link {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: rgba(255,255,255,0.9);
                    text-decoration: none;
                    padding: 0.75rem 0;
                    font-size: 1.15rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .drawer-link:hover { 
                    color: #c5a059;
                    transform: translateX(-5px);
                }

                /* Ensure Hamburger is ALWAYS Visible */
                .mobile-hamburger { display: flex !important; }

            `}</style>
        </nav>
    );
};

export default Navbar;
