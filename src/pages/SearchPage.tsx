import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import WorkCard from '../components/works/WorkCard';
import { Search, Filter, BookOpen } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [searchTerm, setSearchTerm] = useState(query);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [category, setCategory] = useState('All');
    const [year, setYear] = useState('All');
    // const [department, setDepartment] = useState('All');

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                let queryBuilder = supabase
                    .from('works')
                    .select(`
                        *,
                        profiles:professor_id (full_name, avatar_url)
                    `)
                    .textSearch('title', searchTerm || ' ', { type: 'websearch', config: 'arabic' });

                // If textSearch doesn't suit, we can use simple ilike for basic titles
                if (!searchTerm) {
                    queryBuilder = supabase
                        .from('works')
                        .select(`
                            *,
                            profiles:professor_id (full_name, avatar_url)
                        `)
                        .order('created_at', { ascending: false });
                } else {
                    queryBuilder = supabase
                        .from('works')
                        .select(`
                            *,
                            profiles:professor_id (full_name, avatar_url)
                        `)
                        .ilike('title', `%${searchTerm}%`);
                }

                if (category !== 'All') {
                    queryBuilder = queryBuilder.eq('category', category);
                }

                if (year !== 'All') {
                    // Requires extracting year from date, but for now assuming simple filter if we had a dedicated year column
                    // or filtering on client side if dataset is small. 
                    // Let's rely on date range if needed, or simple client filter for MVP.
                    // queryBuilder = queryBuilder.gte('publish_date', `${year}-01-01`).lte('publish_date', `${year}-12-31`);
                }

                const { data, error } = await queryBuilder;

                if (error) throw error;

                if (data) {
                    let filtered = data.map(w => ({
                        ...w,
                        professorName: w.profiles?.full_name || 'أستاذ غير معروف',
                        professorImageUrl: w.profiles?.avatar_url,
                        publishDate: w.publish_date || w.publishDate || new Date(w.created_at).toLocaleDateString('ar-EG'),
                    }));

                    if (year !== 'All') {
                        filtered = filtered.filter(w => w.publishDate.includes(year));
                    }

                    setResults(filtered);
                }

            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(() => {
            fetchResults();
        }, 500);

        return () => clearTimeout(timeout);

    }, [searchTerm, category, year]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
            <Navbar />
            <div className="container" style={{ padding: '8rem 1rem 4rem' }}>

                {/* Search Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', color: '#1E293B', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                        البحث المتقدم
                    </h1>
                    <div style={{ position: 'relative', maxWidth: '800px' }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث في الأرشيف الأكاديمي..."
                            style={{
                                width: '100%',
                                padding: '1rem 3rem 1rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid var(--color-accent)',
                                fontSize: '1.1rem',
                                outline: 'none'
                            }}
                        />
                        <Search style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-accent)' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>

                    {/* Filters Sidebar */}
                    <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
                            <Filter size={20} />
                            <h3 style={{ fontWeight: 'bold' }}>تصفية النتائج</h3>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>نوع العمل</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                            >
                                <option value="All">الكل</option>
                                <option value="Article">مقالات وأبحاث</option>
                                <option value="Book">كتب ومؤلفات</option>
                                <option value="Thesis">رسائل جامعية</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>السنة</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                            >
                                <option value="All">كل السنوات</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                        </div>

                        <button
                            onClick={() => { setCategory('All'); setYear('All'); setSearchTerm(''); }}
                            style={{ width: '100%', padding: '0.5rem', border: '1px dashed var(--color-text-secondary)', borderRadius: '6px', background: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                        >
                            إعادة تعيين
                        </button>
                    </div>

                    {/* Results Grid */}
                    <div>
                        <div style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                            تم العثور على <strong>{results.length}</strong> نتيجة
                        </div>

                        {loading ? (
                            <div className="animate-pulse" style={{ display: 'grid', gap: '1rem' }}>
                                {[1, 2, 3].map(i => <div key={i} style={{ height: '150px', backgroundColor: '#e2e8f0', borderRadius: '8px' }}></div>)}
                            </div>
                        ) : results.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                {results.map((work) => (
                                    <WorkCard key={work.id} work={work} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.2rem', color: '#64748b' }}>لم يتم العثور على نتائج</h3>
                                <p style={{ color: '#94a3b8' }}>حاول تغيير كلمات البحث أو المرشحات</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
