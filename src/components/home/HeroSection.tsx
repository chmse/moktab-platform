import { Search } from 'lucide-react';

const HeroSection = () => {
    return (
        <div className="bg-pattern" style={{
            color: 'white',
            padding: '6rem 1rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '800',
                    marginBottom: '1.5rem',
                    lineHeight: 1.2,
                    textShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                    منصة مكتب
                    <br />
                    <span style={{ fontSize: '2rem', fontWeight: '400', color: 'var(--color-accent)' }}>
                        الأرشيف العلمي والأكاديمي للمعهد
                    </span>
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    maxWidth: '700px',
                    margin: '0 auto 3rem',
                    color: 'rgba(255,255,255,0.9)'
                }}>
                    منصة رقمية شاملة تجمع النتاج العلمي للأكاديميين والباحثين، وتوفر وصولاً سهلاً للمعرفة المتخصصة.
                </p>

                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    position: 'relative',
                    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
                    borderRadius: '50px'
                }}>
                    <input
                        type="text"
                        placeholder="ابحث عن أستاذ، بحث، أو موضوع..."
                        style={{
                            width: '100%',
                            padding: '1.25rem 3.5rem 1.25rem 2rem',
                            borderRadius: '50px',
                            border: '2px solid transparent',
                            fontSize: '1.1rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                    <button style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'var(--color-accent)',
                        color: 'var(--color-primary-dark)',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s'
                    }}>
                        <Search size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
