import { useEffect, useState } from 'react';
import { BookOpen, Plus, FileText, Presentation, MessageCircle, MessageSquare } from 'lucide-react';
import AddWorkModal from '../components/dashboard/AddWorkModal';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

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
    const { profile } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'management' | 'teaching' | 'discussions'>('management');
    const [worksList, setWorksList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
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
                        whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer'
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
                        whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer'
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
                        whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <MessageCircle size={20} />
                    النقاشات
                </button>
            </div>

            {/* Tab Content */}
            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white', minHeight: '400px' }}>

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
            </div>

            <AddWorkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default ProfessorDashboard;
