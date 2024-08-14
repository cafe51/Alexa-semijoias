//app/firebase/config.ts
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyC8Z3tYN8Glm3ptKy-aPOIupiN89mHtISk',
    authDomain: 'alexa-semijoias.firebaseapp.com',
    projectId: 'alexa-semijoias',
    storageBucket: 'gs://alexa-semijoias.appspot.com',
    messagingSenderId: '335721127639',
    appId: '1:335721127639:web:15a170805690148c501a92',
    measurementId: 'G-MEGLYC6L4Z',
};

// const app = initializeApp(firebaseConfig);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];


const projectFirestoreDataBase = getFirestore(app);

// Obtém a instância de autenticação
const auth = getAuth(app);

const storage = getStorage(app);

export { projectFirestoreDataBase, auth, storage };
