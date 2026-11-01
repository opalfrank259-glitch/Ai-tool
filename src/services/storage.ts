import { requireSupabase } from '../lib/supabase';

export type ProjectAssetType = 'reference' | 'submission' | 'export' | 'avatar' | 'other';
export type ProjectAsset = {
  id: string;
  bucketId: 'avatars' | 'project-assets' | 'project-exports';
  storagePath: string;
  signedUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

const BUCKET_LIMITS = {
  avatars: 5 * 1024 * 1024,
  'project-assets': 50 * 1024 * 1024,
  'project-exports': 100 * 1024 * 1024,
} as const;

const ALLOWED_TYPES: Record<keyof typeof BUCKET_LIMITS, string[]> = {
  avatars: ['image/jpeg', 'image/png', 'image/webp'],
  'project-assets': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  'project-exports': [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/zip',
    'application/octet-stream',
  ],
};

function safeFileName(name: string): string {
  const cleaned = name.trim().replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^\.+/, '');
  return cleaned.slice(-120) || 'upload';
}

async function getUserId(): Promise<string> {
  const db = requireSupabase();
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) throw new Error('Please sign in before uploading files.');
  return data.user.id;
}

/**
 * Uploads a private project file and records its storage path in project_assets.
 * Storage policies require the first object-path segment to equal the user's UUID.
 */
export async function uploadProjectAsset(
  projectId: string,
  file: File,
  assetType: ProjectAssetType = 'other',
  bucketId: 'project-assets' | 'project-exports' = 'project-assets'
): Promise<ProjectAsset> {
  const db = requireSupabase() as any;
  const userId = await getUserId();

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId)) {
    throw new Error('A valid saved project is required for file upload.');
  }
  if (!file || file.size <= 0 || file.size > BUCKET_LIMITS[bucketId]) {
    throw new Error(`File size must be between 1 byte and ${Math.floor(BUCKET_LIMITS[bucketId] / (1024 * 1024))} MB.`);
  }
  if (!ALLOWED_TYPES[bucketId].includes(file.type)) {
    throw new Error('This file type is not allowed for this upload.');
  }

  const storagePath = `${userId}/${projectId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error: uploadError } = await db.storage.from(bucketId).upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;

  try {
    const { data: asset, error: insertError } = await db.from('project_assets').insert({
      user_id: userId,
      project_id: projectId,
      bucket_id: bucketId,
      storage_path: storagePath,
      asset_type: assetType,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    }).select('id').single();
    if (insertError) throw insertError;

    const { data: signed, error: signedError } = await db.storage
      .from(bucketId).createSignedUrl(storagePath, 60 * 60);
    if (signedError) throw signedError;

    return {
      id: asset.id,
      bucketId,
      storagePath,
      signedUrl: signed.signedUrl,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    };
  } catch (error) {
    // Roll back the object if its metadata row or signed URL could not be created.
    await db.storage.from(bucketId).remove([storagePath]);
    throw error;
  }
}

export async function createProjectAssetSignedUrl(
  bucketId: ProjectAsset['bucketId'],
  storagePath: string,
  expiresInSeconds = 3600
): Promise<string> {
  if (!Number.isInteger(expiresInSeconds) || expiresInSeconds < 60 || expiresInSeconds > 86400) {
    throw new Error('Signed URL expiry must be between 60 seconds and 24 hours.');
  }
  const db = requireSupabase() as any;
  const { data, error } = await db.storage.from(bucketId).createSignedUrl(storagePath, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteProjectAsset(assetId: string): Promise<void> {
  const db = requireSupabase() as any;
  const userId = await getUserId();
  const { data: asset, error: readError } = await db.from('project_assets')
    .select('id,bucket_id,storage_path')
    .eq('id', assetId)
    .eq('user_id', userId)
    .single();
  if (readError) throw readError;

  const { error: removeError } = await db.storage.from(asset.bucket_id).remove([asset.storage_path]);
  if (removeError) throw removeError;

  const { error: deleteError } = await db.from('project_assets')
    .delete()
    .eq('id', assetId)
    .eq('user_id', userId);
  if (deleteError) throw deleteError;
}

export async function uploadAvatar(file: File): Promise<string> {
  const db = requireSupabase() as any;
  const userId = await getUserId();
  if (!file || file.size <= 0 || file.size > BUCKET_LIMITS.avatars) {
    throw new Error('Avatar image must be smaller than 5 MB.');
  }
  if (!ALLOWED_TYPES.avatars.includes(file.type)) {
    throw new Error('Avatar must be JPG, PNG or WebP.');
  }
  const path = `${userId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error } = await db.storage.from('avatars').upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data, error: signedError } = await db.storage.from('avatars').createSignedUrl(path, 60 * 60);
  if (signedError) throw signedError;
  return data.signedUrl;
}
