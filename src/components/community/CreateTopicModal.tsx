import { X, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface CreateTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CreateTopicModal = ({ isOpen, onClose, onSuccess }: CreateTopicModalProps) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('يجب تسجيل الدخول لنشر موضوع');
                return;
            }

            const { error } = await supabase
                .from('community_topics')
                .insert([
                    {
                        title,
                        category,
                        description,
                        is_elevated: category === 'Elevated',
                        author_id: user.id
                    }
                ]);

            if (!error) {
                alert('تم نشر القضية العلمية بنجاح!');
                setTitle('');
                setDescription('');
                setCategory('General');
                onClose();
                if (onSuccess) onSuccess();
            } else {
                alert('خطأ في نشر الموضوع: ' + error.message);
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
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div className="animate-fade-in" style={{
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '600px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    backgroundColor: 'var(--color-primary)',
                    padding: '1.5rem',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>طرح قضية علمية للنقاش</h2>
                    <button onClick={onClose} style={{ color: 'white', opacity: 0.8 }} className="card-hover">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>عنوان القضية</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="مثلاً: مستقبل التعليم في عصر الذكاء الاصطناعي"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>التصنيف</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                fontSize: '1rem',
                                outline: 'none',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="General">نقاش عام</option>
                            <option value="Professors">خاص بالأساتذة</option>
                            <option value="Elevated">قضية علمية كبرى</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>وصف القضية</label>
                        <textarea
                            required
                            rows={5}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="اشرح القضية واذكر النقاط التي تود نقاشها مع زملائك..."
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'none'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-premium"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}
                        >
                            <Send size={18} />
                            {submitting ? 'جاري النشر...' : 'نشر القضية'}
                        </button>
                        <button type="button" onClick={onClose} disabled={submitting} style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)',
                            fontWeight: 'bold',
                            flex: 0.5,
                            cursor: 'pointer'
                        }}>
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTopicModal;
