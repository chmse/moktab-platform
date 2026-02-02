import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import {
    ArrowRight,
    MessageSquare,
    Users,
    BookOpen,
    User,
    Clock,
    Share2,
    Bookmark
} from 'lucide-react';
import DiscussionSection from '../components/works/DiscussionSection';

const TopicDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [topic, setTopic] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);

        // Fetch Topic
        const { data: topicData, error: topicError } = await supabase
            .from('community_topics')
            .select(`
                *,
                profiles:author_id (full_name)
            `)
            .eq('id', id)
            .single();

        if (topicData && !topicError) {
            // CRITICAL SECURITY: Redirect students from Professors-only topics
            if (profile?.role === 'student' && topicData.category === 'Professors') {
                console.warn('Security: Student blocked from Professors-only topic');
                navigate('/community', { replace: true });
                return;
            }

            setTopic({
                ...topicData,
                authorName: topicData.profiles?.full_name || 'مستخدم مجهول',
                date: new Date(topicData.created_at).toLocaleDateString('ar-EG')
            });

            // Fetch Comments
            const { data: commentsData, error: commentsError } = await supabase
                .from('comments')
                .select(`
                    *,
                    profiles:author_id (full_name, role)
                `)
                .eq('topic_id', id)
                .order('created_at', { ascending: true });

            if (commentsData && !commentsError) {
                setComments(commentsData.map(c => ({
                    ...c,
                    authorName: c.profiles?.full_name || 'مستخدم مجهول',
                    isProfessor: c.profiles?.role === 'professor',
                    date: c.created_at ? (new Date(c.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(c.created_at).toLocaleDateString('ar-EG')) : 'تاريخ غير متوفر'
                })));
            } else {
                setComments([]);
            }
        } else {
            setTopic(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [id]);


    if (loading) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    جاري تحميل تفاصيل الموضوع...
                </div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <h2>الموضوع غير موجود</h2>
                <button onClick={() => navigate('/community')} className="btn-premium" style={{ marginTop: '2rem' }}>
                    العودة للمجتمع العلمي
                </button>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            {/* Breadcrumb */}
            <button
                onClick={() => navigate('/community')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--color-primary)',
                    marginBottom: '2rem',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}
                className="card-hover"
            >
                <ArrowRight size={18} />
                العودة إلى المجتمع العلمي
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '3rem' }}>
                {/* Main Content */}
                <div>
                    {/* Header Card */}
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2.5rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--color-border)',
                        borderRight: `6px solid ${topic.is_elevated ? 'var(--color-accent)' : 'var(--color-primary)'}`,
                        marginBottom: '3rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <span style={{
                                backgroundColor: 'var(--color-surface-alt)',
                                color: 'var(--color-primary)',
                                padding: '0.4rem 1rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                {topic.category === 'General' ? 'نقاش عام' : topic.category === 'Professors' ? 'خاص بالأساتذة' : 'قضية علمية كبرى'}
                            </span>
                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-secondary)' }}>
                                <Share2 size={20} className="card-hover" style={{ cursor: 'pointer' }} />
                                <Bookmark size={20} className="card-hover" style={{ cursor: 'pointer' }} />
                            </div>
                        </div>

                        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.3' }}>
                            {topic.title}
                        </h1>

                        <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>
                            {topic.description}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-surface-alt)' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <User size={24} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{topic?.authorName || 'مستخدم غير معروف'}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{topic?.date || 'تاريخ غير متوفر'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <DiscussionSection topicId={id} sectionOwnerId={topic.author_id} />
                </div>

                {/* Sidebar */}
                <aside>
                    {/* Stats Widget */}
                    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--color-border)' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            إحصائيات النقاش
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageSquare size={16} /> المشاركات
                                </span>
                                <span style={{ fontWeight: 'bold' }}>{comments.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={16} /> المشاركون
                                </span>
                                <span style={{ fontWeight: 'bold' }}>{new Set(comments.map(c => c.author_id)).size || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={16} /> آخر نشاط
                                </span>
                                <span style={{ fontWeight: 'bold' }}>{comments.length > 0 ? 'الآن' : 'لا يوجد'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Related Research Widget - Placeholder for now */}
                    {topic.relatedResearchIds?.length > 0 && (
                        <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={18} /> بحوث ذات صلة
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>سيتم عرض البحوث المرتبطة قريباً.</p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default TopicDetail;
