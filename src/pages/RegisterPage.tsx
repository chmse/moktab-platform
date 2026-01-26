import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>انضم إلى مجتمع مكتب</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>اختر نوع الحساب للمتابعة</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px' }}>
                {/* Professor Card */}
                <Link to="/register/professor" className="card-hover" style={{
                    backgroundColor: 'white',
                    padding: '3rem 2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(26, 35, 126, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary)'
                    }}>
                        <GraduationCap size={40} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>حساب أستاذ</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>للأكاديميين والباحثين لنشر الأعمال وإدارة المحتوى العلمي.</p>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                        سجل الآن <ArrowRight size={18} />
                    </div>
                </Link>

                {/* Student Card */}
                <Link to="/register/student" className="card-hover" style={{
                    backgroundColor: 'white',
                    padding: '3rem 2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(197, 160, 89, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-accent)'
                    }}>
                        <BookOpen size={40} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>حساب طالب</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>للطلاب الباحثين عن المعرفة والمصادر الأكاديمية الموثوقة.</p>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                        سجل الآن <ArrowRight size={18} />
                    </div>
                </Link>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    لديك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'underline' }}>سجل الدخول</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
