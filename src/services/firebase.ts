import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { DiagnosisResultData, RepairRequest, SustainabilityStats } from '../types';

export interface FirebaseUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'customer' | 'professional' | 'admin';
  savedPros?: string[];
  savedParts?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export type AppUser = FirebaseUserProfile;

let app: FirebaseApp | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: Firestore | null = null;

try {
  const firebaseConfig = {
    apiKey: firebaseConfigJson.apiKey,
    authDomain: firebaseConfigJson.authDomain,
    projectId: firebaseConfigJson.projectId,
    storageBucket: firebaseConfigJson.storageBucket,
    messagingSenderId: firebaseConfigJson.messagingSenderId,
    appId: firebaseConfigJson.appId,
  };

  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Connect to custom databaseId if configured, or default
  if (firebaseConfigJson.firestoreDatabaseId) {
    db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId);
  } else {
    db = getFirestore(app);
  }
} catch (error) {
  console.warn('Firebase initialization warning:', error);
}

export { app, auth, db };

// Auth State Listener
export function onAuthStateChangedListener(
  callback: (user: AppUser | null) => void
): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'RepairConnect User',
        photoURL: firebaseUser.photoURL,
        role: 'customer',
      });
    } else {
      callback(null);
    }
  });
}

// Google Sign-In
export async function signInWithGoogle(): Promise<AppUser | null> {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  
  const appUser: AppUser = {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName || 'RepairConnect User',
    photoURL: result.user.photoURL,
    role: 'customer',
  };

  // Sync user profile to Firestore
  if (result.user && db) {
    try {
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          ...appUser,
          savedPros: [],
          savedParts: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Could not sync user profile to Firestore:', e);
    }
  }
  
  return appUser;
}

// Sign Out
export async function signOutUser(): Promise<void> {
  if (auth) {
    await firebaseSignOut(auth);
  }
}

// Save Diagnosis to Firestore
export async function saveDiagnosisToFirestore(
  diagnosis: DiagnosisResultData,
  userId?: string
): Promise<string> {
  const docId = diagnosis.id || `DIAG-${Date.now()}`;
  if (!db) {
    // Local storage fallback
    const key = `rc_diagnoses_${userId || 'guest'}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(diagnosis);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 30)));
    return docId;
  }

  try {
    const diagRef = doc(db, 'diagnoses', docId);
    await setDoc(diagRef, {
      ...diagnosis,
      userId: userId || 'anonymous',
      createdAt: diagnosis.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docId;
  } catch (err) {
    console.warn('Firestore save diagnosis fallback to localStorage:', err);
    const key = `rc_diagnoses_${userId || 'guest'}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(diagnosis);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 30)));
    return docId;
  }
}

// Fetch User's Diagnoses History
export async function fetchUserDiagnoses(userId: string): Promise<DiagnosisResultData[]> {
  if (!db || !userId) {
    const key = `rc_diagnoses_${userId || 'guest'}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  try {
    const q = query(
      collection(db, 'diagnoses'),
      where('userId', '==', userId),
      limit(20)
    );
    const snapshot = await getDocs(q);
    const items: DiagnosisResultData[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as DiagnosisResultData);
    });
    return items;
  } catch (err) {
    console.warn('Firestore fetch diagnoses fallback to localStorage:', err);
    const key = `rc_diagnoses_${userId || 'guest'}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
}

// Save or Update Repair Booking / Service Request
export async function saveRepairBookingToFirestore(
  booking: Partial<RepairRequest>,
  userId?: string
): Promise<string> {
  const docId = booking.id || `REQ-${Date.now()}`;
  const record = {
    ...booking,
    id: docId,
    userId: userId || booking.userId || 'guest',
    createdAt: booking.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!db) {
    const key = `rc_bookings_${userId || 'guest'}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const index = existing.findIndex((b: any) => b.id === docId);
    if (index >= 0) {
      existing[index] = record;
    } else {
      existing.unshift(record);
    }
    localStorage.setItem(key, JSON.stringify(existing));
    return docId;
  }

  try {
    const reqRef = doc(db, 'repairRequests', docId);
    await setDoc(reqRef, record, { merge: true });
    return docId;
  } catch (err) {
    console.warn('Firestore save booking fallback to localStorage:', err);
    const key = `rc_bookings_${userId || 'guest'}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(record);
    localStorage.setItem(key, JSON.stringify(existing));
    return docId;
  }
}

// Fetch Repair Bookings
export async function fetchUserRepairBookings(userId: string): Promise<RepairRequest[]> {
  if (!db || !userId) {
    const key = `rc_bookings_${userId || 'guest'}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  try {
    const q = query(
      collection(db, 'repairRequests'),
      where('userId', '==', userId),
      limit(20)
    );
    const snapshot = await getDocs(q);
    const items: RepairRequest[] = [];
    snapshot.forEach((docSnap) => {
      items.push(docSnap.data() as RepairRequest);
    });
    return items;
  } catch (err) {
    console.warn('Firestore fetch bookings fallback to localStorage:', err);
    const key = `rc_bookings_${userId || 'guest'}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
}

// Save Sustainability Record
export async function saveSustainabilityStatsToFirestore(
  userId: string,
  stats: Partial<SustainabilityStats>
): Promise<void> {
  if (!db || !userId) {
    localStorage.setItem(`rc_sustainability_${userId || 'guest'}`, JSON.stringify(stats));
    return;
  }

  try {
    const docRef = doc(db, 'sustainabilityRecords', userId);
    await setDoc(
      docRef,
      {
        userId,
        ...stats,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (e) {
    console.warn('Firestore save sustainability fallback:', e);
    localStorage.setItem(`rc_sustainability_${userId || 'guest'}`, JSON.stringify(stats));
  }
}
