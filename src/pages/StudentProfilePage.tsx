import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Building2, Mail, ExternalLink, Calendar, BookOpen, Target, Award, User, ChevronRight, HelpCircle } from 'lucide-react';
import type { Student, Professor } from '../data/mockData';

const StudentProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const [student, setStudent] = useState<Student | null>(null);
    const [supervisor, setSupervisor] = useState<Professor | null>(null);
    const [myQuestions, setMyQuestions] = useState<any[]>([]);
    const [myTopics, setMyTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);

            // Fetch Student Profile
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (data && !error) {
                const mappedStudent: Student = {
                    id: data.id,
                    name: data.full_name || 'طالب مجهول',
                    level: (data.level?.charAt(0).toUpperCase() + data.level?.slice(1)) as any || 'Master',
                    department: data.department || 'القسم العلمي',
                    specialty: data.specialty,
                    imageUrl: data.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400',
                    interests: Array.isArray(data.interests) ? data.interests : [],
                    bio: data.bio || '',
                    skills: Array.isArray(data.skills) ? data.skills : [],
                    timeline: Array.isArray(data.timeline) ? data.timeline : [],
                    supervisorId: data.supervisor_id
                };
                setStudent(mappedStudent);

                // Fetch My Questions (Comments)
                const { data: questions } = await supabase
                    .from('comments')
                    .select('*, community_topics(title)')
                    .eq('user_id', id)
                    .limit(5);
                if (questions) setMyQuestions(questions);

                // Fetch My Topics
                const { data: topics } = await supabase
                    .from('community_topics')
                    .select('*')
                    .eq('author_id', id)
                    .limit(5);
                if (topics) setMyTopics(topics);

                // Fetch Supervisor if exists
                if (data.supervisor_id) {
                    const { data: supervisorData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.supervisor_id)
                        .single();

                    if (supervisorData) {
                        setSupervisor({
                            id: supervisorData.id,
                            name: supervisorData.full_name,
                            title: supervisorData.rank,
                            department: supervisorData.department,
                            imageUrl: supervisorData.avatar_url,
                            interests: [],
                            courses: []
                        });
                    }
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '10rem 1rem', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    جاري تحميل ملف الطالب العلمي...
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="container" style={{ padding: '10rem 1rem', textAlign: 'center' }}>
                <h2>عذراً، لم يتم العثور على الملف الشخصي.</h2>
                <Link to="/students" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>العودة لقائمة الطلاب</Link>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#fcfcfd', minHeight: '100vh', paddingBottom: '5rem' }}>
            {/* Creative Header Gradient */}
            <div style={{
                height: '350px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #dbeafe 100%)',
                position: 'relative'
            }}>
                <div className="container" style={{ position: 'relative', height: '100%' }}>
                    <div style={{ position: 'absolute', top: '120px', left: '1rem' }}>
                        <Link to="/students" style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            <ChevronRight size={18} /> العودة للطلاب
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-150px', position: 'relative', zIndex: 10, padding: '0 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2.5rem' }}>

                    {/* Main Content */}
                    <div>
                        {/* Profile Summary Card */}
                        <div className="glass-panel" style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '180px', height: '180px', borderRadius: '30px', overflow: 'hidden', border: '6px solid white', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', flexShrink: 0
                                }}>
                                    <img src={student.imageUrl} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h1 style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--color-primary)', margin: 0 }}>{student.name}</h1>
                                        <span style={{ backgroundColor: 'rgba(197, 160, 89, 0.1)', color: '#c5a059', padding: '0.5rem 1.25rem', borderRadius: '999px', fontSize: '1rem', fontWeight: '800', border: '1px solid rgba(197,160,89,0.3)' }}>
                                            {student.level.toString().toLowerCase() === 'phd' ? 'باحث دكتوراه' : student.level.toString().toLowerCase() === 'master' ? 'طالب ماجستير' : 'طالب ليسانس'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                            <Building2 size={20} /> {student.department}
                                        </p>
                                        {student.specialty && (
                                            <p style={{ fontSize: '1.1rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontWeight: '700' }}>
                                                <Target size={20} /> تخصص: {student.specialty}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.8rem' }}>
                                            <Mail size={18} /> مراسلة الطالب
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <section className="glass-panel" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <BookOpen size={20} color="var(--color-accent)" /> مواضيعي المنشورة
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {myTopics.length > 0 ? myTopics.map(topic => (
                                        <Link key={topic.id} to={`/community/topic/${topic.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }} className="card-hover">
                                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>{topic.title}</h4>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{new Date(topic.created_at).toLocaleDateString('ar-EG')}</span>
                                            </div>
                                        </Link>
                                    )) : (
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>لم يتم نشر مواضيع بعد.</p>
                                    )}
                                </div>
                            </section>

                            <section className="glass-panel" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <HelpCircle size={20} color="var(--color-accent)" /> أسئلتي ونقاشاتي
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {myQuestions.length > 0 ? myQuestions.map(q => (
                                        <div key={q.id} style={{ padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600' }}>{q.content}</p>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>في: {q.community_topics?.title}</span>
                                        </div>
                                    )) : (
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>لا توجد أسئلة مسجلة.</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Academic Journey Timeline */}
                        <section className="glass-panel" style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Calendar size={24} color="var(--color-accent)" /> المسار الأكاديمي
                            </h2>

                            <div style={{ position: 'relative', paddingRight: '2.5rem' }}>
                                <div style={{ position: 'absolute', right: '10px', top: '0', bottom: '0', width: '2px', backgroundColor: '#e2e8f0' }}></div>

                                {student.timeline && student.timeline.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                        {student.timeline.map((item) => (
                                            <div key={item.id} style={{ position: 'relative' }}>
                                                <div style={{ position: 'absolute', right: '-35px', top: '5px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', border: '4px solid #c5a059', zIndex: 2 }}></div>
                                                <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#c5a059', display: 'block', marginBottom: '0.25rem' }}>{item.year}</span>
                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{item.level}</h3>
                                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', margin: 0 }}>{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                        يتم حالياً تحديث تفاصيل المسار الأكاديمي...
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* About Section */}
                        <section className="glass-panel" style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <User size={24} color="var(--color-accent)" /> السيرة العلمية
                            </h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-primary)' }}>
                                {student.bio || `طالب علم متميز في ${student.department}، يسعى للمساهمة في البحث العلمي وتطوير المعرفة الأكاديمية.`}
                            </p>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside>
                        {/* Research Interests */}
                        <div className="glass-panel" style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Target size={20} color="var(--color-accent)" /> الاهتمامات البحثية
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {student.interests.map((interest, idx) => (
                                    <span key={idx} style={{ backgroundColor: 'rgba(26, 35, 126, 0.03)', color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid rgba(26, 35, 126, 0.08)' }}>
                                        #{interest}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="glass-panel" style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Award size={20} color="var(--color-accent)" /> المهارات العلمية
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {(student.skills && student.skills.length > 0 ? student.skills : ['البحث العلمي', 'التحليل النقدي', 'الكتابة الأكاديمية']).map((skill, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#c5a059' }}></div>
                                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Supervision */}
                        {supervisor ? (
                            <div className="glass-panel" style={{ backgroundColor: '#c5a059', color: 'var(--color-primary)', padding: '1.8rem', borderRadius: '20px', boxShadow: '0 15px 30px rgba(197, 160, 89, 0.2)', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BookOpen size={20} /> تحت إشراف الأستاذ
                                </h3>
                                <Link to={`/professors/${supervisor.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="card-hover">
                                        <div style={{ width: '60px', height: '60px', borderRadius: '15px', overflow: 'hidden', border: '3px solid rgba(26,35,126,0.1)' }}>
                                            <img src={supervisor.imageUrl} alt={supervisor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>{supervisor.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700' }}>{supervisor.title}</p>
                                        </div>
                                        <ExternalLink size={18} style={{ marginRight: 'auto' }} />
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="glass-panel" style={{ backgroundColor: '#1a237e', color: 'white', padding: '1.8rem', borderRadius: '20px', boxShadow: '0 15px 30px rgba(26, 35, 126, 0.2)', marginBottom: '2rem' }}>
                                <p style={{ margin: 0, fontSize: '0.95rem', textAlign: 'center', opacity: 0.8 }}>لم يتم تحديد الأستاذ المشرف بعد.</p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .container > div {
                        grid-template-columns: 1fr !important;
                    }
                    aside {
                        order: 2;
                    }
                }
                @media (max-width: 768px) {
                    .container { margin-top: -100px !important; }
                    .glass-panel { padding: 1.5rem !important; }
                    .glass-panel > div { flex-direction: column !important; text-align: center !important; gap: 1.5rem !important; }
                    .profile-avatar { width: 140px !important; height: 140px !important; margin: 0 auto !important; }
                    h1 { font-size: 1.8rem !important; }
                }
            `}</style>
        </div>
    );
};

export default StudentProfilePage;
