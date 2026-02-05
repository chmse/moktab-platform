import { useEffect, useState } from 'react';
import { BookOpen, Users, HelpCircle, CheckCircle, ExternalLink, Bookmark, Clock, Feather, Send, Trash2, Target } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import SuccessToast from '../components/ui/SuccessToast';

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
    const [abstract, setAbstract] = useState('');
    const [references, setReferences] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

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

            // Fetch My Creations with reviews
            const { data: creationsData } = await supabase
                .from('student_creations')
                .select('*, reviews:student_research_reviews(*)')
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
            // Check category for status
            let status = 'published';
            if (category === 'ResearchPaper') status = 'pending';

            const creationData = {
                title: title.trim(),
                content: content.trim(),
                category,
                specialty: specialty.trim(),
                abstract: abstract.trim(),
                references: references.trim(),
                student_id: profile?.id,
                status: status
            };

            const { error } = editingId
                ? await supabase.from('student_creations').update(creationData).eq('id', editingId)
                : await supabase.from('student_creations').insert([creationData]);

            if (error) throw error;

            setTitle('');
            setContent('');
            setSpecialty('');
            setAbstract('');
            setReferences('');
            setEditingId(null);
            setToastMessage(editingId ? 'تم تحديث العمل بنجاح' : 'تم نشر عملك بنجاح! نثمن عطاءك العلمي والأدبي');
            setShowToast(true);
            fetchData();
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStartEdit = (work: any) => {
        setEditingId(work.id);
        setTitle(work.title);
        setContent(work.content);
        setCategory(work.category);
        setSpecialty(work.specialty || '');
        setAbstract(work.abstract || '');
        setReferences(work.references || '');
        setActiveTab('creations');
        // Scroll to editor
        const editor = document.getElementById('editor-section');
        if (editor) editor.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteCreation = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا العمل؟')) return;

        const { error } = await supabase.from('student_creations').delete().eq('id', id);
        if (!error) {
            setMyCreations(prev => prev.filter(c => c.id !== id));
            setToastMessage('تم حذف العمل بنجاح');
            setShowToast(true);
        }
    };

    const handleCorrectionComplete = async (workId: string) => {
        if (!window.confirm('هل قمت بإجراء التعديلات المطلوبة وتود إعادة الإرسال؟')) return;
        try {
            const { error } = await supabase
                .from('student_creations')
                .update({ status: 'corrected' }) // This status tells prof it's ready for re-review
                .eq('id', workId);

            if (error) throw error;
            setToastMessage('تم إبلاغ الأساتذة بإتمام التصحيح.');
            setShowToast(true);
            fetchData();
        } catch (e: any) {
            alert(e.message);
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

            {/* Red Alert Box for Revision Requests */}
            {myCreations.some(c => c.status === 'needs_revision') && (
                <div className="animate-bounce-subtle" style={{
                    backgroundColor: '#fee2e2',
                    border: '2px solid #ef4444',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <Target size={30} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, color: '#991b1b', fontSize: '1.2rem', fontWeight: 'bold' }}>تنبيه بخصوص التحكيم العلمي</h3>
                        <p style={{ margin: '0.25rem 0 0', color: '#b91c1c' }}>لديك أبحاث علمية تتطلب مراجعة فورية وتصحيحاً بناءً على ملاحظات الأساتذة المحكمين. يرجى التوجه لقسم "مختبر الإبداع" للتعديل.</p>
                    </div>
                    <button
                        onClick={() => setActiveTab('creations')}
                        style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
                        }}
                    >
                        انتقل للتصحيح الآن
                    </button>
                </div>
            )}

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
            <div className={activeTab === 'creations' ? "" : "glass-panel"} style={{
                padding: activeTab === 'creations' ? '0' : '2rem',
                backgroundColor: activeTab === 'creations' ? 'transparent' : 'white',
                minHeight: '400px',
                width: '100%',
                maxWidth: activeTab === 'creations' ? 'none' : '100%'
            }}>

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
                            <div id="editor-section">
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
                                                onChange={(e) => {
                                                    setCategory(e.target.value as any);
                                                }}
                                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #dcd3bc', outline: 'none', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.5)' }}
                                            >
                                                <option value="Story">قصة قصيرة</option>
                                                <option value="Poem">قصيدة شعرية</option>
                                                <option value="Essay">خاطرة أدبية</option>
                                                <option value="ResearchPaper">دراسة بحثية (للمراجعة العلمية)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>التخصص الأكاديمي للبحث</label>
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
                                        <div className="bg-parchment" style={{ width: '100%', minHeight: '500px', border: '2px solid #e8dec7', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                                            <ReactQuill
                                                theme="snow"
                                                value={content}
                                                onChange={setContent}
                                                style={{ height: '450px', width: '100%' }}
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

                                        {category === 'ResearchPaper' && (
                                            <>
                                                <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>الملخص الأكاديمي (Abstract)</label>
                                                    <textarea
                                                        value={abstract}
                                                        onChange={(e) => setAbstract(e.target.value)}
                                                        placeholder="اكتب ملخصاً موجزاً..."
                                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #dcd3bc', minHeight: '100px', outline: 'none', backgroundColor: 'rgba(255,255,255,0.5)' }}
                                                    />
                                                </div>
                                                <div style={{ marginBottom: '1.5rem' }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>المصادر والمراجع (References)</label>
                                                    <textarea
                                                        value={references}
                                                        onChange={(e) => setReferences(e.target.value)}
                                                        placeholder="وثق المصادر والمراجع هنا..."
                                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #dcd3bc', minHeight: '100px', outline: 'none', backgroundColor: 'rgba(255,255,255,0.5)' }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            type="submit"
                                            disabled={submitting || !title || !content}
                                            className="btn-premium"
                                            style={{ flex: 1, padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.1rem', borderRadius: '15px' }}
                                        >
                                            <Send size={24} /> {submitting ? 'جاري الحفظ...' : editingId ? 'تحديث العمل' : category === 'ResearchPaper' ? 'نشر الدراسة في الرواق العلمي' : 'نشر العمل في الرواق الأدبي'}
                                        </button>
                                        {editingId && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setTitle('');
                                                    setContent('');
                                                    setCategory('Story');
                                                    setSpecialty('');
                                                    setAbstract('');
                                                    setReferences('');
                                                }}
                                                style={{ padding: '1rem', borderRadius: '15px', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                إلغاء التعديل
                                            </button>
                                        )}
                                    </div>
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
                                            boxShadow: creation.status === 'needs_revision' ? '0 0 0 2px #ef4444' : '0 5px 15px rgba(0,0,0,0.02)',
                                            border: creation.status === 'needs_revision' ? 'none' : '1px solid var(--color-border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                                                        {creation.category === 'Poem' ? 'قصيدة' : creation.category === 'Story' ? 'قصة' : creation.category === 'Essay' ? 'خاطرة' : 'دراسة بحثية محكمة'}
                                                    </span>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{new Date(creation.created_at).toLocaleDateString('ar-EG')}</span>
                                                        <span style={{
                                                            fontSize: '0.7rem',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontWeight: 'bold',
                                                            backgroundColor: creation.status === 'approved' ? '#dcfce7' : creation.status === 'needs_revision' ? '#fee2e2' : '#fef9c3',
                                                            color: creation.status === 'approved' ? '#166534' : creation.status === 'needs_revision' ? '#991b1b' : '#854d0e'
                                                        }}>
                                                            {creation.status === 'approved' ? 'تمت المراجعة والنشر' : creation.status === 'needs_revision' ? 'يحتاج إلى تصحيح' : 'قيد التحكيم والمراجعة'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {creation.status === 'needs_revision' && (
                                                    <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <HelpCircle size={16} />
                                                        <strong>تنبيه:</strong> توجد ملاحظات جديدة من الأساتذة تتطلب تصحيحاً.
                                                    </div>
                                                )}

                                                <h3 style={{ fontWeight: '900', fontSize: '1.3rem', color: 'var(--color-primary)', fontFamily: 'serif', marginTop: '0.5rem' }}>{creation.title}</h3>
                                                {creation.specialty && (
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                                        <Target size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} /> التخصص: {creation.specialty}
                                                    </div>
                                                )}

                                                {/* Official Reviewer Feedback Log */}
                                                {(creation.reviews && creation.reviews.length > 0) ? (
                                                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                                                            <CheckCircle size={16} /> سجل ملاحظات المحكمين ({creation.reviews.length})
                                                        </h4>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                                            {creation.reviews.map((rev: any, idx: number) => (
                                                                <div key={idx} style={{
                                                                    backgroundColor: '#1A237E',
                                                                    color: 'white',
                                                                    padding: '1.2rem',
                                                                    borderRadius: '12px',
                                                                    border: '2px solid #C5A059',
                                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                                }}>
                                                                    <div style={{ borderBottom: '1px solid rgba(197, 160, 89, 0.3)', paddingBottom: '0.5rem', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <span style={{ fontWeight: 'bold', color: '#C5A059', fontSize: '1rem' }}>بروفيسور: {rev.professor_name}</span>
                                                                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{rev.created_at ? new Date(rev.created_at).toLocaleDateString('ar-EG') : ''}</span>
                                                                    </div>

                                                                    {rev.type === 'revision_request' && <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>⚠ طلب تصحيح</div>}

                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                                        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px' }}>
                                                                            <p style={{ color: '#C5A059', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '0.2rem' }}>الملاحظات المنهجية:</p>
                                                                            <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{rev.method_notes || 'لا يوجد ملاحظات'}</p>
                                                                        </div>
                                                                        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px' }}>
                                                                            <p style={{ color: '#C5A059', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '0.2rem' }}>الملاحظات اللغوية:</p>
                                                                            <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{rev.lang_notes || 'لا يوجد ملاحظات'}</p>
                                                                        </div>
                                                                        {rev.other_notes && (
                                                                            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px' }}>
                                                                                <p style={{ color: '#C5A059', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '0.2rem' }}>ملاحظات أخرى:</p>
                                                                                <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{rev.other_notes}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (creation.method_notes || creation.lang_notes) && (
                                                    <div style={{ marginTop: '1rem', padding: '1.2rem', backgroundColor: '#1A237E', borderRadius: '12px', border: '2px solid #C5A059', color: 'white' }}>
                                                        <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#C5A059', marginBottom: '0.8rem' }}>ملاحظات الأستاذ المحكم:</p>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                            {creation.method_notes && <p style={{ fontSize: '0.85rem' }}><strong>المنهج:</strong> {creation.method_notes}</p>}
                                                            {creation.lang_notes && <p style={{ fontSize: '0.85rem' }}><strong>اللغة:</strong> {creation.lang_notes}</p>}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* ACTIONS */}
                                                {(creation.status === 'pending' || creation.status === 'needs_revision') && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                                                        <button
                                                            onClick={() => handleStartEdit(creation)}
                                                            className="btn-accent"
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.6rem',
                                                                borderRadius: '8px',
                                                                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                                                                color: 'var(--color-accent)',
                                                                border: '1px solid var(--color-accent)',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '0.5rem'
                                                            }}
                                                        >
                                                            تعديل العمل {creation.status === 'needs_revision' && '(مطلوب)'}
                                                        </button>

                                                        {creation.status === 'needs_revision' && (
                                                            <button
                                                                onClick={() => handleCorrectionComplete(creation.id)}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '0.6rem',
                                                                    borderRadius: '8px',
                                                                    backgroundColor: '#10b981',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    fontWeight: 'bold',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '0.5rem'
                                                                }}
                                                            >
                                                                <CheckCircle size={16} /> تم استكمال التصحيح
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem' }}>
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
            <SuccessToast
                show={showToast}
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />

            <style>{`
                @media (max-width: 768px) {
                    .full-width-mobile {
                        margin: 0 -1rem !important;
                        width: calc(100% + 2rem) !important;
                        border-radius: 0 !important;
                    }
                    .bg-parchment {
                        border-radius: 0 !important;
                        border: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default StudentDashboard;
