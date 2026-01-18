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

export { db, auth, storage, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, where, onSnapshot, orderBy, serverTimestamp, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, ref, uploadBytes, getDownloadURL };

export const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export function loadNavbar() {
    const nav = document.getElementById('navbar');
    
    // Render Structure
    nav.innerHTML = `
        <nav class="w-full bg-black/95 backdrop-blur-md fixed top-0 z-50 border-b border-gray-800 shadow-md">
            <div class="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                <button id="menu-toggle" class="text-white focus:outline-none p-2 rounded hover:bg-gray-800">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>

                <div class="flex-1 max-w-md mx-1">
                    <div class="relative">
                        <input type="text" id="search-input" class="block w-full py-2.5 pl-4 pr-3 text-sm text-white border border-gray-700 rounded-full bg-[#1a1a1a] focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition placeholder-gray-500 shadow-inner" placeholder="Search drones...">
                    </div>
                </div>

                <a href="cart.html" class="relative text-white hover:text-red-500 transition p-2 rounded hover:bg-gray-800">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span id="cart-count" class="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden">0</span>
                </a>
            </div>

            <div id="mobile-menu" class="hidden bg-[#111] border-b border-gray-800 absolute w-full left-0 top-[60px] shadow-xl z-40 h-screen">
                <ul class="flex flex-col font-medium text-lg" id="menu-list">
                    </ul>
            </div>
        </nav>
        <div class="h-[70px]"></div>

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

    const menuList = document.getElementById('menu-list');
    
    // UPDATED MENU ITEMS TO INCLUDE CATEGORIES
    onAuthStateChanged(auth, (user) => {
        const commonLinks = `
            <li><a href="index.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800">🏠 Home</a></li>
            <li><a href="categories.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800">📂 Categories</a></li>
        `;
        
        if(user && !user.isAnonymous) {
            menuList.innerHTML = `
                ${commonLinks}
                <li><a href="orders.html" class="block py-4 px-6 text-white hover:bg-gray-800 border-b border-gray-800">📦 My Orders</a></li>
                <li><button id="logout-btn" class="w-full text-left py-4 px-6 text-red-500 hover:bg-gray-800">🚪 Logout</button></li>
            `;
            setTimeout(() => {
                const logoutBtn = document.getElementById('logout-btn');
                if(logoutBtn) logoutBtn.addEventListener('click', () => {
                    signOut(auth).then(() => window.location.reload());
                });
            }, 500);
        } else {
            menuList.innerHTML = `
                ${commonLinks}
                <li><button onclick="document.getElementById('auth-modal').classList.remove('hidden')" class="w-full text-left py-4 px-6 text-green-500 hover:bg-gray-800">🔐 Login / Signup</button></li>
            `;
             setTimeout(() => {
                const btnLogin = document.getElementById('btn-login');
                const btnSignup = document.getElementById('btn-signup');
                if(btnLogin) btnLogin.addEventListener('click', async () => {
                    try { await signInWithEmailAndPassword(auth, document.getElementById('auth-email').value, document.getElementById('auth-pass').value); window.location.reload(); } catch(e) { alert(e.message); }
                });
                if(btnSignup) btnSignup.addEventListener('click', async () => {
                    try { await createUserWithEmailAndPassword(auth, document.getElementById('auth-email').value, document.getElementById('auth-pass').value); window.location.reload(); } catch(e) { alert(e.message); }
                });
             }, 500);
        }
    });

    const menuToggle = document.getElementById('menu-toggle');
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    }
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