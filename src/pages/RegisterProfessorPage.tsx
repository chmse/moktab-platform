import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const RegisterProfessorPage = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto-redirect if already logged in
    useEffect(() => {
        if (user && profile) {
            console.log('RegisterProfessor: User already logged in, redirecting...');
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

        if (password !== confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        setLoading(true);

        try {
            console.log('RegisterProfessor: Attempting registration...');
            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                console.log('RegisterProfessor: Auth user created, inserting profile...');
                // 2. Insert/Update Profile Record with all data
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            role: 'professor',
                            full_name: fullName,
                            rank: title,
                            department: department,
                        },
                    ]);

                if (profileError) throw profileError;

                console.log('RegisterProfessor: Registration successful, navigating...');
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('RegisterProfessor: Process failed:', err);
            setLoading(false); // Only stop loading if we DON'T navigate
            // Professional Arabic error messages
            if (err.message.includes('User already registered')) {
                setError('هذا البريد الإلكتروني مسجل بالفعل');
            } else if (err.message.includes('Password should be at least 6 characters')) {
                setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
            } else {
                setError('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }} className="animate-fade-in">
            <div style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--color-primary)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>تسجيل أستاذ جديد</h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>انضم إلى نخبة الأكاديميين في المعهد</p>
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
                            placeholder="د. محمد..."
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>البريد الإلكتروني الجامعي</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            placeholder="yourname@institute.edu"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>الدرجة العلمية</label>
                            <select
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            >
                                <option value="">اختر الدرجة...</option>
                                <option value="أستاذ">أستاذ</option>
                                <option value="أستاذ مشارك">أستاذ مشارك</option>
                                <option value="أستاذ مساعد">أستاذ مساعد</option>
                                <option value="محاضر">محاضر</option>
                                <option value="معيد">معيد</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>القسم</label>
                            <input
                                type="text"
                                required
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                placeholder="مثال: الفقه"
                            />
                        </div>
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

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>تأكيد كلمة المرور</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

export default RegisterProfessorPage;
