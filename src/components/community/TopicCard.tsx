import { MessageSquare, Star, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CommunityTopic } from '../../data/mockData';

interface TopicCardProps {
    topic: CommunityTopic;
}

const TopicCard = ({ topic }: TopicCardProps) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/community/${topic.id}`)}
            className="card-hover animate-fade-in"
            style={{
                padding: '1.25rem',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                border: topic.isElevated ? '1.5px solid var(--color-accent)' : '1px solid rgba(0,0,0,0.05)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}
        >
            {topic.isElevated && (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    backgroundColor: 'var(--color-accent)',
                    color: '#1a1a1a',
                    padding: '0.2rem 0.75rem',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    borderBottomRightRadius: '10px'
                }}>
                    <Star size={10} fill="currentColor" />
                    موضوع متميز
                </div>
            )}

            <div style={{ marginTop: topic.isElevated ? '0.75rem' : '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{
                        color: 'var(--color-accent)',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {topic.category === 'General' ? 'نقاش عام' : topic.category === 'Professors' ? 'خاص بالأساتذة' : 'قضية علمية'}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{topic.date}</span>
                </div>

                <h3 style={{
                    fontSize: '1.1rem',
                    color: 'var(--color-primary)',
                    marginBottom: '0.4rem',
                    fontWeight: '800',
                    lineHeight: '1.4'
                }}>
                    {topic.title}
                </h3>

                <p style={{
                    color: '#64748b',
                    fontSize: '0.85rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.6'
                }}>
                    {topic.description}
                </p>
            </div>

            <div style={{
                marginTop: 'auto',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary)'
                    }}>
                        <User size={14} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e293b' }}>{topic.authorName}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                    <MessageSquare size={14} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{topic.participationCount}</span>
                </div>
            </div>
        </div>
    );
};

export default TopicCard;
