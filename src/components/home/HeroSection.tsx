import { Search, Users, BookOpen, GraduationCap } from 'lucide-react';

interface HeroSectionProps {
    stats: {
        professors: number;
        students: number;
        works: number;
    };
    onSearch: (term: string) => void;
}

const HeroSection = ({ stats, onSearch }: HeroSectionProps) => {
    return (
        <div style={{
            backgroundColor: '#0F172A',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 100%)',
            color: 'white',
            padding: '3rem 1rem',
            textAlign: 'center',
            minHeight: '350px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '900',
                        marginBottom: '0.5rem',
                        lineHeight: 1.2,
                        letterSpacing: '-1px'
                    }}>
                        مَنْصَة مَكْتَب الأكاديمية
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
                        الأرشيف الجامعي الشامل للنتاج العلمي والمعالجات الأكاديمية
                    </p>
                </div>

                <div style={{
                    maxWidth: '650px',
                    margin: '0 auto 2.5rem',
                    position: 'relative',
                }}>
                    <input
                        type="text"
                        placeholder="ابحث عن اسم أستاذ، عنوان بحث، أو كلمة مفتاحية..."
                        onChange={(e) => onSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.25rem 3.5rem 1.25rem 1.5rem',
                            borderRadius: '16px',
                            border: '2px solid #C5A059',
                            boxShadow: '0 0 15px rgba(197, 160, 89, 0.2), inset 0 0 20px rgba(0,0,0,0.2)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            e.target.style.borderColor = 'var(--color-accent)';
                        }}
                        onBlur={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                    />
                    <Search style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} size={20} />
                </div>

                {/* Minimalist Stats Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '3rem',
                    padding: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.8 }}>
                        <Users size={16} color="var(--color-accent)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{stats.professors}</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>أستاذ</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.8 }}>
                        <BookOpen size={16} color="var(--color-accent)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{stats.works}</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>بحث وكتاب</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.8 }}>
                        <GraduationCap size={16} color="var(--color-accent)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{stats.students}</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>باحث</span>
                    </div>
                </div>
            </div>

            {/* Texture overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.05,
                pointerEvents: 'none',
                background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")'
            }}></div>
        </div>
    );
};

export default HeroSection;
