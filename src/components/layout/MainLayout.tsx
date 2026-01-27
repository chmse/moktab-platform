import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '3rem 0', marginTop: 'auto' }}>
            <div className="container" style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} مَنْصَة مَكْتَب الأكاديمية. جميع الحقوق محفوظة.</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                    برمجة وتطوير <span style={{ color: 'var(--color-accent)' }}>شمس الدين</span>
                </p>
            </div>
        </footer>
    );
};

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
