import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AISidebar from '../components/works/AISidebar';
import DiscussionSection from '../components/works/DiscussionSection';
import { ChevronRight, Calendar, User, Bot, X, Bookmark, BookOpen } from 'lucide-react';

const WorkDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [work, setWork] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchWorkDetail = async () => {
            if (!id) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('works')
                .select(`
                    *,
                    profiles:professor_id (full_name)
                `)
                .eq('id', id)
                .single();

            if (data && !error) {
                setWork({
                    ...data,
                    professorName: data.profiles?.full_name || 'أستاذ غير معروف',
                    publishDate: data.publish_date || data.publishDate
                });

                // Check if already saved
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: saved } = await supabase
                        .from('saved_works')
                        .select('id')
                        .eq('work_id', id)
                        .eq('user_id', user.id)
                        .single();
                    if (saved) setIsSaved(true);
                }
            }
            setLoading(false);
        };

        fetchWorkDetail();
    }, [id]);

    const handleSaveWork = async () => {
        if (!id || saving) return;
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('يرجى تسجيل الدخول لحفظ الأعمال');
            setSaving(false);
            return;
        }

        if (isSaved) {
            const { error } = await supabase
                .from('saved_works')
                .delete()
                .eq('work_id', id)
                .eq('user_id', user.id);
            if (!error) setIsSaved(false);
        } else {
            const { error } = await supabase
                .from('saved_works')
                .insert([{ work_id: id, user_id: user.id }]);
            if (!error) setIsSaved(true);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    جاري تحميل تفاصيل العمل العلمي...
                </div>
            </div>
        );
    }

    if (!work) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>العمل العلمي غير موجود</h2>
                <Link to="/works" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>العودة إلى القائمة</Link>
            </div>
        );
    }

    // Fallback for professor object
    const professorName = work?.professorName || work?.profiles?.full_name || 'أستاذ غير معروف';

    return (
        <div className="container" style={{ padding: '3rem 1rem', position: 'relative' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/works" style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem', width: 'fit-content' }}>
                    <ChevronRight size={16} />
                    العودة إلى الأعمال العلمية
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '3rem', alignItems: 'start', position: 'relative' }}>
                {/* Main Content */}
                <div style={{ minWidth: 0 }}>
                    <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
                        <span style={{
                            display: 'inline-block',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            marginBottom: '1rem'
                        }}>
                            {(work?.category === 'Article' || work?.type === 'Article') ? 'بحث محكم' :
                                (work?.category === 'Book' || work?.type === 'Book') ? 'كتاب' :
                                    (work?.category === 'Lecture' || work?.type === 'Lecture') ? 'محاضرة' : 'عمل علمي'}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '2.5rem', lineHeight: '1.3', color: 'var(--color-primary)', margin: 0 }}>
                                {work?.title || 'عنوان غير متوفر'}
                            </h1>
                            <button
                                onClick={handleSaveWork}
                                title={isSaved ? "إزالة من المكتبة" : "حفظ في المكتبة"}
                                style={{
                                    backgroundColor: isSaved ? 'var(--color-primary)' : 'transparent',
                                    color: isSaved ? 'var(--color-accent)' : 'var(--color-primary)',
                                    border: '1px solid var(--color-primary)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s',
                                    opacity: saving ? 0.7 : 1
                                }}
                                className="card-hover"
                            >
                                <Bookmark size={24} fill={isSaved ? "var(--color-accent)" : "none"} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} />
                                <span>{professorName}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={18} />
                                <span>{work?.publish_date || work?.publishDate || 'تاريخ غير متوفر'}</span>
                            </div>
                        </div>
                    </header>

                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>الملخص</h3>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            borderRight: '4px solid var(--color-accent)',
                            fontStyle: 'italic',
                            lineHeight: '1.8',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            {work?.abstract || 'لا يوجد ملخص متاح لهذا العمل.'}
                        </div>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        {work?.pdf_url && (
                            <div style={{ marginTop: '2rem' }}>
                                <a
                                    href={work.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-premium"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        textDecoration: 'none',
                                        padding: '0.75rem 1.5rem'
                                    }}
                                >
                                    <BookOpen size={20} />
                                    قراءة الملف الكامل (PDF)
                                </a>

                                {work.pdf_url.endsWith('.pdf') && (
                                    <div style={{ marginTop: '1.5rem', height: '600px', backgroundColor: '#f1f5f9', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                        <iframe
                                            src={work.pdf_url}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 'none' }}
                                            title="PDF Preview"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {work?.content && (
                            <article className="text-journal" style={{ marginTop: '2rem' }}>
                                {work.content}
                            </article>
                        )}
                    </div>

                    <DiscussionSection workId={id} />
                </div>

                {/* Desktop Sidebar */}
                <aside className="desktop-sidebar" style={{ display: 'none' }}> {/* Handled by CSS media query ideally, but inline styles force logic here */}
                    <style>{`
             @media (min-width: 900px) {
               .desktop-sidebar { display: block !important; }
               .mobile-toggle { display: none !important; }
             }
             @media (max-width: 899px) {
                .desktop-sidebar { display: none !important; }
             }
           `}</style>
                    <AISidebar />
                </aside>
            </div>

            {/* Mobile Sidebar Toggle */}
            <button
                className="mobile-toggle btn-premium"
                onClick={() => setShowMobileSidebar(true)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '2rem',
                    zIndex: 90,
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                <Bot size={24} />
            </button>

            {/* Mobile Sidebar Sheet */}
            {showMobileSidebar && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 100,
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <div className="glass-panel" style={{
                        width: '85%',
                        maxWidth: '350px',
                        height: '100%',
                        padding: '2rem',
                        borderRadius: '20px 0 0 20px',
                        backgroundColor: 'white',
                        overflowY: 'auto',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <button onClick={() => setShowMobileSidebar(false)} style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                            <X size={24} />
                        </button>
                        <AISidebar />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkDetailPage;
