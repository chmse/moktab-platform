import type { Student } from '../../data/mockData';

interface StudentCardProps {
    student: Student;
}

const StudentCard = ({ student }: StudentCardProps) => {
    const isPhD = student.level === 'PhD';

    return (
        <div className="card-hover" style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2.5rem 1.5rem',
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', // PREMIUM ELEVATION
            cursor: 'pointer'
        }}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <div style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    padding: '4px',
                    border: `2px solid ${isPhD ? 'var(--color-accent)' : 'var(--color-primary-light)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src={student.imageUrl}
                        alt={student.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
                <span style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(50%)',
                    backgroundColor: isPhD ? 'var(--color-accent)' : 'var(--color-primary)',
                    color: isPhD ? 'var(--color-primary)' : 'white',
                    padding: '0.4rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    border: '2px solid white',
                    whiteSpace: 'nowrap'
                }}>
                    {student.level === 'PhD' ? 'دكتوراه' : student.level === 'Master' ? 'ماجستير' : 'ليسانس'}
                </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', marginBottom: '0.5rem', marginTop: '1rem' }}>{student.name}</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{student.department}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
                {student.interests.map((interest, idx) => (
                    <span key={idx} style={{
                        backgroundColor: 'rgba(197, 160, 89, 0.05)', // SUBTLE GOLD TINT
                        padding: '0.4rem 1rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        color: 'var(--color-primary)',
                        border: '1px solid #c5a059', // GOLD BORDER
                        fontWeight: '700' // BOLDER
                    }}>
                        {interest}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default StudentCard;
