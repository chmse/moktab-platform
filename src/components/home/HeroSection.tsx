import { Search, Users, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
    stats: {
        professors: number;
        students: number;
        works: number;
    };
    onSearch: (term: string) => void;
}

const HeroSection = ({ stats, onSearch }: HeroSectionProps) => {
    const navigate = useNavigate();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/search?q=${(e.target as HTMLInputElement).value}`);
        }
    };
    return (
        <div style={{
            backgroundColor: '#000033',
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.05) 0%, transparent 100%)',
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
                    <h1 className="hero-title text-responsive-title" style={{
                        fontWeight: '900',
                        marginBottom: '0.5rem',
                        lineHeight: 1.2,
                        letterSpacing: '-1px'
                    }}>
                        مَنْصَة مَكْتَب الأكاديمية
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: '600px', margin: '0 auto' }}>
                        الأرشيف الجامعي الشامل للنتاج العلمي والمعالجات الأكاديمية
                    </p>
                </div>

                <div className="w-full-mobile" style={{
                    maxWidth: '650px',
                    margin: '0 auto 2.5rem',
                    position: 'relative',
                }}>
                    <input
                        type="text"
                        placeholder="ابحث عن اسم أستاذ، عنوان بحث، أو كلمة مفتاحية..."
                        onChange={(e) => onSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        style={{
                            width: '100%',
                            padding: '1.25rem 3.5rem 1.25rem 1.5rem',
                            borderRadius: '16px',
                            border: '2px solid #c5a059',
                            boxShadow: '0 0 20px rgba(197, 160, 89, 0.3), inset 0 0 20px rgba(0,0,0,0.3)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.target.style.borderColor = '#c5a059';
                            e.target.style.boxShadow = '0 0 30px rgba(197, 160, 89, 0.5), inset 0 0 20px rgba(0,0,0,0.3)';
                        }}
                        onBlur={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            e.target.style.borderColor = '#c5a059';
                            e.target.style.boxShadow = '0 0 20px rgba(197, 160, 89, 0.3), inset 0 0 20px rgba(0,0,0,0.3)';
                        }}
                    />
                    <Search style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.7, color: '#c5a059' }} size={20} />
                </div>

                {/* Minimalist Stats Cards */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    padding: '0',
                    maxWidth: '700px',
                    margin: '0 auto',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(197, 160, 89, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        minWidth: '140px',
                        flex: '1 1 140px', /* Allow flex shrink/grow */
                    }}>
                        <Users size={20} color="#c5a059" />
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c5a059' }}>{stats.professors}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>أستاذ</div>
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(197, 160, 89, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        minWidth: '140px',
                        flex: '1 1 140px'
                    }}>
                        <BookOpen size={20} color="#c5a059" />
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c5a059' }}>{stats.works}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>بحث وكتاب</div>
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(197, 160, 89, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        minWidth: '140px',
                        flex: '1 1 140px'
                    }}>
                        <GraduationCap size={20} color="#c5a059" />
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c5a059' }}>{stats.students}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>باحث</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle texture overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.03,
                pointerEvents: 'none',
                background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")'
            }}></div>

            <style>{`
                .hero-title {
                    font-size: 2.5rem;
                }
            `}</style>
        </div>
    );
};

export default HeroSection;
