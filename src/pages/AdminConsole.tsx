// Admin Dashboard - Restricted Platform Management
import { useEffect, useState } from 'react';
import { Users, FileText, BarChart2, Check, X, Shield, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AdminConsole = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'content' | 'stats'>('users');
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [recentWorks, setRecentWorks] = useState<any[]>([]);
    const [recentTopics, setRecentTopics] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);

        // 1. Fetch Pending Users
        const { data: users } = await supabase
            .from('profiles')
            .select('*')
            .eq('status', 'pending');
        setPendingUsers(users || []);

        // 2. Fetch Content
        const { data: works } = await supabase.from('works').select('*').order('created_at', { ascending: false }).limit(5);
        const { data: topics } = await supabase.from('community_topics').select('*').order('created_at', { ascending: false }).limit(5);
        setRecentWorks(works || []);
        setRecentTopics(topics || []);

        // 3. Fetch Stats
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: worksCount } = await supabase.from('works').select('*', { count: 'exact', head: true });
        const { count: topicsCount } = await supabase.from('community_topics').select('*', { count: 'exact', head: true });

        setStats({ usersCount, worksCount, topicsCount });
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUserAction = async (id: string, newStatus: 'approved' | 'rejected') => {
        // Optimistic update
        setPendingUsers(prev => prev.filter(u => u.id !== id));

        const { error } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            // Revert if error (optional, but good practice usually, here keeping simple for speed)
            alert('حدث خطأ أثناء معالجة الطلب');
            fetchData(); // Refetch to sync truth
        } else {
            alert(newStatus === 'approved' ? 'تمت الموافقة على المستخدم بنجاح' : 'تم رفض المستخدم');
        }
    };

    const handleDeleteContent = async (table: string, id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المحتوى؟')) {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (!error) {
                alert('تم الحذف بنجاح');
                fetchData();
            }
        }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>جاري التحميل...</div>;

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <Shield size={40} color="var(--color-primary)" />
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', fontWeight: '800' }}>مركز إدارة المنصة</h1>
            </div>

            {/* Admin Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--color-border)' }}>
                <button onClick={() => setActiveTab('users')} style={{ padding: '1rem 2rem', fontWeight: 'bold', color: activeTab === 'users' ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'users' ? '3px solid var(--color-primary)' : '3px solid transparent' }}>
                    إدارة المستخدمين الجدد
                </button>
                <button onClick={() => setActiveTab('content')} style={{ padding: '1rem 2rem', fontWeight: 'bold', color: activeTab === 'content' ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'content' ? '3px solid var(--color-primary)' : '3px solid transparent' }}>
                    الرقابة على المحتوى
                </button>
                <button onClick={() => setActiveTab('stats')} style={{ padding: '1rem 2rem', fontWeight: 'bold', color: activeTab === 'stats' ? 'var(--color-primary)' : 'var(--color-text-secondary)', borderBottom: activeTab === 'stats' ? '3px solid var(--color-primary)' : '3px solid transparent' }}>
                    الإحصائيات العامة
                </button>
            </div>

            {/* Tab Content */}
            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white' }}>
                {activeTab === 'users' && (
                    <div>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>طلبات الانضمام المعلقة</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-surface)' }}>
                                    <th style={{ textAlign: 'right', padding: '1rem' }}>الاسم</th>
                                    <th style={{ textAlign: 'right', padding: '1rem' }}>الدور</th>
                                    <th style={{ textAlign: 'right', padding: '1rem' }}>القسم/المستوى</th>
                                    <th style={{ textAlign: 'center', padding: '1rem' }}>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '1rem' }}>{u.full_name}</td>
                                        <td style={{ padding: '1rem' }}>{u.role === 'professor' ? 'أستاذ' : 'طالب'}</td>
                                        <td style={{ padding: '1rem' }}>{u.department || u.level}</td>
                                        <td style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                            <button onClick={() => handleUserAction(u.id, 'approved')} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                                                <Check size={18} />
                                            </button>
                                            <button onClick={() => handleUserAction(u.id, 'rejected')} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {pendingUsers.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>لا توجد طلبات معلقة.</p>}
                    </div>
                )}

                {activeTab === 'content' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <h2 style={{ marginBottom: '1.5rem' }}>الأعمال العلمية الأخيرة</h2>
                            {recentWorks.map(w => (
                                <div key={w.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{w.title}</span>
                                    <button onClick={() => handleDeleteContent('works', w.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h2 style={{ marginBottom: '1.5rem' }}>مواضيع المجتمع الأخيرة</h2>
                            {recentTopics.map(t => (
                                <div key={t.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{t.title}</span>
                                    <button onClick={() => handleDeleteContent('community_topics', t.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
                        <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
                            <Users size={32} color="var(--color-primary)" />
                            <h3 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{stats.usersCount}</h3>
                            <p>مستخدم مسجل</p>
                        </div>
                        <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
                            <FileText size={32} color="var(--color-accent)" />
                            <h3 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{stats.worksCount}</h3>
                            <p>عمل علمي</p>
                        </div>
                        <div style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
                            <BarChart2 size={32} color="#10b981" />
                            <h3 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{stats.topicsCount}</h3>
                            <p>موضوع نقاش</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { AdminConsole as default };
