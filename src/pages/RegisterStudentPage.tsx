import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const RegisterStudentPage = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [level, setLevel] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto-redirect if already logged in
    useEffect(() => {
        if (user && profile) {
            console.log('RegisterStudent: User already logged in, redirecting...');
            if (profile.role === 'professor') {
                navigate('/dashboard', { replace: true });
            } else if (profile.role === 'student') {
                navigate('/student-dashboard', { replace: true });
            }
        }
    }, [user, profile, navigate]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            console.log('RegisterStudent: Attempting registration...');
            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                console.log('RegisterStudent: Auth user created with ID:', authData.user.id);

                // 2. Insert/Update Profile Record with all data
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            role: 'student',
                            full_name: fullName,
                            level: level,
                        },
                    ]);

                if (profileError) {
                    console.error('RegisterStudent: Profile database error:', profileError);
                    alert(`فشل إنشاء الملف الشخصي: ${profileError.message}`);
                    throw profileError;
                }

                console.log('RegisterStudent: Profile created, performing explicit login...');
                // 3. Explicitly sign in to activate the session
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (loginError) {
                    console.error('RegisterStudent: Post-registration login failed:', loginError);
                    alert('تم إنشاء الحساب ولكن فشل تسجيل الدخول التلقائي. يرجى تسجيل الدخول يدوياً.');
                    navigate('/login');
                } else {
                    console.log('RegisterStudent: Registration and login successful, navigating...');
                    navigate('/student-dashboard');
                }
            }
        } catch (err: any) {
            console.error('RegisterStudent: Process failed:', err);
            if (err.message.includes('User already registered')) {
                setError('هذا البريد الإلكتروني مسجل بالفعل');
            } else if (err.message.includes('Password should be at least 6 characters')) {
                setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
            } else {
                setError('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }} className="animate-fade-in">
            <div style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>تسجيل طالب جديد</h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>ابدأ رحلتك العلمية معنا</p>
                </div>

                {error && (
                    <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={handleRegister}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>الاسم الكامل</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            placeholder="اسم الطالب..."
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            placeholder="email@example.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>المستوى الأكاديمي</label>
                        <select
                            required
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        >
                            <option value="">اختر المستوى...</option>
                            <option value="licence">ليسانس (بكالوريوس)</option>
                            <option value="master">ماستر</option>
                            <option value="phd">دكتوراه</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>كلمة المرور</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium"
                        style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    لديك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>سجل الدخول</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudentPage;
