import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYSwc8zYQKQ9Mc3mqZYR88ix-iOiFBZSE",
  authDomain: "kd-drones.firebaseapp.com",
  projectId: "kd-drones",
  storageBucket: "kd-drones.firebasestorage.app",
  messagingSenderId: "141530550347",
  appId: "1:141530550347:web:786e497c0a58bef6ae3dce",
  measurementId: "G-67K1GZ80RF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Anonymous User for Cart
onAuthStateChanged(auth, (user) => {
    if (!user) signInAnonymously(auth).catch(console.error);
});

// Export tools
export { db, auth, storage, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, signInWithEmailAndPassword, ref, uploadBytes, getDownloadURL };

// --- UI HELPERS ---

// 1. Dynamic Navbar Injector
export async function loadNavbar() {
    const nav = document.getElementById('navbar');
    
    // Fetch Logo
    let logoUrl = "https://via.placeholder.com/100x40?text=KD+DRONES";
    try {
        const settingsSnap = await getDoc(doc(db, "settings", "general"));
        if (settingsSnap.exists() && settingsSnap.data().logo) logoUrl = settingsSnap.data().logo;
    } catch(e) { console.log("Default logo used"); }

    nav.innerHTML = `
        <nav class="w-full bg-black/90 backdrop-blur-md fixed top-0 z-50 border-b border-gray-800">
            <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="index.html" class="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="${logoUrl}" class="h-8 object-contain" id="nav-logo" alt="KD Logo">
                    <span class="self-center text-xl font-bold whitespace-nowrap text-white tracking-tighter">KD DRONES</span>
                </a>
                <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <a href="cart.html" class="relative text-white hover:text-red-500 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full hidden">0</span>
                    </a>
                    <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none" aria-controls="navbar-sticky" aria-expanded="false">
                        <svg class="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 17 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/></path></svg>
                    </button>
                </div>
                <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-700 rounded-lg bg-gray-800 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
                        <li><a href="index.html" class="block py-2 px-3 text-white rounded hover:text-red-500 md:p-0">Home</a></li>
                        <li><a href="index.html#products" class="block py-2 px-3 text-gray-300 rounded hover:text-white md:p-0">Drones</a></li>
                        <li><a href="admin.html" class="block py-2 px-3 text-gray-400 text-sm rounded hover:text-white md:p-0">Admin</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="h-16"></div> `;
    
    updateCartCount();
}

// 2. Cart Helper
export function updateCartCount() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            onSnapshot(collection(db, "carts", user.uid, "items"), (snap) => {
                const count = document.getElementById('cart-count');
                if (snap.size > 0) {
                    count.innerText = snap.size;
                    count.classList.remove('hidden');
                } else {
                    count.classList.add('hidden');
                }
            });
        }
    });
}
