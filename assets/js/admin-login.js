/**
 * SAHITYA MELA - Admin Authentication System
 * Designed for secure GitHub deployment using Firebase SDK 10.8.0
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
    appId: "1:283544938564:web:b9bba32cca9e52e6aab411"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- LOGIN FORM HANDLER ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        // Auto-redirect to dashboard if already logged in
        onAuthStateChanged(auth, (user) => {
            if (user && user.email === 'sahityamela64@gmail.com') {
                window.location.href = 'dashboard.html';
            }
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const submitBtn = e.target.querySelector('button[type="submit"]');

            // UI Feedback
            submitBtn.disabled = true;
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Authenticating...';

            try {
                await signInWithEmailAndPassword(auth, email, password);
                AdminAuth.showNotification('Access Granted. Welcome!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } catch (error) {
                console.error("Login Error:", error.code);
                AdminAuth.showNotification('Invalid email or password.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    }
});

// --- GLOBAL AUTH OBJECT ---
window.AdminAuth = {
    /**
     * Protects pages from unauthorized access.
     * Add this to the top of dashboard.html, manage-books.html, etc.
     */
    checkAccess: function() {
        onAuthStateChanged(auth, (user) => {
            if (!user || user.email !== 'sahityamela64@gmail.com') {
                console.warn("Unauthorized access blocked.");
                window.location.href = 'login.html';
            }
        });
    },

    /**
     * Signs out the admin and clears session data.
     */
    logout: function() {
        if (confirm("Are you sure you want to logout?")) {
            signOut(auth).then(() => {
                window.location.href = 'login.html';
            }).catch((error) => {
                console.error("Logout failed:", error);
            });
        }
    },

    /**
     * Reusable Toast Notification System
     */
    showNotification: function(message, type) {
        const color = type === 'success' ? '#4CAF50' : '#f44336';
        const toast = document.createElement('div');
        toast.className = 'admin-toast';
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; 
            background: ${color}; color: white; 
            padding: 15px 25px; border-radius: 8px; 
            z-index: 10001; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            font-family: 'Segoe UI', sans-serif; transition: all 0.5s ease;
            animation: slideIn 0.5s forwards;
        `;
        toast.innerText = message;
        document.body.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
};