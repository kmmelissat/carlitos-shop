const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const makeUserAdmin = async (email) => {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);

    // 1. Set custom claims in Firebase Auth
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
      role: "admin",
    });

    // 2. Update user role in Firestore database
    const db = admin.firestore();
    await db.collection("users").doc(user.uid).update({
      role: "admin",
      updatedAt: new Date(),
    });

    console.log(`✅ SUCCESS: ${email} is now an admin!`);
    console.log(`✅ Custom claims set in Firebase Auth`);
    console.log(`✅ Role updated in Firestore database`);
    console.log(`User can now access the admin panel at /admin`);
  } catch (error) {
    console.error("❌ ERROR:", error.message);

    if (error.code === "auth/user-not-found") {
      console.log(
        "💡 TIP: Create this user account first in Firebase Console → Authentication → Users"
      );
    }
  }

  // Exit the script
  process.exit(0);
};

// 👇 CHANGE THIS TO YOUR EMAIL ADDRESS 👇
const myEmail = "kmmelissat@gmail.com";
makeUserAdmin(myEmail);
