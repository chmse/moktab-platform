// Admin Dashboard - Restricted Platform Management
import { useEffect, useState } from 'react';
import { Users, FileText, BarChart2, Check, X, Shield, Trash2, Search, Mail, Archive, Plus, Bell, Edit2, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AdminConsole = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'content' | 'news' | 'stats'>('pending');

    // Data States
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [works, setWorks] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [news, setNews] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    // UI States
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Pending Users
            const { data: pUsers } = await supabase.from('profiles').select('*').eq('status', 'pending');
            setPendingUsers(pUsers || []);

            // 2. Fetch All Users for Management
            const { data: aUsers } = await supabase.from('profiles').select('*').order('full_name', { ascending: true });
            setAllUsers(aUsers || []);

            // 3. Fetch Content (Works & Topics)
            const { data: worksData } = await supabase.from('works').select('*').order('created_at', { ascending: false });
            const { data: topicsData } = await supabase.from('community_topics').select('*').order('created_at', { ascending: false });
            setWorks(worksData || []);
            setTopics(topicsData || []);

            // 4. Fetch News
            const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false });
            setNews(newsData || []);

            // 5. Fetch Stats
            const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: wCount } = await supabase.from('works').select('*', { count: 'exact', head: true });
            const { count: tCount } = await supabase.from('community_topics').select('*', { count: 'exact', head: true });
            setStats({ usersCount: uCount, worksCount: wCount, topicsCount: tCount });

        } catch (err) {
            console.error('AdminConsole error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- Actions ---

    const handleUserApproval = async (id: string, newStatus: 'approved' | 'rejected') => {
        const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', id);
        if (error) alert('خطأ: ' + error.message);
        else fetchData();
    };

    const handleUpdateUser = async (id: string, updates: any) => {
        const { error } = await supabase.from('profiles').update(updates).eq('id', id);
        if (error) alert('فشل التحديث: ' + error.message);
        else {
            alert('تم تحديث بيانات المستخدم بنجاح');
            fetchData();
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الحساب نهائياً؟ لا يمكن التراجع عن هذه الخطوة.')) {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) alert('خطأ في الحذف: ' + error.message);
            else fetchData();
        }
    };

    const handleResetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/settings`,
        });
        if (error) alert('فشل إرسال رابط استعادة كلمة المرور: ' + error.message);
        else alert('تم إرسال رابط استعادة كلمة المرور إلى ' + email);
    };

    const handleWorkAction = async (id: string, action: 'approve' | 'archive' | 'delete') => {
        if (action === 'delete') {
            if (!window.confirm('حذف هذا العمل نهائياً؟')) return;
            const { error } = await supabase.from('works').delete().eq('id', id);
            if (!error) fetchData();
            return;
        }

        const status = action === 'approve' ? 'published' : 'archived';
        const { error } = await supabase.from('works').update({ status }).eq('id', id);
        if (error) alert('خطأ: ' + error.message);
        else fetchData();
    };

    const handleAddNews = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('news').insert([{
            title: newsTitle,
            content: newsContent,
            created_at: new Date().toISOString()
        }]);

        if (error) alert('خطأ في إضافة الخبر: ' + error.message);
        else {
            alert('تم نشر الخبر بنجاح');
            setNewsTitle('');
            setNewsContent('');
            fetchData();
        }
    };

    const handleDeleteNews = async (id: string) => {
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (!error) fetchData();
    };

    const handleDeleteContent = async (table: string, id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المحتوى؟')) {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (!error) {
                alert('تم الحذف بنجاح');
                fetchData();
            } else {
                alert('خطأ في الحذف: ' + error.message);
            }
        }
    };

    // --- Filtering ---
    const filteredUsers = allUsers.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ padding: '8rem', textAlign: 'center', color: 'var(--color-primary)', fontWeight: 'bold' }}>جاري تحميل بروتوكولات الإدارة...</div>;

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <Shield size={40} color="var(--color-primary)" />
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', fontWeight: '800' }}>لوحة الإدارة العليا</h1>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--color-border)', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {[
                    { id: 'pending', label: 'طلبات الانضمام', icon: <Mail size={18} /> },
                    { id: 'users', label: 'إدارة المستخدمين', icon: <Users size={18} /> },
                    { id: 'content', label: 'الرقابة العلمية', icon: <FileText size={18} /> },
                    { id: 'news', label: 'أخبار المعهد', icon: <Bell size={18} /> },
                    { id: 'stats', label: 'الإحصائيات', icon: <BarChart2 size={18} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem', fontWeight: 'bold', whiteSpace: 'nowrap',
                            color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                            borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                            transition: 'all 0.3s'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'white' }}>

                {/* 1. Pending Users */}
                {activeTab === 'pending' && (
                    <div>
                        <h2 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>مراجعة طلبات التسجيل الجديدة</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '2px solid var(--color-border)' }}>
                                    <tr>
                                        <th style={{ textAlign: 'right', padding: '1rem' }}>الاسم الكامل</th>
                                        <th style={{ textAlign: 'right', padding: '1rem' }}>الصفة</th>
                                        <th style={{ textAlign: 'right', padding: '1rem' }}>القسم / المستوى</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>التحكم</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.full_name}</td>
                                            <td style={{ padding: '1rem' }}>{u.role === 'professor' ? 'أستاذ' : 'طالب'}</td>
                                            <td style={{ padding: '1rem' }}>{u.department || u.level}</td>
                                            <td style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                                                <button onClick={() => handleUserApproval(u.id, 'approved')} className="card-hover" style={{ backgroundColor: '#22c55e', color: 'white', padding: '0.5rem', borderRadius: '8px' }} title="قبول"><Check size={20} /></button>
                                                <button onClick={() => handleUserApproval(u.id, 'rejected')} className="card-hover" style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.5rem', borderRadius: '8px' }} title="رفض"><X size={20} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {pendingUsers.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>لا توجد طلبات معلقة حالياً.</div>}
                    </div>
                )}

                {/* 2. All Users Management */}
                {activeTab === 'users' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ color: 'var(--color-primary)' }}>قاعدة بيانات الأعضاء</h2>
                            <div style={{ position: 'relative', width: '300px' }}>
                                <Search size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder="بحث عن عضو..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 2.8rem 0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none' }}
                                />
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '2px solid var(--color-border)' }}>
                                    <tr>
                                        <th style={{ textAlign: 'right', padding: '1rem' }}>الاسم</th>
                                        <th style={{ textAlign: 'right', padding: '1rem' }}>البريد الإلكتروني</th>
                                        <th style={{ textAlign: 'right', padding: '1rem' }}>الرتبة / المستوى</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.full_name}</td>
                                            <td style={{ padding: '1rem' }}>{u.email || 'غير متوفر'}</td>
                                            <td style={{ padding: '1rem' }}>{u.rank || u.level}</td>
                                            <td style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                <button onClick={() => {
                                                    const newName = window.prompt('تعديل الاسم الكامل:', u.full_name);
                                                    if (newName) handleUpdateUser(u.id, { full_name: newName });
                                                }} style={{ color: 'var(--color-primary)', background: '#e0e7ff', padding: '0.4rem', borderRadius: '4px' }} title="تعديل"><Edit2 size={16} /></button>

                                                <button onClick={() => {
                                                    if (u.email) handleResetPassword(u.email);
                                                    else alert('لا يوجد بريد إلكتروني مسجل لهذا المستخدم');
                                                }} style={{ color: '#c5a059', background: '#fef3c7', padding: '0.4rem', borderRadius: '4px' }} title="استعادة كلمة المرور"><RotateCcw size={16} /></button>

                                                <button onClick={() => handleDeleteUser(u.id)} style={{ color: '#ef4444', background: '#fee2e2', padding: '0.4rem', borderRadius: '4px' }} title="حذف"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3. Content Moderation */}
                {activeTab === 'content' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>الأعمال العلمية</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {works.map(w => (
                                    <div key={w.id} style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{w.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>النوع: {w.category} | الحالة: {w.status || 'معلق'}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleWorkAction(w.id, 'approve')} style={{ color: '#22c55e', background: '#dcfce7', padding: '0.5rem', borderRadius: '8px' }} title="اعتماد"><Check size={18} /></button>
                                            <button onClick={() => handleWorkAction(w.id, 'archive')} style={{ color: '#c5a059', background: '#fef3c7', padding: '0.5rem', borderRadius: '8px' }} title="أرشفة"><Archive size={18} /></button>
                                            <button onClick={() => handleWorkAction(w.id, 'delete')} style={{ color: '#ef4444', background: '#fee2e2', padding: '0.5rem', borderRadius: '8px' }} title="حذف"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>مواضيع المجتمع</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {topics.map(t => (
                                    <div key={t.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500' }}>{t.title}</span>
                                        <button onClick={() => handleDeleteContent('community_topics', t.id)} style={{ color: '#ef4444', background: '#fee2e2', padding: '0.4rem', borderRadius: '8px' }}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. News Manager */}
                {activeTab === 'news' && (
                    <div>
                        <h2 style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>إدارة الأخبار والمستجدات</h2>
                        <form onSubmit={handleAddNews} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '3rem', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>عنوان الخبر</label>
                                <input
                                    type="text"
                                    required
                                    value={newsTitle}
                                    onChange={(e) => setNewsTitle(e.target.value)}
                                    placeholder="مثال: المجلس العلمي يعقد اجتماعه الدوري..."
                                    style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>تفاصيل الخبر</label>
                                <textarea
                                    required
                                    value={newsContent}
                                    onChange={(e) => setNewsContent(e.target.value)}
                                    rows={4}
                                    placeholder="اكتب محتوى الخبر هنا..."
                                    style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--color-border)', resize: 'vertical' }}
                                />
                            </div>
                            <button type="submit" className="btn-premium" style={{ width: 'fit-content', padding: '1rem 3rem', alignSelf: 'flex-end' }}>
                                <Plus size={20} /> نشر الخبر الآن
                            </button>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>الأخبار المنشورة سابقاً</h3>
                            {news.map(n => (
                                <div key={n.id} style={{ padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{n.title}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{n.content?.substring(0, 150)}...</p>
                                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.6 }}>{new Date(n.created_at).toLocaleDateString('ar-DZ')}</div>
                                    </div>
                                    <button onClick={() => handleDeleteNews(n.id)} style={{ color: '#ef4444', padding: '0.5rem' }}><Trash2 size={20} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Stats */}
                {activeTab === 'stats' && stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <div style={{ padding: '2.5rem', border: '1px solid var(--color-border)', borderRadius: '20px', textAlign: 'center', backgroundColor: 'var(--color-surface)' }}>
                            <Users size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--color-primary)' }}>{stats.usersCount}</div>
                            <p style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>أعضاء المنصة</p>
                        </div>
                        <div style={{ padding: '2.5rem', border: '1px solid var(--color-border)', borderRadius: '20px', textAlign: 'center', backgroundColor: 'var(--color-surface)' }}>
                            <FileText size={48} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--color-accent)' }}>{stats.worksCount}</div>
                            <p style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>أعمال منشورة</p>
                        </div>
                        <div style={{ padding: '2.5rem', border: '1px solid var(--color-border)', borderRadius: '20px', textAlign: 'center', backgroundColor: 'var(--color-surface)' }}>
                            <BarChart2 size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981' }}>{stats.topicsCount}</div>
                            <p style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>مواضيع نقاشية</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { AdminConsole as default };
