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
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            height: '100%',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
            {/* Top Image Section with Overlay */}
            <div style={{
                height: isMini ? '160px' : '200px',
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
                    padding: '2rem 1rem 0.75rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: isMini ? '1rem' : '1.25rem',
                        color: 'white',
                        fontWeight: '800',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        textAlign: 'right'
                    }}>
                        {professor.name}
                    </h3>
                </div>
            </div>

            {/* Middle Content Section */}
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}>
                        {professor.department || 'قسم غير محدد'}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.9rem', fontWeight: '500' }}>
                        <GraduationCap size={16} color="#c5a059" />
                        <span>{professor.title}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Button Section */}
            <Link to={`/professors/${professor.id}`} style={{
                backgroundColor: '#c5a059',
                color: '#1a1a1a',
                padding: '0.9rem',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}
                className="hover-opacity"
            >
                <span>عرض الملف الأكاديمي</span>
            </Link>
        </div>
    );
};

export default ProfessorCard;
