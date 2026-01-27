import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

interface WorkCardProps {
    work: {
        id: string;
        title: string;
        abstract: string;
        type: string;
        publishDate: string;
        professorName: string;
        professorImageUrl: string;
    };
    variant?: 'default' | 'mini';
}

const WorkCard = ({ work, variant = 'default' }: WorkCardProps) => {
    const isMini = variant === 'mini';

    return (
        <div className="card-hover" style={{
            padding: isMini ? '1rem' : '1.25rem',
            backgroundColor: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: isMini ? '0.5rem' : '0.75rem',
            height: '100%',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                    fontSize: isMini ? '0.7rem' : '0.75rem',
                    color: 'var(--color-accent)',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px'
                }}>
                    {work.type === 'Article' ? 'بحث' : 'كتاب'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: isMini ? '0.75rem' : '0.8rem' }}>
                    <Calendar size={isMini ? 12 : 14} />
                    {work.publishDate}
                </span>
            </div>

            <Link to={`/works/${work.id}`}>
                <h3 style={{ fontSize: isMini ? '1rem' : '1.1rem', color: 'var(--color-primary)', fontWeight: '700', lineHeight: '1.4' }}>
                    {work.title}
                </h3>
            </Link>

            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.5', fontSize: '0.85rem', flex: 1 }}>
                {work.abstract.length > (isMini ? 60 : 100) ? `${work.abstract.substring(0, isMini ? 60 : 100)}...` : work.abstract}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-surface-alt)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--color-surface-alt)' }}>
                        {work.professorImageUrl ? (
                            <img src={work.professorImageUrl} alt={work.professorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '0.6rem' }}>
                                ?
                            </div>
                        )}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{work.professorName}</span>
                </div>

                <Link to={`/works/${work.id}`} style={{
                    color: 'var(--color-primary)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.85rem'
                }}>
                    <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default WorkCard;
