import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Clock, Send, MessageSquare, Target, CheckCircle, BookOpen } from 'lucide-react';
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
    const [otherNotes, setOtherNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const fetchPending = async () => {
        setLoading(true);
        // Fetch pending OR corrected works. 
        // Corrected works need re-review.
        const { data, error } = await supabase
            .from('student_creations')
            .select('*, profiles:student_id(full_name, department)')
            .eq('category', 'ResearchPaper')
            .in('status', ['pending', 'corrected'])
            .order('created_at', { ascending: false });

        if (data && !error) {
            // Filter logic:
            // 1. If status is 'pending', show only if I haven't reviewed it yet.
            // 2. If status is 'corrected', show it (needs re-review), potentially even if I reviewed before? 
            //    Usually 'corrected' means the student addressed feedback, so previous reviewers should see it again.
            const filtered = data.filter(w => {
                const reviewedByMe = w.reviews?.some((r: any) => r.professor_id === profile?.id);
                if (w.status === 'corrected') return true; // Show corrected works to everyone for re-check
                return !reviewedByMe; // For pending works, only show if I haven't reviewed
            });
            setPendingWorks(filtered);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (profile) fetchPending();
    }, [profile]);

    if (profile && profile.role !== 'professor' && !profile.is_admin) {
        return <div style={{ padding: '5rem', textAlign: 'center' }}>الوصول غير مصرح به.</div>;
    }

    const resetForm = () => {
        setSelectedWork(null);
        setMethodNotes('');
        setLangNotes('');
        setOtherNotes('');
    };

    const handleApprove = async () => {
        if (!selectedWork) return;
        setSubmitting(true);
        try {
            // 1. Insert into the dedicated 'student_research_reviews' table
            const { error: reviewError } = await supabase
                .from('student_research_reviews')
                .insert([{
                    work_id: selectedWork.id,
                    professor_id: profile?.id,
                    professor_name: profile?.full_name,
                    method_notes: methodNotes,
                    lang_notes: langNotes,
                    other_notes: otherNotes
                }]);

            if (reviewError) throw reviewError;

            // 2. Prepare the new review object
            const newReview = {
                professor_id: profile?.id,
                professor_name: profile?.full_name,
                method_notes: methodNotes,
                lang_notes: langNotes,
                other_notes: otherNotes,
                created_at: new Date().toISOString()
            };

            const currentReviews = selectedWork.reviews || [];

            // Note: If it was 'corrected', we are adding a new review. 
            // We might want to remove the professor's OLD review or keep history. 
            // For this system, we append.
            const updatedReviews = [...currentReviews, newReview];
            const isFullyApproved = updatedReviews.filter((r: any) => !r.type || r.type !== 'revision_request').length >= 3;

            // 3. Update 'student_creations' table
            const { error: updateError } = await supabase
                .from('student_creations')
                .update({
                    status: isFullyApproved ? 'approved' : 'pending',
                    reviews: updatedReviews,
                    method_notes: methodNotes,
                    lang_notes: langNotes,
                    other_notes: otherNotes, // Ensure other_notes is also synced
                    reviewed_by: profile?.id,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', selectedWork.id);

            if (updateError) throw updateError;

            setToastMsg(isFullyApproved ? 'تم اعتماد البحث نهائياً ونشره في الرواق!' : `تم تسجيل تقييمكم. يحتاج البحث إلى المزيد من التقييمات.`);
            setShowToast(true);
            resetForm();
            fetchPending();
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRequestRevision = async () => {
        if (!selectedWork) return;
        if (!methodNotes && !langNotes && !otherNotes) {
            alert('يرجى إضافة ملاحظات التوجيه قبل إرسال طلب التصحيح.');
            return;
        }
        setSubmitting(true);
        try {
            const newReview = {
                professor_id: profile?.id,
                professor_name: profile?.full_name,
                method_notes: methodNotes,
                lang_notes: langNotes,
                other_notes: otherNotes,
                type: 'revision_request',
                created_at: new Date().toISOString()
            };

            const currentReviews = selectedWork.reviews || [];
            const updatedReviews = [...currentReviews, newReview];

            // 1. Insert into history table
            const { error: reviewError } = await supabase
                .from('student_research_reviews')
                .insert([{
                    work_id: selectedWork.id,
                    professor_id: profile?.id,
                    professor_name: profile?.full_name,
                    method_notes: methodNotes,
                    lang_notes: langNotes,
                    other_notes: otherNotes,
                    type: 'revision_request'
                }]);

            if (reviewError) throw reviewError;

            // 2. Update creations table
            const { error } = await supabase
                .from('student_creations')
                .update({
                    status: 'needs_revision',
                    reviews: updatedReviews,
                    method_notes: methodNotes,
                    lang_notes: langNotes,
                    other_notes: otherNotes // Sync other_notes here too
                })
                .eq('id', selectedWork.id);

            if (error) throw error;

            setToastMsg('تم إرسال البحث للطالب للتصحيح.');
            setShowToast(true);
            resetForm();
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
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '140px 1.5rem 4rem', maxWidth: '100vw', overflowX: 'hidden' }}>
            <div className="container-fluid" style={{ maxWidth: '1700px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem', borderRight: '5px solid var(--color-accent)', paddingRight: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        <Target size={35} color="var(--color-accent)" />
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '900', color: 'var(--color-primary)' }}>منصة تحكيم البحوث الطلابية المحكمة</h1>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>تحية طيبة، دكتور {profile?.full_name}. هذه الواجهة مخصصة للتحكيم العلمي الدقيق للأبحاث المودعة.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 350px',
                    gap: '2rem',
                    alignItems: 'start',
                    direction: 'ltr' // Ensures physical placement where 1fr is left and 350px is right
                }}>

                    {/* LEFT COLUMN (1fr): Research Article Content & Review Form */}
                    <div style={{ direction: 'rtl' }}>
                        {selectedWork ? (
                            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                                {/* 1. TITLE OF RESEARCH */}
                                <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                    <h1 style={{ fontSize: '2.8rem', color: 'var(--color-primary)', lineHeight: '1.3', marginBottom: '1.5rem', fontFamily: 'var(--font-family-serif)', fontWeight: '900' }}>{selectedWork.title}</h1>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', color: 'var(--color-text-secondary)', fontSize: '1.1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                                        <span><strong>الباحث:</strong> {selectedWork.profiles?.full_name}</span>
                                        <span><strong>القسم العلمي:</strong> {selectedWork.profiles?.department}</span>
                                        <span><strong>تاريخ الإيداع:</strong> {new Date(selectedWork.created_at).toLocaleDateString('ar-EG')}</span>
                                        <span><strong>التخصص:</strong> {selectedWork.specialty}</span>
                                    </div>
                                </div>

                                {/* 2. LARGE READABLE BOX FOR RESEARCH TEXT */}
                                <div className="glass-panel" style={{
                                    backgroundColor: 'white',
                                    padding: '2rem', // Fixed padding as requested
                                    width: '100%',
                                    boxSizing: 'border-box', // Ensure padding doesn't cause overflow
                                    borderRadius: '32px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                                    border: '1px solid #e2e8f0',
                                    position: 'relative',
                                    overflow: 'hidden' // Prevent any internal overflow leaking out
                                }}>
                                    <div style={{ position: 'absolute', top: '2rem', left: '2rem', opacity: 0.05 }}>
                                        <BookOpen size={100} />
                                    </div>
                                    <div className="research-article-box" style={{
                                        fontSize: '1.35rem',
                                        lineHeight: '1.8', // Adjusted for readability
                                        color: '#1e293b',
                                        textAlign: 'justify',
                                        fontFamily: 'var(--font-family-serif)',
                                        minHeight: '600px',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'normal', // STOP cutting words
                                        overflowWrap: 'break-word',
                                        hyphens: 'none' // Prevent auto-hyphenation
                                    }} dangerouslySetInnerHTML={{ __html: selectedWork.content }}></div>
                                </div>

                                {/* 3. PREVIOUS REVIEWS SECTION */}
                                {selectedWork.reviews && selectedWork.reviews.length > 0 && (
                                    <div style={{ backgroundColor: '#fff7ed', padding: '2.5rem', borderRadius: '24px', border: '2px dashed #fdba74' }}>
                                        <h3 style={{ fontSize: '1.5rem', color: '#9a3412', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '900' }}>
                                            <MessageSquare size={28} /> سجـل الملاحظات السـابقة (تحكيم الأقران)
                                        </h3>
                                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                                            {selectedWork.reviews.map((rev: any, idx: number) => (
                                                <div key={idx} style={{
                                                    backgroundColor: 'white',
                                                    padding: '2rem',
                                                    borderRadius: '20px',
                                                    border: '1px solid #fed7aa',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', borderBottom: '1px solid #fff7ed' }}>
                                                        <span style={{ fontWeight: '900', color: 'var(--color-primary)', fontSize: '1.1rem' }}>البروفيسور: {rev.professor_name}</span>
                                                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{new Date(rev.created_at).toLocaleDateString('ar-EG')}</span>
                                                    </div>
                                                    {rev.type === 'revision_request' && (
                                                        <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.2rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <Target size={16} /> تنبيه: طلب مراجعة وتعديل
                                                        </div>
                                                    )}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                                            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: '1.6' }}><strong>1. المنهجية العلمية:</strong> {rev.method_notes || 'لم تسجل ملاحظات'}</p>
                                                        </div>
                                                        <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                                            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: '1.6' }}><strong>2. المعيار اللغوي:</strong> {rev.lang_notes || 'لم تسجل ملاحظات'}</p>
                                                        </div>
                                                        {rev.other_notes && (
                                                            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                                                <p style={{ fontSize: '1rem', color: '#334155', lineHeight: '1.6' }}><strong>3. توجيهات إضافية للدراسة:</strong> {rev.other_notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 4. THE REVIEW FORM (BOTTOM) */}
                                <div id="review-form-section" className="glass-panel" style={{
                                    backgroundColor: '#fff',
                                    padding: '3rem',
                                    borderRadius: '28px',
                                    border: '2px solid var(--color-primary)',
                                    boxShadow: '0 15px 40px rgba(26, 35, 126, 0.1)'
                                }}>
                                    <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '900' }}>
                                        <CheckCircle size={30} color="var(--color-accent)" /> تقييم وقرار التحكيم المعتمد
                                    </h2>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                        <div style={{ width: '100%' }}>
                                            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.1rem' }}>ملاحظات المنهجية والتوثيق</label>
                                            <textarea
                                                value={methodNotes}
                                                onChange={(e) => setMethodNotes(e.target.value)}
                                                placeholder="دقة الإحالات، تسلسل الأفكار، سلامة المنهج المتبع..."
                                                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #e2e8f0', minHeight: '160px', outline: 'none', fontSize: '1.05rem', backgroundColor: '#fcfcfc' }}
                                            />
                                        </div>
                                        <div style={{ width: '100%' }}>
                                            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.1rem' }}>توصيات الصياغة واللغة</label>
                                            <textarea
                                                value={langNotes}
                                                onChange={(e) => setLangNotes(e.target.value)}
                                                placeholder="السلامة النحوية، الأسلوب الأكاديمي، علامات الترقيم..."
                                                style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #e2e8f0', minHeight: '160px', outline: 'none', fontSize: '1.05rem', backgroundColor: '#fcfcfc' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '3rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.1rem' }}>توجيهات ختامية (تظهر للطالب فقط)</label>
                                        <textarea
                                            value={otherNotes}
                                            onChange={(e) => setOtherNotes(e.target.value)}
                                            placeholder="توجيهات عامة لتحسين جودة البحث مستقبلاً أو متطلبات التصحيح..."
                                            style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '2px solid #e2e8f0', minHeight: '100px', outline: 'none', fontSize: '1.05rem', backgroundColor: '#fcfcfc' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                                        <button
                                            onClick={handleApprove}
                                            disabled={submitting}
                                            className="btn-premium card-hover"
                                            style={{
                                                flex: 2,
                                                padding: '1.4rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '1rem',
                                                fontSize: '1.3rem',
                                                borderRadius: '20px',
                                                boxShadow: '0 8px 20px rgba(26, 35, 126, 0.2)'
                                            }}
                                        >
                                            <CheckCircle size={24} /> {submitting ? 'جاري المعالجة...' : 'اعتمـاد النشـر (إيجابي)'}
                                        </button>

                                        <button
                                            onClick={handleRequestRevision}
                                            disabled={submitting}
                                            className="card-hover"
                                            style={{
                                                flex: 1,
                                                padding: '1.4rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '1rem',
                                                fontSize: '1.3rem',
                                                borderRadius: '20px',
                                                backgroundColor: '#fff',
                                                border: '3px solid #ef4444',
                                                color: '#ef4444',
                                                fontWeight: '900',
                                                cursor: 'pointer',
                                                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.1)'
                                            }}
                                        >
                                            <Send size={24} /> إرسال للتصحيح
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ height: '100%', minHeight: '700px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#94a3b8', border: '3px dashed #e2e8f0', borderRadius: '32px', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                                <BookOpen size={80} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                                <p style={{ fontSize: '1.5rem', fontWeight: '500' }}>يرجى اختيار بحث علمي من القائمة الجانبية لبدء عملية المراجعة.</p>
                                <p style={{ fontSize: '1rem', opacity: 0.8, marginTop: '0.5rem' }}>نقدر جهودكم في إثراء البحث العلمي في المعهد.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN (350px): List of Student Works */}
                    <div style={{ position: 'sticky', top: '2rem', height: 'fit-content', direction: 'rtl' }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '24px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                        }}>
                            <h2 style={{ fontSize: '1.3rem', paddingBottom: '1rem', borderBottom: '3px solid var(--color-primary)', marginBottom: '1.5rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                قائمة الأبحاث المعلقة ({pendingWorks.length})
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingLeft: '0.5rem' }}>
                                {pendingWorks.length > 0 ? pendingWorks.map(work => (
                                    <div key={work.id}
                                        onClick={() => setSelectedWork(work)}
                                        className="card-hover"
                                        style={{
                                            backgroundColor: selectedWork?.id === work.id ? 'var(--color-primary)' : 'white',
                                            padding: '1.2rem',
                                            borderRadius: '16px',
                                            border: selectedWork?.id === work.id ? 'none' : '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            color: selectedWork?.id === work.id ? 'white' : 'inherit'
                                        }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    backgroundColor: selectedWork?.id === work.id ? 'rgba(255,255,255,0.2)' : 'rgba(197, 160, 89, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: selectedWork?.id === work.id ? 'white' : 'var(--color-accent)'
                                                }}>
                                                    <User size={14} />
                                                </div>
                                                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>{work.profiles?.full_name}</h3>
                                            </div>
                                            {work.status === 'corrected' && (
                                                <span style={{ fontSize: '0.65rem', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>تم التصحيح</span>
                                            )}
                                        </div>
                                        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: '1.4', fontWeight: '600' }}>{work.title}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.8 }}>
                                            <span>{work.specialty}</span>
                                            <span><Clock size={12} style={{ verticalAlign: 'middle' }} /> {new Date(work.created_at).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                                        <CheckCircle size={40} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>لا توجد أبحاث معلقة حالياً.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessToast show={showToast} message={toastMsg} onClose={() => setShowToast(false)} />
        </div>
    );
};

export default StudentResearchHub;
