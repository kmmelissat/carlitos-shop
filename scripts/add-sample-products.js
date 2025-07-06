const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../service-account-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const sampleProducts = [
  {
    name: "Doritos Nacho Cheese",
    description:
      "The classic nacho cheese flavored tortilla chips that started it all. Crunchy, cheesy, and absolutely irresistible.",
    price: 4.99,
    category: "chips",
    images: [
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    ],
    stock: 25,
    weight: 311,
    ingredients: "Corn, vegetable oil, cheese seasoning, salt",
    allergens: "Milk, contains corn",
    brand: "Doritos",
    seller: {
      id: "admin",
      name: "Madreselva Store",
      rating: 5,
    },
    rating: 4.5,
    reviewCount: 156,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Oreo Original Cookies",
    description:
      "America's favorite cookie with a rich chocolate wafer and sweet cream filling. Perfect for dunking in milk!",
    price: 3.79,
    category: "cookies",
    images: [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500",
    ],
    stock: 42,
    weight: 432,
    ingredients: "Sugar, flour, cocoa, palm oil, high fructose corn syrup",
    allergens: "Wheat, soy, may contain milk",
    brand: "Oreo",
    seller: {
      id: "admin",
      name: "Madreselva Store",
      rating: 5,
    },
    rating: 4.8,
    reviewCount: 203,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Coca-Cola Classic",
    description:
      "The original and iconic cola with that distinctive Coca-Cola taste. Refreshing and crisp with the perfect amount of sweetness.",
    price: 1.99,
    category: "beverages",
    images: [
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500",
      "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=500",
    ],
    stock: 0, // Out of stock for testing
    weight: 355,
    ingredients:
      "Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, natural flavors, caffeine",
    allergens: "None",
    brand: "Coca-Cola",
    seller: {
      id: "admin",
      name: "Madreselva Store",
      rating: 5,
    },
    rating: 4.2,
    reviewCount: 89,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Snickers Bar",
    description:
      "Packed with roasted peanuts, nougat, caramel and milk chocolate. Snickers really satisfies your hunger!",
    price: 2.49,
    category: "chocolate",
    images: [
      "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500",
      "https://images.unsplash.com/photo-1549308252-d25ca5c30f83?w=500",
    ],
    stock: 3, // Low stock for testing
    weight: 52,
    ingredients:
      "Milk chocolate, peanuts, corn syrup, sugar, palm oil, skim milk, lactose",
    allergens: "Peanuts, milk, soy, may contain tree nuts",
    brand: "Snickers",
    seller: {
      id: "admin",
      name: "Madreselva Store",
      rating: 5,
    },
    rating: 4.6,
    reviewCount: 134,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Planters Mixed Nuts",
    description:
      "Premium mix of cashews, almonds, brazil nuts, hazelnuts and pecans. A perfect healthy snack for any time of day.",
    price: 7.99,
    category: "nuts",
    images: [
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500",
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500",
    ],
    stock: 18,
    weight: 340,
    ingredients: "Cashews, almonds, brazil nuts, hazelnuts, pecans, sea salt",
    allergens: "Tree nuts, may contain peanuts",
    brand: "Planters",
    seller: {
      id: "admin",
      name: "Madreselva Store",
      rating: 5,
    },
    rating: 4.4,
    reviewCount: 67,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Kettle Brand Sea Salt Chips",
    description:
      "Crispy kettle-cooked potato chips with just the right amount of sea salt. Made with all-natural ingredients.",
    price: 5.49,
    category: "chips",
    images: [
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500",
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500",
    ],
    stock: 31,
    weight: 142,
    ingredients: "Potatoes, safflower and/or sunflower oil, sea salt",
    allergens: "None",
    brand: "Kettle Brand",
    seller: {
      id: "admin",
      name: "Madreselva Store",
      rating: 5,
    },
    rating: 4.3,
    reviewCount: 45,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const addSampleProducts = async () => {
  try {
    console.log("🚀 Adding sample products to the database...");

    for (const product of sampleProducts) {
      const docRef = await db.collection("products").add(product);
      console.log(`✅ Added product: ${product.name} (ID: ${docRef.id})`);
    }

    console.log("🎉 All sample products added successfully!");
    console.log("📊 Summary:");
    console.log(`   - Total products: ${sampleProducts.length}`);
    console.log(
      `   - In stock: ${sampleProducts.filter((p) => p.stock > 0).length}`
    );
    console.log(
      `   - Out of stock: ${sampleProducts.filter((p) => p.stock === 0).length}`
    );
    console.log(
      `   - Featured: ${sampleProducts.filter((p) => p.featured).length}`
    );
  } catch (error) {
    console.error("❌ Error adding sample products:", error);
  }

  process.exit(0);
};

addSampleProducts();
