/**
 * SAHITYA MELA - Secure Admin Authentication System
 * Version: 2.0 (GitHub Ready)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyCftWFc6WvMbaY_iwF6DUawi7Qvf0SRKYc",
    authDomain: "sahitya-mela.firebaseapp.com",
    projectId: "sahitya-mela",
    storageBucket: "sahitya-mela.firebasestorage.app",
    messagingSenderId: "283544938564",
    appId: "1:283544938564:web:b9bba32cca9e52e6aab411",
    databaseURL: "https://sahitya-mela-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- 1. HANDLE LOGIN FORM ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const submitBtn = e.target.querySelector('button[type="submit"]');

            submitBtn.disabled = true;
            submitBtn.innerText = 'Verifying...';

            try {
                await signInWithEmailAndPassword(auth, email, password);
                showToast('Welcome back, Admin!', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1000);
            } catch (error) {
                showToast('Invalid credentials. Access Denied.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Login';
            }
        });
    }
});

// --- 2. GLOBAL PROTECTION & UTILS ---
window.AdminAuth = {
    /**
     * Use this at the top of your Admin pages:
     * window.AdminAuth.checkAccess();
     */
    checkAccess: function() {
        onAuthStateChanged(auth, (user) => {
            if (!user || user.email !== 'sahityamela64@gmail.com') {
                console.warn("Security Breach: Redirecting to login.");
                window.location.href = 'login.html';
            }
        });
    },

    /**
     * Call this from your Logout button:
     * onclick="AdminAuth.logout()"
     */
    logout: function() {
        if (confirm("Are you sure you want to sign out?")) {
            signOut(auth).then(() => {
                window.location.href = 'login.html';
            });
        }
    }
};

// Internal Toast Helper
function showToast(msg, type) {
    const color = type === 'success' ? '#4CAF50' : '#f44336';
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed; top:20px; right:20px; background:${color}; color:white; padding:15px 25px; border-radius:8px; z-index:100000; font-family:sans-serif; box-shadow:0 4px 12px rgba(0,0,0,0.2);`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}