const InstituteStats = () => {
    const stats = [
        { number: '+50', label: 'عضو هيئة تدريس' },
        { number: '+200', label: 'طالب باحث' },
        { number: '+500', label: 'نتاج علمي محكّم' }
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
                        }} className="card-hover">
                            <h3 style={{
                                fontSize: '3.5rem',
                                fontWeight: '900',
                                color: 'var(--color-accent)',
                                marginBottom: '0.5rem',
                                letterSpacing: '1px'
                            }}>
                                {stat.number}
                            </h3>
                            <p style={{
                                fontSize: '1.2rem',
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
