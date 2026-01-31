import { useParams, Link, Navigate } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, Library, FlaskConical, Calendar, Info, Mail, ArrowRight, MessageSquare, Cpu, Sparkles, Shield } from 'lucide-react';

const units = {
    'production': {
        title: 'الإنتاج العلمي',
        description: 'المركز السيادي لنشر المعرفة والأبحاث العلمية المحكمة بمعهد الآداب واللغات.',
        color: '#c5a059',
        stats: [
            { id: 'works', label: 'الأبحاث والكتب', value: '+520', icon: <BookOpen size={28} /> },
            { id: 'citations', label: 'معدل الاستشهاد', value: '85%', icon: <Sparkles size={28} /> }
        ],
        cards: [
            { id: 'works', title: 'الأرشيف العلمي', icon: <BookOpen size={36} />, link: '/works', desc: 'قاعدة بيانات شاملة للأبحاث والكتب الأكاديمية' },
            { id: 'community', title: 'المنتدى البحثي', icon: <MessageSquare size={36} />, link: '/community', desc: 'فضاء للتفاعل العلمي والحوار حول المستجدات البحثية' }
        ]
    },
    'environment': {
        title: 'البيئة الأكاديمية',
        description: 'قاعدة بيانات النخبة الأكاديمية والكفاءات العلمية في المعهد.',
        color: '#c5a059',
        stats: [
            { id: 'professors', label: 'القامات العلمية', value: '+54', icon: <GraduationCap size={28} /> },
            { id: 'students', label: 'الباحثين الناشئين', value: '+215', icon: <Users size={28} /> }
        ],
        cards: [
            { id: 'professors', title: 'دليل الأساتذة', icon: <GraduationCap size={36} />, link: '/professors', desc: 'ملفات تعريفية مفصلة للأساتذة الباحثين وتخصصاتهم' },
            { id: 'students', title: 'نادي الطلبة', icon: <Users size={36} />, link: '/students', desc: 'مشاريع وطموحات طلبة الدراسات العليا' }
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
            { id: 'journals', title: 'المجلات العلمية', icon: <Library size={36} />, link: '/coming-soon', desc: 'منصة تصفح أحدث أعداد المجلات العلمية الدورية' },
            { id: 'labs', title: 'المخابر البحثية', icon: <FlaskConical size={36} />, link: '/coming-soon', desc: 'استكشف وحدات البحث والمختبرات المتخصصة بالمعهد' }
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
            { id: 'ai-assistant', title: 'Research AI', icon: <Sparkles size={36} />, link: '/coming-soon', desc: 'المساعد البحثي الذكي لتحليل وتلخيص المحتوى العلمي' },
            { id: 'nlp-tools', title: 'NLP Tools', icon: <Cpu size={36} />, link: '/coming-soon', desc: 'أدوات المعالجة الآلية للغة العربية والتحليل الصرفي' }
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
            { id: 'clubs', title: 'النوادي الطلابية', icon: <Users size={36} />, link: '/coming-soon', desc: 'النشاط الطلابي والنوادي العلمية تحت إشراف المعهد' },
            { id: 'events', title: 'الأجندة العلمية', icon: <Calendar size={36} />, link: '/coming-soon', desc: 'مواعيد وتفاصيل الملتقيات والندوات القادمة' }
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
            { id: 'info', title: 'الهوية المؤسسية', icon: <Info size={36} />, link: '/about', desc: 'تعرف على التوجهات الكبرى والقيم الحاكمة للمنصة' },
            { id: 'contact', title: 'التواصل الأكاديمي', icon: <Mail size={36} />, link: '/coming-soon', desc: 'قنوات التواصل المباشر مع إدارة المنصة' }
        ]
    }
};

const UnitHubPage = () => {
    const { unitId } = useParams<{ unitId: string }>();
    const unit = units[unitId as keyof typeof units];

    if (!unit) return <Navigate to="/" replace />;

    return (
        <div className="hub-container animate-fade-in" style={{
            backgroundColor: '#000033',
            minHeight: '100vh',
            paddingTop: '120px',
            paddingBottom: '6rem',
            color: 'white',
            backgroundImage: 'radial-gradient(circle at top right, rgba(197, 160, 89, 0.05) 0%, transparent 400px)'
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
                        boxShadow: '0 0 20px rgba(197, 160, 89, 0.2)'
                    }}>
                        <Shield size={16} /> مركز التحكم السيادي - وحدة مَكْتَب
                    </div>
                    <h1 style={{
                        fontSize: '4.5rem',
                        color: 'white',
                        marginBottom: '1.5rem',
                        fontWeight: '900',
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        lineHeight: '1.1'
                    }}>{unit.title}</h1>
                    <p style={{
                        fontSize: '1.35rem',
                        color: 'rgba(255,255,255,0.85)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: '1.8',
                        fontWeight: '500'
                    }}>{unit.description}</p>
                </header>

                {/* Hub Stats Section - Prominent Top */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '6rem'
                }}>
                    {unit.stats.map(stat => (
                        <div key={stat.id} style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(12px)',
                            padding: '2.5rem 3rem',
                            borderRadius: '24px',
                            border: '2px solid rgba(197, 160, 89, 0.4)',
                            textAlign: 'center',
                            minWidth: '260px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                                width: '40px', height: '2px', background: '#c5a059'
                            }} />
                            <div style={{ color: '#c5a059', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '0.5rem', fontFamily: 'monospace' }}>{stat.value}</div>
                            <div style={{ fontSize: '1rem', color: '#c5a059', fontWeight: '900', letterSpacing: '1px' }}>{stat.label.toUpperCase()}</div>
                        </div>
                    ))}
                </div>

                {/* Hub Gateway Cards - Premium Bottom */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '3.5rem',
                    maxWidth: '1100px',
                    margin: '0 auto'
                }}>
                    {unit.cards.map(card => (
                        <Link key={card.id} to={card.link} className="card-hover-premium" style={{
                            display: 'flex', flexDirection: 'column',
                            padding: '4rem 3rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textDecoration: 'none',
                            gap: '2rem',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            borderLeft: '4px solid #c5a059'
                        }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '24px',
                                backgroundColor: 'rgba(197, 160, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#c5a059',
                                border: '1px solid rgba(197, 160, 89, 0.2)'
                            }}>
                                {card.icon}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem', fontWeight: '900' }}>{card.title}</h2>
                                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', lineHeight: '1.7' }}>{card.desc}</p>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    color: '#c5a059', fontWeight: '900', fontSize: '1.1rem'
                                }}>
                                    دخول الوحدة المعتمدة <ArrowRight size={22} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
                .card-hover-premium:hover {
                    background-color: rgba(255, 255, 255, 0.08) !important;
                    border-color: #c5a059 !important;
                    transform: translateY(-15px) scale(1.02);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.6);
                }
                .card-hover-premium:hover h2 { color: #c5a059 !important; }
                @media (max-width: 768px) {
                    h1 { font-size: 2.8rem !important; }
                    .hub-container { padding-top: 100px !important; }
                }
            `}</style>
        </div>
    );
};

export default UnitHubPage;
