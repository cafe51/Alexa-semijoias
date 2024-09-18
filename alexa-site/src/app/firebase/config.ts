import { getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence, Auth } from 'firebase/auth';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator, Functions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
let projectFirestoreDataBase: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
let functions: Functions;

const initializeFirebase = () => {
    if (!app) {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
        projectFirestoreDataBase = getFirestore(app);
        auth = getAuth(app);
        setPersistence(auth, browserLocalPersistence);
        storage = getStorage(app);
        functions = getFunctions(app);
    }
};

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    console.log('Usando emuladores do Firebase');
    
    // Inicializa o app sem conectar aos serviços reais
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    
    projectFirestoreDataBase = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    functions = getFunctions(app);

    connectFirestoreEmulator(projectFirestoreDataBase, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
} else {
    initializeFirebase();
}

export { projectFirestoreDataBase, auth, storage, functions, initializeFirebase };