import { useEffect, useState } from 'react';
import { BookOpen, Users, HelpCircle, CheckCircle, ExternalLink, Bookmark, Clock, Feather, Send, Trash2, Target } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
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
    const [activeTab, setActiveTab] = useState<'library' | 'questions' | 'creations'>('library');
    const [savedWorks, setSavedWorks] = useState<any[]>([]);
    const [myQuestions, setMyQuestions] = useState<any[]>([]);
    const [myCreations, setMyCreations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Writing Lab State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<'Story' | 'Poem' | 'Essay' | 'ResearchPaper'>('Story');
    const [specialty, setSpecialty] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

            // Fetch My Creations
            const { data: creationsData } = await supabase
                .from('student_creations')
                .select('*')
                .eq('student_id', user.id)
                .order('created_at', { ascending: false });

            if (creationsData) setMyCreations(creationsData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('student_creations')
                .insert([{
                    title: title.trim(),
                    content: content.trim(),
                    category,
                    specialty: specialty.trim(),
                    student_id: profile?.id,
                    status: 'published'
                }]);

            if (error) throw error;

            setTitle('');
            setContent('');
            setSpecialty('');
            alert('تم نشر عملك بنجاح! نثمن عطاءك العلمي والأدبي');
            fetchData();
        } catch (error: any) {
            alert('خطأ في النشر: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCreation = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا العمل؟')) return;

        const { error } = await supabase.from('student_creations').delete().eq('id', id);
        if (!error) {
            setMyCreations(prev => prev.filter(c => c.id !== id));
        }
    };

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
                <button
                    onClick={() => setActiveTab('creations')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'creations' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'creations' ? '3px solid var(--color-accent)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <Feather size={20} />
                    مختبر الإبداع
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

                {/* Creations Tab (Writing Lab) */}
                {activeTab === 'creations' && (
                    <div className="animate-fade-in">
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            {/* Editor Section */}
                            <div>
                                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-family-serif)' }}>
                                    <Feather size={28} className="text-accent" /> مختبر الإبداع الأدبي
                                </h2>
                                <form onSubmit={handlePublish} className="glass-panel bg-parchment" style={{ padding: '2.5rem', border: '2px solid #e8dec7', borderRadius: '24px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.1 }}>
                                        <Feather size={80} />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>عنوان المخطوطة</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="أدخل عنواناً ملهماً لعملك القادم..."
                                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #dcd3bc', outline: 'none', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.5)' }}
                                            required
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>جنس العمل</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value as any)}
                                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #dcd3bc', outline: 'none', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.5)' }}
                                            >
                                                <option value="Story">قصة قصيرة</option>
                                                <option value="Poem">قصيدة شعرية</option>
                                                <option value="Essay">خاطرة أدبية</option>
                                                <option value="ResearchPaper">مقال بحثي / دراسة</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>التخصص العلمي / الموضوع</label>
                                            <input
                                                type="text"
                                                value={specialty}
                                                onChange={(e) => setSpecialty(e.target.value)}
                                                placeholder="مثال: الأدب العباسي، اللسانيات..."
                                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #dcd3bc', outline: 'none', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.5)' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>متن النص</label>
                                        <div className="bg-parchment" style={{ minHeight: '450px', border: '1px solid #dcd3bc', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                            <ReactQuill
                                                theme="snow"
                                                value={content}
                                                onChange={setContent}
                                                style={{ height: '400px' }}
                                                placeholder="ابدأ في تدوين وحي قلمك هنا..."
                                                modules={{
                                                    toolbar: [
                                                        [{ 'header': [1, 2, 3, false] }],
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                        [{ 'align': [] }],
                                                        ['clean']
                                                    ],
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || !title || !content}
                                        className="btn-premium"
                                        style={{ width: '100%', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.1rem', borderRadius: '15px' }}
                                    >
                                        <Send size={24} /> {submitting ? 'جاري تخليد العمل...' : category === 'ResearchPaper' ? 'نشر الدراسة في الرواق العلمي' : 'نشر العمل في الرواق الأدبي'}
                                    </button>
                                </form>
                            </div>

                            <div>
                                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-family-serif)' }}>أعمالي المنشورة</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                    {myCreations.length > 0 ? myCreations.map(creation => (
                                        <div key={creation.id} style={{
                                            padding: '1.5rem',
                                            backgroundColor: 'white',
                                            borderRadius: '20px',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.02)',
                                            border: '1px solid var(--color-border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                                                        {creation.category === 'Poem' ? 'قصيدة' : creation.category === 'Story' ? 'قصة' : creation.category === 'Essay' ? 'خاطرة' : 'مقال بحثي'}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{new Date(creation.created_at).toLocaleDateString('ar-EG')}</span>
                                                </div>
                                                <h3 style={{ fontWeight: '900', fontSize: '1.3rem', color: 'var(--color-primary)', fontFamily: 'serif', marginTop: '0.5rem' }}>{creation.title}</h3>
                                                {creation.specialty && (
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                                        <Target size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} /> التخصص: {creation.specialty}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                                <Link to={`/creations/${creation.id}`} style={{ flex: 1, padding: '0.6rem', color: 'var(--color-accent)', backgroundColor: 'rgba(197,160,89,0.1)', borderRadius: '10px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                    <BookOpen size={18} /> عرض العمل
                                                </Link>
                                                <button onClick={() => handleDeleteCreation(creation.id)} style={{ padding: '0.6rem', color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: '#fffcf9', borderRadius: '24px', border: '2px dashed #fce8cc' }}>
                                            <Feather size={40} color="#c5a059" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                            <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>بانتظار قطرات حبرك الأولى...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
