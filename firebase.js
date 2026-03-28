import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection as fsCollection, addDoc, getDocs, query, where, orderBy, limit }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAA6DHaA8f9ItDhEKPm4gJv9f-YeeVKT_Y",
    authDomain: "cards-f88ac.firebaseapp.com",
    projectId: "cards-f88ac",
    storageBucket: "cards-f88ac.firebasestorage.app",
    messagingSenderId: "585214672784",
    appId: "1:585214672784:web:712a3ca0e66079ef31fd15"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export async function register(username, password) {
    const email = username.toLowerCase() + "@cards.game";
    const userSnap = await getDoc(doc(db, "usernames", username.toLowerCase()));
    if (userSnap.exists()) throw new Error("Username already taken.");

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    await setDoc(doc(db, "usernames", username.toLowerCase()), { uid });
    await setDoc(doc(db, "users", uid), {
        username: username,
        admin: false,
        save: null
    });
    return cred.user;
}

export async function login(username, password) {
    const email = username.toLowerCase() + "@cards.game";
    return (await signInWithEmailAndPassword(auth, email, password)).user;
}

export function logout() { return signOut(auth); }

export function onAuth(callback) {
    onAuthStateChanged(auth, callback);
}

export async function getPlayerSave(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data().save : null;
}

export async function setPlayerSave(uid, saveData) {
    await setDoc(doc(db, "users", uid), { save: saveData }, { merge: true });
}

export async function isUserAdmin(uid) {
    if (!uid) return false;
    try {
        const snap = await getDoc(doc(db, "users", uid));
        return snap.exists() && snap.data().admin === true;
    } catch { return false; }
}

export async function deletePlayer(uid) {
    await deleteDoc(doc(db, "users", uid));
    const q = query(fsCollection(db, "usernames"), where("uid", "==", uid));
    const snap = await getDocs(q);
    snap.forEach(async (d) => await deleteDoc(doc(db, "usernames", d.id)));
}

export async function testConnection() {
    try {
        const q = query(fsCollection(db, "rap"), limit(1));
        await getDocs(q);
        return true;
    } catch (e) {
        console.warn("Firebase connection test failed:", e);
        return false;
    }
}

// Attach to window for rng.js access
window._fbGetPlayerSave = getPlayerSave;
window._fbSetPlayerSave = setPlayerSave;
window._fbIsAdmin = isUserAdmin;
window._fbDeletePlayer = deletePlayer;
window._fbTestConnection = testConnection;