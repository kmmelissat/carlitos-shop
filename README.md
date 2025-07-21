# 🛍️ CARLITOS - Modern E-commerce Platform

A full-featured e-commerce application built with Next.js 15, TypeScript, and Firebase. Features a beautiful UI, comprehensive admin panel, and seamless shopping experience.

![CARLITOS Logo](public/carlitos-logo.svg)

## 🌟 Live Demo

**Production Site:** [https://carlitos-esen.vercel.app](https://carlitos-esen.vercel.app)

## ✨ Features

### 🛒 **Customer Features**

- **Product Catalog** - Browse products with search and category filtering
- **Shopping Cart** - Persistent cart with real-time updates
- **Secure Checkout** - Multiple payment and delivery options
- **User Authentication** - Email/password and Google OAuth
- **Order Tracking** - View order history and status
- **Responsive Design** - Mobile-first approach

### 🔧 **Admin Panel**

- **Dashboard Analytics** - Sales metrics, revenue trends, and insights
- **Product Management** - CRUD operations with image upload
- **Order Management** - Status updates and order processing
- **Customer Management** - Customer profiles, analytics, and insights
- **Sales Analytics** - Revenue trends, best-selling products, peak hours
- **Inventory Management** - Stock tracking and low stock alerts

### 🎨 **UI/UX Features**

- **Modern Design** - Clean, professional interface
- **Dark/Light Mode** - Theme switching capability
- **Loading States** - Smooth user experience
- **Toast Notifications** - User feedback system
- **Responsive Layout** - Works on all devices

## 🚀 Tech Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Ant Design** - Professional UI components
- **Zustand** - State management

### **Backend & Database**

- **Firebase** - Authentication, Firestore database
- **Firebase Admin SDK** - Server-side operations
- **Vercel** - Deployment and hosting

### **Development Tools**

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **date-fns** - Date manipulation

## 📁 Project Structure

```
CARLITOS/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── customers/     # Customer management
│   │   │   ├── orders/        # Order management
│   │   │   ├── products/      # Product management
│   │   │   └── analytics/     # Sales analytics
│   │   ├── auth/              # Authentication pages
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout process
│   │   ├── orders/            # Order tracking
│   │   ├── products/          # Product catalog
│   │   └── profile/           # User profile
│   ├── components/            # Reusable components
│   │   ├── admin/            # Admin-specific components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   ├── lib/                  # Utility libraries
│   ├── store/                # State management
│   ├── types/                # TypeScript definitions
│   └── utils/                # Helper functions
├── public/                   # Static assets
└── scripts/                  # Database scripts
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CARLITOS
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file with your Firebase credentials:

   ```env
   # Firebase Config
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin SDK
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
   FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

### Making a User Admin

Use the provided script to grant admin privileges:

```bash
node scripts/make-me-admin.js <email>
```

### Admin Features

- **Dashboard**: Overview of sales, orders, and customer metrics
- **Products**: Add, edit, and manage product catalog
- **Orders**: Process orders and update status
- **Customers**: View customer profiles and analytics
- **Analytics**: Sales trends and business insights

## 📊 Admin Panel Features

### **Dashboard** (`/admin`)

- Real-time sales metrics
- Recent orders overview
- Top customers and products
- Weekly comparison charts
- Low stock alerts

### **Products** (`/admin/products`)

- Product catalog management
- Image upload and editing
- Stock level tracking
- Category organization
- Featured product selection

### **Orders** (`/admin/orders`)

- Order status management
- Payment processing
- Delivery tracking
- Customer communication
- Order history

### **Customers** (`/admin/customers`)

- Customer directory with search
- Customer segmentation (New, Active, Inactive, VIP)
- Purchase history and analytics
- Lifetime value calculations
- Customer activity tracking

### **Analytics** (`/admin/analytics`)

- Revenue trends and forecasting
- Best-selling products analysis
- Peak sales hours identification
- Customer acquisition metrics
- Sales performance insights

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Environment Variables for Production

Ensure all Firebase credentials are set in Vercel environment variables.

## 🧪 Testing

### Development Scripts

```bash
# Add sample products
node scripts/add-sample-products.js

# Delete all products
node scripts/delete-all-products.js

# Set admin privileges
node scripts/make-me-admin.js <email>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Support

For support, email kmmelissat@gmail.com or create an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and Firebase**
