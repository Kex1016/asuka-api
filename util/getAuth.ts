import crypto from "crypto";

export async function validateAuthHeaders(request: Request) {
    const test = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(process.env.API_SECRET || 'changeme'));
    const hash = Array.from(new Uint8Array(test)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (!request.headers.has('Authorization')) {
        return false;
    }

    const authHeader = request.headers.get('Authorization');
    return authHeader === hash;
}
