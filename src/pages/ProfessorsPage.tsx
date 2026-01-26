import { useEffect, useState } from 'react';
import ProfessorCard from '../components/common/ProfessorCard';
import { supabase } from '../lib/supabaseClient';
import type { Professor } from '../data/mockData';

const ProfessorsPage = () => {
    const [professorsList, setProfessorsList] = useState<Professor[]>([]);
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

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>أعضاء هيئة التدريس والباحثين</h1>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    نخبة من العلماء والباحثين المتميزين في مختلف التخصصات الأكاديمية، بسجل حافل من العطاء العلمي والمعرفي.
                </p>
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
                    {professorsList.length > 0 ? (
                        professorsList.map((professor) => (
                            <ProfessorCard key={professor.id} professor={professor} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                            لا يوجد أساتذة متاحون حالياً.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfessorsPage;
