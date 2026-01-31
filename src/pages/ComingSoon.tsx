import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const ComingSoon = () => {
    return (
        <div className="container" style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div style={{
                marginBottom: '2rem',
                color: '#c5a059'
            }}>
                <Sparkles size={64} />
            </div>

            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: '#000033',
                marginBottom: '1rem'
            }}>
                قريباً..
            </h1>

            <p style={{
                fontSize: '1.25rem',
                color: '#555',
                maxWidth: '600px',
                marginBottom: '3rem'
            }}>
                ننتظركم مع ميزات تقنية متطورة لتعزيز التجربة الأكاديمية والبحثية.
                نعمل حالياً على تجهيز هذا القسم ليليق بتطلعاتكم.
            </p>

            <Link to="/" className="btn-premium" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 2rem'
            }}>
                <ArrowRight size={20} />
                العودة للرئيسية
            </Link>
        </div>
    );
};

export default ComingSoon;
