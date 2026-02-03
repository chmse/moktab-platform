import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Clock, Send, MessageSquare, Target, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SuccessToast from '../components/ui/SuccessToast';

const StudentResearchHub = () => {
    const { profile } = useAuth();
    const [pendingWorks, setPendingWorks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWork, setSelectedWork] = useState<any | null>(null);

    // Evaluation State
    const [methodNotes, setMethodNotes] = useState('');
    const [langNotes, setLangNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const fetchPending = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('student_creations')
            .select('*, profiles:student_id(full_name, department)')
            .eq('category', 'ResearchPaper')
            .eq('status', 'pending') // STRICT: Only pending for review
            .order('created_at', { ascending: false });

        if (data && !error) setPendingWorks(data);
        setLoading(false);
    };

    if (profile && profile.role !== 'professor' && !profile.is_admin) {
        return <div style={{ padding: '5rem', textAlign: 'center' }}>الوصول غير مصرح به.</div>;
    }

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async () => {
        if (!selectedWork) return;
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('student_creations')
                .update({
                    status: 'approved',
                    method_notes: methodNotes,
                    lang_notes: langNotes,
                    reviewed_by: profile?.id,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', selectedWork.id);

            if (error) throw error;

            setToastMsg('تم اعتماد البحث ونشره في الرواق العلمي بنجاح');
            setShowToast(true);
            setSelectedWork(null);
            setMethodNotes('');
            setLangNotes('');
            fetchPending();
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>جاري استحضار الأبحاث المودعة للتحكيم...</div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '4rem 1rem' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-accent)', marginBottom: '1rem' }}>
                        <Target size={30} />
                        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>منصة تحكيم البحوث الطلابية</h1>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>مرحباً يا بوفيسور، بانتظار مساهمتكم في تقييم وتوجيه نتاج الطلبة العلمي.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: selectedWork ? '1fr 400px' : '1fr', gap: '2.5rem' }}>
                    {/* List Section */}
                    <div>
                        <h2 style={{ fontSize: '1.4rem', borderRight: '4px solid var(--color-primary)', paddingRight: '1rem', marginBottom: '2rem' }}>الأبحاث المختارة للتحكيم ({pendingWorks.length})</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {pendingWorks.length > 0 ? pendingWorks.map(work => (
                                <div key={work.id}
                                    onClick={() => setSelectedWork(work)}
                                    className="card-hover"
                                    style={{
                                        backgroundColor: selectedWork?.id === work.id ? '#eff6ff' : 'white',
                                        padding: '1.5rem',
                                        borderRadius: '16px',
                                        border: selectedWork?.id === work.id ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                                        cursor: 'pointer'
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'rgba(197, 160, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)' }}>
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-primary)' }}>{work.profiles?.full_name}</h3>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{work.profiles?.department}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                                            <Clock size={14} /> {new Date(work.created_at).toLocaleDateString('ar-EG')}
                                        </div>
                                    </div>
                                    <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>{work.title}</h2>
                                    {work.specialty && <p style={{ fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>التخصص: {work.specialty}</p>}
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '5rem', backgroundColor: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                                    <CheckCircle size={50} color="#10b981" style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                    <p style={{ color: 'var(--color-text-secondary)' }}>لا توجد أبحاث معلقة حالياً. تم تحكيم جميع المساهمات!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Review Panel */}
                    {selectedWork && (
                        <div className="glass-panel" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', position: 'sticky', top: '2rem', height: 'fit-content' }}>
                            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <MessageSquare size={20} /> لوحة التحكيم العلمي
                            </h2>

                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>محتوى البحث:</h3>
                                <div style={{
                                    backgroundColor: '#fffcf5',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: '1px solid #fce8cc',
                                    fontSize: '0.95rem',
                                    maxHeight: '300px',
                                    overflowY: 'auto',
                                    fontFamily: 'serif'
                                }} dangerouslySetInnerHTML={{ __html: selectedWork.content }}></div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الملاحظات المنهجية</label>
                                    <textarea
                                        value={methodNotes}
                                        onChange={(e) => setMethodNotes(e.target.value)}
                                        placeholder="قوة الإشكالية، ترتيب العناصر، توثيق المصادر..."
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', minHeight: '80px', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الملاحظات اللغوية والأسلوبية</label>
                                    <textarea
                                        value={langNotes}
                                        onChange={(e) => setLangNotes(e.target.value)}
                                        placeholder="سلامة اللغة، وضوح الأسلوب، جودة التعبير..."
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', minHeight: '80px', outline: 'none' }}
                                    />
                                </div>

                                <button
                                    onClick={handleApprove}
                                    disabled={submitting}
                                    className="btn-premium"
                                    style={{ width: '100%', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.1rem', borderRadius: '15px' }}
                                >
                                    <Send size={20} /> {submitting ? 'جاري الاعتماد...' : 'اعتماد النشر في الرواق'}
                                </button>

                                <button
                                    onClick={() => setSelectedWork(null)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    إلغاء المراجعة
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <SuccessToast show={showToast} message={toastMsg} onClose={() => setShowToast(false)} />
        </div>
    );
};

export default StudentResearchHub;
