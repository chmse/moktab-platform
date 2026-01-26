import { useState, useEffect } from 'react';
import { User, ShieldCheck, CornerDownLeft, MessageSquare, Send } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface Comment {
    id: string;
    content: string;
    author_id: string;
    parent_id: string | null;
    created_at: string;
    profiles: {
        full_name: string;
        role: string;
        avatar_url: string | null;
    };
}

interface DiscussionSectionProps {
    workId?: string;
    topicId?: string;
}

const DiscussionSection = ({ workId, topicId }: DiscussionSectionProps) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        setLoading(true);
        let query = supabase
            .from('comments')
            .select(`
                *,
                profiles:author_id (full_name, role, avatar_url)
            `)
            .order('created_at', { ascending: true });

        if (workId) query = query.eq('work_id', workId);
        else if (topicId) query = query.eq('topic_id', topicId);

        const { data, error } = await query;
        if (data && !error) {
            setComments(data as Comment[]);
        } else if (error) {
            console.error('DiscussionSection: Fetch error:', error);
            setComments([]); // Safety fallback
        } else {
            setComments([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComments();
    }, [workId, topicId]);

    const handleAddComment = async (parentId: string | null = null) => {
        const content = parentId ? replyContent : newComment;
        if (!content.trim() || !user) {
            if (!user) alert('يرجى تسجيل الدخول للتعليق');
            return;
        }

        setSubmitting(true);
        try {
            console.log('DiscussionSection: Adding comment for user:', user.id);
            const { error } = await supabase
                .from('comments')
                .insert([{
                    content: content.trim(),
                    author_id: user.id,
                    work_id: workId || null,
                    topic_id: topicId || null,
                    parent_id: parentId
                }]);

            if (error) throw error;

            if (parentId) {
                setReplyContent('');
                setReplyingTo(null);
            } else {
                setNewComment('');
            }
            await fetchComments();
        } catch (error: any) {
            console.error('DiscussionSection: Error adding comment:', error);
            alert(`فشل إرسال التعليق: ${error.message || 'خطأ غير معروف'}`);
        } finally {
            setSubmitting(false);
        }
    };

    const renderComment = (comment: Comment, isReply = false) => {
        const isProfessor = comment?.profiles?.role === 'professor';

        return (
            <div key={comment.id} style={{
                backgroundColor: isProfessor ? 'rgba(197, 160, 89, 0.05)' : 'var(--color-surface)',
                border: isProfessor ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginRight: isReply ? '2rem' : '0',
                marginTop: isReply ? '0.75rem' : '0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isProfessor ? 'var(--color-accent)' : '#e2e8f0',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isProfessor ? 'white' : 'var(--color-text-secondary)'
                    }}>
                        {comment?.profiles?.avatar_url ? (
                            <img src={comment.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            isProfessor ? <ShieldCheck size={18} /> : <User size={18} />
                        )}
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', color: isProfessor ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                                {comment?.profiles?.full_name || 'مشارك مجهول'}
                            </h4>
                            {isProfessor ? (
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--color-accent)',
                                    backgroundColor: 'rgba(197, 160, 89, 0.1)',
                                    padding: '0.1rem 0.5rem',
                                    borderRadius: '999px',
                                    border: '1px solid var(--color-accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem'
                                }}>
                                    <ShieldCheck size={10} />
                                    أكاديمي محقق
                                </span>
                            ) : comment?.profiles?.role === 'student' ? (
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--color-primary)',
                                    backgroundColor: 'rgba(26, 35, 126, 0.05)',
                                    padding: '0.1rem 0.5rem',
                                    borderRadius: '999px',
                                    border: '1px solid var(--color-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem'
                                }}>
                                    <User size={10} />
                                    طالب باحث
                                </span>
                            ) : null}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            {comment?.created_at ? (
                                <>
                                    {new Date(comment.created_at).toLocaleDateString('ar-EG')} {new Date(comment.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                </>
                            ) : 'تاريخ غير متوفر'}
                        </span>
                    </div>
                </div>
                <p style={{ color: 'var(--color-text-primary)', lineHeight: '1.6', margin: '0 0 1rem 0' }}>{comment?.content}</p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                        <CornerDownLeft size={14} />
                        رد
                    </button>
                </div>

                {replyingTo === comment.id && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="اكتب ردك هنا..."
                            style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }}
                        />
                        <button
                            onClick={() => handleAddComment(comment.id)}
                            disabled={!replyContent.trim() || submitting}
                            className="btn-premium"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                )}

                {/* Render Replies */}
                {comments.filter(c => c.parent_id === comment.id).map(reply => renderComment(reply, true))}
            </div>
        );
    };

    const topLevelComments = comments.filter(c => !c.parent_id);

    return (
        <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MessageSquare size={24} />
                النقاش العلمي
            </h3>

            {loading ? (
                <p>جاري تحميل التعليقات...</p>
            ) : topLevelComments.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>لا توجد تعليقات حتى الآن. كن أول من يفتح باب النقاش!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {topLevelComments.map(comment => renderComment(comment))}
                </div>
            )}

            {user ? (
                <div style={{ marginTop: '3rem', backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ marginBottom: '1rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>أضف تعليقاً علمياً</h4>
                    <textarea
                        placeholder="أضف تعليقاً أو استفساراً علمياً..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            marginBottom: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        className="btn-premium"
                        onClick={() => handleAddComment()}
                        disabled={!newComment.trim() || submitting}
                    >
                        {submitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
                    </button>
                </div>
            ) : (
                <div style={{ marginTop: '2rem', padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>يرجى تسجيل الدخول لتتمكن من المشاركة في النقاش.</p>
                </div>
            )}
        </div>
    );
};

export default DiscussionSection;
