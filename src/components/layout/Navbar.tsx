import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, LogOut, LayoutDashboard, Shield, UserCircle, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const { user, profile, loading, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    return (
        <nav style={{
            background: '#020617 !important',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            backgroundColor: '#020617 !important',
            color: 'white',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: 'var(--shadow-sm)',
            borderBottom: '1px solid rgba(197, 160, 89, 0.3)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* User Menu Area (Left - RTL) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} ref={menuRef}>
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
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-full)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="hover-bright"
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
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
                                            <UserIcon size={18} color="white" />
                                        )}
                                    </div>
                                    <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{profile?.full_name}</span>
                                    <ChevronDown size={16} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
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
                            <Link to="/login" className="btn-premium" style={{ textDecoration: 'none' }}>
                                تسجيل الدخول
                            </Link>
                        )
                    )}
                </div>

                {/* Primary Nav Links */}
                <ul style={{ display: 'flex', gap: '2rem', margin: 0, alignItems: 'center', listStyle: 'none' }}>
                    <li><Link to="/" className="nav-link">الرئيسية</Link></li>
                    <li><Link to="/professors" className="nav-link">الأساتذة</Link></li>
                    <li><Link to="/students" className="nav-link">الطلاب</Link></li>
                    <li><Link to="/community" className="nav-link">المجتمع العلمي</Link></li>
                    <li><Link to="/works" className="nav-link">الأعمال العلمية</Link></li>
                    <li><Link to="/about" className="nav-link">عن المنصة</Link></li>
                </ul>

                {/* Logo (Right - RTL) */}
                <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-accent)' }}>مَنْصَة</span>
                        <span>مَكْتَب</span>
                        <span style={{ fontSize: '1.2rem', opacity: 0.9 }}>الأكاديمية</span>
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
            `}</style>
        </nav>
    );
};

export default Navbar;
