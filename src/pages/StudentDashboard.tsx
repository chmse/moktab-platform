import { useEffect, useState } from 'react';
import { BookOpen, Users, HelpCircle, CheckCircle, ExternalLink, Bookmark, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const StudentDashboard = () => {
    const { profile } = useAuth();
    const [activeTab, setActiveTab] = useState<'library' | 'questions'>('library');
    const [savedWorks, setSavedWorks] = useState<any[]>([]);
    const [myQuestions, setMyQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Fetch Saved Works
            const { data: savedData, error: savedError } = await supabase
                .from('saved_works')
                .select(`
                    *,
                    works (*)
                `)
                .eq('user_id', user.id);

            if (savedData && !savedError) {
                setSavedWorks(savedData.map(s => ({
                    ...s.works,
                    publishDate: s.works.publish_date || s.works.publishDate
                })));
            }

            // Fetch Questions (Comments)
            const { data: commData, error: commError } = await supabase
                .from('comments')
                .select(`
                    *,
                    community_topics (title)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (commData && !commError) {
                setMyQuestions(commData.map(c => ({
                    id: c.id,
                    topicId: c.topic_id,
                    workTitle: c.community_topics?.title || 'موضوع عام',
                    question: c.content,
                    date: new Date(c.created_at).toLocaleDateString('ar-EG'),
                    isAnswered: false
                })));
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    جاري تحميل لوحة البيانات...
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>مرحباً، {profile?.full_name || 'طالب العلم'}</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>واصل رحلتك المعرفية، إليك ملخص نشاطك.</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard icon={Users} label="الأساتذة المتابعون" value="-" color="#1A237E" />
                <StatCard icon={Bookmark} label="المكتبة الشخصية" value={savedWorks.length} color="#C5A059" />
                <StatCard icon={HelpCircle} label="أسئلتي والنقاشات" value={myQuestions.length} color="#10b981" />
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--color-border)', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('library')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'library' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'library' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <BookOpen size={20} />
                    مكتبتي
                </button>
                <button
                    onClick={() => setActiveTab('questions')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'questions' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'questions' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <HelpCircle size={20} />
                    أسئلتي
                </button>
            </div>

            {/* Tab Content */}
            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white', minHeight: '400px' }}>

                {/* Library Tab */}
                {activeTab === 'library' && (
                    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {savedWorks.length > 0 ? savedWorks.map(work => (
                            <div key={work.id} className="card-hover" style={{
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{ padding: '1.5rem', flex: 1 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: 'var(--color-surface-alt)',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        marginBottom: '0.5rem',
                                        color: 'var(--color-text-secondary)'
                                    }}>
                                        {work.type === 'Article' ? 'بحث' : 'كتاب'}
                                    </span>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                                        <Link to={`/works/${work.id}`} style={{ color: 'var(--color-primary)' }}>{work.title}</Link>
                                    </h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{work.abstract}</p>
                                </div>
                                <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface)' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{work.publishDate}</span>
                                    <Link to={`/works/${work.id}`} style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'none' }}>قراءة</Link>
                                </div>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                                <Bookmark size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>لم تقم بحفظ أي أعمال علمية بعد.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Questions Tab */}
                {activeTab === 'questions' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {myQuestions.length > 0 ? myQuestions.map(q => (
                            <div key={q.id} style={{
                                padding: '1.5rem',
                                border: q.isAnswered ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                backgroundColor: q.isAnswered ? 'rgba(197, 160, 89, 0.05)' : 'white'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                        في: <strong style={{ color: 'var(--color-primary)' }}>{q.workTitle}</strong>
                                    </span>
                                    {q.isAnswered ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                            <CheckCircle size={16} /> تمت الإجابة
                                        </span>
                                    ) : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            <Clock size={16} /> بانتظار الرد
                                        </span>
                                    )}
                                </div>

                                <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{q.question}</p>

                                <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                                    <Link to={`/community/topic/${q.topicId}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                                        عرض النقاش كاملاً <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                                <HelpCircle size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>لا توجد أسئلة أو نقاشات مسجلة.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
