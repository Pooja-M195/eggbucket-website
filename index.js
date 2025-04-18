// Firebase Cloud Function (in functions/index.js)
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addUserRole = functions.auth.user().onCreate(async (user) => {
  // Check if user is admin (you might have a list of admin emails)
  const adminEmails = ['admin@eggbucket.com'];
  const isAdmin = adminEmails.includes(user.email);
  
  try {
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: isAdmin,
      retail: !isAdmin // All non-admin users are retail by default
    });
    
    // Add user to Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      role: isAdmin ? 'admin' : 'retail',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Custom claims set for ${user.email}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
});