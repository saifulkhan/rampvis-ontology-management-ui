importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-analytics.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'xxx',
  authDomain: 'xxx.firebaseapp.com',
  databaseURL: 'https://xxx.firebaseio.com',
  projectId: 'xxx',
  storageBucket: 'xxx',
  messagingSenderId: 'xx',
  appId: 'xxx',
  measurementId: 'xxx'
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
