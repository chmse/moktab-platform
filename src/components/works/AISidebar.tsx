import { Bot, Sparkles, MessageCircleQuestion } from 'lucide-react';

const AISidebar = () => {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                <Bot size={24} />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>الذكاء الاصطناعي</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-alt)',
                    color: 'var(--color-text-primary)',
                    transition: 'background 0.2s',
                    cursor: 'pointer'
                }}>
                    <Sparkles size={18} color="var(--color-accent)" />
                    <span>تلخيص البحث</span>
                </button>

                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-alt)',
                    color: 'var(--color-text-primary)',
                    transition: 'background 0.2s',
                    cursor: 'pointer'
                }}>
                    <Bot size={18} color="var(--color-accent)" />
                    <span>استخراج النقاط الرئيسية</span>
                </button>

                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-alt)',
                    color: 'var(--color-text-primary)',
                    transition: 'background 0.2s',
                    cursor: 'pointer'
                }}>
                    <MessageCircleQuestion size={18} color="var(--color-accent)" />
                    <span>سؤال للمؤلف (AI)</span>
                </button>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(26, 35, 126, 0.05)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <strong>ملاحظة:</strong> هذه الأدوات تستخدم الذكاء الاصطناعي لتحليل النص وقد لا تكون دقيقة بنسبة 100%.
            </div>
        </div>
    );
};

export default AISidebar;
