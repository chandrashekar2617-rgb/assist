import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Ensure you're importing Firebase instances

export const useAuth = () => {
  const signUp = async (email: string, password: string, name: string, workshopName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name (optional)
    await updateProfile(user, { displayName: name });

    // Store extra details in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      name,
      workshopName,
      createdAt: new Date().toISOString()
    });
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  return { signUp, signIn };
};
