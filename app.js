// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, set, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAReyjrJAfJBBS9cZSDg8aDE2H-xGV_1K0",
    authDomain: "smartargi-39ce1.firebaseapp.com",
    projectId: "smartargi-39ce1",
    storageBucket: "smartargi-39ce1.firebasestorage.app",
    messagingSenderId: "706583262630",
    appId: "1:706583262630:web:c104d03770b75735708b67",
    databaseURL: "https://smartargi-39ce1-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// -----------------------------------------
// 1. LISTEN TO SENSORS (Reading Data)
// -----------------------------------------
const sensorsRef = ref(db, 'system/sensors');
onValue(sensorsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        document.getElementById('temp-display').innerText = data.temperature || "--";
        document.getElementById('moisture-display').innerText = data.moisture || "--";
        document.getElementById('level-display').innerText = data.fertilizerLevel || "--";
        
        // Logical "Note" for Fertilizer
        if(data.fertilizerLevel < 20) {
            document.getElementById('fertilizer-note').innerText = "ALERT: Fertilizer Low!";
            document.getElementById('fertilizer-note').className = "status-low";
        } else {
            document.getElementById('fertilizer-note').innerText = "Status: Good";
            document.getElementById('fertilizer-note').className = "";
        }
    }
});

// -----------------------------------------
// 2. PUMP CONTROL (Writing Data)
// -----------------------------------------
const pumpBtn = document.getElementById('pump-btn');
const pumpRef = ref(db, 'system/controls/pump');

let currentPumpState = false;

// Update UI when database changes
onValue(pumpRef, (snapshot) => {
    currentPumpState = snapshot.val();
    document.getElementById('pump-status').innerText = currentPumpState ? "ON" : "OFF";
    document.getElementById('pump-status').style.color = currentPumpState ? "green" : "red";
});

// Change database when button clicked
pumpBtn.onclick = () => {
    set(pumpRef, !currentPumpState);
    
    // Add an event to logs
    const logsRef = ref(db, 'logs');
    push(logsRef, {
        action: currentPumpState ? "Pump Stopped" : "Pump Started",
        timestamp: serverTimestamp()
    });
};

// -----------------------------------------
// 3. DISPLAY DATE & TIME
// -----------------------------------------
setInterval(() => {
    const now = new Date();
    document.getElementById('date-time').innerText = now.toLocaleString();
}, 1000);