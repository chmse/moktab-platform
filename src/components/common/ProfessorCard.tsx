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
            backgroundColor: '#f8f9fa',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            width: '260px',
            height: '400px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
            {/* Top Image Section (60% height) */}
            <div style={{
                height: '60%',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <img
                    src={professor.imageUrl}
                    alt={professor.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '3rem 1rem 0.75rem',
                    background: 'linear-gradient(to top, rgba(0,0,30,0.95) 0%, rgba(0,0,30,0.6) 50%, transparent 100%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: isMini ? '0.95rem' : '1.1rem',
                        color: 'white',
                        fontWeight: '800',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        textAlign: 'right'
                    }}>
                        {professor.name}
                    </h3>
                </div>
            </div>

            {/* Bottom Content Section */}
            <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                    <span style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '100px',
                        fontSize: '0.7rem',
                        fontWeight: '600'
                    }}>
                        {professor.department || 'قسم غير محدد'}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4b5563', fontSize: '0.85rem', fontWeight: '500' }}>
                        <GraduationCap size={14} color="#c5a059" />
                        <span>{professor.title}</span>
                    </div>
                </div>

                <Link to={`/professors/${professor.id}`} style={{
                    marginTop: 'auto',
                    backgroundColor: '#c5a059',
                    color: '#1a1a1a',
                    padding: '0.6rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background-color 0.2s ease',
                    display: 'block'
                }}
                    className="hover-opacity"
                >
                    عرض الملف
                </Link>
            </div>
        </div>
    );
};

export default ProfessorCard;
