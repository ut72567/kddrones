import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// Export tools
export { db, auth, storage, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, orderBy, serverTimestamp, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };

// --- UI HELPERS ---

export async function loadNavbar() {
    const nav = document.getElementById('navbar');
    
    // Auth State Check for Menu
    onAuthStateChanged(auth, (user) => {
        const isUser = user && !user.isAnonymous;
        const menuHTML = isUser ? 
            `<li><a href="orders.html" class="block py-2 px-4 text-white hover:bg-gray-800">📦 My Orders</a></li>
             <li><button id="logout-btn" class="w-full text-left py-2 px-4 text-red-500 hover:bg-gray-800">Logout</button></li>` 
            : 
            `<li><button onclick="document.getElementById('auth-modal').classList.remove('hidden')" class="w-full text-left py-2 px-4 text-green-500 hover:bg-gray-800">Login / Signup</button></li>`;

        nav.innerHTML = `
            <nav class="w-full bg-black/90 backdrop-blur-md fixed top-0 z-50 border-b border-gray-800">
                <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="index.html" class="flex items-center space-x-3 rtl:space-x-reverse">
                        <span class="self-center text-xl font-bold whitespace-nowrap text-white tracking-tighter">KD DRONES</span>
                    </a>
                    <div class="flex items-center gap-4">
                        <a href="cart.html" class="relative text-white hover:text-red-500 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            <span id="cart-count" class="absolute -top-2 -right-2 bg-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full hidden">0</span>
                        </a>
                        <button id="menu-toggle" class="text-white focus:outline-none">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>
                <div id="mobile-menu" class="hidden bg-[#111] border-b border-gray-800 absolute w-full left-0 top-16 shadow-xl">
                    <ul class="flex flex-col font-medium">
                        <li><a href="index.html" class="block py-2 px-4 text-white hover:bg-gray-800">Home</a></li>
                        ${menuHTML}
                    </ul>
                </div>
            </nav>
            <div class="h-16"></div>

            <div id="auth-modal" class="fixed inset-0 bg-black/90 z-[60] hidden flex items-center justify-center p-4">
                <div class="bg-[#111] border border-gray-800 rounded-xl p-6 w-full max-w-sm relative">
                    <button onclick="document.getElementById('auth-modal').classList.add('hidden')" class="absolute top-2 right-4 text-gray-500 text-2xl">&times;</button>
                    <h2 class="text-xl font-bold mb-4 text-white">Login / Signup</h2>
                    <input type="email" id="auth-email" placeholder="Email" class="w-full bg-black border border-gray-700 text-white p-3 rounded mb-3">
                    <input type="password" id="auth-pass" placeholder="Password" class="w-full bg-black border border-gray-700 text-white p-3 rounded mb-4">
                    <div class="flex gap-2">
                        <button id="btn-login" class="flex-1 bg-white text-black font-bold py-2 rounded">LOGIN</button>
                        <button id="btn-signup" class="flex-1 border border-white text-white font-bold py-2 rounded">SIGNUP</button>
                    </div>
                </div>
            </div>
        `;

        // Logic for Menu Toggle
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });

        // Logic for Logout
        if(isUser) {
            document.getElementById('logout-btn').addEventListener('click', () => {
                signOut(auth).then(() => window.location.reload());
            });
        }

        // Logic for Login/Signup
        if(!isUser) {
            document.getElementById('btn-login').addEventListener('click', async () => {
                try {
                    await signInWithEmailAndPassword(auth, document.getElementById('auth-email').value, document.getElementById('auth-pass').value);
                    window.location.reload();
                } catch(e) { alert(e.message); }
            });
            document.getElementById('btn-signup').addEventListener('click', async () => {
                try {
                    await createUserWithEmailAndPassword(auth, document.getElementById('auth-email').value, document.getElementById('auth-pass').value);
                    window.location.reload();
                } catch(e) { alert(e.message); }
            });
        }
    });

    updateCartCount();
}

function updateCartCount() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            onSnapshot(collection(db, "carts", user.uid, "items"), (snap) => {
                const count = document.getElementById('cart-count');
                if (count) {
                    if (snap.size > 0) {
                        count.innerText = snap.size;
                        count.classList.remove('hidden');
                    } else {
                        count.classList.add('hidden');
                    }
                }
            });
        }
    });
}
