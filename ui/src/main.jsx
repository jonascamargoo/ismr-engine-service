import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Cleanly register the SW using the Vite Plugin helper
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const handleRequestPermission = async () => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Permission granted!");
    // Now you can trigger notifications
  }
};

const triggerVibration = () => {
  if ("vibrate" in navigator) {
    // Vibrate for 200ms
    navigator.vibrate(200);
  } else {
    console.log("Vibration API not supported on this device.");
  }
};


const triggerNotification = async () => {
  if (Notification.permission === "granted") {
    // Get the active Service Worker registration
    const registration = await navigator.serviceWorker.ready;

    registration.showNotification("ISMR Text-to-Speech", {
      body: "Your audio is ready to play!",
      icon: "/logo192.png", // Must be in your public folder
      vibrate: [200, 100, 200],
      tag: "vibration-sample", // Unique ID: keeps only one notification active
      data: {
        url: window.location.origin, // You can use this to open the app on click
      }
    });
  } else {
    console.log("Permission not granted yet.");
  }
};

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  // Your Public VAPID Key from Step A
  const publicVapidKey = config.vapidKey;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicVapidKey
  });

  // // 🚩 IMPORTANT: Send this 'subscription' object to your backend database!
  // await fetch('/api/save-subscription', {
  //   method: 'POST',
  //   body: JSON.stringify(subscription),
  //   headers: { 'Content-Type': 'application/json' }
  // });
}