import {
  collection, addDoc, getDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Bouquet } from '../types/bouquet';

export async function saveBouquet(bouquet: Bouquet): Promise<string> {
  const ref = await addDoc(collection(db, 'bouquets'), {
    ...bouquet,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getBouquet(id: string): Promise<Bouquet | null> {
  const snap = await getDoc(doc(db, 'bouquets', id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return { ...data, id: snap.id } as Bouquet;
}
