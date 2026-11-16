# 🛍️ TechPulse — Modern E-Commerce Platform & Admin Console

> **Pluto Academy MERN Stack Internship — Project 02**  
> Built by **Shivshankar Dhareppa Mali**  
> Candidate Offer Reference: `PA-OL-MS-2026-0237`

TechPulse is an e-commerce platform built on the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It features a catalog with dynamic multi-parameter filtering, real-time keyword search, interactive shopping cart with state persistence, role-based authorization, and an Admin Management Console for real-time inventory control.

---

## 🌟 Key Features

- **🔎 Real-Time Product Catalog & Filtering:**
  - Instant client-side & server-side search across product names, categories, and descriptions.
  - Category filtering tabs (*Audio*, *Wearables*, *Accessories*, *Computers*, *Photography*, etc.).
  - Interactive price range slider filter.
  - Multi-criteria sorting (*Featured First*, *Price: Low to High*, *Price: High to Low*, *Customer Rating*, *Newest Arrivals*).
  - Responsive empty states and 1-click filter reset.

- **🛒 Interactive Shopping Cart:**
  - Slide-over Cart Drawer accessible from anywhere in the application.
  - Real-time quantity adjustments with stock-boundary checking (prevents ordering beyond available stock).
  - Item removal and clear-cart operations.
  - Live subtotal and order breakdown calculation.
  - Simulated checkout workflow with animated confirmation screen.
  - Persistent cart state saved across browser sessions via `localStorage`.

- **🛡️ Role-Based Access Control (RBAC):**
  - Distinguishes standard customers (`role: 'user'`) from administrators (`role: 'admin'`).
  - Protected backend routes with `protect` and `admin` middleware.
  - Frontend route guards (`AdminRoute`) restricting the admin dashboard to authenticated administrators.

- **⚙️ Protected Admin Console:**
  - Real-time catalog metrics: Total Products, Total Stock Units, Low Stock Alert Count, and Catalog Valuation ($).
  - Searchable inventory table with thumbnail previews, stock indicators, and pricing.
  - Full CRUD operations: Create new products, update existing specifications, and delete obsolete inventory.
  - Pre-seeded with 10 high-quality products across tech and lifestyle categories.

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
| **Database** | MongoDB Atlas / Local MongoDB (9.0.4) |
| **Deployment** | Vercel (Frontend SPA), Render (Backend REST API) |

---

## 📂 Project Structure

```
project-02-ecommerce-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
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
    │   │   └── api.js                # Axios client with interceptors
    │   ├── App.jsx                   # Application routes
    │   ├── main.jsx                  # React DOM mount
    │   └── index.css                 # Tailwind CSS styles
    ├── index.html
    ├── vercel.json                   # Vercel SPA routing
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

# Create environment configuration
cp .env.example .env

# Seed initial products and admin account
npm run seed

# Run backend development server
npm run dev
```
*Backend runs on `http://localhost:5001`.*

### 2. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment configuration
cp .env.example .env

# Run Vite frontend server
npm run dev
```
*Frontend runs on `http://localhost:5174`.*

---

## 💡 Challenge / Interesting Feature (Submission Note)

> **Most Interesting Feature Built:**  
> Implementing the dual-tier role-based authorization system combining secure Express middleware (`protect` + `admin`) with a synchronized client-side cart and real-time Admin Management Console that enables immediate catalog updates, live stock monitoring, and out-of-stock validation without requiring page reloads.

