import { useState } from 'react';
import { Bot, Sparkles, Lightbulb, Loader2, AlertCircle, X } from 'lucide-react';
import { extractPDFText, generateSummary, generateInsights } from '../../lib/aiService';

interface AISidebarProps {
    pdfUrl?: string;
    onClose?: () => void;
}

const AISidebar = ({ pdfUrl, onClose }: AISidebarProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [insights, setInsights] = useState<string[] | null>(null);
    const [activeFeature, setActiveFeature] = useState<'summary' | 'insights' | null>(null);

    const handleSummary = async () => {
        if (!pdfUrl) {
            setError('لا يوجد رابط لملف PDF');
            return;
        }

        setLoading(true);
        setError(null);
        setActiveFeature('summary');
        setSummary(null);
        setInsights(null);

        try {
            const text = await extractPDFText(pdfUrl);
            const aiSummary = await generateSummary(text);
            setSummary(aiSummary);
        } catch (err: any) {
            setError(err.message || 'فشل في إنشاء الملخص');
        } finally {
            setLoading(false);
        }
    };

    const handleInsights = async () => {
        if (!pdfUrl) {
            setError('لا يوجد رابط لملف PDF');
            return;
        }

        setLoading(true);
        setError(null);
        setActiveFeature('insights');
        setSummary(null);
        setInsights(null);

        try {
            const text = await extractPDFText(pdfUrl);
            const aiInsights = await generateInsights(text);
            setInsights(aiInsights);
        } catch (err: any) {
            setError(err.message || 'فشل في استخراج النتائج');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                    <Bot size={24} />
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>الذكاء الاصطناعي</h3>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem', // RTL: Left is the "end" or "start"? standard is corner.
                            zIndex: 100,
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            background: 'rgba(255,255,255,0.8)',
                            borderRadius: '50%'
                        }}
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                    onClick={handleSummary}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: activeFeature === 'summary' ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                        color: activeFeature === 'summary' ? 'white' : 'var(--color-text-primary)',
                        transition: 'all 0.2s',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                        border: 'none'
                    }}
                >
                    <Sparkles size={18} color={activeFeature === 'summary' ? 'white' : 'var(--color-accent)'} />
                    <span>ملخص الذكاء الاصطناعي</span>
                </button>

                <button
                    onClick={handleInsights}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: activeFeature === 'insights' ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                        color: activeFeature === 'insights' ? 'white' : 'var(--color-text-primary)',
                        transition: 'all 0.2s',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                        border: 'none'
                    }}
                >
                    <Lightbulb size={18} color={activeFeature === 'insights' ? 'white' : 'var(--color-accent)'} />
                    <span>أهم النتائج</span>
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(26, 35, 126, 0.05) 100%)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                }}>
                    <Loader2 size={32} color="var(--color-accent)" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '1rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                        جاري تحليل البحث...
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                        قد يستغرق هذا بضع ثوانٍ
                    </p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(220, 38, 38, 0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
                        <AlertCircle size={18} />
                        <strong>خطأ</strong>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#dc2626', marginTop: '0.5rem' }}>
                        {error}
                    </p>
                </div>
            )}

            {/* Summary Result */}
            {summary && !loading && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(26, 35, 126, 0.05) 100%)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(197, 160, 89, 0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>
                        <Sparkles size={18} />
                        <strong>الملخص</strong>
                    </div>
                    <p style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.8',
                        color: 'var(--color-text-primary)',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {summary}
                    </p>
                </div>
            )}

            {/* Insights Result */}
            {insights && !loading && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(26, 35, 126, 0.05) 100%)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(197, 160, 89, 0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>
                        <Lightbulb size={18} />
                        <strong>النتائج الرئيسية</strong>
                    </div>
                    <ul style={{
                        margin: 0,
                        paddingRight: '1.5rem',
                        fontSize: '0.95rem',
                        lineHeight: '1.8',
                        color: 'var(--color-text-primary)'
                    }}>
                        {insights.map((insight, index) => (
                            <li key={index} style={{ marginBottom: '0.75rem' }}>
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(26, 35, 126, 0.05)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <strong>ملاحظة:</strong> هذه الأدوات تستخدم الذكاء الاصطناعي لتحليل النص وقد لا تكون دقيقة بنسبة 100%.
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AISidebar;
