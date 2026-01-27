import type { Professor } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

interface ProfessorCardProps {
    professor: Professor;
    variant?: 'default' | 'mini';
}

const ProfessorCard = ({ professor, variant = 'default' }: ProfessorCardProps) => {
    const isMini = variant === 'mini';

    return (
        <div className="card-hover" style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            height: '100%'
        }}>
            <div style={{ height: isMini ? '100px' : '140px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={professor.imageUrl}
                    alt={professor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            <div style={{ padding: isMini ? '0.75rem' : '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: isMini ? '0.5rem' : '0.75rem' }}>
                <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: isMini ? '0.9rem' : '1.1rem', color: 'var(--color-primary)', fontWeight: '700' }}>{professor.name}</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: isMini ? '0.75rem' : '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <GraduationCap size={isMini ? 12 : 14} />
                        {professor.title}
                    </p>
                </div>

                {!isMini && (
                    <div style={{ padding: '0.5rem 0', borderTop: '1px solid var(--color-surface-alt)' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {professor.interests.slice(0, 2).map((interest, idx) => (
                                <span key={idx} style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-secondary)',
                                    opacity: 0.8
                                }}>
                                    # {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <Link to={`/professors/${professor.id}`} style={{
                    marginTop: 'auto',
                    textAlign: 'center',
                    padding: '0.5rem',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-primary)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    transition: 'all 0.2s ease'
                }} className="hover-bright">
                    {isMini ? 'الملف' : 'الملف الأكاديمي'}
                </Link>
            </div>
        </div>
    );
};

export default ProfessorCard;
