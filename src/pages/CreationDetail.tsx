import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight, User, BookOpen } from 'lucide-react';

const CreationDetail = () => {
    const { id } = useParams();
    const [creation, setCreation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFocusMode, setIsFocusMode] = useState(false);

    useEffect(() => {
        const fetchCreation = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from('student_creations')
                .select(`
                    *,
                    profiles:student_id (full_name, id, bio, avatar_url)
                `)
                .eq('id', id)
                .single();

            if (!error && data) {
                setCreation(data);
                // Also update the document title for a professional feel
                document.title = `${data.title} | Moktab Journal`;
            }
            setLoading(false);
        };
        fetchCreation();
    }, [id]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>جاري استرجاع النص الإبداعي...</div>
            </div>
        );
    }

    if (!creation) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>المحتوى غير موجود</h2>
                <Link to="/creations" style={{ color: 'var(--color-accent)' }}>العودة للمجلة الأدبية</Link>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: isFocusMode ? '#fdf6e3' : '#f4f4f2',
            minHeight: '100vh',
            padding: isFocusMode ? '4rem 1rem' : '8rem 1rem',
            transition: 'all 0.6s ease',
            color: isFocusMode ? '#2d2d2d' : 'inherit'
        }}>
            <div className="container" style={{ maxWidth: isFocusMode ? '800px' : '1000px' }}>

                {/* Focus Mode Toggle */}
                <div style={{
                    position: 'fixed',
                    top: '2rem',
                    left: '2rem',
                    zIndex: 1000,
                    opacity: isFocusMode ? 0.4 : 1,
                    transition: 'opacity 0.3s'
                }} onMouseEnter={(e) => isFocusMode && (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => isFocusMode && (e.currentTarget.style.opacity = '0.4')}>
                    <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '50px',
                            backgroundColor: isFocusMode ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.05)',
                            border: '1px solid rgba(0,0,0,0.1)',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            boxShadow: isFocusMode ? 'none' : '0 4px 15px rgba(0,0,0,0.05)'
                        }}
                    >
                        {isFocusMode ? <User size={18} /> : <BookOpen size={18} />}
                        {isFocusMode ? 'الخروج من وضع التركيز' : 'وضع التركيز العميق'}
                    </button>
                </div>

                {!isFocusMode && (
                    <div style={{ marginBottom: '3rem' }}>
                        <Link to="/creations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 'bold' }}>
                            <ArrowRight size={20} /> العودة إلى الرواق
                        </Link>
                    </div>
                )}

                <article style={{
                    backgroundColor: isFocusMode ? 'transparent' : 'white',
                    padding: isFocusMode ? '0' : '6rem 7rem',
                    borderRadius: isFocusMode ? '0' : '8px',
                    boxShadow: isFocusMode ? 'none' : '0 40px 100px rgba(0,0,0,0.06)',
                    position: 'relative',
                    border: isFocusMode ? 'none' : '1px solid #e2e8f0',
                    marginTop: '2rem'
                }}>

                    {/* Journal Identification */}
                    {!isFocusMode && (
                        <div style={{
                            position: 'absolute',
                            top: '3rem',
                            left: '7rem',
                            right: '7rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderBottom: '2px solid #000033',
                            paddingBottom: '1rem',
                            marginBottom: '4rem',
                            color: '#000033',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            fontFamily: 'var(--font-family-serif)'
                        }}>
                            <span>MOKTAB ACADEMIC JOURNAL - VOL 16.0</span>
                            <span style={{ direction: 'rtl' }}>مجلة مُكتب للدراسات الأكاديمية - المجلد 16</span>
                        </div>
                    )}

                    {/* Header Info */}
                    <div style={{ textAlign: 'center', marginBottom: isFocusMode ? '4rem' : '7rem', marginTop: isFocusMode ? '0' : '6rem' }}>
                        <span style={{
                            color: '#c5a059',
                            fontWeight: '900',
                            fontSize: '1.1rem',
                            letterSpacing: '2px',
                            display: 'block',
                            marginBottom: '1.5rem',
                            fontFamily: 'var(--font-family-serif)',
                            textTransform: 'uppercase'
                        }}>
                            {creation.category === 'Poem' ? 'قَصيدة شِعرية' : creation.category === 'Story' ? 'قِصَّة قَصيرة' : creation.category === 'ResearchPaper' ? 'دِراسَة بَحثيَّة مُحَكَّمة' : 'خَاطِرة أدبيَّة'}
                        </span>

                        <h1 style={{
                            fontSize: isFocusMode ? '4.8rem' : '3.8rem',
                            color: '#000033',
                            textAlign: 'center',
                            marginBottom: '2rem',
                            fontFamily: 'var(--font-family-serif)',
                            lineHeight: 1.3,
                            fontWeight: '700'
                        }}>
                            {creation.title}
                        </h1>

                        <div style={{
                            height: '1px',
                            width: '200px',
                            backgroundColor: '#000033',
                            margin: '0 auto 2.5rem',
                            opacity: isFocusMode ? 0.3 : 0.6
                        }}></div>

                        {!isFocusMode && (
                            <div style={{ color: '#475569', fontSize: '1.2rem', fontFamily: 'var(--font-family-serif)' }}>
                                <div style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.5rem' }}>{creation.profiles?.full_name}</div>
                                <div style={{ fontSize: '1rem', opacity: 0.8 }}>تاريخ النشر: {new Date(creation.created_at).toLocaleDateString('ar-EG')}</div>
                            </div>
                        )}
                    </div>

                    {/* Academic Abstract */}
                    {creation.category === 'ResearchPaper' && creation.abstract && (
                        <div style={{
                            marginBottom: '6rem',
                            padding: '3rem',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '4px',
                            borderRight: '8px solid #000033',
                            borderLeft: '1px solid #e2e8f0',
                            borderTop: '1px solid #e2e8f0',
                            borderBottom: '1px solid #e2e8f0'
                        }}>
                            <h3 style={{ fontSize: '1.4rem', color: '#000033', fontWeight: '900', marginBottom: '1.5rem', textAlign: 'right', fontFamily: 'var(--journal-font-serif)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ملخص الدراسة (ABSTRACT)</h3>
                            <p style={{ fontSize: '1.15rem', lineHeight: '2', color: '#334155', textAlign: 'justify', fontStyle: 'italic', fontFamily: 'var(--academic-font-serif)' }}>{creation.abstract}</p>
                        </div>
                    )}

                    {/* Main Content */}
                    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>
                        <div
                            className="academic-journal-content"
                            style={{
                                fontSize: isFocusMode ? '2.2rem' : '1.4rem',
                                color: '#1a1a1a',
                                lineHeight: isFocusMode ? '2.8' : '2.3',
                                whiteSpace: 'pre-wrap',
                                fontFamily: isFocusMode ? 'var(--academic-font-serif)' : 'var(--academic-font-serif)',
                                textAlign: creation.category === 'Poem' ? 'center' : 'justify',
                                maxWidth: '100%',
                                transition: 'all 0.5s ease',
                                direction: 'rtl',
                                minHeight: '400px',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word'
                            }}
                            dangerouslySetInnerHTML={{ __html: creation.content }}
                        ></div>
                    </div>

                    {/* Academic References */}
                    {creation.category === 'ResearchPaper' && creation.references && (
                        <div style={{ marginTop: '8rem', padding: '4rem 0 2rem', borderTop: '2px solid #000033' }}>
                            <h3 style={{ fontSize: '1.4rem', color: '#000033', fontWeight: '900', marginBottom: '2.5rem', textAlign: 'right', fontFamily: 'var(--journal-font-serif)' }}>المصادر والمراجع والملاحق (REFERENCES)</h3>
                            <div style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.8',
                                color: '#475569',
                                whiteSpace: 'pre-wrap',
                                textAlign: 'right',
                                fontFamily: 'var(--academic-font-serif)',
                                padding: '1rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '4px'
                            }}>{creation.references}</div>
                        </div>
                    )}

                    {/* Footer / Signature - Scholar Profile Link */}
                    {!isFocusMode && (
                        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '2px double #e2e8f0', display: 'flex', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center', background: '#f8fafc', padding: '4rem', borderRadius: '4px', width: '100%', border: '1px solid #e2e8f0', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}>
                                <p style={{ color: '#64748b', marginBottom: '2.5rem', fontStyle: 'italic', fontSize: '1.2rem', fontFamily: 'var(--font-family-serif)', letterSpacing: '0.05em' }}>تأليف الباحث</p>
                                <Link to={`/students/${creation.profiles?.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', justifyContent: 'center' }} className="card-hover">
                                        {creation.profiles?.avatar_url ? (
                                            <img src={creation.profiles.avatar_url} alt="" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '6px solid white', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} />
                                        ) : (
                                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={60} color="#64748b" />
                                            </div>
                                        )}
                                        <div style={{ textAlign: 'right' }}>
                                            <h3 style={{ fontSize: '2.5rem', color: '#1e293b', margin: 0, fontFamily: 'var(--font-family-serif)', fontWeight: '700' }}>{creation.profiles?.full_name}</h3>
                                            <p style={{ margin: '0.5rem 0 0', color: '#c5a059', fontWeight: 'bold', fontSize: '1.1rem', borderRight: '3px solid #c5a059', paddingRight: '1rem' }}>سيرة الباحث الأكاديمية</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </article>

                {/* Bottom Actions - Institutional Contact */}
                {!isFocusMode && (
                    <div style={{ marginTop: '8rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '6rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2rem', backgroundColor: '#000033', color: 'white', padding: '2rem 4rem', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,30,0.15)', border: '1px solid #c5a059' }} className="card-hover">
                            <BookOpen size={40} color="#c5a059" />
                            <div style={{ textAlign: 'right' }}>
                                <h4 style={{ margin: 0, fontSize: '1.6rem', fontFamily: 'var(--font-family-serif)', color: '#c5a059' }}>مجلة مُكتب للدراسات والبحوث</h4>
                                <p style={{ margin: '0.5rem 0 0', opacity: 0.8, fontSize: '1.1rem', letterSpacing: '0.02em' }}>منصة البحث العلمي والتميز الأكاديمي بجامعة الجزائر</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif+Arabic:wght@400;700&display=swap');
                
                :root {
                    --journal-font-serif: "Amiri", serif;
                    --academic-font-serif: "Noto Serif Arabic", serif;
                }

                .academic-journal-content {
                    font-family: var(--academic-font-serif);
                    font-size: 1.4rem;
                    line-height: 2.2;
                    color: #1a1a1a;
                    text-align: justify;
                    text-justify: inter-word;
                    word-spacing: -0.05em;
                }

                .academic-journal-content h2, 
                .academic-journal-content h3 {
                    font-family: var(--journal-font-serif);
                    color: #000033;
                    margin-top: 3rem;
                    margin-bottom: 1.5rem;
                    font-weight: 700;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 0.5rem;
                }

                .ql-editor { padding: 0; }
                
                /* Selection style for academic feel */
                ::selection {
                    background: #c5a059;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default CreationDetail;
