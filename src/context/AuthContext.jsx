import { createContext, useContext, useState, useEffect } from 'react';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import app from '../utils/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'owner' | 'staff' | null
    const [loading, setLoading] = useState(true);

    const auth = app ? getAuth(app) : null;

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                // In a real app, you might fetch claims or profile to determine role.
                // For now, if they are authenticated via Firebase, we assume Owner/Admin
                // unless specified otherwise. Staff might use a simple PIN in local state.
                setUserRole('owner');
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [auth]);

    // Login for Owner (Email/Password)
    const loginOwner = async (email, password) => {
        if (!auth) {
            // Fallback for demo/development if Firebase is not configured
            if (email === 'admin@test.com' && password === 'admin123') {
                setCurrentUser({ email: 'admin@test.com', uid: 'mock-owner-id' });
                setUserRole('owner');
                return Promise.resolve({ user: { email: 'admin@test.com' } });
            }
            throw new Error("Firebase Auth not initialized and invalid mock credentials");
        }
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Login for Staff (PIN)
    const loginStaff = async (pin) => {
        // 1. Try to verify against Firebase Firestore
        if (app) {
            try {
                const { getFirestore, doc, getDoc } = await import('firebase/firestore');
                const db = getFirestore(app);
                const docRef = doc(db, 'system', 'staff');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const dbData = docSnap.data();
                    if (pin === dbData.pin) {
                        setUserRole('staff');
                        return true;
                    } else {
                        throw new Error('Invalid PIN');
                    }
                }
            } catch (err) {
                console.warn("Could not verify PIN with Firebase (offline or not set), trying local.", err);
            }
        }

        // 2. Fallback: Local Storage (from setup)
        const storedAuth = JSON.parse(localStorage.getItem('authSetup') || '{}');
        const storedPin = storedAuth?.credentials?.staff?.pin;

        // 3. Fallback: Default
        const correctPin = storedPin || '1234';

        if (pin === correctPin) {
            setUserRole('staff');
            return Promise.resolve(true);
        }
        return Promise.reject(new Error('Invalid PIN'));
    };

    const logout = async () => {
        if (auth && currentUser) {
            await signOut(auth);
        }
        // Clear all auth-related state
        setCurrentUser(null);
        setUserRole(null);
        // Clear any localStorage items that might cause conflicts
        localStorage.removeItem('userRole');
        localStorage.removeItem('staffAuthenticated');
    };

    const value = {
        currentUser,
        userRole,
        loginOwner,
        loginStaff,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
