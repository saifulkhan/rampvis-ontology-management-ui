importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-analytics.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyAlvl6-po-c5dp2HRToaARDWgfRjor9Lmc',
  authDomain: 'data-mining-7d9bf.firebaseapp.com',
  databaseURL: 'https://data-mining-7d9bf.firebaseio.com',
  projectId: 'data-mining-7d9bf',
  storageBucket: 'data-mining-7d9bf.appspot.com',
  messagingSenderId: '431207723497',
  appId: '1:431207723497:web:c328d72aab8082587a1b78',
  measurementId: 'G-FEFMQ1VJHW'
};

firebase.initializeApp(firebaseConfig);
// firebase.analytics();

const messaging = firebase.messaging();

/**
 * Handling notification on background
 */
const handler = (payload) => {
  console.log('[firebase-messaging-sw.js]: handler: received background message = ', payload);

  const notificationTitle = payload.data.type;
  const notificationOptions = {
    body: payload.data.message,
    icon: '/assets/img/search.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
}

messaging.setBackgroundMessageHandler(handler);
// messaging.onMessage(handler);

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event;
});
