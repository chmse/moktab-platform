const AboutPage = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: '#000033', marginBottom: '1.5rem', fontWeight: '900' }}>عن المنصة</h1>

                <div style={{
                    padding: '3rem',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    borderTop: '6px solid #c5a059'
                }}>
                    <h2 style={{ color: '#c5a059', marginBottom: '1rem', fontSize: '1.8rem' }}>مَنْصَة مَكْتَب الأكاديمية</h2>
                    <h3 style={{ color: '#555', marginBottom: '2rem', fontSize: '1.2rem' }}>معهد الآداب واللغات - المركز الجامعي آفلو</h3>

                    <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', marginBottom: '2rem', textAlign: 'justify' }}>
                        تعتبر منصة "مكتب" الرائدة بيئة رقمية أكاديمية متكاملة تهدف إلى تعزيز البحث العلمي والتواصل الأكاديمي داخل معهد الآداب واللغات.
                        نسعى من خلال هذه المنصة إلى توفير فضاء معرفي يجمع بين الأساتذة والطلبة، ويتيح الوصول السلس إلى النتاج العلمي والمحاضرات والمناقشات الأكاديمية.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '0.5rem' }}>
                            <h4 style={{ color: '#000033', marginBottom: '0.5rem', fontWeight: 'bold' }}>رؤيتنا</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>الريادة في الرقمنة الأكاديمية وتعزيز جودة التعليم والبحث.</p>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '0.5rem' }}>
                            <h4 style={{ color: '#000033', marginBottom: '0.5rem', fontWeight: 'bold' }}>رسالتنا</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>تمكين المجتمع الجامعي من أدوات تواصل وبحث فعالة وحديثة.</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '3rem', color: '#888', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} جميع الحقوق محفوظة - معهد الآداب واللغات
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
