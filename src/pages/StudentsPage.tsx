import { useEffect, useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import StudentCard from '../components/common/StudentCard';

const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('All');
    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'student');

            if (data && !error) {
                setStudentsList(data.map((s: any) => ({
                    id: s.id,
                    name: s.full_name || 'طالب مجهول',
                    level: s.level || 'غير محدد',
                    department: s.department || 'القسم العام',
                    interests: Array.isArray(s.interests) ? s.interests : [],
                    imageUrl: s.avatar_url || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400'
                })));
            }
            setLoading(false);
        };

        fetchStudents();
    }, []);

    const filteredStudents = studentsList.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.interests.some((interest: string) => interest.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLevel = filterLevel === 'All' || (
            filterLevel === 'PhD' ? student.level === 'phd' :
                filterLevel === 'Master' ? student.level === 'master' :
                    filterLevel === 'Bachelor' ? student.level === 'licence' : false
        );
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'rgba(26, 35, 126, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    color: 'var(--color-primary)'
                }}>
                    <GraduationCap size={32} />
                </div>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>مجتمع الطلاب والباحثين</h1>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
                    اكتشف زملاءك من الباحثين والطلاب المتميزين، وتواصل معهم لتبادل الخبرات والمعرفة.
                </p>
            </div>

            {/* Search & Filter */}
            <div style={{
                padding: '2rem',
                marginBottom: '4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)'
            }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
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
                        placeholder="ابحث عن اسم طالب، تخصص، أو اهتمام بحثي..."
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
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['All', 'PhD', 'Master', 'Bachelor'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setFilterLevel(level)}
                            style={{
                                padding: '0.6rem 2rem',
                                borderRadius: '999px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                backgroundColor: filterLevel === level ? 'var(--color-primary)' : 'white',
                                color: filterLevel === level ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                border: `2px solid ${filterLevel === level ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                boxShadow: filterLevel === level ? '0 4px 12px rgba(26, 35, 126, 0.2)' : 'none'
                            }}
                        >
                            {level === 'All' ? 'جميع المستويات' : level === 'PhD' ? 'دكتوراه' : level === 'Master' ? 'ماجستير' : 'ليسانس'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="animate-pulse" style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        جاري تحميل البيانات...
                    </div>
                </div>
            ) : filteredStudents.length > 0 ? (
                <div className="grid-responsive-cards">
                    {filteredStudents.map(student => (
                        <StudentCard key={student.id} student={student} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
                    <p>لا توجد نتائج مطابقة للبحث.</p>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;
