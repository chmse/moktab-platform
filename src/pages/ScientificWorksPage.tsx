import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Calendar, ArrowRight, Search } from 'lucide-react';

const ScientificWorksPage = () => {
    const [worksList, setWorksList] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorks = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('works')
                .select(`
                    *,
                    profiles:professor_id (full_name, avatar_url)
                `);

            if (data && !error) {
                setWorksList(data.map(w => ({
                    ...w,
                    professorName: w.profiles?.full_name || 'أستاذ غير معروف',
                    professorImageUrl: w.profiles?.avatar_url,
                    publishDate: w.publish_date || w.publishDate,
                })));
            }
            setLoading(false);
        };

        fetchWorks();
    }, []);

    const filteredWorks = worksList.filter(work =>
        work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.professorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>المكتبة العلمية</h1>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    استعرض أحدث الأبحاث والدراسات والمؤلفات العلمية لنخبة من الأكاديميين.
                </p>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{
                        position: 'absolute',
                        top: '50%',
                        right: '1.5rem',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-primary)',
                        opacity: 0.7
                    }} size={20} />
                    <input
                        type="text"
                        placeholder="ابحث عن عنوان بحث، كلمة مفتاحية، أو اسم أستاذ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.2rem 3.5rem 1.2rem 1.5rem',
                            borderRadius: '999px',
                            border: '2px solid var(--color-surface-alt)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            transition: 'all 0.3s',
                            backgroundColor: 'var(--color-surface-alt)',
                            color: 'var(--color-primary)'
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-surface-alt)';
                            e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        جاري تحميل المكتبة العلمية...
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in grid-responsive-cards">
                    {filteredWorks.length > 0 ? (
                        filteredWorks.map((work) => (
                            <div key={work.id} className="card-hover" style={{
                                padding: '2rem',
                                backgroundColor: 'white',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--color-accent)',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            {work.type === 'Article' ? 'بحث' : 'كتاب'}
                                        </span>
                                        <Link to={`/works/${work.id}`}>
                                            <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                                {work.title}
                                            </h3>
                                        </Link>
                                    </div>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                        <Calendar size={16} />
                                        {work.publishDate}
                                    </span>
                                </div>

                                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', flex: 1 }}>{work.abstract}</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-alt)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                                            <img src={work.professorImageUrl} alt={work.professorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{work.professorName}</span>
                                    </div>

                                    <Link to={`/works/${work.id}`} style={{
                                        color: 'var(--color-primary)',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: 'var(--color-surface)'
                                    }}>
                                        قراءة المزيد
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                            لا توجد نتائج مطابقة للبحث.
                        </div>
                    )}
                </div>
            )}
            {/* Mobile Grid Override */}
            <style>{`
                .grid-responsive-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                @media (max-width: 768px) {
                    .grid-responsive-cards {
                        grid-template-columns: 1fr !important;
                        gap: 20px !important;
                        padding: 0 0.5rem;
                    }
                    /* Professional Vertical Flow */
                    .grid-responsive-cards h3 { font-size: 1.2rem !important; line-height: 1.4; }
                    .grid-responsive-cards p { 
                        display: -webkit-box !important;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        font-size: 0.9rem !important;
                    } 
                    .grid-responsive-cards .card-hover { 
                        padding: 1.25rem !important;
                        border-radius: 12px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ScientificWorksPage;
