import type { Professor } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';

interface ProfessorCardProps {
    professor: Professor;
}

const ProfessorCard = ({ professor }: ProfessorCardProps) => {
    return (
        <div className="card-hover" style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
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
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    padding: '1rem',
                    color: 'white'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{professor.name}</h3>
                </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <span style={{
                        display: 'inline-block',
                        backgroundColor: 'rgba(26, 35, 126, 0.1)',
                        color: 'var(--color-primary)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                    }}>
                        {professor.department}
                    </span>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <GraduationCap size={18} />
                        {professor.title}
                    </p>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>الاهتمامات البحثية:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {professor.interests.map((interest, idx) => (
                            <span key={idx} style={{
                                fontSize: '0.8rem',
                                backgroundColor: 'var(--color-surface-alt)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '4px',
                                color: 'var(--color-text-primary)'
                            }}>
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>

                <Link to={`/professors/${professor.id}`} className="btn-premium" style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.9rem', padding: '0.6rem', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <BookOpen size={18} />
                        عرض الملف الأكاديمي
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default ProfessorCard;
