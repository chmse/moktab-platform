import { Users, FlaskConical, Library, Calendar, Briefcase } from 'lucide-react';

const InstituteStats = () => {
    const stats = [
        { number: '+50', label: 'عضو هيئة تدريس' },
        { number: '+200', label: 'طالب باحث' },
        { number: '+500', label: 'نتاج علمي محكّم' },
        { number: '+15', label: 'مشاريع علمية', icon: <Briefcase size={32} /> },
        { number: '+5', label: 'مجلات علمية', icon: <Library size={32} /> },
        { number: '+12', label: 'مخابر بحث', icon: <FlaskConical size={32} /> },
        { number: '+8', label: 'نوادي طلابية', icon: <Users size={32} /> },
        { number: '+20', label: 'ملتقيات وفعاليات', icon: <Calendar size={32} /> }
    ];

    return (
        <div style={{ backgroundColor: '#1A237E', color: 'white', padding: '4rem 0' }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    textAlign: 'center'
                }}>
                    {stats.map((stat, index) => (
                        <div key={index} style={{
                            padding: '2rem',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(197, 160, 89, 0.2)',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            transition: 'transform 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }} className="card-hover">
                            {stat.icon && (
                                <div style={{ color: 'var(--color-accent)', marginBottom: '0.5rem', opacity: 0.8 }}>
                                    {stat.icon}
                                </div>
                            )}
                            <h3 style={{
                                fontSize: '2.5rem',
                                fontWeight: '900',
                                color: 'var(--color-accent)',
                                lineHeight: 1
                            }}>
                                {stat.number}
                            </h3>
                            <p style={{
                                fontSize: '1rem',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontWeight: '500'
                            }}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstituteStats;
