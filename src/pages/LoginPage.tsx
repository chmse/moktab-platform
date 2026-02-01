import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto-redirect if already logged in
    useEffect(() => {
        if (user && profile) {
            console.log('LoginPage: User already logged in, redirecting...');
            if (profile.role === 'professor') {
                navigate('/dashboard', { replace: true });
            } else if (profile.role === 'student') {
                navigate('/student-dashboard', { replace: true });
            }
        }
    }, [user, profile, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            console.log('LoginPage: Attempting login...');
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // Fetch profile to get role and completeness
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('role, specialty, avatar_url')
                    .eq('id', authData.user.id)
                    .single();

                if (profileError) {
                    console.error('LoginPage: Profile fetch error:', profileError);
                    throw profileError;
                }

                console.log('LoginPage: Login successful, checking profile completeness...');
                if (profileData?.role === 'professor') {
                    navigate('/dashboard');
                } else if (profileData?.role === 'student') {
                    // Redirect to settings if incomplete
                    if (!profileData.specialty || !profileData.avatar_url) {
                        navigate('/student-dashboard?tab=settings');
                    } else {
                        navigate('/student-dashboard');
                    }
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            console.error('LoginPage: Login process failed:', err);
            setLoading(false); // Only stop loading if we DON'T navigate
            if (err.message.includes('Invalid login credentials')) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            } else {
                setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }} className="animate-fade-in">
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-lg)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-primary)' }}>تسجيل الدخول</h2>

                {error && (
                    <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleLogin}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>كلمة المرور</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium"
                        style={{ marginTop: '1rem', width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'جاري الدخول...' : 'دخول'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        ليس لديك حساب؟ <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>سجل الآن</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
