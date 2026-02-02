import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight, User, Calendar, BookOpen } from 'lucide-react';

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
            backgroundColor: isFocusMode ? '#fdf6e3' : '#fffcf7',
            minHeight: '100vh',
            padding: isFocusMode ? '4rem 1rem' : '6rem 1rem',
            transition: 'all 0.6s ease',
            color: isFocusMode ? '#2d2d2d' : 'inherit'
        }}>
            <div className="container" style={{ maxWidth: isFocusMode ? '750px' : '900px' }}>

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
                    padding: isFocusMode ? '0' : '5rem',
                    borderRadius: isFocusMode ? '0' : '24px',
                    boxShadow: isFocusMode ? 'none' : '0 30px 70px rgba(0,0,0,0.04)',
                    position: 'relative'
                }}>

                    {/* Header Info */}
                    <div style={{ textAlign: 'center', marginBottom: isFocusMode ? '4rem' : '5rem' }}>
                        <span style={{
                            color: isFocusMode ? '#c5a059' : 'var(--color-accent)',
                            fontWeight: '900',
                            fontSize: '1rem',
                            letterSpacing: '3px',
                            display: 'block',
                            marginBottom: '1.2rem',
                            fontFamily: 'var(--font-family-serif)'
                        }}>
                            {creation.category === 'Poem' ? 'قَصيدة شِعرية' : creation.category === 'Story' ? 'قِصَّة قَصيرة' : 'خَاطِرة أدبيَّة'}
                        </span>

                        <h1 style={{
                            fontSize: isFocusMode ? '4.8rem' : '4rem',
                            color: 'var(--color-primary)',
                            textAlign: 'center',
                            marginBottom: '2.5rem',
                            fontFamily: 'var(--font-family-serif)',
                            lineHeight: 1.2,
                            fontWeight: '700'
                        }}>
                            {creation.title}
                        </h1>

                        <div style={{
                            height: '2px',
                            width: '120px',
                            backgroundColor: '#c5a059',
                            margin: '0 auto 2.5rem',
                            opacity: isFocusMode ? 0.4 : 1
                        }}></div>

                        {!isFocusMode && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={18} /> {creation.profiles?.full_name}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} /> {new Date(creation.created_at).toLocaleDateString('ar-EG')}</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            fontSize: isFocusMode ? '2rem' : '1.7rem',
                            color: isFocusMode ? '#374151' : '#2d3748',
                            lineHeight: isFocusMode ? '2.8' : '2.2',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'var(--font-family-serif)',
                            textAlign: creation.category === 'Poem' ? 'center' : 'right',
                            maxWidth: '100%',
                            transition: 'all 0.5s ease'
                        }}
                        dangerouslySetInnerHTML={{ __html: creation.content }}
                    ></div>

                    {/* Footer / Signature */}
                    {!isFocusMode && (
                        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center', background: '#fcfcfd', padding: '3.5rem', borderRadius: '32px', width: '100%', border: '1px solid #f1f5f9' }}>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontStyle: 'italic', fontSize: '1.2rem', fontFamily: 'var(--font-family-serif)' }}>خُطَّتْ بقلم المبدع</p>
                                <Link to={`/students/${creation.profiles?.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }} className="card-hover">
                                        {creation.profiles?.avatar_url ? (
                                            <img src={creation.profiles.avatar_url} alt="" style={{ width: '100px', height: '100px', borderRadius: '28px', objectFit: 'cover', border: '5px solid white', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }} />
                                        ) : (
                                            <div style={{ width: '100px', height: '100px', borderRadius: '28px', backgroundColor: 'var(--color-surface-alt)', border: '5px solid white', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={50} color="var(--color-primary)" />
                                            </div>
                                        )}
                                        <div style={{ textAlign: 'right' }}>
                                            <h3 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', margin: 0, fontFamily: 'var(--font-family-serif)', fontWeight: '700' }}>{creation.profiles?.full_name}</h3>
                                            <p style={{ margin: 0, color: 'var(--color-accent)', fontWeight: '900', fontSize: '1.1rem' }}>استكشاف السيرة العلمية والبحثية</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </article>

                {/* Bottom Actions */}
                {!isFocusMode && (
                    <div style={{ marginTop: '6rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem', backgroundColor: '#1a237e', color: 'white', padding: '1.5rem 3.5rem', borderRadius: '24px', boxShadow: '0 25px 50px rgba(26, 35, 126, 0.2)' }} className="card-hover">
                            <BookOpen size={32} className="text-accent" />
                            <div style={{ textAlign: 'right' }}>
                                <h4 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-family-serif)' }}>هل لامس هذا النص وجدانك؟</h4>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>شارك أفكارك وتفاعلك في رواق النقاش المجتمعي</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap');
                .ql-editor { padding: 0; }
            `}</style>
        </div>
    );
};

export default CreationDetail;
