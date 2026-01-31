import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Building2, BookOpen, GraduationCap, ChevronRight, Book, Presentation, Download } from 'lucide-react';
import type { Professor } from '../data/mockData';

const ProfessorProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'research' | 'teaching'>('research');
    const [activeCategory, setActiveCategory] = useState<'ALL' | 'Article' | 'Book' | 'Conference'>('ALL');
    const [professor, setProfessor] = useState<Professor | null>(null);
    const [professorWorks, setProfessorWorks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);

            console.log('Fetching profile for Professor ID:', id);

            // Fetch Professor Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (profileError) console.error('Supabase Profile fetch error:', profileError);
            console.log('Profile Data result:', profileData);

            if (profileData && !profileError) {
                const mappedProfessor: Professor = {
                    id: profileData.id,
                    name: profileData.full_name || 'أستاذ غير معروف',
                    title: profileData.rank || 'عضو هيئة تدريس',
                    department: profileData.department || 'القسم العلمي',
                    imageUrl: profileData.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
                    interests: Array.isArray(profileData.interests) ? profileData.interests : [],
                    courses: [],
                    ...profileData
                };
                setProfessor(mappedProfessor);

                // Fetch Professor Works
                const { data: worksData, error: worksError } = await supabase
                    .from('works')
                    .select('*')
                    .eq('professor_id', id);

                if (worksError) console.error('Supabase Works fetch error:', worksError);
                console.log('Works Data count:', worksData?.length || 0, worksData);

                if (worksData && !worksError) {
                    setProfessorWorks(worksData.map(w => ({
                        ...w,
                        id: w.id,
                        professorId: w.professor_id,
                        publishDate: w.publish_date || w.publishDate, // Support both snake and camel
                    })));
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '3rem 1rem', paddingTop: '100px', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    جاري تحميل ملف الأستاذ...
                </div>
            </div>
        );
    }

    if (!professor) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>الأستاذ غير موجود</h2>
                <Link to="/professors" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>العودة إلى القائمة</Link>
            </div>
        );
    }

    const filteredWorks = activeCategory === 'ALL'
        ? professorWorks
        : professorWorks.filter(w => w.category === activeCategory);

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Premium Cover Section */}
            <div className="bg-pattern" style={{
                height: '250px',
                position: 'relative',
                borderBottom: '4px solid var(--color-accent)'
            }}>
                <div className="container" style={{ height: '100%', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '2rem', right: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                        <Link to={professor.role === 'student' ? "/students" : "/professors"} style={{ display: 'flex', alignItems: 'center', color: 'inherit', fontSize: '0.9rem' }}>
                            <ChevronRight size={16} />
                            {professor.role === 'student' ? 'العودة إلى قائمة الطلاب' : 'العودة إلى قائمة الأساتذة'}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container animate-fade-in" style={{ padding: '0 1rem', position: 'relative' }}>
                {/* Profile Header */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '-80px', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{
                            width: '180px',
                            height: '180px',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            border: '4px solid white',
                            boxShadow: 'var(--shadow-lg)',
                            backgroundColor: 'white'
                        }}>
                            <img src={professor.imageUrl} alt={professor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ paddingBottom: '0.5rem', flex: 1 }}>
                            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                {professor.name}
                            </h1>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <GraduationCap size={20} color="var(--color-accent)" />
                                    {professor.role === 'student' ? (
                                        professor.level === 'licence' ? 'طالب ليسانس' :
                                            professor.level === 'master' ? 'طالب ماجستير' :
                                                professor.level === 'phd' ? 'طالب دكتوراه' : professor.level || 'طالب علم'
                                    ) : professor.title}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Building2 size={20} color="var(--color-accent)" />
                                    {professor.department}
                                </span>
                            </div>
                        </div>

                        <div style={{ paddingBottom: '1rem' }}>
                            <button className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={18} />
                                تواصل مع {professor.role === 'student' ? 'الطالب' : 'الأستاذ'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '3rem', alignItems: 'start' }}>
                    <div>
                        {/* Bio / About */}
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                                {professor.role === 'student' ? 'نبذة عن الطالب' : 'نبذة عن الأستاذ'}
                            </h2>
                            <p style={{ lineHeight: '1.8', color: 'var(--color-text-primary)', fontSize: '1.1rem' }}>
                                {professor.bio || `${professor.name} ${professor.role === 'student' ? 'طالب مجتهد' : 'أحد أبرز الأكاديميين'} في ${professor.department}. ${professor.role === 'student' ? 'يسعى لتطوير مهاراته العلمية' : 'يتميز بمسيرة علمية حافلة بالعطاء والبحث العلمي الجاد'}. يهتم بشكل خاص بمجالات ${professor.interests && professor.interests.length > 0 ? professor.interests.join(" و ") : 'البحث العلمي'}.`}
                            </p>
                        </section>

                        {/* Conditional Sections for Students vs Professors */}
                        {professor.role === 'student' ? (
                            <section className="animate-fade-in">
                                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                                    الاهتمامات الأكاديمية والمشاريع
                                </h2>
                                <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                                    <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                        يركز {professor.name} حالياً على أبحاثه في مستوى {professor.level} ضمن تخصص {professor.department}.
                                        يشارك الطالب بفعالية في النقاشات العلمية ضمن المجتمع الأكاديمي للمنصة.
                                    </p>
                                    <div style={{ marginTop: '2rem' }}>
                                        <Link to="/community" className="btn-premium" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <BookOpen size={18} />
                                            عرض مساهمات المجتمع
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <>
                                {/* Main Tabs for Professors */}
                                <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--color-border)', marginBottom: '2rem' }}>
                                    <button
                                        onClick={() => setActiveTab('research')}
                                        style={{
                                            padding: '1rem 2rem',
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            color: activeTab === 'research' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                            borderBottom: activeTab === 'research' ? '3px solid var(--color-primary)' : '3px solid transparent',
                                            marginBottom: '-2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Book size={20} />
                                        النتاج العلمي
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('teaching')}
                                        style={{
                                            padding: '1rem 2rem',
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            color: activeTab === 'teaching' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                            borderBottom: activeTab === 'teaching' ? '3px solid var(--color-primary)' : '3px solid transparent',
                                            marginBottom: '-2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Presentation size={20} />
                                        التدريس
                                    </button>
                                </div>

                                {/* Research Tab Content */}
                                {activeTab === 'research' && (
                                    <section className="animate-fade-in">
                                        {/* Sub-tabs */}
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                                            {[
                                                { id: 'ALL', label: 'الكل' },
                                                { id: 'Article', label: 'مقالات وأبحاث' },
                                                { id: 'Book', label: 'كتب ومؤلفات' },
                                                { id: 'Conference', label: 'مداخلات في مؤتمرات' }
                                            ].map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setActiveCategory(cat.id as any)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.9rem',
                                                        backgroundColor: activeCategory === cat.id ? 'var(--color-primary)' : 'var(--color-surface)',
                                                        color: activeCategory === cat.id ? 'white' : 'var(--color-text-primary)',
                                                        border: '1px solid var(--color-border)',
                                                        transition: 'all 0.2s',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>

                                        {filteredWorks.length > 0 ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: activeCategory === 'Book' ? 'repeat(auto-fill, minmax(180px, 1fr))' : '1fr', gap: '1.5rem' }}>
                                                {filteredWorks.map(work => (
                                                    activeCategory === 'Book' || work.category === 'Book' ? (
                                                        <Link to={`/works/${work.id}`} key={work.id} style={{ textDecoration: 'none' }}>
                                                            <div className="book-cover" style={{
                                                                aspectRatio: '2/3',
                                                                backgroundImage: work.cover_url ? `url(${work.cover_url})` : undefined,
                                                                backgroundSize: 'cover',
                                                                backgroundPosition: 'center',
                                                                display: work.cover_url ? 'block' : 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                padding: '1rem',
                                                                textAlign: 'center',
                                                                backgroundColor: 'var(--color-primary)'
                                                            }}>
                                                                {!work.cover_url && (
                                                                    <div>
                                                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'white' }}>{work.title}</h3>
                                                                        <span style={{ fontSize: '0.8rem', opacity: 0.8, color: 'white' }}>{work.publishDate}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-primary)', fontWeight: 'bold' }}>{work.title}</p>
                                                        </Link>
                                                    ) : (
                                                        <div key={work.id} className="card-hover" style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                                                                    <Link to={`/works/${work.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{work.title}</Link>
                                                                </h3>
                                                                <span style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                                                                    {work.category === 'Article' ? 'بحث' : work.category === 'Conference' ? 'مؤتمر' : 'كتاب'}
                                                                </span>
                                                            </div>
                                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                                                                {work.abstract}
                                                            </p>
                                                            <Link to={`/works/${work.id}`} style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                                                قراءة المزيد <ChevronRight size={16} />
                                                            </Link>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                                                لا توجد أعمال في هذا التصنيف حالياً.
                                            </p>
                                        )}
                                    </section>
                                )}

                                {/* Teaching Tab Content */}
                                {activeTab === 'teaching' && (
                                    <section className="animate-fade-in">
                                        {professorWorks.filter(w => w.category === 'Lecture' || w.type === 'Lecture').length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                {professorWorks.filter(w => w.category === 'Lecture' || w.type === 'Lecture').map(work => (
                                                    <div key={work.id} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '1.5rem',
                                                        backgroundColor: 'var(--color-surface)',
                                                        borderRadius: 'var(--radius-lg)',
                                                        border: '1px solid var(--color-border)'
                                                    }} className="card-hover">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                            <div style={{
                                                                width: '48px',
                                                                height: '48px',
                                                                borderRadius: '12px',
                                                                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'var(--color-primary)'
                                                            }}>
                                                                <Presentation size={24} />
                                                            </div>
                                                            <div>
                                                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-primary)' }}>{work.title}</h3>
                                                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>تاريخ النشر: {work.publishDate}</span>
                                                            </div>
                                                        </div>

                                                        <a
                                                            href={work.download_url || '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                padding: '0.6rem 1.25rem',
                                                                borderRadius: 'var(--radius-sm)',
                                                                backgroundColor: 'var(--color-accent)',
                                                                color: 'white',
                                                                fontSize: '0.9rem',
                                                                fontWeight: 'bold',
                                                                textDecoration: 'none'
                                                            }}
                                                        >
                                                            <Download size={18} />
                                                            تحميل المحاضرة
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                                                لا توجد محاضرات أو مواد تدريسية مسجلة لهذا الأستاذ حالياً.
                                            </p>
                                        )}
                                    </section>
                                )}
                            </>
                        )}
                    </div>

                    <aside>
                        <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'white' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen size={20} />
                                {professor.role === 'student' ? 'الاهتمامات العلمية' : 'الاهتمامات البحثية'}
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {professor.interests && professor.interests.length > 0 ? (
                                    professor.interests.map((interest, idx) => (
                                        <span key={idx} style={{
                                            backgroundColor: 'var(--color-surface-alt)',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.9rem',
                                            color: 'var(--color-text-primary)'
                                        }}>
                                            {interest}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>لم يتم تحديد اهتمامات بعد.</span>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ProfessorProfilePage;
