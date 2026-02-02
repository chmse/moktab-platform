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
    specialty?: string;
    skills?: string[];
    bio?: string;
    role?: 'professor' | 'student';
    level?: string;
}

export interface TimelineItem {
    id: string;
    year: string;
    description: string;
    level: string;
}

export interface Student {
    id: string;
    name: string;
    level: 'PhD' | 'Master' | 'Bachelor';
    department: string;
    specialty?: string;
    imageUrl: string;
    interests: string[];
    bio?: string;
    skills?: string[];
    timeline?: TimelineItem[];
    supervisorId?: string;
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

export const professors: Professor[] = [];
export const students: Student[] = [];
export const works: ScientificWork[] = [];
export const communityTopics: CommunityTopic[] = [];
