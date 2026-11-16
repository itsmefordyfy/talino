import { ApiError, postJson, publicUrl } from '@/lib/api';

export async function issueCertificate(input: { courseId: string; learnerName: string; appUserId: string; entitlements: string[]; reviewTokens: Record<string, string> }): Promise<{ id: string; url: string | null }> {
  const body = await postJson('/api/certificates', input);
  if (typeof body.id !== 'string') throw new ApiError('unknown');
  return { id: body.id, url: publicUrl(`/c/${body.id}`) };
}
