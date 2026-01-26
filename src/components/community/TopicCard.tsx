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
            className="card-hover glass-panel animate-fade-in"
            style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                border: topic.isElevated ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
            }}
        >
            {topic.isElevated && (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-primary-dark)',
                    padding: '0.25rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderBottomRightRadius: '12px'
                }}>
                    <Star size={12} fill="currentColor" />
                    موضوع مرتفع
                </div>
            )}

            <div style={{ marginTop: topic.isElevated ? '1rem' : '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{
                        backgroundColor: topic.category === 'Professors' ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                        color: topic.category === 'Professors' ? 'white' : 'var(--color-text-secondary)',
                        padding: '0.2rem 0.8rem',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                    }}>
                        {topic.category === 'General' ? 'نقاش عام' : topic.category === 'Professors' ? 'خاص بالأساتذة' : 'قضية علمية'}
                    </span>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{topic.date}</span>
                </div>

                <h3 style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-primary)',
                    marginBottom: '0.5rem',
                    fontWeight: '700',
                    lineHeight: '1.4'
                }}>
                    {topic.title}
                </h3>

                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '1.5rem'
                }}>
                    {topic.description}
                </p>
            </div>

            <div style={{
                marginTop: 'auto',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-surface-alt)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-surface-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary)'
                    }}>
                        <User size={16} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{topic.authorName}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)' }}>
                    <MessageSquare size={16} />
                    <span style={{ fontSize: '0.85rem' }}>{topic.participationCount} مشاركة</span>
                </div>
            </div>
        </div>
    );
};

export default TopicCard;
