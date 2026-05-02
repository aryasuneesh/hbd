import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const uploadsEnabled = import.meta.env.VITE_ENABLE_UPLOADS === 'true';

export async function uploadFile(
  path: string,
  file: File,
): Promise<string> {
  if (!uploadsEnabled) {
    throw new Error('Uploads are disabled. Set VITE_ENABLE_UPLOADS=true to enable.');
  }
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
