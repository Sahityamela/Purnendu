import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCftWFc6WvMbaY_iwF6DUawi7Qvf0SRKYc",
    authDomain: "sahitya-mela.firebaseapp.com",
    projectId: "sahitya-mela",
    databaseURL: "https://sahitya-mela-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.getElementById('contactForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('msgSubmitBtn');
    btn.disabled = true;
    btn.innerText = "Sending...";

    const msgData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        message: document.getElementById('contactMessage').value,
        timestamp: Date.now(),
        status: 'unread' // To help you filter new messages
    };

    try {
        const msgRef = ref(database, 'messages');
        await push(msgRef, msgData);
        alert("Thank you! Your message has been sent to Sahitya Mela.");
        document.getElementById('contactForm').reset();
    } catch (error) {
        alert("Error: " + error.message);
        showNotification('Error: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerText = "Send Message";
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        ${type === 'success' ? 'background: #4CAF50;' : 'background: #f44336;'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
