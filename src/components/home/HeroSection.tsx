import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
    onSearch: (term: string) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
    const navigate = useNavigate();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/search?q=${(e.target as HTMLInputElement).value}`);
        }
    };
    return (
        <div className="hero-section-container" style={{
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
                {/* Centered Logo & Title */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '900',
                        color: '#c5a059',
                        marginBottom: '1rem',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}>
                        MOKTAB ACADEMIC
                    </div>
                    <h1 className="hero-title text-responsive-title" style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        marginBottom: '1rem',
                        lineHeight: 1.1,
                        color: 'white',
                        textShadow: '0 10px 30px rgba(0,0,0,0.4)'
                    }}>
                        مَنْصَة مَكْتَب الأكاديمية
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        opacity: 0.9,
                        maxWidth: '700px',
                        margin: '0 auto',
                        fontWeight: '500',
                        color: 'rgba(255,255,255,0.7)'
                    }}>
                        قاعدة البيانات المركزية للنتاج العلمي والبحثي المحكم
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
                @media (max-width: 768px) {
                    .hero-section-container {
                        padding-top: 80px !important;
                    }
                    .hero-title {
                        font-size: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default HeroSection;
