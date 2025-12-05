// Sample Products Script - Add Sports Equipment & Clothing
// Run this with: node add-sample-products.js

const products = [
  // Sports Equipment - Cricket
  {
    name: "Professional Cricket Bat",
    category: "Sports Equipment",
    subCategory: "Cricket",
    productType: "Bat",
    sport: "Cricket",
    brand: "SS",
    price: 3999,
    description: "Premium English willow cricket bat with excellent balance and power. Perfect for professional players.",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500",
    availableSizes: [],
    availableColors: []
  },
  {
    name: "Leather Cricket Ball - Red",
    category: "Sports Equipment",
    subCategory: "Cricket",
    productType: "Ball",
    sport: "Cricket",
    brand: "SG",
    price: 899,
    description: "High-quality leather cricket ball for professional matches. Four-piece construction with excellent seam.",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=500",
    availableSizes: [],
    availableColors: ["Red"]
  },
  {
    name: "Cricket Batting Gloves",
    category: "Sports Equipment",
    subCategory: "Cricket",
    productType: "Gloves",
    sport: "Cricket",
    brand: "Kookaburra",
    price: 1499,
    description: "Premium batting gloves with superior protection and comfort. High-density foam padding.",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1593766787879-e8c78e09cec2?w=500",
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: ["White", "Black"]
  },

  // Sports Equipment - Football
  {
    name: "FIFA Approved Football",
    category: "Sports Equipment",
    subCategory: "Football",
    productType: "Ball",
    sport: "Football",
    brand: "Adidas",
    price: 2499,
    description: "Official size 5 football with FIFA Quality certification. Excellent grip and durability.",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500",
    availableSizes: ["5"],
    availableColors: ["White", "Black", "Blue"]
  },
  {
    name: "Football Training Cones Set",
    category: "Sports Equipment",
    subCategory: "Football",
    productType: "Training Equipment",
    sport: "Football",
    brand: "Nike",
    price: 599,
    description: "Set of 10 durable training cones. Perfect for drills and practice sessions.",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500",
    availableSizes: [],
    availableColors: ["Orange", "Yellow"]
  },

  // Sports Equipment - Tennis
  {
    name: "Professional Tennis Racket",
    category: "Sports Equipment",
    subCategory: "Tennis",
    productType: "Racket",
    sport: "Tennis",
    brand: "Wilson",
    price: 5999,
    description: "High-performance tennis racket with carbon fiber frame. Perfect balance of power and control.",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=500",
    availableSizes: [],
    availableColors: ["Red", "Black"]
  },
  {
    name: "Tennis Ball Can (3 Balls)",
    category: "Sports Equipment",
    subCategory: "Tennis",
    productType: "Ball",
    sport: "Tennis",
    brand: "Wilson",
    price: 399,
    description: "Pack of 3 premium tennis balls with excellent bounce and durability.",
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500",
    availableSizes: [],
    availableColors: ["Yellow"]
  },

  // Sports Equipment - Gym & Fitness
  {
    name: "Adjustable Dumbbells Set",
    category: "Sports Equipment",
    subCategory: "Gym & Fitness",
    productType: "Dumbbells",
    sport: "Gym & Fitness",
    brand: "Reebok",
    price: 4999,
    description: "Premium adjustable dumbbell set (5-25kg). Perfect for home gym workouts.",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
    availableSizes: [],
    availableColors: ["Black"]
  },
  {
    name: "Yoga Mat Premium",
    category: "Sports Equipment",
    subCategory: "Gym & Fitness",
    productType: "Yoga Mat",
    sport: "Gym & Fitness",
    brand: "Liforme",
    price: 1299,
    description: "Extra thick yoga mat with anti-slip surface. Perfect for yoga, pilates, and stretching.",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    availableSizes: [],
    availableColors: ["Purple", "Blue", "Pink", "Green"]
  },
  {
    name: "Resistance Bands Set",
    category: "Sports Equipment",
    subCategory: "Gym & Fitness",
    productType: "Resistance Bands",
    sport: "Gym & Fitness",
    brand: "TheraBand",
    price: 899,
    description: "Set of 5 resistance bands with varying resistance levels. Great for strength training.",
    stock: 55,
    imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
    availableSizes: [],
    availableColors: ["Multi"]
  },

  // Clothing - Men
  {
    name: "Men's Running T-Shirt",
    category: "Clothing",
    subCategory: "Men",
    productType: "T-Shirt",
    gender: "Men",
    material: "Polyester",
    brand: "Nike",
    price: 1299,
    description: "Breathable quick-dry running t-shirt with moisture-wicking technology. Perfect for workouts.",
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    availableColors: ["Black", "Blue", "Red", "White"]
  },
  {
    name: "Men's Training Shorts",
    category: "Clothing",
    subCategory: "Men",
    productType: "Shorts",
    gender: "Men",
    material: "Polyester",
    brand: "Adidas",
    price: 999,
    description: "Comfortable training shorts with elastic waistband and side pockets.",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500",
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    availableColors: ["Black", "Navy", "Gray"]
  },
  {
    name: "Men's Track Jacket",
    category: "Clothing",
    subCategory: "Men",
    productType: "Jacket",
    gender: "Men",
    material: "Polyester",
    brand: "Puma",
    price: 2499,
    description: "Classic track jacket with full zip and side pockets. Great for training and casual wear.",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    availableSizes: ["M", "L", "XL", "XXL"],
    availableColors: ["Black", "Navy", "Red"]
  },
  {
    name: "Men's Sports Tank Top",
    category: "Clothing",
    subCategory: "Men",
    productType: "Tank Top",
    gender: "Men",
    material: "Cotton Blend",
    brand: "Under Armour",
    price: 899,
    description: "Lightweight tank top for gym workouts. Breathable and comfortable fit.",
    stock: 65,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: ["Black", "Gray", "White"]
  },

  // Clothing - Women
  {
    name: "Women's Sports Bra",
    category: "Clothing",
    subCategory: "Women",
    productType: "Sports Bra",
    gender: "Women",
    material: "Spandex",
    brand: "Nike",
    price: 1499,
    description: "High-support sports bra with moisture-wicking fabric. Perfect for intense workouts.",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1556316384-12c35d30afa4?w=500",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    availableColors: ["Black", "Pink", "Purple", "Blue"]
  },
  {
    name: "Women's Yoga Leggings",
    category: "Clothing",
    subCategory: "Women",
    productType: "Leggings",
    gender: "Women",
    material: "Spandex",
    brand: "Lululemon",
    price: 2299,
    description: "High-waisted yoga leggings with four-way stretch. Non-see-through and squat-proof.",
    stock: 75,
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    availableColors: ["Black", "Navy", "Maroon", "Gray"]
  },
  {
    name: "Women's Running Tank",
    category: "Clothing",
    subCategory: "Women",
    productType: "Tank Top",
    gender: "Women",
    material: "Polyester",
    brand: "Adidas",
    price: 1099,
    description: "Lightweight running tank with breathable mesh panels. Perfect for summer workouts.",
    stock: 55,
    imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=500",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    availableColors: ["White", "Pink", "Mint", "Purple"]
  },
  {
    name: "Women's Training Shorts",
    category: "Clothing",
    subCategory: "Women",
    productType: "Shorts",
    gender: "Women",
    material: "Polyester",
    brand: "Puma",
    price: 899,
    description: "Comfortable training shorts with inner brief. Great for gym and outdoor activities.",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1574633502809-f9df7c5925e3?w=500",
    availableSizes: ["XS", "S", "M", "L", "XL"],
    availableColors: ["Black", "Navy", "Gray", "Pink"]
  },

  // Clothing - Kids
  {
    name: "Kids Football Jersey",
    category: "Clothing",
    subCategory: "Kids",
    productType: "Jersey",
    gender: "Kids",
    material: "Polyester",
    brand: "Adidas",
    price: 799,
    description: "Comfortable football jersey for kids. Lightweight and breathable fabric.",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1522057306606-f1a6b5f0f1f3?w=500",
    availableSizes: ["6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    availableColors: ["Red", "Blue", "Yellow"]
  },
  {
    name: "Kids Sports T-Shirt",
    category: "Clothing",
    subCategory: "Kids",
    productType: "T-Shirt",
    gender: "Kids",
    material: "Cotton",
    brand: "Nike",
    price: 599,
    description: "Comfortable cotton t-shirt for active kids. Perfect for daily wear and sports.",
    stock: 70,
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
    availableSizes: ["6-7Y", "8-9Y", "10-11Y", "12-13Y", "14-15Y"],
    availableColors: ["Blue", "Green", "Orange", "Black"]
  },
  {
    name: "Kids Track Pants",
    category: "Clothing",
    subCategory: "Kids",
    productType: "Pants",
    gender: "Kids",
    material: "Polyester",
    brand: "Puma",
    price: 899,
    description: "Comfortable track pants with elastic waistband. Great for sports and casual wear.",
    stock: 55,
    imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500",
    availableSizes: ["6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    availableColors: ["Black", "Navy", "Gray"]
  },
  {
    name: "Kids Swimming Shorts",
    category: "Clothing",
    subCategory: "Kids",
    productType: "Swim Shorts",
    gender: "Kids",
    material: "Polyester",
    brand: "Speedo",
    price: 699,
    description: "Quick-dry swimming shorts for kids. Comfortable fit with drawstring waist.",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500",
    availableSizes: ["6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    availableColors: ["Blue", "Red", "Green"]
  }
];

console.log('\n=== Sample Products for IndiaBorn E-Commerce ===\n');
console.log(`Total products to add: ${products.length}\n`);

console.log('Products by Category:');
console.log('- Sports Equipment:', products.filter(p => p.category === 'Sports Equipment').length);
console.log('- Clothing:', products.filter(p => p.category === 'Clothing').length);
console.log('\nSports Equipment Breakdown:');
console.log('- Cricket:', products.filter(p => p.sport === 'Cricket').length);
console.log('- Football:', products.filter(p => p.sport === 'Football').length);
console.log('- Tennis:', products.filter(p => p.sport === 'Tennis').length);
console.log('- Gym & Fitness:', products.filter(p => p.sport === 'Gym & Fitness').length);
console.log('\nClothing Breakdown:');
console.log('- Men:', products.filter(p => p.gender === 'Men').length);
console.log('- Women:', products.filter(p => p.gender === 'Women').length);
console.log('- Kids:', products.filter(p => p.gender === 'Kids').length);

console.log('\n=== How to Add These Products ===\n');
console.log('1. Open the admin panel: http://localhost:3000/admin');
console.log('2. Login with: admin@indiaborn.com / ChangeMe123!');
console.log('3. Copy each product data from this script');
console.log('4. Fill in the form fields and click "Add Product"\n');

console.log('=== Product List ===\n');
products.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}`);
  console.log(`   Category: ${product.category}${product.subCategory ? ' > ' + product.subCategory : ''}`);
  console.log(`   Brand: ${product.brand} | Price: ₹${product.price}`);
  console.log(`   Stock: ${product.stock} | Sizes: ${product.availableSizes.length > 0 ? product.availableSizes.join(', ') : 'N/A'}`);
  console.log(`   Image: ${product.imageUrl}`);
  console.log('');
});

console.log('\n=== Instructions ===');
console.log('Each product includes:');
console.log('✓ High-quality images from Unsplash');
console.log('✓ Proper categorization (Sports Equipment or Clothing)');
console.log('✓ Brand names (Nike, Adidas, Puma, etc.)');
console.log('✓ Size options for clothing items');
console.log('✓ Color variants');
console.log('✓ Realistic pricing');
console.log('✓ Stock quantities\n');

// Export for potential programmatic use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = products;
}
