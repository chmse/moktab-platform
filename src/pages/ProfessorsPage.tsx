import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ProfessorCard from '../components/common/ProfessorCard';
import { supabase } from '../lib/supabaseClient';
import type { Professor } from '../data/mockData';

const ProfessorsPage = () => {
    const [professorsList, setProfessorsList] = useState<Professor[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfessors = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'professor');

            if (data && !error) {
                // Explicitly mapping Supabase profile fields to the Professor interface
                const mappedProfessors: Professor[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.full_name || 'أستاذ غير معروف',
                    title: item.rank || 'عضو هيئة تدريس',
                    department: item.department || 'القسم العلمي',
                    imageUrl: item.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
                    interests: Array.isArray(item.interests) ? item.interests : [],
                    courses: [] // Mapping empty courses for now as they're not in the profiles table
                }));
                setProfessorsList(mappedProfessors);
            }
            setLoading(false);
        };

        fetchProfessors();
    }, []);

    const filteredProfessors = professorsList.filter(professor =>
        professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>أعضاء هيئة التدريس والباحثين</h1>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    نخبة من العلماء والباحثين المتميزين في مختلف التخصصات الأكاديمية، بسجل حافل من العطاء العلمي والمعرفي.
                </p>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{
                        position: 'absolute',
                        top: '50%',
                        right: '1.5rem',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-primary)',
                        opacity: 0.7
                    }} size={20} />
                    <input
                        type="text"
                        placeholder="ابحث عن اسم أستاذ، تخصص، أو اهتمام بحثي..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.2rem 3.5rem 1.2rem 1.5rem',
                            borderRadius: '999px',
                            border: '2px solid var(--color-surface-alt)',
                            fontSize: '1.1rem',
                            outline: 'none',
                            transition: 'all 0.3s',
                            backgroundColor: 'var(--color-surface-alt)',
                            color: 'var(--color-primary)'
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-surface-alt)';
                            e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        جاري تحميل البيانات...
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {filteredProfessors.length > 0 ? (
                        filteredProfessors.map((professor) => (
                            <ProfessorCard key={professor.id} professor={professor} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                            لا توجد نتائج مطابقة للبحث.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfessorsPage;
