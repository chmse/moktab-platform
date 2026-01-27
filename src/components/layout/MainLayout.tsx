import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#0a0a0a', color: 'white', padding: '2rem 0', textAlign: 'center', marginTop: 'auto' }}>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                برمجة وتطوير <span style={{ color: '#c5a059', fontWeight: '800', fontSize: '1.1rem' }}>شمس الدين</span>
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#999' }}>
                © 2024 منصة مكتب الأكاديمية - جميع الحقوق محفوظة
            </p>
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
