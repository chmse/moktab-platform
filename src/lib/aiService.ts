import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

/**
 * Extract text content from a PDF URL
 */
export async function extractPDFText(pdfUrl: string): Promise<string> {
    try {
        // Determine if we need to use a CORS proxy
        // Supabase URLs usually support CORS if configured correctly, but external ones definitely don't.
        // We use corsproxy.io which handles binary data better than allorigins.
        const isSupabase = pdfUrl.includes('supabase.co');
        const fetchUrl = isSupabase
            ? pdfUrl
            : `https://corsproxy.io/?${encodeURIComponent(pdfUrl)}`;

        console.log(`Fetching PDF from: ${fetchUrl}`);

        // Fetch the PDF
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            console.error(`Fetch failed for URL: ${fetchUrl}`, response.status, response.statusText);
            throw new Error(`فشل في تحميل ملف PDF (${response.status}): ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && !contentType.includes('application/pdf')) {
            console.warn('Warning: Content-Type is not application/pdf:', contentType);
            // We continue anyway as some presigned URLs might have generic types, but logging it helps debug.
        }

        const arrayBuffer = await response.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        const maxPages = Math.min(pdf.numPages, 50); // Limit to first 50 pages

        // Extract text from each page
        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }

        if (!fullText.trim()) {
            throw new Error('لم يتم العثور على نص في ملف PDF');
        }

        // Limit text size (Gemini has token limits)
        const maxChars = 30000;
        if (fullText.length > maxChars) {
            fullText = fullText.substring(0, maxChars) + '...';
        }

        return fullText;
    } catch (error: any) {
        console.error('PDF extraction error:', error);
        throw new Error(error.message || 'فشل في استخراج النص من ملف PDF');
    }
}

/**
 * Generate AI summary of academic paper
 */
export async function generateSummary(text: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `أنت مساعد أكاديمي متخصص. قم بتلخيص هذا البحث العلمي باللغة العربية الأكاديمية الرصينة، مع التركيز على المنهجية والنتائج الرئيسية. اجعل الملخص شاملاً ومفيداً للباحثين.

النص:
${text}

الملخص:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        if (!summary) {
            throw new Error('لم يتم إنشاء ملخص');
        }

        return summary;
    } catch (error: any) {
        console.error('AI summary error:', error);
        throw new Error('فشل في إنشاء الملخص بواسطة الذكاء الاصطناعي');
    }
}

/**
 * Extract key insights from academic paper
 */
export async function generateInsights(text: string): Promise<string[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `أنت مساعد أكاديمي متخصص. استخرج أهم 5 نقاط رئيسية من هذا البحث العلمي باللغة العربية الأكاديمية. يجب أن تكون النقاط واضحة ومحددة وذات قيمة علمية.

النص:
${text}

قدم النتائج كقائمة مرقمة من 1 إلى 5، كل نقطة في سطر منفصل.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const insightsText = response.text();

        if (!insightsText) {
            throw new Error('لم يتم إنشاء النتائج');
        }

        // Parse the numbered list
        const insights = insightsText
            .split('\n')
            .filter((line: string) => line.trim())
            .map((line: string) => line.replace(/^\d+[\.\)]\s*/, '').trim())
            .filter((line: string) => line.length > 0)
            .slice(0, 5);

        if (insights.length === 0) {
            throw new Error('لم يتم العثور على نتائج');
        }

        return insights;
    } catch (error: any) {
        console.error('AI insights error:', error);
        throw new Error('فشل في استخراج النتائج بواسطة الذكاء الاصطناعي');
    }
}
