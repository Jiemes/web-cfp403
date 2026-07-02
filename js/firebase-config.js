// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCsWaEoq2HYkM8vDXISAsSJw3MHzRhmD4",
    authDomain: "cfp403-web.firebaseapp.com",
    projectId: "cfp403-web",
    storageBucket: "cfp403-web.firebasestorage.app",
    messagingSenderId: "793570725272",
    appId: "1:793570725272:web:e3650eca72f98df8e9afed"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const authFirebase = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Expose to window for global access
window.authFirebase = authFirebase;
window.db = db;
window.storage = storage;
