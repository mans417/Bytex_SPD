# 📊 SmartBill Lite - Digital Billing System

A modern, real-time billing and analytics platform built with React and Firebase. SmartBill Lite provides separate interfaces for staff (billing) and owners (analytics & monitoring) with role-based access control.

🌐 **Live Demo:** [https://smart-bill-lite.web.app](https://smart-bill-lite.web.app)

---

## ✨ Features

### 👥 Staff Portal
- **Quick Billing** - Create digital bills with automatic GST (18%) calculation
- **Bill History** - View and track all generated bills
- **Offline Support** - Create bills without internet, sync when online
- **Real-time Sync** - Automatic synchronization with Firebase Firestore
- **Mobile Responsive** - Works perfectly on phones and tablets

### 📈 Owner Dashboard
- **Real-time Analytics** - Live revenue tracking and transaction monitoring
- **Sales Charts** - Daily, weekly, and monthly revenue visualization
- **Top Customers** - View customers ranked by total spend
- **Peak Hours Analysis** - Identify busiest transaction times
- **Transaction History** - Detailed transaction table with filters
- **Report Export** - Download sales reports in JSON format

### 🔐 Security
- **Role-Based Access** - Separate authentication for staff (PIN) and owners (email/password)
- **Firebase Authentication** - Secure user management
- **Protected Routes** - Authorization checks on all sensitive pages
- **Session Management** - Automatic logout and state clearing

### 🚀 Technical Features
- **Progressive Web App (PWA)** - Installable on mobile devices
- **Real-time Updates** - Live data synchronization using Firestore
- **Offline-First** - Works without internet connection
- **Responsive Design** - Mobile-first approach
- **Fast Performance** - Built with Vite for lightning-fast builds

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI framework
- **Vite** 5.0.0 - Build tool & dev server
- **React Router** 6.21.1 - Client-side routing
- **Tailwind CSS** 3.4.0 - Utility-first styling

### Backend & Services
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Authentication** - User authentication
- **Firebase Hosting** - Static site hosting with HTTPS & CDN
- **Firebase Analytics** - Usage tracking

### Libraries
- **Recharts** 2.10.3 - Charts and data visualization
- **Lucide React** 0.303.0 - Icon library
- **React Helmet** 6.1.0 - Meta tags & SEO

---

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Firebase account
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/mans417/Bytex_SPD.git
cd Bytex_SPD
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Get your Firebase config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → General
4. Scroll to "Your apps" and select the web app
5. Copy the config values

### 4. Firebase Setup

**Enable Services:**
1. **Firestore Database** - Create database in production mode
2. **Authentication** - Enable Email/Password sign-in
3. **Hosting** (optional) - For deployment

**Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bills/{bill} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /system/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Start Development Server
```bash
npm start
```

App will open at `http://localhost:4028`

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI (one-time)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

Your app will be live at `https://your-project-id.web.app`

---

## 🔑 Default Credentials

### Owner Dashboard
- **Email:** `owner@smartbill.com`
- **Password:** `SmartBill123!`

### Staff Billing
- **PIN:** `1234`

**⚠️ Important:** Change these credentials after first login in production!

---

## 📱 Install as Mobile App

### Android (Chrome)
1. Visit the live URL on Chrome
2. Tap the "Add to Home Screen" prompt
3. App installs like a native app!

### iOS (Safari)
1. Open the URL in Safari
2. Tap Share (□↑) → "Add to Home Screen"
3. Done!

---

## 📂 Project Structure

```
SmartBill Lite/
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/          # React Context (AuthContext)
│   ├── pages/            # Route pages
│   │   ├── login/        # Login page
│   │   ├── staff-billing/     # Staff billing interface
│   │   ├── staff-bill-history/ # Bill history
│   │   ├── owner-dashboard/   # Owner dashboard
│   │   └── sales-analytics/   # Analytics page
│   ├── utils/            # Utility functions
│   │   ├── currency.js   # Currency formatting (₹)
│   │   └── firebase.js   # Firebase configuration
│   └── styles/           # Global styles
├── public/               # Static assets
├── build/                # Production build output
└── firebase.json         # Firebase configuration
```

---

## 🎯 Usage

### For Staff
1. Login with PIN
2. Fill customer information
3. Add items (name, quantity, price)
4. Generate bill (GST calculated automatically)
5. View bill history

### For Owners
1. Login with email/password
2. View real-time dashboard metrics
3. Analyze sales with charts
4. Check top customers and peak hours
5. Export reports
6. Filter transactions by date/staff

---

## 🔄 Updating the App

After making code changes:

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

Changes go live in ~30 seconds!

---

## 🌟 Key Features Explained

### Real-time Synchronization
All bill data syncs instantly between staff and owner dashboards using Firestore's `onSnapshot` listeners.

### Offline Functionality
Bills created offline are stored in localStorage and automatically synced when internet connection is restored.

### GST Calculation
Automatic 18% GST calculation on all transactions with proper formatting in Indian Rupees (₹).

### Role-Based Access
- **Staff:** PIN-based authentication, access to billing only
- **Owner:** Email/password authentication, full dashboard access
- **Secure:** Protected routes prevent unauthorized access

---

## 📊 Analytics Features

- **Revenue Chart** - Visualize sales trends (daily/weekly/monthly)
- **Transaction Metrics** - Total sales, transaction count, today's sales
- **Customer Insights** - Top customers by revenue
- **Time Analysis** - Peak business hours identification
- **Filtering** - Filter by date range and staff member

---

## 🛡️ Security Best Practices

✅ Environment variables for sensitive data  
✅ Firebase Authentication for user management  
✅ Firestore security rules  
✅ Protected routes with authorization checks  
✅ HTTPS by default (Firebase Hosting)  
✅ No sensitive data in client-side code  

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill the process on port 4028
npx kill-port 4028
```

**Build fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Deployment shows welcome page:**
- Check `firebase.json` points to `build/` folder
- Ensure you ran `npm run build` before deploying

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nishant Dharukar**  
- Email: nishantdharukar7@gmail.com
**Mansi Raut**  
- Email: mansiraut131@gmail.com
**Numesh Barapatrer**  
- Email: anshulbarapatre729@gmail.com
**Varun Baisaree**
- Email: 
  
---

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Recharts for beautiful visualizations
- Lucide React for icon system
- Tailwind CSS for rapid styling

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase Console logs
3. Check browser console for errors
4. Open an issue on GitHub

---

**⭐ If you find this project useful, please give it a star!**

**🚀 SmartBill Lite - Making billing simple and analytics powerful!**
