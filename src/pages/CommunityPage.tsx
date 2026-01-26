import { useEffect, useState } from 'react';
import { Search, Plus, Filter, Users, Shield, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import TopicCard from '../components/community/TopicCard';
import CreateTopicModal from '../components/community/CreateTopicModal';

const CommunityPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'General' | 'Professors' | 'Elevated'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTopics = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('community_topics')
            .select(`
                *,
                profiles:author_id (full_name)
            `)
            .order('created_at', { ascending: false });

        if (data && !error) {
            setTopics(data.map(t => ({
                ...t,
                authorName: t.profiles?.full_name || 'مستخدم مجهول',
                date: new Date(t.created_at).toLocaleDateString('ar-EG')
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const filteredTopics = topics.filter(topic => {
        const matchesSearch = topic.title.includes(searchTerm) || topic.description.includes(searchTerm);
        const matchesFilter = activeFilter === 'All' || topic.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const filterButtons = [
        { id: 'All', label: 'الكل', icon: <Users size={18} /> },
        { id: 'General', label: 'نقاش عام', icon: <Users size={18} /> },
        { id: 'Professors', label: 'خاص بالأساتذة', icon: <Shield size={18} /> },
        { id: 'Elevated', label: 'قضايا علمية كبرى', icon: <TrendingUp size={18} /> },
    ];

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', fontWeight: '800', marginBottom: '1rem' }}>المجتمع العلمي</h1>
                    <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', fontSize: '1.1rem' }}>
                        مساحة فكرية مخصصة للأكاديميين والباحثين لطرح القضايا العلمية الكبرى وتعميق النقاش الأكاديمي.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-premium"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1rem 2rem' }}
                >
                    <Plus size={20} />
                    طرح قضية علمية
                </button>
            </div>

            {/* Controls */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {filterButtons.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id as any)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.7rem 1.25rem',
                                borderRadius: '999px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                backgroundColor: activeFilter === filter.id ? 'var(--color-primary)' : 'var(--color-surface-alt)',
                                color: activeFilter === filter.id ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                transition: 'all 0.3s',
                                border: 'none'
                            }}
                            className="card-hover"
                        >
                            {filter.icon}
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                    <Search style={{ position: 'absolute', top: '50%', right: '1.25rem', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} size={18} />
                    <input
                        type="text"
                        placeholder="ابحث في المواضيع..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem 3rem 0.8rem 1.25rem',
                            borderRadius: '999px',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.95rem',
                            outline: 'none',
                            backgroundColor: 'white'
                        }}
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        جاري تحميل المواضيع العلمية...
                    </div>
                </div>
            ) : filteredTopics.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '2rem'
                }}>
                    {filteredTopics.map(topic => (
                        <TopicCard key={topic.id} topic={topic} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                    <Filter size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.2rem' }}>لا توجد مواضيع تطابق معايير البحث.</p>
                </div>
            )}

            <CreateTopicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTopics}
            />
        </div>
    );
};

export default CommunityPage;
