import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Feather, Clock, User } from 'lucide-react';

const CreationsFeed = () => {
    const [creations, setCreations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCreations = async () => {
            try {
                // First attempt: approved works
                let { data, error } = await supabase
                    .from('student_creations')
                    .select(`
                        *,
                        profiles:student_id (full_name, id)
                    `)
                    .in('category', ['Story', 'Poem', 'Essay'])
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                // Fallback: if no approved works, fetch all published works
                if (!data || data.length === 0 || error) {
                    const { data: allData, error: allErr } = await supabase
                        .from('student_creations')
                        .select(`
                            *,
                            profiles:student_id (full_name, id)
                        `)
                        .eq('status', 'published')
                        .order('created_at', { ascending: false });

                    if (allData) data = allData;
                    if (allErr) throw allErr;
                }

                if (data) setCreations(data);
            } catch (err) {
                console.error('Error fetching creations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCreations();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>جاري استحضار الأعمال الإبداعية...</div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#fffcf7', minHeight: '100vh', scrollBehavior: 'smooth' }}>
            <div className="container" style={{ padding: '6rem 1rem' }}>
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: '#c5a059', marginBottom: '1.5rem', padding: '0.6rem 2rem', backgroundColor: 'rgba(197, 160, 89, 0.08)', borderRadius: '50px', fontWeight: '900', fontSize: '0.9rem', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                        <Feather size={18} /> رواق الأدب والإبداع
                    </div>
                    <h1 style={{ fontSize: '4.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem', fontFamily: "'Amiri', serif", fontWeight: 'normal' }}>المجلة الأدبية الإلكترونية</h1>
                    <div style={{ width: '100px', height: '2px', backgroundColor: '#c5a059', margin: '0 auto 2rem' }}></div>
                    <p style={{ maxWidth: '800px', margin: '0 auto', color: '#4b5563', fontSize: '1.4rem', lineHeight: '1.8', fontFamily: "'Amiri', serif", fontStyle: 'italic' }}>
                        "قلم يكتب، وفكر يبدع، وأمة تقرأ.. هنا ملتقى المبدعين من طلبة معهد الآداب واللغات"
                    </p>
                </div>

                {/* Masonry-style Grid */}
                <div className="masonry-columns">
                    {creations.length > 0 ? creations.map((creation) => (
                        <div key={creation.id} className="masonry-item">
                            <Link to={`/creations/${creation.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card-hover" style={{
                                    backgroundColor: 'white',
                                    padding: '2.5rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                                    border: '1px solid #f1f5f9',
                                    position: 'relative',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', opacity: 0.1, color: 'var(--color-accent)' }}>
                                        <Feather size={32} />
                                    </div>

                                    <span style={{ color: '#c5a059', fontWeight: '900', fontSize: '0.85rem', marginBottom: '1.2rem', letterSpacing: '1.5px', display: 'block' }}>
                                        {creation.category === 'Poem' ? 'قَصيدة شِعرية' : creation.category === 'Story' ? 'قِصَّة قَصيرة' : 'خَاطِرة أدبية'}
                                    </span>

                                    <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', lineHeight: 1.3, fontFamily: 'var(--font-family-serif)', fontWeight: '700' }}>{creation.title}</h2>

                                    <div style={{
                                        fontSize: '1.2rem',
                                        color: '#4b5563',
                                        lineHeight: '1.8',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 5,
                                        WebkitBoxOrient: 'vertical',
                                        marginBottom: '2rem',
                                        fontFamily: 'var(--font-family-serif)'
                                    }} dangerouslySetInnerHTML={{ __html: creation.content }}></div>

                                    <div style={{ borderTop: '1px solid #f8fafc', paddingTop: '1.5rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(26, 35, 126, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={18} color="var(--color-primary)" />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{creation.profiles?.full_name}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>مبدع مشارك</span>
                                            </div>
                                        </div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Clock size={14} /> {new Date(creation.created_at).toLocaleDateString('ar-EG')}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '5rem', width: '100%', gridColumn: '1/-1' }}>
                            <p style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', fontFamily: 'var(--font-family-serif)' }}>الرواق ينتظر أولى ثمار إبداعكم...</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap');
                
                .card-hover:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.08) !important;
                    border-color: #c5a059 !important;
                }
            `}</style>
        </div>
    );
};

export default CreationsFeed;
