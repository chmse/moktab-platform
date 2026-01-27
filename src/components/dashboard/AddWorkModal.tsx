import { useState } from 'react';
import { X, FileText, BookOpen, Presentation } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface AddWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const AddWorkModal = ({ isOpen, onClose, onSuccess }: AddWorkModalProps) => {
    const [category, setCategory] = useState('Article');
    const [title, setTitle] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [abstract, setAbstract] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('يجب تسجيل الدخول لإضافة عمل علمي');
                return;
            }

            const { error } = await supabase
                .from('works')
                .insert([
                    {
                        title,
                        category,
                        publish_date: publishDate,
                        abstract,
                        pdf_url: pdfUrl,
                        cover_url: coverUrl,
                        professor_id: user.id,
                    }
                ]);

            if (!error) {
                alert('تم إضافة العمل العلمي بنجاح!');
                setTitle('');
                setPublishDate('');
                setAbstract('');
                setPdfUrl('');
                setCoverUrl('');
                onClose();
                if (onSuccess) onSuccess();
            } else {
                alert('حدث خطأ أثناء الإضافة: ' + error.message);
                console.error('Supabase error:', error);
            }
        } catch (err: any) {
            console.error('Unexpected error:', err);
            alert('حدث خطأ غير متوقع: ' + (err.message || 'يرجى المحاولة لاحقاً'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>
            <div className="glass-panel" style={{
                backgroundColor: 'white',
                width: '90%',
                maxWidth: '600px',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                position: 'relative',
                boxShadow: 'var(--shadow-lg)',
                maxHeight: '90vh',
                overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--color-text-secondary)' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '2rem', fontSize: '1.5rem' }}>
                    إضافة عمل جديد
                </h2>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>عنوان العمل</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="العنوان الكامل..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>النوع</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            >
                                <option value="Article">بحث / مقال</option>
                                <option value="Book">كتاب</option>
                                <option value="Conference">مداخلة مؤتمر</option>
                                <option value="Lecture">محاضرة</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>تاريخ النشر</label>
                            <input
                                type="date"
                                required
                                value={publishDate}
                                onChange={(e) => setPublishDate(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>الملخص / الوصف</label>
                        <textarea
                            rows={3}
                            required
                            value={abstract}
                            onChange={(e) => setAbstract(e.target.value)}
                            placeholder="وصف مختصر..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>مصدر الملف</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setPdfUrl('')}
                                    style={{
                                        flex: 1, padding: '0.5rem', fontSize: '0.85rem',
                                        backgroundColor: !pdfUrl.startsWith('http') && pdfUrl !== '' ? 'var(--color-primary)' : 'var(--color-surface)',
                                        color: !pdfUrl.startsWith('http') && pdfUrl !== '' ? 'white' : 'var(--color-text)',
                                        border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)'
                                    }}
                                >
                                    رفع ملف (PDF)
                                </button>
                                <button
                                    type="button"
                                    style={{
                                        flex: 1, padding: '0.5rem', fontSize: '0.85rem',
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)'
                                    }}
                                >
                                    أو أدخل رابط مباشر
                                </button>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={pdfUrl}
                                    onChange={(e) => setPdfUrl(e.target.value)}
                                    placeholder="رابط خارجي (ASJP, ResearchGate...)"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                />
                                <div style={{ marginTop: '0.5rem' }}>
                                    <label style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: 'var(--color-surface-alt)',
                                        border: '1px dashed var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        color: 'var(--color-primary)',
                                        width: '100%',
                                        justifyContent: 'center'
                                    }}>
                                        <FileText size={16} />
                                        {submitting ? 'جاري الرفع...' : 'اضغط لرفع ملف PDF'}
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                try {
                                                    setSubmitting(true);
                                                    const fileExt = file.name.split('.').pop();
                                                    const fileName = `${Math.random()}.${fileExt}`;
                                                    const filePath = `works/${fileName}`;

                                                    const { error: uploadError } = await supabase.storage
                                                        .from('works')
                                                        .upload(filePath, file);

                                                    if (uploadError) throw uploadError;

                                                    const { data: { publicUrl } } = supabase.storage
                                                        .from('works')
                                                        .getPublicUrl(filePath);

                                                    setPdfUrl(publicUrl);
                                                    alert('تم رفع الملف بنجاح!');
                                                } catch (error: any) {
                                                    alert('فشل رفع الملف: ' + error.message);
                                                } finally {
                                                    setSubmitting(false);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>رابط الغلاف (اختياري)</label>
                            <input
                                type="text"
                                value={coverUrl}
                                onChange={(e) => setCoverUrl(e.target.value)}
                                placeholder="https://example.com/cover.jpg"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-premium"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: submitting ? 0.7 : 1 }}
                        >
                            {submitting ? 'جاري النشر...' : (
                                <>
                                    {category === 'Lecture' ? <Presentation size={18} /> : category === 'Book' ? <BookOpen size={18} /> : <FileText size={18} />}
                                    {category === 'Lecture' ? 'نشر المحاضرة' : 'نشر العمل'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default AddWorkModal;
