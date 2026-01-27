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
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--color-surface-alt)' }}>
                <div style={{
                    width: isMini ? '80px' : '100px',
                    height: isMini ? '80px' : '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    marginBottom: '0.5rem'
                }}>
                    <img
                        src={professor.imageUrl}
                        alt={professor.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: isMini ? '1rem' : '1.2rem', color: '#1a1a1a', fontWeight: '800', letterSpacing: '-0.5px' }}>{professor.name}</h3>
                    <p style={{ color: '#666', fontSize: isMini ? '0.8rem' : '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: '500' }}>
                        <GraduationCap size={isMini ? 14 : 16} color="#734822" />
                        {professor.title}
                    </p>
                </div>
            </div>

            <div style={{ padding: isMini ? '1rem' : '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: isMini ? '0.5rem' : '0.75rem', backgroundColor: '#fafafa' }}>
                {!isMini && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        {professor.interests.slice(0, 2).map((interest, idx) => (
                            <span key={idx} style={{
                                fontSize: '0.75rem',
                                color: '#666',
                                backgroundColor: '#fff',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                border: '1px solid #eee'
                            }}>
                                {interest}
                            </span>
                        ))}
                    </div>
                )}

                <Link to={`/professors/${professor.id}`} style={{
                    marginTop: 'auto',
                    textAlign: 'center',
                    padding: '0.6rem',
                    backgroundColor: '#734822',
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                    border: 'none',
                    display: 'block'
                }} className="hover-opacity">
                    {isMini ? 'الملف' : 'الملف الأكاديمي'}
                </Link>
            </div>
        </div>
    );
};

export default ProfessorCard;
