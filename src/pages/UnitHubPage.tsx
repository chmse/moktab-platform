import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookOpen, Users, GraduationCap, Library, FlaskConical, Calendar, Info, Mail, ArrowRight, MessageSquare, Cpu, Sparkles, Shield } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const unitData = {
    'production': {
        title: 'الإنتاج العلمي',
        description: 'بوابة نشر المعرفة',
        color: '#c5a059',
        stats: [
            { id: 'works', label: 'الأبحاث والكتب', value: '+520', icon: <BookOpen size={24} /> },
            { id: 'citations', label: 'معدل الاستشهاد', value: '85%', icon: <Sparkles size={24} /> }
        ],
        cards: [
            { id: 'works', title: 'الأرشيف العلمي', icon: <BookOpen size={28} />, link: '/works', desc: 'شامل للأبحاث والكتب الأكاديمية' },
            { id: 'community', title: 'المنتدى البحثي', icon: <MessageSquare size={28} />, link: '/community', desc: 'فضاء للتفاعل العلمي والحوار حول المستجدات البحثية' }
        ]
    },
    'environment': {
        title: 'البيئة الأكاديمية',
        description: 'النخبة الأكاديمية والكفاءات العلمية في المعهد.',
        color: '#c5a059',
        stats: [
            { id: 'professors', label: 'القامات العلمية', value: '+54', icon: <GraduationCap size={24} /> },
            { id: 'students', label: 'الباحثين الناشئين', value: '+215', icon: <Users size={24} /> }
        ],
        cards: [
            { id: 'professors', title: 'هيئة التدريس والباحثين', icon: <GraduationCap size={28} />, link: '/professors', desc: 'ملفات تعريفية مفصلة للأساتذة الباحثين وتخصصاتهم' },
            { id: 'students', title: 'نادي الطلبة', icon: <Users size={28} />, link: '/students', desc: 'مشاريع وطموحات طلبة الدراسات العليا' }
        ]
    },
    'research': {
        title: 'البحث والتطوير',
        description: 'قاطرة الابتكار وتطوير المناهج البحثية والمخابر العلمية.',
        color: '#c5a059',
        stats: [
            { id: 'journals', label: 'المجلات المحكمة', value: '06', icon: <Library size={24} /> },
            { id: 'labs', label: 'وحدات البحث', value: '12', icon: <FlaskConical size={24} /> }
        ],
        cards: [
            { id: 'journals', title: 'المجلات العلمية', icon: <Library size={28} />, link: '/coming-soon', desc: 'منصة تصفح أحدث أعداد المجلات العلمية الدورية' },
            { id: 'labs', title: 'المخابر البحثية', icon: <FlaskConical size={28} />, link: '/coming-soon', desc: 'استكشف وحدات البحث والمختبرات المتخصصة بالمعهد' }
        ]
    },
    'ai': {
        title: 'الذكاء الاصطناعي والحوسبة اللغوية',
        description: 'رواق التقنيات المتقدمة لخدمة اللغة العربية وحوسبتها ومعالجتها آلياً بأحدث النماذج الذكية.',
        color: '#c5a059',
        stats: [
            { id: 'ai-tools', label: 'الأدوات الذكية', value: '04', icon: <Cpu size={24} /> },
            { id: 'ai-papers', label: 'أوراق محللة', value: '+120', icon: <Sparkles size={24} /> }
        ],
        cards: [
            { id: 'ai-assistant', title: 'Research AI', icon: <Sparkles size={28} />, link: '/coming-soon', desc: 'المساعد البحثي الذكي لتحليل وتلخيص المحتوى العلمي' },
            { id: 'nlp-tools', title: 'NLP Tools', icon: <Cpu size={28} />, link: '/coming-soon', desc: 'أدوات المعالجة الآلية للغة العربية والتحليل الصرفي' }
        ]
    },
    'activities': {
        title: 'الأنشطة والفعاليات',
        description: 'سجل الفعاليات الأكاديمية والملتقيات العلمية في منصة مَكْتَب.',
        color: '#c5a059',
        stats: [
            { id: 'clubs', label: 'النوادي العلمية', value: '08', icon: <Users size={24} /> },
            { id: 'events', label: 'ملتقيات سنوية', value: '+22', icon: <Calendar size={24} /> }
        ],
        cards: [
            { id: 'clubs', title: 'النوادي الطلابية', icon: <Users size={28} />, link: '/coming-soon', desc: 'النشاط الطلابي والنوادي العلمية تحت إشراف المعهد' },
            { id: 'events', title: 'الملتقيات والمؤتمرات', icon: <Calendar size={28} />, link: '/coming-soon', desc: 'مواعيد وتفاصيل الملتقيات والندوات القادمة' }
        ]
    },
    'about': {
        title: 'عن المنصة',
        description: 'الرؤية الاستراتيجية لرقمنة البحث العلمي في معهد الآداب واللغات.',
        color: '#c5a059',
        stats: [
            { id: 'vision', label: 'محاور الرؤية', value: '05', icon: <Info size={24} /> },
            { id: 'support', label: 'الاستجابة التقنية', value: '24/7', icon: <Mail size={24} /> }
        ],
        cards: [
            { id: 'info', title: 'الهوية المؤسسية', icon: <Info size={28} />, link: '/about', desc: 'تعرف على التوجهات الكبرى والقيم الحاكمة للمنصة' },
            { id: 'contact', title: 'التواصل الأكاديمي', icon: <Mail size={28} />, link: '/coming-soon', desc: 'قنوات التواصل الم مباشر مع إدارة المنصة' }
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
            paddingTop: '140px', // EXACTLY 140px as requested
            paddingBottom: '6rem',
            color: '#1a1a1a',
            backgroundImage: 'radial-gradient(circle at top right, rgba(197, 160, 89, 0.1) 0%, transparent 600px)'
        }}>
            <div className="container">
                {/* Hub Header - Institutional Refinement */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 1.25rem',
                        backgroundColor: 'rgba(197, 160, 89, 0.08)',
                        borderRadius: '6px',
                        border: '1px solid rgba(197, 160, 89, 0.3)',
                        color: '#c5a059',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        <Shield size={14} /> وحدة معتمدة
                    </div>
                    <h1 style={{
                        fontSize: '4rem',
                        color: 'var(--color-primary)',
                        marginBottom: '2rem', // Breathing space
                        fontWeight: '900',
                        lineHeight: '1.1'
                    }}>{unit.title}</h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#475569',
                        maxWidth: '850px',
                        margin: '0 auto',
                        lineHeight: '1.7',
                        fontWeight: '600' // Bit bolder for precision
                    }}>{unit.description}</p>
                </header>

                {/* Hub Stats Section - Slim Horizontal Rectangles */}
                <div className="hub-stats-grid" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '4rem'
                }}>
                    {unit.stats.map(stat => (
                        <div key={stat.id} className="hub-stat-card" style={{
                            background: 'white',
                            padding: '0.75rem 1.25rem', // SLIMMER PADDING
                            borderRadius: '8px',       // SHARPER RADIUS
                            border: '1px solid rgba(197, 160, 89, 0.25)', // SLIGHTLY BOLDER BORDER
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            minWidth: '220px',         // SLIMMER MIN WIDTH
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)', // SUBTLE SHADOW
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '8px', // SLIMMER ICON BOX
                                backgroundColor: 'rgba(197, 160, 89, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#c5a059'
                            }}>
                                {stat.icon}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--color-primary)', lineHeight: '1', marginBottom: '0.1rem', fontFamily: 'monospace' }}>
                                    {counts[stat.id] !== undefined ? counts[stat.id] : stat.value}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#c5a059', fontWeight: '800', letterSpacing: '0.5px' }}>{stat.label.toUpperCase()}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Hub Gateway Cards - Perfect Alignment & Shadow Polish */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '1.5rem',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    {unit.cards.map(card => (
                        <Link key={card.id} to={card.link} className="card-hover-premium" style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1.5rem 2rem', // GENEROUS BUT ALIGNED
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            border: '1px solid rgba(0, 0, 0, 0.08)', // PRECISE BORDER
                            textDecoration: 'none',
                            gap: '1.5rem',
                            transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)', // SUBTLE BASE SHADOW
                            borderRight: '5px solid #c5a059'
                        }}>
                            <div style={{
                                width: '54px', height: '54px', borderRadius: '12px',
                                backgroundColor: 'rgba(197, 160, 89, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#c5a059',
                                flexShrink: 0
                            }}>
                                {card.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.2rem', fontWeight: '800' }}>{card.title}</h2>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', lineHeight: '1.4' }}>{card.desc}</p>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    color: '#c5a059', fontWeight: '800', fontSize: '0.85rem'
                                }}>
                                    استعراض القسم <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
                .card-hover-premium:hover {
                    border-color: #c5a059 !important;
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.06);
                }
                .card-hover-premium:hover h2 { color: #c5a059 !important; }
                
                @media (max-width: 768px) {
                    h1 { font-size: 2.25rem !important; }
                    .hub-container { padding-top: 140px !important; }
                    .hub-stats-grid {
                        display: grid !important;
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 0.5rem !important; // VERY COMPACT
                        padding: 0 0.5rem;
                    }
                    .hub-stat-card {
                        min-width: 0 !important;
                        padding: 0.6rem !important; // VERY COMPACT
                        gap: 0.4rem !important;
                        border-radius: 6px !important; // SHARPER
                    }
                    .hub-stat-card div:first-child { width: 30px !important; height: 30px !important; }
                    .hub-stat-card svg { width: 14px !important; height: 14px !important; }
                    .hub-stat-card div:nth-child(2) div:first-child { font-size: 1.1rem !important; }
                    .hub-stat-card div:nth-child(2) div:last-child { font-size: 0.55rem !important; }
                }
            `}</style>
        </div>
    );
};

export default UnitHubPage;
