// ═══════════════════════════════════════════════════════════════
// firebase.js — Auth + Firestore sync for Cards Game
// ═══════════════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc,
         collection as fsCollection, addDoc, getDocs, query, where, orderBy }
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

// ── Helpers ──────────────────────────────────────────────────────

function usernameToEmail(username) {
    return username.trim() + "@cards-game.app";
}

async function isUsernameTaken(username) {
    const snap = await getDoc(doc(db, "usernames", username));
    return snap.exists();
}

// ── Register ─────────────────────────────────────────────────────

export async function register(username, password) {
    if (!username || username.trim().length < 2) throw new Error("Username must be at least 2 characters.");
    if (!password || password.length < 6)        throw new Error("Password must be at least 6 characters.");
    if (/\s/.test(username))                      throw new Error("Username cannot contain spaces.");

    const taken = await isUsernameTaken(username.trim());
    if (taken) throw new Error("Username already taken.");

    const email = usernameToEmail(username);
    const cred  = await createUserWithEmailAndPassword(auth, email, password);

    // Reserve username → uid mapping
    await setDoc(doc(db, "usernames", username.trim()), { uid: cred.user.uid });

    // Create empty save document
    await setDoc(doc(db, "users", cred.user.uid), {
        username: username.trim(),
        createdAt: Date.now(),
        save: null   // will be populated on first saveToCloud()
    });

    return cred.user;
}

// ── Login ─────────────────────────────────────────────────────────

export async function login(username, password) {
    if (!username || !password) throw new Error("Username and password required.");
    const email = usernameToEmail(username.trim());
    const cred  = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}

// ── Logout ────────────────────────────────────────────────────────

export async function logout() {
    await signOut(auth);
}

// ── Load save from Firestore ──────────────────────────────────────

export async function loadFromCloud(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return snap.data();   // { username, createdAt, save: {...} }
}

// ── Save to Firestore ─────────────────────────────────────────────

export async function saveToCloud(uid, saveData) {
    await setDoc(doc(db, "users", uid), { save: saveData }, { merge: true });
}

// ── Auth state observer ───────────────────────────────────────────
// Calls onLoggedIn(user, cloudData) or onLoggedOut()

export function watchAuth(onLoggedIn, onLoggedOut) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const data = await loadFromCloud(user.uid);
            onLoggedIn(user, data);
        } else {
            onLoggedOut();
        }
    });
}

// ── Market ───────────────────────────────────────────────────────

// Post a listing
export async function postListing({ sellerUid, sellerName, cardName, cardType, amount, priceTotal, itemCategory }) {
    const ref = await addDoc(fsCollection(db, "market"), {
        sellerUid,
        sellerName,
        cardName,
        cardType:     cardType || '',
        amount:       Number(amount),
        priceTotal:   Number(priceTotal),
        priceEach:    priceTotal > 0 ? Math.ceil(Number(priceTotal) / Number(amount)) : 0,
        itemCategory: itemCategory || 'card',
        createdAt:    Date.now(),
    });
    return ref.id;
}

// Fetch all active listings
export async function fetchListings() {
    const snap = await getDocs(query(fsCollection(db, "market"), orderBy("createdAt", "desc")));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Delete a listing (seller or buyer completing a purchase calls this)
export async function deleteListing(listingId) {
    await deleteDoc(doc(db, "market", listingId));
}

// Fetch only the current user's listings
export async function fetchMyListings(uid) {
    const snap = await getDocs(query(fsCollection(db, "market"), where("sellerUid", "==", uid)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Update username ──────────────────────────────────────────

export async function updateUsername(uid, oldUsername, newUsername) {
    // Check new name not taken
    const snap = await getDoc(doc(db, "usernames", newUsername));
    if (snap.exists()) throw new Error("Username already taken.");

    // Write new mapping
    await setDoc(doc(db, "usernames", newUsername), { uid });

    // Update user document
    await setDoc(doc(db, "users", uid), { username: newUsername }, { merge: true });

    // Delete old mapping (best-effort)
    try { await deleteDoc(doc(db, "usernames", oldUsername)); } catch(e) {}
}

export { auth, db };

// ── RAP  (rap/{itemKey}) ──────────────────────────────────────────
// Stores the Recent Average Price for each tradeable item.
// itemKey examples: "xp", "card:Grass", "card:Grass:Gold"
// Document shape: { itemKey, rap, updatedAt }
// Formula: RAP = RAP + (salePrice - RAP) / 100

// Update RAP when a listing is posted (price per unit)
export async function updateRap(itemKey, priceEach) {
    if (!itemKey || priceEach == null || priceEach < 0) return;
    const ref = doc(db, "rap", itemKey);
    const snap = await getDoc(ref);
    let newRap;
    if (!snap.exists() || snap.data().rap == null) {
        newRap = priceEach;
    } else {
        const currentRap = snap.data().rap;
        newRap = currentRap + (priceEach - currentRap) / 100;
    }
    await setDoc(ref, { itemKey, rap: newRap, updatedAt: Date.now() });
    return newRap;
}

// Fetch RAP for a single item
export async function getRap(itemKey) {
    const snap = await getDoc(doc(db, "rap", itemKey));
    if (!snap.exists()) return null;
    return snap.data().rap ?? null;
}

// Fetch all RAP entries
export async function getAllRap() {
    const snap = await getDocs(fsCollection(db, "rap"));
    const result = {};
    snap.forEach(d => { result[d.data().itemKey] = d.data().rap; });
    return result;
}

// ── Rewards  (rewards/{uid}/pending/{autoId}) ─────────────────────
// Each document: { type: 'diamonds'|'card'|'item', amount, from, createdAt }
// This subcollection structure allows any reward type in the future.

function _pendingCol(uid) {
    return fsCollection(db, "rewards", uid, "pending");
}

// Add a diamond reward for a seller when a buyer purchases
export async function addPendingReward(sellerUid, amount) {
    if (!sellerUid || !amount || amount <= 0) return;
    await addDoc(_pendingCol(sellerUid), {
        type:      'diamonds',
        amount:    Number(amount),
        from:      'market_sale',
        createdAt: Date.now(),
    });
}

// Fetch all pending reward docs without claiming
export async function getPendingRewards(uid) {
    const snap = await getDocs(_pendingCol(uid));
    // Return structured summary: { diamonds, docs: [{id, type, amount, from}] }
    let diamonds = 0;
    const docs = [];
    snap.forEach(d => {
        const data = d.data();
        if (data.type === 'diamonds') diamonds += (data.amount || 0);
        docs.push({ id: d.id, ...data });
    });
    return { diamonds, docs };
}

// Claim all pending rewards — deletes every pending doc and returns totals
export async function claimRewards(uid) {
    const snap = await getDocs(_pendingCol(uid));
    if (snap.empty) return { diamonds: 0 };

    let diamonds = 0;
    const deletes = [];
    snap.forEach(d => {
        const data = d.data();
        if (data.type === 'diamonds') diamonds += (data.amount || 0);
        deletes.push(deleteDoc(doc(db, "rewards", uid, "pending", d.id)));
    });
    await Promise.all(deletes);
    return { diamonds };
}
