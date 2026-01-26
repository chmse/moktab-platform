import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '2rem 0', marginTop: 'auto' }}>
            <div className="container" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p>&copy; {new Date().getFullYear()} منصة مكتب الأكاديمية. جميع الحقوق محفوظة.</p>
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
