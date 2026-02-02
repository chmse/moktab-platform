import { useEffect, useState } from 'react';
import { BookOpen, Plus, FileText, Presentation, MessageCircle, MessageSquare, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddWorkModal from '../components/dashboard/AddWorkModal';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
            width: '50px',
            height: '50px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: color + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
        }}>
            <Icon size={24} />
        </div>
        <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--color-primary)' }}>{value}</h3>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{label}</span>
        </div>
    </div>
);

const ProfessorDashboard = () => {
    const { profile } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'management' | 'teaching' | 'discussions' | 'supervisees'>('management');
    const [worksList, setWorksList] = useState<any[]>([]);
    const [supervisees, setSupervisees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [showBadgeModal, setShowBadgeModal] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch ALL Works for this professor
                const { data: worksData, error: worksError } = await supabase
                    .from('works')
                    .select('*')
                    .eq('professor_id', user.id)
                    .order('created_at', { ascending: false });

                if (worksError) throw worksError;
                setWorksList(worksData || []);

                // Fetch Supervisees
                const { data: studentsData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('supervisor_id', user.id)
                    .eq('role', 'student');

                if (studentsData) setSupervisees(studentsData);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAwardBadge = async (badgeName: string) => {
        if (!selectedStudent) return;

        try {
            const currentBadges = Array.isArray(selectedStudent.badges) ? selectedStudent.badges : [];
            if (currentBadges.includes(badgeName)) {
                alert('هذا الطالب يحمل هذا الوسام بالفعل.');
                return;
            }

            const newBadges = [...currentBadges, badgeName];

            const { error } = await supabase
                .from('profiles')
                .update({ badges: newBadges })
                .eq('id', selectedStudent.id);

            if (error) throw error;

            alert(`تم منح وسام "${badgeName}" للطالب ${selectedStudent.full_name} بنجاح!`);
            setShowBadgeModal(false);
            setSelectedStudent(null);
            fetchData(); // Refresh list to show new badge
        } catch (err) {
            console.error('Error awarding badge:', err);
            alert('حدث خطأ أثناء منح الوسام. يرجى المحاولة لاحقاً.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = {
        books: worksList.filter(w => (w.category === 'Book' || w.type === 'Book')).length,
        articles: worksList.filter(w => (w.category === 'Article' || w.type === 'Article')).length,
        lectures: worksList.filter(w => (w.category === 'Lecture' || w.type === 'Lecture')).length,
        pendingQuestions: 0
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    جاري تحميل لوحة التحكم...
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>لوحة التحكم</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        مرحباً بك {profile?.rank || 'د.'} {profile?.full_name || ''}، إليك ملخص نشاطك العلمي.
                    </p>
                </div>

                <button
                    className="btn-premium"
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} />
                    إضافة عمل جديد
                </button>
            </div>

            {/* Enhanced Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard icon={MessageSquare} label="أسئلة بانتظار الرد" value={stats.pendingQuestions} color="#ef4444" />
                <StatCard icon={BookOpen} label="الكتب والمؤلفات" value={stats.books} color="#1A237E" />
                <StatCard icon={FileText} label="المقالات والأبحاث" value={stats.articles} color="#C5A059" />
                <StatCard icon={Presentation} label="المحاضرات" value={stats.lectures} color="#10b981" />
            </div>

            {/* Dashboard Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--color-border)', marginBottom: '2rem', overflowX: 'auto' }}>
                <button
                    onClick={() => setActiveTab('management')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'management' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'management' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <FileText size={20} />
                    إدارة الأعمال
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
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <Presentation size={20} />
                    التدريس
                </button>
                <button
                    onClick={() => setActiveTab('discussions')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'discussions' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'discussions' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <MessageCircle size={20} />
                    النقاشات
                </button>
                <button
                    onClick={() => setActiveTab('supervisees')}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: activeTab === 'supervisees' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        borderBottom: activeTab === 'supervisees' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        marginBottom: '-2px',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    <BookOpen size={20} />
                    طلبتي المقيدين
                </button>
            </div>

            {/* Tab Content */}
            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white', minHeight: '400px' }}>

                {activeTab === 'management' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>الأعمال المنشورة</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-surface)' }}>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--color-text-secondary)' }}>العنوان</th>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--color-text-secondary)' }}>النوع</th>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--color-text-secondary)' }}>تاريخ النشر</th>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--color-text-secondary)' }}>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {worksList.length > 0 ? worksList.map((work) => (
                                        <tr key={work.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '1rem', fontWeight: '500' }}>{work.title}</td>
                                            <td style={{ padding: '1rem' }}>
                                                {work.category === 'Article' ? 'بحث' : work.category === 'Book' ? 'كتاب' : work.category === 'Lecture' ? 'محاضرة' : 'أخرى'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>{work.publish_date || 'غير محدد'}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' }}>منشور</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                                لا توجد أعمال منشورة بعد.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'teaching' && (
                    <div className="animate-fade-in">
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>المقاييس الدراسية</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>هذا القسم قيد التطوير...</p>
                    </div>
                )}

                {activeTab === 'discussions' && (
                    <div className="animate-fade-in">
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>أحدث النقاشات والأسئلة</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>لا توجد نقاشات جديدة حالياً.</p>
                    </div>
                )}

                {activeTab === 'supervisees' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-family-serif)', fontWeight: '700' }}>البيئة البحثية: الطلاب تحت الإشراف العلمي</h3>
                            <span style={{ backgroundColor: 'rgba(197, 160, 89, 0.1)', color: 'var(--color-accent)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '800' }}>
                                عدد الطلاب: {supervisees.length}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                            {supervisees.length > 0 ? supervisees.map(student => (
                                <div key={student.id} className="glass-panel card-hover" style={{ padding: '1.8rem', border: '1px solid #f1f5f9', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'white' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <img src={student.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'} alt="" style={{ width: '70px', height: '70px', borderRadius: '20px', objectFit: 'cover', border: '3px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                                            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#10b981', border: '3px solid white' }}></div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: '800' }}>{student.full_name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>{student.specialty || 'باحث في علم اللغات'}</p>
                                        </div>
                                    </div>

                                    {/* Student Badges Preview */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {Array.isArray(student.badges) && student.badges.length > 0 ? student.badges.map((b: string, i: number) => (
                                            <span key={i} style={{ fontSize: '0.7rem', backgroundColor: '#fff9eb', color: '#c5a059', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #fce8cc', fontWeight: 'bold' }}>{b}</span>
                                        )) : (
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>لا توجد أوسمة بعد</span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto' }}>
                                        <Link to={`/students/${student.id}`} style={{ flex: 1, textAlign: 'center', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none', border: '1px solid #f1f5f9' }} className="card-hover">الملف العلمي</Link>
                                        <button
                                            onClick={() => { setSelectedStudent(student); setShowBadgeModal(true); }}
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--color-accent)', color: 'white', fontWeight: 'bold' }}
                                            className="card-hover"
                                        >
                                            <Award size={18} /> منح وسام
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'var(--color-surface)', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
                                    <BookOpen size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>لا يوجد طلاب مسجلون تحت إشرافك حالياً في هذا الرواق.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <AddWorkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />

            {/* Badge Award Modal */}
            {showBadgeModal && selectedStudent && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                    <div className="glass-panel" style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '32px', maxWidth: '480px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                        <div className="badge-gold-medal" style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
                            <Award size={40} />
                        </div>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-family-serif)', fontSize: '1.8rem' }}>التكريم الشرفي</h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>اختر الوسام المستحق للطالب <strong style={{ color: 'var(--color-primary)' }}>{selectedStudent.full_name}</strong></p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[
                                { name: 'طالب متميز', color: '#ffd700', icon: Award },
                                { name: 'باحث صاعد', color: '#c5a059', icon: BookOpen },
                                { name: 'مناقش بارع', color: '#10b981', icon: MessageCircle },
                                { name: 'قلم الإبداع', color: '#ec4899', icon: FileText }
                            ].map(badge => (
                                <button
                                    key={badge.name}
                                    onClick={() => handleAwardBadge(badge.name)}
                                    style={{
                                        padding: '1.2rem',
                                        borderRadius: '20px',
                                        background: 'white',
                                        border: `2px solid ${badge.color}20`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="card-hover"
                                >
                                    <div style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '14px',
                                        backgroundColor: `${badge.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: badge.color
                                    }}>
                                        <badge.icon size={24} />
                                    </div>
                                    <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--color-primary)' }}>{badge.name}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => { setShowBadgeModal(false); setSelectedStudent(null); }}
                            style={{ background: 'none', border: 'none', marginTop: '2.5rem', color: '#ef4444', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}
                        >
                            إلغاء العملية
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessorDashboard;
