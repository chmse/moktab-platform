import { useEffect, useState } from 'react';
import { User, Lock, Mail, Camera, Save, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
    const { profile, user: authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Profile State
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Security State
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setBio(profile.bio || '');
            setSpecialty(profile.specialty || '');
            setAvatarUrl(profile.avatar_url || '');
        }
        if (authUser) {
            setEmail(authUser.email || '');
        }
    }, [profile, authUser]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                bio,
                specialty,
                avatar_url: avatarUrl
            })
            .eq('id', authUser?.id);

        if (error) {
            setMessage({ type: 'error', text: 'حدث خطأ أثناء تحديث الملف الشخصي' });
        } else {
            setMessage({ type: 'success', text: 'تم تحديث البيانات الشخصية بنجاح' });
        }
        setLoading(false);
    };

    const handleUpdateSecurity = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' });
            setLoading(false);
            return;
        }

        const updateData: any = {};
        if (email !== authUser?.email) updateData.email = email;
        if (newPassword) updateData.password = newPassword;

        if (Object.keys(updateData).length === 0) {
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser(updateData);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'تم تحديث بيانات الحساب بنجاح' });
            setNewPassword('');
            setConfirmPassword('');
        }
        setLoading(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${authUser?.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
            setMessage({ type: 'success', text: 'تم رفع الصورة بنجاح!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'فشل الرفع: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '6rem 1rem', maxWidth: '1000px' }}>
            <div style={{ marginBottom: '3rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', fontWeight: '900' }}>إعدادات الحساب</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>إدارة هويتك الأكاديمية وإعدادات الأمان الخاصة بك.</p>
            </div>

            {message && (
                <div style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    {message.type === 'success' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Profile Information Section */}
                <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                        <User size={24} color="var(--color-accent)" />
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>البيانات الشخصية</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                margin: '0 auto 1rem',
                                border: '4px solid #c5a059',
                                overflow: 'hidden',
                                backgroundColor: 'var(--color-surface-alt)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={48} color="var(--color-text-secondary)" />}
                            </div>
                            <label className="btn-premium" style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                                <Camera size={16} /> تغيير الصورة
                                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                            </label>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>الاسم الكامل</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                            />
                        </div>

                        {profile?.role === 'professor' ? (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>الرتبة العلمية</label>
                                <select
                                    value={profile?.rank || ''}
                                    onChange={async (e) => {
                                        await supabase.from('profiles').update({ rank: e.target.value }).eq('id', authUser?.id);
                                        window.location.reload(); // Refresh to update context
                                    }}
                                    style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'white' }}
                                >
                                    <option value="">اختر الرتبة...</option>
                                    <option value="أستاذ التعليم العالي">أستاذ التعليم العالي</option>
                                    <option value="أستاذ محاضر أ">أستاذ محاضر أ</option>
                                    <option value="أستاذ محاضر ب">أستاذ محاضر ب</option>
                                    <option value="أستاذ مساعد أ">أستاذ مساعد أ</option>
                                    <option value="أستاذ مساعد ب">أستاذ مساعد ب</option>
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>المستوى الدراسي</label>
                                <select
                                    value={profile?.level || ''}
                                    onChange={async (e) => {
                                        await supabase.from('profiles').update({ level: e.target.value }).eq('id', authUser?.id);
                                        window.location.reload();
                                    }}
                                    style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'white' }}
                                >
                                    <option value="">اختر المستوى...</option>
                                    <option value="licence">ليسانس</option>
                                    <option value="master">ماستر</option>
                                    <option value="phd">دكتوراه</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>التخصص الدقيق</label>
                            <input
                                type="text"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                placeholder="مثال: نقد معاصر، لسانيات.."
                                style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>السيرة العلمية</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                style={{ width: '100%', minHeight: '120px', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-premium" style={{ width: '100%', padding: '1rem' }}>
                            <Save size={18} /> حفظ التعديلات الشخصية
                        </button>
                    </form>
                </div>

                {/* Account Security Section */}
                <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                        <Lock size={24} color="var(--color-accent)" />
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>أمان الحساب</h2>
                    </div>

                    <form onSubmit={handleUpdateSecurity} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>البريد الإلكتروني</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '0.85rem 3rem 0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>كلمة مرور جديدة</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="اتركها فارغة إذا لم ترد التغيير"
                                style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700' }}>تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-premium" style={{ width: '100%', padding: '1rem' }}>
                            <ShieldCheck size={18} /> تحديث بيانات الأمان
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;
