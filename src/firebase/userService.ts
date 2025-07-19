import { auth, db } from './config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

export async function signupAndSaveUser(
  email: string,
  password: string,
  userData: Record<string, unknown>
) {
  // Sign up with Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save user info to Firestore
  await addDoc(collection(db, 'User'), {
    uid: user.uid,
    email: user.email,
    ...userData // other fields from your form
  });
}
