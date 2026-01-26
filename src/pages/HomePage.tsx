import HeroSection from '../components/home/HeroSection';
import InstituteStats from '../components/home/InstituteStats';
import ProfessorCard from '../components/common/ProfessorCard';
import { professors } from '../data/mockData';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <InstituteStats />

      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>نخبة الأساتذة</h2>
          <a href="/professors" style={{ color: 'var(--color-accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            عرض الكل &larr;
          </a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {professors.slice(0, 3).map((professor) => (
            <ProfessorCard key={professor.id} professor={professor} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
