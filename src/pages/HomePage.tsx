import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import HeroSection from '../components/home/HeroSection';
import ProfessorCard from '../components/common/ProfessorCard';
import StudentCard from '../components/common/StudentCard';
import WorkCard from '../components/works/WorkCard';
import TopicCard from '../components/community/TopicCard';
import { Users, BookOpen, MessageSquare, GraduationCap } from 'lucide-react';

const HomePage = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [stats, setStats] = useState({ professors: 0, students: 0, works: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

        // Helper to fetch valid data with fallback
        const fetchWithFallback = async (table: string, role?: string) => {
          let query = supabase.from(table).select('*');
          if (role) query = query.eq('role', role);
          // Try fetching approved
          const { data: approvedData } = await query.eq('status', 'approved').order('created_at', { ascending: false });

          if (approvedData && approvedData.length > 0) return approvedData;

          // Fallback: fetch all if no approved data found
          console.log(`HomePage: No approved data for ${table} ${role || ''}, using fallback.`);
          let fallbackQuery = supabase.from(table).select('*');
          if (role) fallbackQuery = fallbackQuery.eq('role', role);
          const { data: allData } = await fallbackQuery.order('created_at', { ascending: false });
          return allData;
        };

        // 1. Elite Faculty
        const facultyData = await fetchWithFallback('profiles', 'professor');

        // 2. Latest Research
        // (For works, we assume 'status' column exists, if not we might need adjustment. 
        // Based on user request, we try approved first)
        let researchData: any[] | null = null;
        const { data: approvedWorks } = await supabase
          .from('works')
          .select(`*, profiles:professor_id (full_name, avatar_url)`)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (approvedWorks && approvedWorks.length > 0) {
          researchData = approvedWorks;
        } else {
          const { data: allWorks } = await supabase
            .from('works')
            .select(`*, profiles:professor_id (full_name, avatar_url)`)
            .order('created_at', { ascending: false });
          researchData = allWorks;
        }

        // 3. Scientific Discourse
        // (Similar logic for topics if 'status' exists, otherwise just fetch)
        const { data: topicsData } = await supabase
          .from('community_topics')
          .select(`*, profiles:author_id (full_name)`)
          .order('created_at', { ascending: false });

        // 4. New Researchers
        const studentsData = await fetchWithFallback('profiles', 'student');

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

  const filteredFaculty = faculty.filter(f => f.full_name?.includes(searchTerm)).slice(0, 4);
  const filteredResearch = research.filter(r => r.title?.includes(searchTerm)).slice(0, 3);
  const filteredTopics = topics.filter(t => t.title?.includes(searchTerm)).slice(0, 2);
  const filteredStudents = studentsList.filter(s => s.full_name?.includes(searchTerm)).slice(0, 4);

  const EmptyState = ({ message }: { message: string }) => (
    <div style={{
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: 'white',
      borderRadius: 'var(--radius-md)',
      border: '1px dashed var(--color-accent)',
      color: 'var(--color-primary)',
      fontWeight: 'bold'
    }}>
      {message}
    </div>
  );

  const SectionHeader = ({ title, link, icon: Icon }: { title: string, link: string, icon: any }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Icon size={20} color="var(--color-accent)" />
        <h2 style={{ fontSize: '1.25rem', color: '#1E293B', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h2>
      </div>
      <a href={link} style={{ color: 'var(--color-text-secondary)', fontWeight: 'bold', fontSize: '0.85rem' }}>
        عرض الكل
      </a>
    </div>
  );

  return (
    <>
      <HeroSection stats={stats} onSearch={setSearchTerm} />

      <div style={{ backgroundColor: '#F8FAFC', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
              {/* Left Column: Research & Discourse */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <section>
                  <SectionHeader title="آخر الأبحاث والأعمال" link="/works" icon={BookOpen} />
                  {loading ? (
                    <div className="animate-pulse" style={{ height: '300px', backgroundColor: 'white', borderRadius: 'var(--radius-md)' }}></div>
                  ) : filteredResearch.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                      {filteredResearch.map((work) => (
                        <WorkCard key={work.id} work={work} variant="mini" />
                      ))}
                    </div>
                  ) : <EmptyState message="لا توجد أبحاث منشورة حالياً" />}
                </section>

                <section>
                  <SectionHeader title="النقاش العلمي" link="/community" icon={MessageSquare} />
                  {loading ? (
                    <div className="animate-pulse" style={{ height: '200px', backgroundColor: 'white', borderRadius: 'var(--radius-md)' }}></div>
                  ) : filteredTopics.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                      {filteredTopics.map((topic) => (
                        <TopicCard key={topic.id} topic={topic} />
                      ))}
                    </div>
                  ) : <EmptyState message="لا توجد نقاشات علمية حالياً" />}
                </section>
              </div>

              {/* Right Column: Faculty & Students */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <section>
                  <SectionHeader title="بيئة بحثية للنخبة" link="/professors" icon={Users} />
                  {loading ? (
                    <div className="animate-pulse" style={{ height: '350px', backgroundColor: 'white', borderRadius: 'var(--radius-md)' }}></div>
                  ) : filteredFaculty.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '1.25rem'
                    }}>
                      {filteredFaculty.map((professor) => (
                        <ProfessorCard key={professor.id} professor={professor} variant="mini" />
                      ))}
                    </div>
                  ) : <EmptyState message="لا يوجد أساتذة مضافون حالياً" />}
                </section>

                <section>
                  <SectionHeader title="الباحثون المنضمون" link="/students" icon={GraduationCap} />
                  {loading ? (
                    <div className="animate-pulse" style={{ height: '250px', backgroundColor: 'white', borderRadius: 'var(--radius-md)' }}></div>
                  ) : filteredStudents.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '1.25rem'
                    }}>
                      {filteredStudents.map((student) => (
                        <StudentCard key={student.id} student={student} />
                      ))}
                    </div>
                  ) : <EmptyState message="لا يوجد باحثون مضافون حالياً" />}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
