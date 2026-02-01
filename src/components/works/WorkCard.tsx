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

const WorkCard = ({ work }: WorkCardProps) => {

    return (
        <div className="card-hover work-card-v95" style={{
            padding: '1rem',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            height: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.12)', // ENHANCED ELEVATION
            position: 'relative'
        }}>
            <style>{`
                .work-card-v95:hover {
                    border-color: #c5a059 !important;
                    transform: translateY(-4px);
                }
            `}</style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-accent)',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {work.type === 'Article' ? 'بحث علمي' : 'مؤلف أكاديمي'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                    <Calendar size={12} />
                    {work.publishDate}
                </span>
            </div>

            <Link to={`/works/${work.id}`}>
                <h3 style={{
                    fontSize: '1rem',
                    color: 'var(--color-primary)',
                    fontWeight: '800',
                    lineHeight: '1.4',
                    margin: '0.2rem 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.8em' // Stabilize height
                }}>
                    {work.title}
                </h3>
            </Link>

            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.8rem', flex: 1 }}>
                {work.abstract.length > 80 ? `${work.abstract.substring(0, 80)}...` : work.abstract}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                        {work.professorImageUrl ? (
                            <img src={work.professorImageUrl} alt={work.professorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.5rem' }}>
                                ?
                            </div>
                        )}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e293b' }}>{work.professorName}</span>
                </div>

                <Link to={`/works/${work.id}`} style={{ color: 'var(--color-accent)' }}>
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default WorkCard;
