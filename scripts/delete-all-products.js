const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../service-account-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const deleteAllProducts = async () => {
  try {
    console.log("🗑️  Starting to delete all products from the database...");
    console.log("⚠️  WARNING: This action cannot be undone!");

    // Get all products
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      console.log("📭 No products found in the database.");
      return;
    }

    console.log(`📊 Found ${snapshot.size} products to delete...`);

    // Create a batch to delete all products
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
      console.log(
        `🗑️  Queued for deletion: ${doc.data().name} (ID: ${doc.id})`
      );
    });

    // Execute the batch delete
    await batch.commit();

    console.log("✅ All products have been successfully deleted!");
    console.log(`📊 Summary: ${snapshot.size} products deleted`);
  } catch (error) {
    console.error("❌ Error deleting products:", error.message);
    process.exit(1);
  }
};

// Add confirmation prompt
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  "⚠️  WARNING: You are about to delete ALL products from the database!"
);
console.log("🚨 This action cannot be undone!");
console.log("");

rl.question(
  'Are you sure you want to continue? Type "DELETE ALL" to confirm: ',
  (answer) => {
    if (answer === "DELETE ALL") {
      console.log("🔥 Proceeding with deletion...");
      deleteAllProducts().then(() => {
        rl.close();
        process.exit(0);
      });
    } else {
      console.log("❌ Deletion cancelled. Your products are safe!");
      rl.close();
      process.exit(0);
    }
  }
);
