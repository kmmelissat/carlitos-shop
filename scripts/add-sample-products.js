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
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 25,
    weight: 311,
    ingredients: "Corn, vegetable oil, cheese seasoning, salt",
    allergens: "Milk, contains corn",
    brand: "Doritos",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
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
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 42,
    weight: 432,
    ingredients: "Sugar, flour, cocoa, palm oil, high fructose corn syrup",
    allergens: "Wheat, soy, may contain milk",
    brand: "Oreo",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
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
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 0, // Out of stock for testing
    weight: 355,
    ingredients:
      "Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, natural flavors, caffeine",
    allergens: "None",
    brand: "Coca-Cola",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
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
      "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1571506165871-ee72a35f476c?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 3, // Low stock for testing
    weight: 52,
    ingredients:
      "Milk chocolate, peanuts, corn syrup, sugar, palm oil, skim milk, lactose",
    allergens: "Peanuts, milk, soy, may contain tree nuts",
    brand: "Snickers",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
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
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 18,
    weight: 340,
    ingredients: "Cashews, almonds, brazil nuts, hazelnuts, pecans, sea salt",
    allergens: "Tree nuts, may contain peanuts",
    brand: "Planters",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
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
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 31,
    weight: 142,
    ingredients: "Potatoes, safflower and/or sunflower oil, sea salt",
    allergens: "None",
    brand: "Kettle Brand",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.3,
    reviewCount: 45,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // El Salvador Popular Products
  {
    name: "Diana Galletas María",
    description:
      "Classic Diana María cookies, perfect to enjoy with coffee or milk. A traditional flavor that never goes out of style.",
    price: 2.25,
    category: "cookies",
    images: [
      "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 45,
    weight: 200,
    ingredients: "Wheat flour, sugar, vegetable oil, salt, yeast",
    allergens: "Gluten, may contain milk",
    brand: "Diana",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.7,
    reviewCount: 92,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Ricitos de Oro Cereal",
    description:
      "Honey corn cereal, perfect for breakfast. Nutritious and delicious, the whole family's favorite.",
    price: 4.5,
    category: "other",
    images: [
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 28,
    weight: 400,
    ingredients: "Corn, honey, vitamins and minerals, sugar",
    allergens: "May contain gluten",
    brand: "Ricitos de Oro",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.5,
    reviewCount: 78,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Manzanita Sol",
    description:
      "Carbonated apple soda with a refreshing and unique flavor. Central America's favorite beverage.",
    price: 1.75,
    category: "beverages",
    images: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 35,
    weight: 355,
    ingredients:
      "Carbonated water, sugar, natural apple flavoring, citric acid",
    allergens: "None",
    brand: "Manzanita Sol",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.6,
    reviewCount: 156,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Churros Rellenos",
    description:
      "Crispy churros filled with dulce de leche, dusted with sugar. An irresistible traditional sweet treat.",
    price: 3.25,
    category: "candy",
    images: [
      "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1545552966-1c12e9f1b9ca?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 20,
    weight: 150,
    ingredients: "Flour, oil, dulce de leche, sugar, cinnamon",
    allergens: "Gluten, milk",
    brand: "Dulces Tradicionales",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.8,
    reviewCount: 123,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Horchata en Polvo",
    description:
      "Mix to prepare traditional Salvadoran horchata. Just add cold water and enjoy this delicious refreshing drink.",
    price: 2.99,
    category: "beverages",
    images: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 32,
    weight: 250,
    ingredients: "Rice, cinnamon, sugar, vanilla, natural preservatives",
    allergens: "None",
    brand: "Tradicional",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.4,
    reviewCount: 89,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Semitas de Piña",
    description:
      "Traditional Salvadoran pineapple cookies. Perfect for afternoon coffee or as a dessert.",
    price: 3.75,
    category: "cookies",
    images: [
      "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 15,
    weight: 300,
    ingredients: "Flour, pineapple, sugar, butter, eggs",
    allergens: "Gluten, eggs, milk",
    brand: "Panadería Nacional",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.9,
    reviewCount: 67,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Tamarindo Dulce",
    description:
      "Tamarind candies with chili, the perfect sweet and sour flavor. A classic from Central American confectionery.",
    price: 1.99,
    category: "candy",
    images: [
      "https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1549308252-d25ca5c30f83?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 50,
    weight: 100,
    ingredients: "Tamarind, sugar, chili, salt, preservatives",
    allergens: "None",
    brand: "Dulces del Trópico",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.3,
    reviewCount: 145,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Tortrix Naturales",
    description:
      "Natural corn tortilla chips, crispy and flavorful. Perfect for sharing or enjoying alone.",
    price: 2.75,
    category: "chips",
    images: [
      "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 40,
    weight: 200,
    ingredients: "Corn, vegetable oil, salt",
    allergens: "May contain gluten",
    brand: "Tortrix",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.4,
    reviewCount: 98,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Café Listo Instantáneo",
    description:
      "High-quality instant coffee, perfect for quick preparation. Intense and aromatic flavor.",
    price: 5.99,
    category: "beverages",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 25,
    weight: 170,
    ingredients: "100% soluble coffee",
    allergens: "None",
    brand: "Café Listo",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.6,
    reviewCount: 234,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Churritos Dulces",
    description:
      "Corn snacks shaped like little churros, sweet and crispy. Perfect for kids and the whole family.",
    price: 1.5,
    category: "candy",
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 60,
    weight: 80,
    ingredients: "Corn, sugar, vegetable oil, flavorings",
    allergens: "May contain gluten",
    brand: "Snacks Centroamericanos",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.2,
    reviewCount: 76,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Act II Butter Lovers Popcorn",
    description:
      "Microwave popcorn with rich, buttery flavor. Perfect for movie nights and snacking anytime.",
    price: 2.99,
    category: "popcorn",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 20,
    weight: 99,
    ingredients:
      "Popcorn, palm oil, salt, natural and artificial flavor, color",
    allergens: "May contain milk",
    brand: "Act II",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.1,
    reviewCount: 33,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Skittles Original",
    description:
      "Taste the rainbow with these colorful, fruit-flavored chewy candies. A classic favorite for all ages.",
    price: 1.89,
    category: "candy",
    images: [
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 50,
    weight: 61,
    ingredients:
      "Sugar, corn syrup, hydrogenated palm kernel oil, fruit juice, colors",
    allergens: "None",
    brand: "Skittles",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.7,
    reviewCount: 120,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Nature Valley Granola Bars",
    description:
      "Crunchy granola bars made with whole grain oats and honey. A healthy snack for on-the-go.",
    price: 3.49,
    category: "healthy",
    images: [
      "https://images.unsplash.com/photo-1504674900247-ec6b0b1b798e?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 40,
    weight: 210,
    ingredients:
      "Whole grain oats, sugar, canola oil, honey, brown sugar syrup",
    allergens: "May contain peanuts, tree nuts, soy",
    brand: "Nature Valley",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.5,
    reviewCount: 60,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sun-Maid Dried Apricots",
    description:
      "Sweet and tangy dried apricots, a healthy and delicious snack packed with nutrients.",
    price: 4.29,
    category: "dried_fruits",
    images: [
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 22,
    weight: 170,
    ingredients: "Dried apricots, sulfur dioxide (preservative)",
    allergens: "None",
    brand: "Sun-Maid",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.6,
    reviewCount: 41,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Ritz Crackers",
    description:
      "Light, flaky, and buttery crackers. Perfect for snacking or pairing with cheese and spreads.",
    price: 2.99,
    category: "crackers",
    images: [
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1504674900247-ec6b0b1b798e?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 36,
    weight: 200,
    ingredients: "Enriched flour, vegetable oil, sugar, salt, leavening",
    allergens: "Wheat, soy",
    brand: "Ritz",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.4,
    reviewCount: 55,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Pepsi",
    description:
      "The bold, refreshing cola taste loved worldwide. Perfect for quenching your thirst.",
    price: 1.89,
    category: "beverages",
    images: [
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 27,
    weight: 355,
    ingredients:
      "Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, natural flavors, caffeine",
    allergens: "None",
    brand: "Pepsi",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.3,
    reviewCount: 77,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "KIND Dark Chocolate Nuts & Sea Salt",
    description:
      "A healthy snack bar made with almonds, peanuts, and dark chocolate, lightly sprinkled with sea salt.",
    price: 2.49,
    category: "healthy",
    images: [
      "https://images.unsplash.com/photo-1504674900247-ec6b0b1b798e?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 30,
    weight: 40,
    ingredients: "Almonds, peanuts, dark chocolate, sea salt, honey",
    allergens: "Tree nuts, peanuts, soy",
    brand: "KIND",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.8,
    reviewCount: 90,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Takis Fuego",
    description:
      "Rolled tortilla chips with an intense hot chili pepper and lime flavor. For the bold snackers!",
    price: 3.29,
    category: "chips",
    images: [
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1504674900247-ec6b0b1b798e?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 25,
    weight: 90,
    ingredients:
      "Corn masa flour, vegetable oil, seasoning, chili pepper, lime",
    allergens: "May contain milk, soy",
    brand: "Takis",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.6,
    reviewCount: 110,
    isActive: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Hershey’s Milk Chocolate Bar",
    description:
      "Classic creamy milk chocolate bar, perfect for sharing or enjoying all to yourself.",
    price: 1.99,
    category: "chocolate",
    images: [
      "https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1571506165871-ee72a35f476c?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 40,
    weight: 43,
    ingredients: "Milk chocolate, sugar, cocoa butter, milk, lecithin, vanilla",
    allergens: "Milk, soy",
    brand: "Hershey’s",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.7,
    reviewCount: 150,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Pringles Sour Cream & Onion",
    description:
      "Crispy, stackable potato chips with a tangy sour cream and onion flavor.",
    price: 2.79,
    category: "chips",
    images: [
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 32,
    weight: 156,
    ingredients: "Dried potatoes, vegetable oil, sour cream & onion seasoning",
    allergens: "Milk, wheat",
    brand: "Pringles",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.5,
    reviewCount: 80,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Welch’s Fruit Snacks",
    description:
      "Juicy, bite-sized fruit snacks made with real fruit. A sweet and healthy treat for all ages.",
    price: 1.49,
    category: "candy",
    images: [
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 60,
    weight: 25,
    ingredients: "Fruit puree, sugar, gelatin, citric acid, vitamin C",
    allergens: "None",
    brand: "Welch’s",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.9,
    reviewCount: 70,
    isActive: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Tropicana Orange Juice",
    description:
      "100% pure squeezed orange juice, no added sugar. Refreshing and full of vitamin C.",
    price: 2.59,
    category: "beverages",
    images: [
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&h=500&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&h=500&fit=crop&auto=format",
    ],
    stock: 28,
    weight: 355,
    ingredients: "100% orange juice",
    allergens: "None",
    brand: "Tropicana",
    seller: {
      id: "admin",
      name: "Carlito's Snacks",
      rating: 5,
    },
    rating: 4.8,
    reviewCount: 65,
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
