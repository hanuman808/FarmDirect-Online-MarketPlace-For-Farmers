# 🚜 Farm Inventory Management System (FIMS)

A premium, state-of-the-art MERN stack application designed to bridge the gap between farmers and consumers. Built for performance, security, and a seamless user experience, FIMS provides a robust ecosystem for Agri-Food supply chain management.

---

## ✨ Premium Features

The system features **four dedicated panels** tailored to each user role for a fully integrated supply chain:

### 🏢 Admin Control Center
- **Farmer Verification**: Sophisticated approval workflow for new farmers.
- **Global Management**: Oversee all products, users, and transactions.
- **Visual Analytics**: Real-time monitoring of system activity.
- **Premium UI**: High-visibility action center with emerald/rose color coding.

### 👩‍🌾 Farmer Dashboard
- **Price Guess Helper**: AI-powered price prediction based on market trends.
- **Inventory Management**: Add products with live camera feed integration.
- **Stock Guard**: Atomic stock management prevents over-ordering.
- **Order Tracking**: Manage customer orders with status updates.

### 🛒 Consumer Experience
- **Premium Checkout**: Complete end-to-end shopping journey.
- **Multi-Payment Support**: Online (Razorpay) and COD.
- **Order History**: Track payment and delivery statuses.
- **Address Management**: Secure delivery address collection including Pincode verification.

### 🚚 Delivery Partner Panel
- **Work Assignment**: Easily accept delivery tasks assigned by the system admin.
- **Real-Time Job Workflow**: Progress tasks through consecutive stages: Accept Request, Picked Up, In Transit, and Delivered.
- **Direct Communication**: Quick click-to-call functionality to contact clients.
- **Earnings & Stats**: Track active jobs, completed orders, and profile stats.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TailwindCSS 4
- **Backend**: Node.js, Express, Next.js API Routes
- **ML Service**: Python Flask, Scikit-Learn, Pandas, NumPy
- **Database**: MongoDB (Local Compass / Atlas Ready)
- **Payments**: Razorpay Gateway Integration
- **Security**: JWT, Bcrypt.js, Protected Middleware

---

## ⚙️ Prerequisites

- **Node.js** (v18 or later)
- **Python 3.x** (for Price Prediction Service)
- **MongoDB Compass** installed and running locally.
- **Razorpay Keys** (Optional for online payments)

---

## 🏃 Getting Started

### 1. Main Application
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 2. Price Prediction Service (ML)
To use the "Price Guess Helper" on the Add Product page, you must start the Flask service:
```bash
# Navigate to ML directory
cd backend/ml

# Install Python requirements
pip install flask flask-cors joblib pandas numpy scikit-learn

# Start the service
python app.py
```
*The ML service runs on `http://localhost:5000`.*

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:
```env
# Database
MONGO_URI = mongodb://localhost:27017/agrifood-mern

# Auth
JWT_SECRET = your_jwt_secret

# Default Admin
ADMIN_EMAIL = admin@example.com
ADMIN_PASSWORD = admin123

# Razorpay (Optional)
RAZORPAY_KEY_ID = your_key
RAZORPAY_KEY_SECRET = your_secret
```

---

## 🛡️ Security & Integrity
- **Atomic Transactions**: Support for MongoDB sessions with automatic fallback.
- **Stock Integrity**: Real-time deduction via `findOneAndUpdate` guards.
- **Non-Italic Aesthetic**: Premium, bold, and straight typography for maximum clarity.

## 🤝 Support
Admin Default: `admin@example.com` | `admin123`
