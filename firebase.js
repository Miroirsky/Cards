// ═══════════════════════════════════════════════════════════════
// firebase.js — Auth + Firestore sync for Cards Game
// ═══════════════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc,
         collection as fsCollection, addDoc, getDocs, query, where, orderBy, limit }
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
        priceEach:    priceTotal > 0 ? Number(priceTotal) / Number(amount) : 0,
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

// ── Leaderboard ───────────────────────────────────────────────────
// Fetches top 10 players by diamonds from their saved game state.
export async function getLeaderboard() {
    const snap = await getDocs(
        query(fsCollection(db, "users"), orderBy("save.diamonds", "desc"), limit(10))
    );
    return snap.docs.map((d, i) => ({
        rank:     i + 1,
        uid:      d.id,
        username: d.data().username || 'Unknown',
        diamonds: d.data().save?.diamonds || 0,
        level:    d.data().save?.level    || 1,
    }));
}
// Each document: { type: 'diamonds'|'card'|'item', amount, from, createdAt }
// This subcollection structure allows any reward type in the future.

function _pendingCol(uid) {
    return fsCollection(db, "rewards", uid, "pending");
}

// Add a reward for a user (seller payment, level-up, etc.)
export async function addPendingReward(uid, amount, from, label) {
    if (!uid || !amount || amount <= 0) return;
    await addDoc(_pendingCol(uid), {
        type:      'diamonds',
        amount:    Number(amount),
        from:      from || 'unknown',
        label:     label || '',
        createdAt: Date.now(),
    });
}

// Fetch all pending reward docs without claiming
export async function getPendingRewards(uid) {
    const snap = await getDocs(_pendingCol(uid));
    let diamonds = 0;
    const docs = [];
    snap.forEach(d => {
        const data = d.data();
        if (data.type === 'diamonds') diamonds += (data.amount || 0);
        docs.push({ id: d.id, ...data });
    });
    // Sort newest first
    docs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return { diamonds, docs };
}

// Claim a single reward doc by id
export async function claimOneReward(uid, docId) {
    await deleteDoc(doc(db, "rewards", uid, "pending", docId));
}

// Claim all pending rewards at once
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

// ── Orders  (orders/{orderId}) ────────────────────────────────────
// Buyers post orders requesting items. Sellers fill them to earn diamonds.
// Document shape:
// { buyerUid, buyerName, cardName, cardType, itemCategory,
//   amountWanted, amountFilled, rewardEach, lockedDiamonds,
//   status: 'open'|'complete'|'cancelled', createdAt }

// Post a new order. Diamonds are locked upfront.
export async function postOrder({ buyerUid, buyerName, cardName, cardType, itemCategory, amountWanted, rewardEach }) {
    const lockedDiamonds = parseFloat((Number(amountWanted) * Number(rewardEach)).toFixed(2));
    const ref = await addDoc(fsCollection(db, "orders"), {
        buyerUid,
        buyerName:     buyerName || 'Unknown',
        cardName:      cardName || '',
        cardType:      cardType || '',
        itemCategory:  itemCategory || 'card',
        amountWanted:  Number(amountWanted),
        amountFilled:  0,
        rewardEach:    Number(rewardEach),
        lockedDiamonds,
        status:        'open',
        createdAt:     Date.now(),
    });
    return ref.id;
}

// Fetch all open orders
export async function fetchOrders() {
    const snap = await getDocs(
        query(fsCollection(db, "orders"), where("status", "==", "open"), orderBy("createdAt", "desc"))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Fetch orders created by a specific user (all statuses)
export async function fetchMyOrders(uid) {
    const snap = await getDocs(
        query(fsCollection(db, "orders"), where("buyerUid", "==", uid), orderBy("createdAt", "desc"))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Fill an order (filler gives items, earns diamonds, buyer gets item reward)
export async function fillOrder(orderId, { fillerUid, fillerName, amount }) {
    const ref  = doc(db, "orders", orderId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Order not found.");

    const order = snap.data();
    if (order.status !== 'open') throw new Error("Order is no longer open.");

    const remaining = order.amountWanted - order.amountFilled;
    const fill      = Math.min(Number(amount), remaining);
    if (fill <= 0) throw new Error("Nothing to fill.");

    const newFilled = order.amountFilled + fill;
    const newStatus = newFilled >= order.amountWanted ? 'complete' : 'open';
    const earned    = parseFloat((fill * order.rewardEach).toFixed(2));

    // Update order
    await setDoc(ref, { amountFilled: newFilled, status: newStatus }, { merge: true });

    // Log fulfillment
    await addDoc(fsCollection(db, "orders", orderId, "fulfillments"), {
        fillerUid, fillerName: fillerName || 'Unknown', amount: fill, createdAt: Date.now(),
    });

    // Pay the filler immediately via rewards
    const fillLabel = order.itemCategory === 'xp'
        ? 'Filled order: ' + fill + ' XP'
        : 'Filled order: ' + fill + '\u00D7 ' + (order.cardType ? order.cardName + ' (' + order.cardType + ')' : order.cardName);
    await addDoc(fsCollection(db, "rewards", fillerUid, "pending"), {
        type: 'diamonds', amount: earned, from: 'order_fill', label: fillLabel, createdAt: Date.now(),
    });

    // Send items to buyer via rewards
    const itemLabel = order.itemCategory === 'xp'
        ? fill + ' XP from order'
        : fill + '\u00D7 ' + (order.cardType ? order.cardName + ' (' + order.cardType + ')' : order.cardName) + ' from order';
    if (order.itemCategory === 'xp') {
        await addDoc(fsCollection(db, "rewards", order.buyerUid, "pending"), {
            type: 'xp', amount: fill, from: 'order_received', label: itemLabel, createdAt: Date.now(),
        });
    } else {
        await addDoc(fsCollection(db, "rewards", order.buyerUid, "pending"), {
            type:      'card',
            cardName:  order.cardName,
            cardType:  order.cardType || '',
            amount:    fill,
            from:      'order_received',
            label:     itemLabel,
            createdAt: Date.now(),
        });
    }

    return { fill, earned, newStatus };
}

// Cancel an open order — refund remaining locked diamonds to buyer
export async function cancelOrder(orderId, buyerUid) {
    const ref  = doc(db, "orders", orderId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Order not found.");

    const order = snap.data();
    if (order.buyerUid !== buyerUid) throw new Error("Not your order.");
    if (order.status !== 'open') throw new Error("Order is not open.");

    await setDoc(ref, { status: 'cancelled' }, { merge: true });

    const unfilled = order.amountWanted - order.amountFilled;
    const refund   = parseFloat((unfilled * order.rewardEach).toFixed(2));
    if (refund > 0) {
        await addDoc(fsCollection(db, "rewards", buyerUid, "pending"), {
            type: 'diamonds', amount: refund, from: 'order_cancelled',
            label: 'Cancelled order refund (' + unfilled + ' unfilled)',
            createdAt: Date.now(),
        });
    }

    return { refund };
}

// ── Admin System ───────────────────────────────────────────────────
// Fetch all users with their stats
export async function getAllUsersStats() {
    const snap = await getDocs(fsCollection(db, "users"));
    return snap.docs.map(d => ({
        uid: d.id,
        username: d.data().username || 'Unknown',
        createdAt: d.data().createdAt,
        admin: d.data().admin === true,
        level: d.data().save?.level || 1,
        diamonds: d.data().save?.diamonds || 0,
        xp: d.data().save?.xp || 0,
        rolls: d.data().save?.rolls || 0,
    }));
}

// Reset a player's save to default
export async function resetPlayerSave(uid) {
    const defaultSave = {
        collection: {},
        diamonds: 0,
        xp: 0,
        rolls: 0,
        level: 1,
        xpNext: 50,
        potionInventory: {},
        activeEffects: {},
        tokens: 10,
        maxToken: 20,
    };
    await setDoc(doc(db, "users", uid), { save: defaultSave }, { merge: true });
}

// Update a player's manual save via admin (editable in Firestore console)
export async function getPlayerSave(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return snap.data().save;
}

export async function setPlayerSave(uid, saveData) {
    await setDoc(doc(db, "users", uid), { save: saveData }, { merge: true });
}

// Check if user is admin
export async function isUserAdmin(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return false;
    return snap.data().admin === true;
}

// Delete a player completely (account + all data)
export async function deletePlayer(uid) {
    // Delete user document
    await deleteDoc(doc(db, "users", uid));
    
    // Delete username mapping
    const usernameSnap = await getDocs(query(fsCollection(db, "usernames"), where("uid", "==", uid)));
    for (const docSnap of usernameSnap.docs) {
        await deleteDoc(doc(db, "usernames", docSnap.id));
    }
    
    // Delete market listings
    const listingsSnap = await getDocs(query(fsCollection(db, "market"), where("sellerUid", "==", uid)));
    for (const docSnap of listingsSnap.docs) {
        await deleteDoc(doc(db, "market", docSnap.id));
    }
    
    // Delete orders
    const ordersSnap = await getDocs(query(fsCollection(db, "orders"), where("buyerUid", "==", uid)));
    for (const docSnap of ordersSnap.docs) {
        await deleteDoc(doc(db, "orders", docSnap.id));
    }
    
    // Delete rewards subcollection
    const rewardsSnap = await getDocs(fsCollection(db, "rewards", uid, "pending"));
    for (const docSnap of rewardsSnap.docs) {
        await deleteDoc(doc(db, "rewards", uid, "pending", docSnap.id));
    }
}
