import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Calendar, ArrowRight } from 'lucide-react';

const ScientificWorksPage = () => {
    const [worksList, setWorksList] = useState<any[]>([]);
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

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>المكتبة العلمية</h1>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    استعرض أحدث الأبحاث والدراسات والمؤلفات العلمية لنخبة من الأكاديميين.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        جاري تحميل المكتبة العلمية...
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
                    {worksList.length > 0 ? (
                        worksList.map((work) => (
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
                            لا توجد أعمال علمية متاحة حالياً.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScientificWorksPage;
