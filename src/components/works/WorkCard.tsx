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
}

const WorkCard = ({ work }: WorkCardProps) => {
    return (
        <div className="card-hover" style={{
            padding: '2rem',
            backgroundColor: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%'
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
                        <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-primary)', lineHeight: '1.4' }}>
                            {work.title}
                        </h3>
                    </Link>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    <Calendar size={14} />
                    {work.publishDate}
                </span>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', flex: 1 }}>
                {work.abstract.length > 150 ? `${work.abstract.substring(0, 150)}...` : work.abstract}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-surface-alt)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--color-surface-alt)' }}>
                        {work.professorImageUrl ? (
                            <img src={work.professorImageUrl} alt={work.professorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
                                ?
                            </div>
                        )}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{work.professorName}</span>
                </div>

                <Link to={`/works/${work.id}`} style={{
                    color: 'var(--color-primary)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.9rem'
                }}>
                    التفاصيل
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default WorkCard;
