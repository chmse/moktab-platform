import HeroSection from '../components/home/HeroSection';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <HeroSection onSearch={() => { }} />

      {/* Entrance Hub Section - 3D Glassmorphism */}
      <div style={{
        background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
        padding: '5rem 0',
        position: 'relative'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', textAlign: 'center', marginBottom: '3.5rem', color: '#1a1a1a' }}>
            بوابة الدخول
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <Link to="/hub/production" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '2.5rem',
                borderRadius: '20px',
                border: '1px solid #c5a059',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                height: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transform: 'translateY(0)',
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>📚</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>الإنتاج العلمي</h3>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  تصفح أحدث المقالات والكتب الأكاديمية لأساتذة المعهد
                </p>
              </div>
            </Link>
            <Link to="/hub/environment" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '2.5rem',
                borderRadius: '20px',
                border: '1px solid #c5a059',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                height: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transform: 'translateY(0)',
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>🎓</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>البيئة الأكاديمية</h3>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  تعرف على القامات العلمية والأساتذة الباحثين بالمعهد
                </p>
              </div>
            </Link>
            <Link to="/hub/research" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '2.5rem',
                borderRadius: '20px',
                border: '1px solid #c5a059',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                height: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transform: 'translateY(0)',
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>🔬</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>البحث والتطوير</h3>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  استكشف المخابر العلمية والمشاريع البحثية المبتكرة
                </p>
              </div>
            </Link>
            <Link to="/hub/ai" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '2.5rem',
                borderRadius: '20px',
                border: '1px solid #c5a059',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                height: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transform: 'translateY(0)',
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>🤖</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>الذكاء الاصطناعي</h3>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  أدوات التحليل الذكي ومعالجة اللغة العربية آلياً
                </p>
              </div>
            </Link>
            <Link to="/hub/activities" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '2.5rem',
                borderRadius: '20px',
                border: '1px solid #c5a059',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                height: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transform: 'translateY(0)',
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>📅</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>الأنشطة</h3>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  متابعة أجندة الفعاليات والملتقيات العلمية بالمعهد
                </p>
              </div>
            </Link>
            <Link to="/hub/about" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '2.5rem',
                borderRadius: '20px',
                border: '1px solid #c5a059',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                height: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transform: 'translateY(0)',
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>🏛️</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>عن المنصة</h3>
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  تعرف على رؤية مَنْصَة مَكْتَب وأهدافها الاستراتيجية
                </p>
              </div>
            </Link>
          </div>
        </div>

        <style>{`
          .card-hover:hover {
            transform: translateY(-12px) !important;
            box-shadow: 0 25px 50px rgba(197, 160, 89, 0.3) !important;
          }
        `}</style>
      </div>

      {/* Research Cloud Section */}
      <div style={{ backgroundColor: 'white', padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', textAlign: 'center', marginBottom: '2rem', color: '#1a1a1a' }}>
            التخصصات البارزة
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {['اللسانيات', 'التداولية', 'البلاغة', 'النقد الأدبي', 'الشعر العربي', 'تعليمية اللغات', 'فقه اللغة'].map((tag, idx) => (
              <div key={idx} className="card-hover" style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                border: '1px solid #c5a059',
                borderRadius: '100px',
                color: 'var(--color-primary)',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(197, 160, 89, 0.1)'
              }}>
                #{tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section - Institutional Mission */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: '900', textAlign: 'center', marginBottom: '3rem', color: '#1a1a1a' }}>
            رسالتنا المؤسسية
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: '#c5a059' }}>التوثيق العلمي</h3>
              <p style={{ color: '#666', lineHeight: '1.8', fontSize: '0.95rem' }}>
                نوفر منصة موثوقة لحفظ ونشر الأبحاث والأعمال العلمية بأعلى معايير الجودة
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: '#c5a059' }}>الذكاء الاصطناعي</h3>
              <p style={{ color: '#666', lineHeight: '1.8', fontSize: '0.95rem' }}>
                نستخدم أحدث تقنيات الذكاء الاصطناعي لتحليل المحتوى وتقديم توصيات ذكية
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: '#c5a059' }}>التفاعل العلمي</h3>
              <p style={{ color: '#666', lineHeight: '1.8', fontSize: '0.95rem' }}>
                نشجع الحوار البناء والتعاون بين الباحثين والأساتذة في مختلف التخصصات
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
