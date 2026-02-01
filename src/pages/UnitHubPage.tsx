import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookOpen, Users, GraduationCap, Library, FlaskConical, Calendar, Info, Mail, ArrowRight, MessageSquare, Cpu, Sparkles, Shield } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const unitData = {
    'production': {
        title: 'الإنتاج العلمي',
        description: 'المركز السيادي لنشر المعرفة والأبحاث العلمية المحكمة بمعهد الآداب واللغات.',
        color: '#c5a059',
        stats: [
            { id: 'works', label: 'الأبحاث والكتب', value: '+520', icon: <BookOpen size={28} /> },
            { id: 'citations', label: 'معدل الاستشهاد', value: '85%', icon: <Sparkles size={28} /> }
        ],
        cards: [
            { id: 'works', title: 'الأرشيف العلمي', icon: <BookOpen size={32} />, link: '/works', desc: 'شامل للأبحاث والكتب الأكاديمية' },
            { id: 'community', title: 'المنتدى البحثي', icon: <MessageSquare size={32} />, link: '/community', desc: 'فضاء للتفاعل العلمي والحوار حول المستجدات البحثية' }
        ]
    },
    'environment': {
        title: 'البيئة الأكاديمية',
        description: 'النخبة الأكاديمية والكفاءات العلمية في المعهد.',
        color: '#c5a059',
        stats: [
            { id: 'professors', label: 'القامات العلمية', value: '+54', icon: <GraduationCap size={28} /> },
            { id: 'students', label: 'الباحثين الناشئين', value: '+215', icon: <Users size={28} /> }
        ],
        cards: [
            { id: 'professors', title: 'هيئة التدريس والباحثين', icon: <GraduationCap size={32} />, link: '/professors', desc: 'ملفات تعريفية مفصلة للأساتذة الباحثين وتخصصاتهم' },
            { id: 'students', title: 'نادي الطلبة', icon: <Users size={32} />, link: '/students', desc: 'مشاريع وطموحات طلبة الدراسات العليا' }
        ]
    },
    'research': {
        title: 'البحث والتطوير',
        description: 'قاطرة الابتكار وتطوير المناهج البحثية والمخابر العلمية.',
        color: '#c5a059',
        stats: [
            { id: 'journals', label: 'المجلات المحكمة', value: '06', icon: <Library size={28} /> },
            { id: 'labs', label: 'وحدات البحث', value: '12', icon: <FlaskConical size={28} /> }
        ],
        cards: [
            { id: 'journals', title: 'المجلات العلمية', icon: <Library size={32} />, link: '/coming-soon', desc: 'منصة تصفح أحدث أعداد المجلات العلمية الدورية' },
            { id: 'labs', title: 'المخابر البحثية', icon: <FlaskConical size={32} />, link: '/coming-soon', desc: 'استكشف وحدات البحث والمختبرات المتخصصة بالمعهد' }
        ]
    },
    'ai': {
        title: 'الذكاء الاصطناعي والحوسبة اللغوية',
        description: 'رواق التقنيات المتقدمة لخدمة اللغة العربية وحوسبتها ومعالجتها آلياً بأحدث النماذج الذكية.',
        color: '#c5a059',
        stats: [
            { id: 'ai-tools', label: 'الأدوات الذكية', value: '04', icon: <Cpu size={28} /> },
            { id: 'ai-papers', label: 'أوراق محللة', value: '+120', icon: <Sparkles size={28} /> }
        ],
        cards: [
            { id: 'ai-assistant', title: 'Research AI', icon: <Sparkles size={32} />, link: '/coming-soon', desc: 'المساعد البحثي الذكي لتحليل وتلخيص المحتوى العلمي' },
            { id: 'nlp-tools', title: 'NLP Tools', icon: <Cpu size={32} />, link: '/coming-soon', desc: 'أدوات المعالجة الآلية للغة العربية والتحليل الصرفي' }
        ]
    },
    'activities': {
        title: 'الأنشطة والفعاليات',
        description: 'سجل الفعاليات الأكاديمية والملتقيات العلمية في منصة مَكْتَب.',
        color: '#c5a059',
        stats: [
            { id: 'clubs', label: 'النوادي العلمية', value: '08', icon: <Users size={28} /> },
            { id: 'events', label: 'ملتقيات سنوية', value: '+22', icon: <Calendar size={28} /> }
        ],
        cards: [
            { id: 'clubs', title: 'النوادي الطلابية', icon: <Users size={32} />, link: '/coming-soon', desc: 'النشاط الطلابي والنوادي العلمية تحت إشراف المعهد' },
            { id: 'events', title: 'الملتقيات والمؤتمرات', icon: <Calendar size={32} />, link: '/coming-soon', desc: 'مواعيد وتفاصيل الملتقيات والندوات القادمة' }
        ]
    },
    'about': {
        title: 'عن المنصة',
        description: 'الرؤية الاستراتيجية لرقمنة البحث العلمي في معهد الآداب واللغات.',
        color: '#c5a059',
        stats: [
            { id: 'vision', label: 'محاور الرؤية', value: '05', icon: <Info size={28} /> },
            { id: 'support', label: 'الاستجابة التقنية', value: '24/7', icon: <Mail size={28} /> }
        ],
        cards: [
            { id: 'info', title: 'الهوية المؤسسية', icon: <Info size={32} />, link: '/about', desc: 'تعرف على التوجهات الكبرى والقيم الحاكمة للمنصة' },
            { id: 'contact', title: 'التواصل الأكاديمي', icon: <Mail size={32} />, link: '/coming-soon', desc: 'قنوات التواصل المباشر مع إدارة المنصة' }
        ]
    }
};

const UnitHubPage = () => {
    const { unitId } = useParams<{ unitId: string }>();
    const [counts, setCounts] = useState<Record<string, number | string>>({});
    const unit = unitData[unitId as keyof typeof unitData];

    useEffect(() => {
        const fetchCounts = async () => {
            if (!unitId) return;

            const newCounts: Record<string, number | string> = {};

            if (unitId === 'production') {
                const { count } = await supabase.from('works').select('*', { count: 'exact', head: true });
                newCounts['works'] = count || 0;
            } else if (unitId === 'environment') {
                const { count: profCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'professor');
                const { count: studCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student');
                newCounts['professors'] = profCount || 0;
                newCounts['students'] = studCount || 0;
            }

            setCounts(newCounts);
        };

        fetchCounts();
    }, [unitId]);

    if (!unit) return <Navigate to="/" replace />;

    return (
        <div className="hub-container animate-fade-in" style={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            paddingTop: '120px',
            paddingBottom: '6rem',
            color: '#1a1a1a',
            backgroundImage: 'radial-gradient(circle at top right, rgba(197, 160, 89, 0.1) 0%, transparent 600px)'
        }}>
            <div className="container">
                {/* Hub Header - Official Control Center Style */}
                <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 1.5rem',
                        backgroundColor: 'rgba(197, 160, 89, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid #c5a059',
                        color: '#c5a059',
                        fontSize: '0.85rem',
                        fontWeight: '900',
                        marginBottom: '2rem',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        boxShadow: '0 0 20px rgba(197, 160, 89, 0.1)'
                    }}>
                        <Shield size={16} /> البوابة الأكاديمية للوحدة - مَكْتَب
                    </div>
                    <h1 style={{
                        fontSize: '4.5rem',
                        color: 'var(--color-primary)',
                        marginBottom: '1.5rem',
                        fontWeight: '900',
                        textShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        lineHeight: '1.1'
                    }}>{unit.title}</h1>
                    <p style={{
                        fontSize: '1.35rem',
                        color: '#475569',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: '1.8',
                        fontWeight: '500'
                    }}>{unit.description}</p>
                </header>

                {/* Hub Stats Section - Prominent Top */}
                <div className="hub-stats-grid" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '6rem'
                }}>
                    {unit.stats.map(stat => (
                        <div key={stat.id} className="hub-stat-card" style={{
                            background: 'white',
                            padding: '2.5rem 3rem',
                            borderRadius: '24px',
                            border: '1px solid rgba(197, 160, 89, 0.3)',
                            textAlign: 'center',
                            minWidth: '260px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                                width: '40px', height: '2px', background: '#c5a059'
                            }} />
                            <div style={{ color: '#c5a059', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--color-primary)', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                                {counts[stat.id] !== undefined ? counts[stat.id] : stat.value}
                            </div>
                            <div style={{ fontSize: '1rem', color: '#c5a059', fontWeight: '900', letterSpacing: '1px' }}>{stat.label.toUpperCase()}</div>
                        </div>
                    ))}
                </div>

                {/* Hub Gateway Cards - Premium Bottom */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    {unit.cards.map(card => (
                        <Link key={card.id} to={card.link} className="card-hover-premium" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1.5rem 2rem',
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            textDecoration: 'none',
                            gap: '1.5rem',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            borderRight: '4px solid #c5a059'
                        }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '14px',
                                backgroundColor: 'rgba(197, 160, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#c5a059',
                                flexShrink: 0
                            }}>
                                {card.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '0.25rem', fontWeight: '800' }}>{card.title}</h2>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>{card.desc}</p>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    color: '#c5a059', fontWeight: '800', fontSize: '0.9rem'
                                }}>
                                    استعراض القسم العلمي <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
                .card-hover-premium:hover {
                    background-color: white !important;
                    border-color: #c5a059 !important;
                    transform: translateX(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                }
                .card-hover-premium:hover h2 { color: #c5a059 !important; }
                
                @media (max-width: 768px) {
                    h1 { font-size: 2.8rem !important; }
                    .hub-container { padding-top: 100px !important; }
                    .hub-stats-grid {
                        display: grid !important;
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 1rem !important;
                        padding: 0 1rem;
                    }
                    .hub-stat-card {
                        minWidth: 0 !important;
                        padding: 1.5rem 1rem !important;
                        border-radius: 16px !important;
                    }
                    .hub-stat-card div:nth-child(3) {
                        font-size: 1.75rem !important;
                    }
                    .hub-stat-card div:nth-child(4) {
                        font-size: 0.75rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default UnitHubPage;
