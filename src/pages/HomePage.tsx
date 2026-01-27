import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import HeroSection from '../components/home/HeroSection';
import InstituteStats from '../components/home/InstituteStats';
import ProfessorCard from '../components/common/ProfessorCard';
import StudentCard from '../components/common/StudentCard';
import WorkCard from '../components/works/WorkCard';
import TopicCard from '../components/community/TopicCard';
import { ArrowLeft, Users, BookOpen, MessageSquare, GraduationCap } from 'lucide-react';

const HomePage = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Elite Faculty (Last 4 approved professors)
        const { data: facultyData } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'professor')
          .order('created_at', { ascending: false })
          .limit(4);

        // 2. Latest Research (Last 3 works)
        const { data: researchData } = await supabase
          .from('works')
          .select(`
            *,
            profiles:professor_id (full_name, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        // 3. Scientific Discourse (Top 2 active community topics)
        // We'll use created_at for "Latest" as requested in ordering reminder: "order by 'created_at' descending"
        const { data: topicsData } = await supabase
          .from('community_topics')
          .select(`
            *,
            profiles:author_id (full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(2);

        // 4. New Researchers (Last 4 joined students)
        const { data: studentsData } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'student')
          .order('created_at', { ascending: false })
          .limit(4);

        if (facultyData) setFaculty(facultyData);
        if (researchData) setResearch(researchData.map(w => ({
          ...w,
          professorName: w.profiles?.full_name || 'أستاذ غير معروف',
          professorImageUrl: w.profiles?.avatar_url,
          publishDate: w.publish_date || w.publishDate || new Date(w.created_at).toLocaleDateString('ar-EG'),
        })));
        if (topicsData) setTopics(topicsData.map(t => ({
          ...t,
          authorName: t.profiles?.full_name || 'مستخدم مجهول',
          date: new Date(t.created_at).toLocaleDateString('ar-EG')
        })));
        if (studentsData) setStudentsList(studentsData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const EmptyState = ({ message }: { message: string }) => (
    <div style={{
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--color-accent)',
      color: 'var(--color-primary)',
      fontWeight: 'bold'
    }}>
      {message}
    </div>
  );

  const SectionHeader = ({ title, link, icon: Icon }: { title: string, link: string, icon: any }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '2px solid var(--color-surface-alt)', paddingBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ backgroundColor: 'var(--color-primary)', padding: '0.6rem', borderRadius: 'var(--radius-md)', color: 'white' }}>
          <Icon size={24} />
        </div>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', fontWeight: '800' }}>{title}</h2>
      </div>
      <a href={link} style={{ color: 'var(--color-accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
        استكشاف الكل <ArrowLeft size={18} />
      </a>
    </div>
  );

  return (
    <>
      <HeroSection />
      <InstituteStats />

      <div style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <div className="container">
          {/* Elite Faculty */}
          <section style={{ marginBottom: '6rem' }}>
            <SectionHeader title="نخبة الأساتذة" link="/professors" icon={Users} />
            {loading ? (
              <div className="animate-pulse" style={{ height: '300px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}></div>
            ) : faculty.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
              }}>
                {faculty.map((professor) => (
                  <ProfessorCard key={professor.id} professor={professor} />
                ))}
              </div>
            ) : <EmptyState message="سيتم إضافة المحتوى قريباً" />}
          </section>

          {/* Latest Research */}
          <section style={{ marginBottom: '6rem' }}>
            <SectionHeader title="أحدث البحوث والمؤلفات" link="/works" icon={BookOpen} />
            {loading ? (
              <div className="animate-pulse" style={{ height: '350px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}></div>
            ) : research.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2.5rem'
              }}>
                {research.map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            ) : <EmptyState message="سيتم إضافة المحتوى قريباً" />}
          </section>

          {/* Scientific Discourse */}
          <section style={{ marginBottom: '6rem' }}>
            <SectionHeader title="المجالس العلمية النشطة" link="/community" icon={MessageSquare} />
            {loading ? (
              <div className="animate-pulse" style={{ height: '250px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}></div>
            ) : topics.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {topics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            ) : <EmptyState message="سيتم إضافة المحتوى قريباً" />}
          </section>

          {/* New Researchers */}
          <section>
            <SectionHeader title="الباحثون الجدد" link="/students" icon={GraduationCap} />
            {loading ? (
              <div className="animate-pulse" style={{ height: '280px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}></div>
            ) : studentsList.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
              }}>
                {studentsList.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            ) : <EmptyState message="سيتم إضافة المحتوى قريباً" />}
          </section>
        </div>
      </div>
    </>
  );
};

export default HomePage;
