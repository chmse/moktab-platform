export interface Lecture {
    id: string;
    title: string;
    date: string;
    pdfUrl: string;
}

export interface Course {
    id: string;
    title: string;
    code: string;
    year: string;
    lectures: Lecture[];
}

export interface Professor {
    id: string;
    name: string;
    title: string;
    department: string;
    imageUrl: string;
    interests: string[];
    courses: Course[];
    bio?: string;
    role?: 'professor' | 'student';
    level?: string;
}

export interface Student {
    id: string;
    name: string;
    level: 'PhD' | 'Master' | 'Bachelor';
    department: string;
    imageUrl: string;
    interests: string[];
}

export interface DiscussionComment {
    id: string;
    author: string;
    date: string;
    content: string;
    isProfessor?: boolean;
}

export interface ScientificWork {
    id: string;
    title: string;
    professorId: string;
    abstract: string;
    content: string;
    publishDate: string;
    type: 'Article' | 'Book' | 'Thesis'; // Legacy type for compatibility
    category: 'Article' | 'Book' | 'Conference';
    comments: DiscussionComment[];
}

export interface CommunityTopic {
    id: string;
    title: string;
    authorId: string;
    authorName: string;
    category: 'General' | 'Professors' | 'Elevated';
    participationCount: number;
    isElevated: boolean;
    date: string;
    description: string;
    comments: CommunityComment[];
    relatedResearchIds?: string[];
}

export interface CommunityComment {
    id: string;
    authorName: string;
    authorImageUrl?: string;
    content: string;
    date: string;
    isProfessor?: boolean;
    isPinned?: boolean;
    replies?: CommunityComment[];
}

export const professors: Professor[] = [
    {
        id: "prof-1",
        name: "أ.د. محمد العلوي",
        title: "أستاذ كرسي في العلوم الإسلامية",
        department: "كلية أصول الدين",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
        interests: ["الفقه المقارن", "مقاصد الشريعة", "التاريخ الإسلامي"],
        courses: [
            {
                id: "course-1",
                title: "فقه المعاملات المالية المعاصرة",
                code: "ISL401",
                year: "2023/2024",
                lectures: [
                    { id: "lec-1", title: "مقدمة في المعاملات المالية", date: "2023-09-15", pdfUrl: "#" },
                    { id: "lec-2", title: "الربا وأنواعه في العصر الحديث", date: "2023-09-22", pdfUrl: "#" },
                    { id: "lec-3", title: "عقود التمويل الإسلامي", date: "2023-09-29", pdfUrl: "#" }
                ]
            },
            {
                id: "course-2",
                title: "مقاصد الشريعة الإسلامية",
                code: "ISL302",
                year: "2023/2024",
                lectures: [
                    { id: "lec-4", title: "تطور علم المقاصد", date: "2023-10-05", pdfUrl: "#" },
                    { id: "lec-5", title: "الضروريات الخمس", date: "2023-10-12", pdfUrl: "#" }
                ]
            }
        ]
    },
    {
        id: "prof-2",
        name: "د. فاطمة الزهراء",
        title: "أستاذة مشاركة في الأدب العربي",
        department: "كلية الآداب والعلوم الإنسانية",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        interests: ["الشعر الجاهلي", "النقد الأدبي الحديث", "الأدب الأندلسي"],
        courses: [
            {
                id: "course-3",
                title: "الشعر الجاهلي: قضاياه وفنونه",
                code: "LIT201",
                year: "2023/2024",
                lectures: [
                    { id: "lec-6", title: "المعلقات: التوثيق والرواية", date: "2023-09-10", pdfUrl: "#" }
                ]
            }
        ]
    },
    {
        id: "prof-3",
        name: "د. يوسف المنصور",
        title: "باحث في الفلسفة وعلم الكلام",
        department: "قسم الفلسفة",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
        interests: ["الفلسفة الإسلامية", "علم الكلام", "المنطق"],
        courses: []
    }
];

export const students: Student[] = [
    {
        id: "stud-1",
        name: "عمر خالد",
        level: "PhD",
        department: "كلية أصول الدين",
        imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400",
        interests: ["الفقه المقارن", "المعاملات المالية", "التاريخ"]
    },
    {
        id: "stud-2",
        name: "سارة أحمد",
        level: "Master",
        department: "كلية الآداب",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
        interests: ["الأدب المعاصر", "النقد الأدبي", "الرواية العربية"]
    },
    {
        id: "stud-3",
        name: "ياسر محمود",
        level: "Bachelor",
        department: "علوم الحاسوب",
        imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400",
        interests: ["الذكاء الاصطناعي", "تطوير الويب", "قواعد البيانات"]
    },
    {
        id: "stud-4",
        name: "مريم علي",
        level: "PhD",
        department: "علم النفس التربوي",
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
        interests: ["علم النفس المعرفي", "صعوبات التعلم", "تطوير المناهج"]
    },
    {
        id: "stud-5",
        name: "أحمد كمال",
        level: "Master",
        department: "الاقتصاد الإسلامي",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        interests: ["الصيرفة الإسلامية", "الأسواق المالية", "التنمية المستدامة"]
    },
    {
        id: "stud-6",
        name: "ليلى حسن",
        level: "Bachelor",
        department: "العلوم السياسية",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
        interests: ["العلاقات الدولية", "السياسة العامة", "حقوق الإنسان"]
    },
    {
        id: "stud-7",
        name: "خالد بن الوليد",
        level: "PhD",
        department: "الدراسات الإسلامية",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
        interests: ["علوم الحديث", "تحقيق التراث", "المخطوطات"]
    },
    {
        id: "stud-8",
        name: "نورا القحطاني",
        level: "Master",
        department: "إدارة الأعمال",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        interests: ["القيادة الإدارية", "التسويق الرقمي", "ريادة الأعمال"]
    }
];

export const works: ScientificWork[] = [
    {
        id: "work-1",
        title: "أثر المقاصد الشرعية في المعاملات المالية المعاصرة",
        professorId: "prof-1",
        type: "Article",
        category: "Article",
        publishDate: "2024-03-15",
        abstract: "تهدف هذه الدراسة إلى الكشف عن أثر المقاصد الشرعية في توجيه المعاملات المالية الحديثة، وكيف يمكن استثمار القواعد الفقهية الكلية في استنباط أحكام للنوازل المالية المستجدة.",
        content: "هنا يوضع النص الكامل للبحث... يعتبر فقه المعاملات من أكثر أبواب الفقه تطوراً وتجدداً نظراً لتطور الحياة الاقتصادية وتشابك العلاقات المالية...",
        comments: [
            { id: "comm-1", author: "باحث دكتوراه", date: "2024-03-16", content: "بحث قيم جداً يا دكتور، هل يمكن تطبيق هذه القواعد على العملات الرقمية؟" },
            { id: "comm-2", author: "أ.د. محمد العلوي", date: "2024-03-17", content: "شكراً لك. نعم، العملات الرقمية تخضع لنفس الضوابط الشرعية العامة، مع مراعاة عنصر الغرر والجهالة.", isProfessor: true }
        ]
    },
    {
        id: "work-2",
        title: "جماليات التكرار في الشعر الجاهلي",
        professorId: "prof-2",
        type: "Article",
        category: "Article",
        publishDate: "2023-11-20",
        abstract: "تحليل لظاهرة التكرار في المعلقات السبع، ودورها في تعميق المعنى وإحداث الإيقاع الداخلي للقصيدة.",
        content: "يعد التكرار من أبرز الخصائص الأسلوبية في الشعر الجاهلي...",
        comments: []
    },
    {
        id: "work-3",
        title: "إشكاليات الحداثة في الفكر العربي المعاصر",
        professorId: "prof-3",
        type: "Book",
        category: "Book",
        publishDate: "2024-01-10",
        abstract: "قراءة نقدية لمشاريع النهضة العربية وموقفها من التراث والحداثة الغربية.",
        content: "يتناول هذا الكتاب الجدل المستمر حول الحداثة...",
        comments: [
            { id: "comm-3", author: "طالب ماجستير", date: "2024-02-05", content: "هل يعتبر هذا الكتاب رداً على مشروع طه عبد الرحمن؟" }
        ]
    },
    {
        id: "work-4",
        title: "منهجية البحث في العلوم الإسلامية",
        professorId: "prof-1",
        type: "Book",
        category: "Book",
        publishDate: "2023-05-15",
        abstract: "دليل عملي للباحثين في الدراسات الشرعية، يتناول خطوات البحث العلمي وأدواته.",
        content: "...",
        comments: []
    },
    {
        id: "work-5",
        title: "التجديد في الفقه الإسلامي: ضوابطه وآفاقه",
        professorId: "prof-1",
        type: "Article",
        category: "Conference",
        publishDate: "2023-12-01",
        abstract: "ورقة مقدمة للمؤتمر الدولي حول التجديد في العلوم الإسلامية، تناقش مفهوم التجديد وضوابطه.",
        content: "...",
        comments: []
    }
];

export const communityTopics: CommunityTopic[] = [
    {
        id: "topic-1",
        title: "النهضة الفقهية في العصر الحديث: التحديات والآفاق",
        authorId: "prof-1",
        authorName: "أ.د. محمد العلوي",
        category: "Elevated",
        participationCount: 24,
        isElevated: true,
        date: "2024-03-20",
        description: "نقاش حول سبل تجديد الفكر الفقهي بما يتناسب مع متغيرات العصر الحالي مع الحفاظ على الأصول.",
        comments: [
            {
                id: "comm-4",
                authorName: "د. يوسف المنصور",
                content: "هذا الموضوع في غاية الأهمية، خاصة فيما يتعلق بدمج المقاصد في الفتاوى المعاصرة.",
                date: "2024-03-21",
                isProfessor: true,
                isPinned: true,
                replies: [
                    {
                        id: "comm-5",
                        authorName: "عمر خالد",
                        content: "أتفق معكم دكتور، فالفجوة بين النص والواقع تتطلب اجتهاداً جريئاً ومنضبطاً.",
                        date: "2024-03-21"
                    }
                ]
            }
        ],
        relatedResearchIds: ["work-1", "work-4"]
    },
    {
        id: "topic-2",
        title: "إشكاليات الترجمة الأدبية للنصوص التراثية",
        authorId: "prof-2",
        authorName: "د. فاطمة الزهراء",
        category: "General",
        participationCount: 15,
        isElevated: false,
        date: "2024-03-18",
        description: "بحث في الصعوبات التي تواجه المترجم عند نقل النصوص الأدبية القديمة إلى لغات معاصرة.",
        comments: []
    },
    {
        id: "topic-3",
        title: "تطوير مناهج البحث في الدراسات العليا: رؤية مستقبلية",
        authorId: "prof-1",
        authorName: "أ.د. محمد العلوي",
        category: "Professors",
        participationCount: 8,
        isElevated: false,
        date: "2024-03-15",
        description: "جلسة مغلقة للأساتذة لمناقشة تحديات الإشراف الأكاديمي وتطوير مهارات الباحثين.",
        comments: []
    },
    {
        id: "topic-4",
        title: "الذكاء الاصطناعي في خدمة العلوم الإنسانية",
        authorId: "prof-3",
        authorName: "د. يوسف المنصور",
        category: "General",
        participationCount: 32,
        isElevated: false,
        date: "2024-03-10",
        description: "كيف يمكن توظيف تقنيات الذكاء الاصطناعي في تحليل النصوص التاريخية والفلسفية؟",
        comments: []
    }
];
