import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import HeroSection from '../components/home/HeroSection';

const HomePage = () => {
  const [stats, setStats] = useState({ professors: 0, students: 0, works: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('HomePage: Supabase Connection Success - Starting data fetch');
        // Fetch Stats
        const [profResult, studResult, workResult] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'professor'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
          supabase.from('works').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          professors: profResult.count || 0,
          students: studResult.count || 0,
          works: workResult.count || 0
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HeroSection stats={stats} onSearch={() => { }} />

      {/* Entrance Hub Section - Institutional Minimalist */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: '900', textAlign: 'center', marginBottom: '3rem', color: '#1a1a1a' }}>
            بوابة الدخول
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <Link to="/works" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #c5a059',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>المكتبة الرقمية</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  تصفح أحدث المقالات والكتب الأكاديمية لأساتذة معهد الآداب واللغات
                </p>
              </div>
            </Link>
            <Link to="/professors" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #c5a059',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>هيئة التدريس</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  تعرف على القامات العلمية والأساتذة الباحثين بمعهد الآداب واللغات
                </p>
              </div>
            </Link>
            <Link to="/community" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #c5a059',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                height: '100%'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>رواق الحوار</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.7' }}>
                  ملتقى طلبة وأساتذة معهد الآداب واللغات للنقاش العلمي المرقّى
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Research Cloud Section */}
      <div style={{ backgroundColor: 'white', padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', textAlign: 'center', marginBottom: '2rem', color: '#1a1a1a' }}>
            التخصصات البارزة
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {['القانون', 'الأدب', 'الذكاء_الاصطناعي', 'الفقه', 'التاريخ', 'اللغة_العربية'].map((tag, idx) => (
              <div key={idx} className="card-hover" style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f8f9fa',
                border: '2px solid #c5a059',
                borderRadius: '100px',
                color: '#1a1a1a',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
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
