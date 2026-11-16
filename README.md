# 🛍️ TechPulse — Modern E-Commerce Platform & Admin Console

> **Pluto Academy MERN Stack Internship — Project 02**  
> Built by **Shivshankar Dhareppa Mali**  
> Candidate Offer Reference: `PA-OL-MS-2026-0237`  
> GitHub Repository: [https://github.com/shiv123-coder/pluto-ecommerce-mern](https://github.com/shiv123-coder/pluto-ecommerce-mern)

TechPulse is an e-commerce platform built on the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It features a catalog with dynamic multi-parameter filtering, real-time keyword search, interactive shopping cart with state persistence, role-based authorization, and an Admin Management Console for real-time inventory control.

---

## 📚 Core Concepts & Topics Covered

### 1. Role-Based Access Control (RBAC) & Security
- **Dual-Tier Authentication:** Distinguishing standard customers (`role: 'user'`) from administrators (`role: 'admin'`).
- **Hierarchical Middleware:** Chained Express guards (`protect` for JWT verification, followed by `admin` for role authorization).
- **Frontend Route Protection:** Client-side `AdminRoute` blocking unauthorized access with user-friendly access-denied prompts.
- **Bcrypt Security:** Salted hashing for passwords and secure token issuance.

### 2. Advanced NoSQL Data Modeling & Database Seeding
- **MongoDB Atlas Schemas:** Product schema with name, description, price, category, imageUrl, stockCount, ratings, and featured status.
- **Compound Text Indexing:** Database-level `$text` index across `name` and `description` for high-performance search.
- **Automated Cloud Seeder (`seeder.js`):** Standalone data seeder to wipe and populate 10+ realistic catalog items with CDN assets and pre-configured administrator accounts.

### 3. E-Commerce State Management & Shopping Cart
- **Persistent Cart Context (`CartContext`):** React Context managing cart state with automatic bidirectional synchronization to `localStorage`.
- **Inventory Boundary Enforcement:** Quantity increment logic strictly bounded by actual product `stockCount` to prevent overselling.
- **Dynamic Price Breakdown:** Live subtotal, free shipping calculations, and checkout simulation with confirmation feedback.

### 4. Interactive Catalog & Multi-Parameter Filtering
- **Multi-Factor Filtering:** Live client-side & server-side search across keyword, category tags, and dynamic price range slider.
- **Flexible Sorting:** Sorting algorithms for *Featured*, *Price: Low to High*, *Price: High to Low*, *Rating*, and *Newest Arrivals*.
- **Instant Reset:** 1-click filter reset returning to the full catalog view.

### 5. Admin Inventory Management Console
- **Real-Time Catalog Metrics:** Automated calculation of Total Products, Total Stock Units, Low Stock Alert Count (<= 5 units), and Catalog Valuation ($).
- **Full Inventory CRUD:** Modal dialogs for adding new products, updating specifications/stock, and permanently deleting products.

---

## 🔑 Evaluator Test Credentials

Evaluators can test the application using pre-configured accounts or the 1-click demo autofill buttons on the login screen:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ecommerce.com` | `AdminPassword123!` | Full Catalog CRUD & Admin Panel |
| **Customer** | `user@ecommerce.com` | `UserPassword123!` | Browsing, Cart & Checkout |

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19 (Vite), React Router DOM v7, Axios, Tailwind CSS v4, Lucide React |
| **Backend** | Node.js, Express.js, Mongoose ODM, JSON Web Token (JWT), Bcryptjs, CORS, Dotenv |
| **Database** | MongoDB Atlas Cloud Cluster |
| **Deployment** | Vercel (Frontend SPA), Render (Backend REST API) |

---

## 📂 Project Structure

```
project-02-ecommerce-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile & RBAC
│   │   └── productController.js  # Product queries, filters, and Admin CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection & Admin guard
│   │   └── errorMiddleware.js    # 404 & centralized error handlers
│   ├── models/
│   │   ├── User.js               # User schema with roles ('user', 'admin')
│   │   └── Product.js            # Product schema with indexes & stock tracking
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── productRoutes.js      # Public & Admin product routes
│   ├── seeder.js                 # Database seeder with 10 initial products & admin
│   ├── .env.example              # Sample environment variables
│   ├── server.js                 # Express server configuration
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminProductModal.jsx # Create/Edit product dialog
    │   │   ├── AdminRoute.jsx        # RBAC frontend route guard
    │   │   ├── CartDrawer.jsx        # Slide-over interactive shopping cart
    │   │   ├── Navbar.jsx            # Top bar with cart badge and admin navigation
    │   │   └── ProductCard.jsx       # Catalog product card with stock badges
    │   ├── context/
    │   │   ├── AuthContext.jsx       # Auth state, login/logout, role detection
    │   │   └── CartContext.jsx       # Shopping cart state & local storage sync
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx    # Protected inventory management console
    │   │   ├── Catalog.jsx           # Storefront with live search & filters
    │   │   ├── Login.jsx             # Sign in with 1-click demo accounts
    │   │   └── Register.jsx          # Customer registration
    │   ├── services/
    │   └── api.js                # Axios client with interceptors
    ├── App.jsx                   # Application routes
    ├── main.jsx                  # React DOM mount
    └── index.css                 # Tailwind CSS styles
    ├── index.html
    ├── vercel.json               # Vercel SPA routing
    └── package.json
```

---

## 🚀 API Endpoints Reference

### Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new customer account |
| `POST` | `/api/auth/login` | Authenticate user & return token with role |
| `GET` | `/api/products` | Get products with search, category, price & sorting |
| `GET` | `/api/products/categories` | Get distinct category list |
| `GET` | `/api/products/:id` | Get single product specifications |

### Protected & Admin Endpoints
| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/me` | User / Admin | Retrieve current authenticated profile |
| `POST` | `/api/products` | Admin Only | Add new product to inventory |
| `PUT` | `/api/products/:id` | Admin Only | Update product details & stock |
| `DELETE`| `/api/products/:id` | Admin Only | Permanently delete product |

---

## ⚙️ Local Development Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

---

## 💡 Challenge / Interesting Feature (Submission Note)

> **Most Interesting Feature Built:**  
> Implementing the dual-tier role-based authorization system combining secure Express middleware (`protect` + `admin`) with a synchronized client-side cart and real-time Admin Management Console that enables immediate catalog updates, live stock monitoring, and out-of-stock validation without requiring page reloads.
