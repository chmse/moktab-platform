import { useEffect, useState } from 'react';
import { BookOpen, Plus, FileText, Presentation, Settings, MessageCircle, MessageSquare } from 'lucide-react';
import AddWorkModal from '../components/dashboard/AddWorkModal';
import { supabase } from '../lib/supabaseClient';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
            width: '50px',
            height: '50px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: color + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
        }}>
            <Icon size={24} />
        </div>
        <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--color-primary)' }}>{value}</h3>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{label}</span>
        </div>
    </div>
);

const ProfessorDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'management' | 'teaching' | 'discussions' | 'settings'>('management');
    const [profile, setProfile] = useState<any>(null);
    const [worksList, setWorksList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch Profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(profileData);

                // Fetch ALL Works for this professor
                const { data: worksData, error: worksError } = await supabase
                    .from('works')
                    .select('*')
                    .eq('professor_id', user.id)
                    .order('created_at', { ascending: false });

                if (worksError) throw worksError;
                setWorksList(worksData || []);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = {
        books: worksList.filter(w => (w.category === 'Book' || w.type === 'Book')).length,
        articles: worksList.filter(w => (w.category === 'Article' || w.type === 'Article')).length,
        lectures: worksList.filter(w => (w.category === 'Lecture' || w.type === 'Lecture')).length,
        pendingQuestions: 0
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    جاري تحميل لوحة التحكم...
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>لوحة التحكم</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        مرحباً بك {profile?.rank || 'د.'} {profile?.full_name || ''}، إليك ملخص نشاطك العلمي.
                    </p>
                </div>

                <button
                    className="btn-premium"
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} />
                    إضافة عمل جديد
                </button>
            </div>

            {/* Enhanced Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard icon={MessageSquare} label="أسئلة بانتظار الرد" value={stats.pendingQuestions} color="#ef4444" />
                <StatCard icon={BookOpen} label="الكتب والمؤلفات" value={stats.books} color="#1A237E" />
                <StatCard icon={FileText} label="المقالات والأبحاث" value={stats.articles} color="#C5A059" />
                <StatCard icon={Presentation} label="المحاضرات" value={stats.lectures} color="#10b981" />
            </div>

            {/* Dashboard Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--color-border)', marginBottom: '2rem', overflowX: 'auto' }}>
                <button
                    onClick={() => setActiveTab('management')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'management' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'management' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <FileText size={20} />
                    إدارة الأعمال
                </button>
                <button
                    onClick={() => setActiveTab('teaching')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'teaching' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'teaching' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <Presentation size={20} />
                    التدريس
                </button>
                <button
                    onClick={() => setActiveTab('discussions')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'discussions' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'discussions' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <MessageCircle size={20} />
                    النقاشات
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'settings' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'settings' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <Settings size={20} />
                    الإعدادات
                </button>
            </div>

            {/* Tab Content */}
            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white' }}>

                {activeTab === 'management' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>الأعمال المنشورة</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-surface)' }}>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--color-text-secondary)' }}>العنوان</th>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--color-text-secondary)' }}>النوع</th>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--color-text-secondary)' }}>تاريخ النشر</th>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--color-text-secondary)' }}>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {worksList.length > 0 ? worksList.map((work) => (
                                        <tr key={work.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '1rem', fontWeight: '500' }}>{work.title}</td>
                                            <td style={{ padding: '1rem' }}>
                                                {work.category === 'Article' ? 'بحث' : work.category === 'Book' ? 'كتاب' : work.category === 'Lecture' ? 'محاضرة' : 'أخرى'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>{work.publish_date || 'غير محدد'}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' }}>منشور</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                                لا توجد أعمال منشورة بعد.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'teaching' && (
                    <div className="animate-fade-in">
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>المقاييس الدراسية</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>هذا القسم قيد التطوير...</p>
                    </div>
                )}

                {activeTab === 'discussions' && (
                    <div className="animate-fade-in">
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>أحدث النقاشات والأسئلة</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>لا توجد نقاشات جديدة حالياً.</p>
                    </div>
                )}

                {activeTab === 'settings' && <ProfessorSettings />}
            </div>

            <AddWorkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
};

const ProfessorSettings = () => {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [rank, setRank] = useState('');
    const [department, setDepartment] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchCurrentProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (data) {
                    setFullName(data.full_name || '');
                    setRank(data.rank || '');
                    setDepartment(data.department || '');
                    setSpecialty(data.specialty || '');
                    setAvatarUrl(data.avatar_url || '');
                    setBio(data.bio || '');
                    setSkills(Array.isArray(data.skills) ? data.skills.join(', ') : '');
                }
            }
        };
        fetchCurrentProfile();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const skillsArray = skills.split(',').map(i => i.trim()).filter(i => i !== '');

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                rank,
                department,
                specialty,
                avatar_url: avatarUrl,
                bio,
                skills: skillsArray
            })
            .eq('id', user.id);

        if (error) {
            setMessage({ type: 'error', text: 'حدث خطأ أثناء تحديث الملف الشخصي' });
        } else {
            setMessage({ type: 'success', text: 'تم تحديث الهوية العلمية للأستاذ بنجاح' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleUpdateProfile} className="animate-fade-in" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ color: 'var(--color-primary)', fontSize: '1.8rem', fontWeight: '900' }}>الهوية العلمية للأستاذ</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>أكمل بياناتك الأكاديمية لتظهر هويتك العلمية بشكل احترافي للطلاب والباحثين.</p>
            </div>

            {message && (
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>الاسم الكامل</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="الأستاذ الدكتور/..."
                        required
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>الرتبة العلمية</label>
                    <select
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>القسم</label>
                    <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="مثال: قسم الآداب واللغة العربية"
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>التخصص الدقيق</label>
                    <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder="مثال: نقد معاصر، لسانيات تعليمية..."
                        style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                    />
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>رابط الصورة الشخصية (أو رفع ملف)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="أدخل رابط صورتك..."
                        style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                    />
                    <label className="btn-premium" style={{ cursor: 'pointer', whiteSpace: 'nowrap', padding: '0.85rem 1.5rem' }}>
                        رفع صورة
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                    setLoading(true);
                                    const { data: { user } } = await supabase.auth.getUser();
                                    if (!user) return;

                                    const fileExt = file.name.split('.').pop();
                                    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
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
                            }}
                        />
                    </label>
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>السيرة العلمية المختصرة (Bio)</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="اكتب نبذة عن مسيرتك العلمية وإسهاماتك..."
                    style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>المجالات البحثية والمهارات (افصل بينها بفاصلة)</label>
                <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="النقد، البلاغة، المناهج التعليمية..."
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                />
            </div>

            <button type="submit" disabled={loading} className="btn-premium" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', marginTop: '1rem' }}>
                {loading ? 'جاري حفظ التغييرات...' : 'حفظ ونشر التعديلات'}
            </button>
        </form>
    );
};

export default ProfessorDashboard;
