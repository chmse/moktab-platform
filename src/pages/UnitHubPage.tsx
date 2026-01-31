import { useParams, Link, Navigate } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, Library, FlaskConical, Calendar, Info, Mail, ArrowRight } from 'lucide-react';

const units = {
    'production': {
        title: 'الإنتاج العلمي',
        description: 'مركز نشر المعرفة والأبحاث العلمية الرصينة.',
        cards: [
            { id: 'works', title: 'الأعمال العلمية', icon: <BookOpen size={32} />, link: '/works', color: 'var(--color-primary)' },
            { id: 'community', title: 'المجتمع العلمي', icon: <Users size={32} />, link: '/community', color: 'var(--color-accent)' }
        ]
    },
    'environment': {
        title: 'البيئة الأكاديمية',
        description: 'مجتمع حيوي يضم نخبة من الأساتذة والطلاب.',
        cards: [
            { id: 'professors', title: 'الأساتذة', icon: <GraduationCap size={32} />, link: '/professors', color: 'var(--color-primary)' },
            { id: 'students', title: 'الطلاب', icon: <Users size={32} />, link: '/students', color: 'var(--color-accent)' }
        ]
    },
    'research': {
        title: 'البحث والتطوير',
        description: 'مراكز الابتكار والتميز البحثي.',
        cards: [
            { id: 'journals', title: 'المجلات العلمية', icon: <Library size={32} />, link: '/coming-soon', color: 'var(--color-primary)' },
            { id: 'labs', title: 'المخابر العلمية', icon: <FlaskConical size={32} />, link: '/coming-soon', color: 'var(--color-accent)' }
        ]
    },
    'activities': {
        title: 'الأنشطة والفعاليات',
        description: 'نبض الحياة الجامعية والنشاط الطلابي.',
        cards: [
            { id: 'clubs', title: 'النوادي الطلابية', icon: <Users size={32} />, link: '/coming-soon', color: 'var(--color-primary)' },
            { id: 'events', title: 'الملتقيات والفعاليات', icon: <Calendar size={32} />, link: '/coming-soon', color: 'var(--color-accent)' }
        ]
    },
    'about': {
        title: 'عن المنصة',
        description: 'هويتنا ورؤيتنا للمستقبل.',
        cards: [
            { id: 'info', title: 'معلومات عن المنصة', icon: <Info size={32} />, link: '/about', color: 'var(--color-primary)' },
            { id: 'contact', title: 'اتصل بنا', icon: <Mail size={32} />, link: '/coming-soon', color: 'var(--color-accent)' }
        ]
    }
};

const UnitHubPage = () => {
    const { unitId } = useParams<{ unitId: string }>();
    const unit = units[unitId as keyof typeof units];

    if (!unit) return <Navigate to="/" replace />;

    return (
        <div className="container animate-fade-in" style={{ padding: '8rem 1rem 4rem', minHeight: '80vh' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: 'bold' }}>{unit.title}</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>{unit.description}</p>
            </div>

            {/* Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                {unit.cards.map(card => (
                    <Link key={card.id} to={card.link} className="card-hover" style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                        padding: '3rem 2rem', backgroundColor: 'white', borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)', textDecoration: 'none', gap: '1.5rem',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: card.color
                        }}>
                            {card.icon}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{card.title}</h2>
                            <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontWeight: 'bold' }}>
                                تصفح القسم <ArrowRight size={18} />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default UnitHubPage;
