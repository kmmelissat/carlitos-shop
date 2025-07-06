const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path-to-your-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const setAdminClaim = async (email) => {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);

    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
      role: "admin",
    });

    console.log(`Successfully set admin claims for user: ${email}`);
    console.log(`User UID: ${user.uid}`);
  } catch (error) {
    console.error("Error setting admin claims:", error);
  }
};

// Replace with your admin email
const adminEmail = "admin@madreselva.com";
setAdminClaim(adminEmail);
