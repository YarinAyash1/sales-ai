import {put} from '@vercel/blob';
import {NextResponse} from 'next/server';
import {z} from 'zod';

import {auth} from '@/app/(auth)/auth';

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
    file: z
        .instanceof(Blob)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'הקובץ צריך להיות עד 5MB',
        })
        // Update the file type based on the kind of files you want to accept
        .refine((file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type), {
            message: 'הקובץ צריך להיות בפורמט JPG, PNG או PDF',
        })
});

export async function POST(request: Request) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({error: 'לא מחובר'}, {status: 401});
    }

    if (request.body === null) {
        // Request body is empty
        return new Response('הגוף של הבקשה ריק', {status: 400});
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as Blob;

        if (!file) {
            // No file uploaded
            return NextResponse.json({error: 'הקובץ לא עלה'}, {status: 400});
        }

        const validatedFile = FileSchema.safeParse({file});

        if (!validatedFile.success) {
            const errorMessage = validatedFile.error.errors
                .map((error) => error.message)
                .join(', ');

            return NextResponse.json({error: errorMessage}, {status: 400});
        }

        // Get filename from formData since Blob doesn't have name property
        const filename = (formData.get('file') as File).name;
        const fileBuffer = await file.arrayBuffer();

        try {
            const data = await put(`${filename}`, fileBuffer, {
                access: 'public',
            });

            return NextResponse.json(data);
        } catch (error) {
            return NextResponse.json({error: 'העלאת הקובץ נכשלה'}, {status: 500});
        }
    } catch (error) {
        return NextResponse.json(
            {error: 'התרחשה שגיאה בעת עיבוד הבקשה'},
            {status: 500},
        );
    }
}
