# ⚛️ React Files in GameXchange

## 📊 Summary

**Total React Files: 68**

- **Main App Files**: 2
- **Page Components**: 19
- **UI Components**: 47 (Radix UI primitives)

---

## 🎯 Main Application Files

### Entry Point & Root
```
src/
├── main.tsx                    # React app entry point
└── App.tsx                     # Root component with routing
```

**Purpose:**
- `main.tsx` - Initializes React app, renders to DOM
- `App.tsx` - Main app component, handles routing and layout

---

## 📄 Page & Feature Components (19 files)

### Location: `src/components/`

#### 🏠 Pages (Top-level routes)
```
src/components/
├── landing-page.tsx            # Homepage with hero section
├── dashboard.tsx               # User dashboard (main app)
├── buy-accounts-page.tsx       # Browse/buy accounts page
└── verify-email-page.tsx       # Email verification page
```

#### 🎮 Marketplace Features
```
src/components/
├── valorant-marketplace.tsx    # Main marketplace component
├── account-detail-modal.tsx    # Account details popup
├── sell-account-form.tsx       # List account for sale
└── checkout-modal.tsx          # Purchase flow
```

#### 💰 Trading Features
```
src/components/
├── active-trades.tsx                  # User's active trades list
├── trade-detail-modal.tsx             # Trade details popup
├── manual-trade-detail-modal.tsx      # Manual payment trade flow
└── seller-credentials-modal.tsx       # Seller submits credentials
```

#### 👤 User Features
```
src/components/
├── login-form.tsx              # Login/signup form
├── profile-details-modal.tsx   # User profile editor
├── settings-modal.tsx          # App settings
└── wallet-details-modal.tsx    # Wallet information
```

#### 🎨 UI/UX Components
```
src/components/
├── animated-background.tsx     # Animated background effect
├── loading-transition.tsx      # Page transition loader
└── wallet-loading.tsx          # Wallet loading animation
```

---

## 🧩 UI Primitive Components (47 files)

### Location: `src/components/ui/`

These are reusable UI building blocks based on **Radix UI** and **shadcn/ui**:

#### Form & Input Components
```
src/components/ui/
├── button.tsx                  # Button component
├── input.tsx                   # Text input
├── input-otp.tsx              # OTP input
├── textarea.tsx               # Multi-line text input
├── checkbox.tsx               # Checkbox
├── radio-group.tsx            # Radio buttons
├── switch.tsx                 # Toggle switch
├── slider.tsx                 # Range slider
├── select.tsx                 # Dropdown select
├── form.tsx                   # Form wrapper
└── label.tsx                  # Form label
```

#### Layout Components
```
src/components/ui/
├── card.tsx                   # Card container
├── separator.tsx              # Divider line
├── aspect-ratio.tsx           # Aspect ratio container
├── resizable.tsx              # Resizable panels
├── scroll-area.tsx            # Custom scrollbar
├── sidebar.tsx                # Sidebar layout
└── table.tsx                  # Data table
```

#### Navigation Components
```
src/components/ui/
├── navigation-menu.tsx        # Navigation menu
├── menubar.tsx               # Menu bar
├── breadcrumb.tsx            # Breadcrumb navigation
├── pagination.tsx            # Page pagination
└── tabs.tsx                  # Tab navigation
```

#### Overlay Components
```
src/components/ui/
├── dialog.tsx                # Modal dialog
├── alert-dialog.tsx          # Alert/confirm dialog
├── sheet.tsx                 # Side sheet
├── drawer.tsx                # Bottom drawer
├── popover.tsx               # Popover
├── tooltip.tsx               # Tooltip
├── hover-card.tsx            # Hover card
├── dropdown-menu.tsx         # Dropdown menu
└── context-menu.tsx          # Right-click menu
```

#### Feedback Components
```
src/components/ui/
├── alert.tsx                 # Alert message
├── sonner.tsx                # Toast notifications
├── progress.tsx              # Progress bar
├── skeleton.tsx              # Loading skeleton
└── badge.tsx                 # Badge/tag
```

#### Data Display Components
```
src/components/ui/
├── avatar.tsx                # User avatar
├── chart.tsx                 # Charts/graphs
├── calendar.tsx              # Date picker
└── carousel.tsx              # Image carousel
```

#### Interactive Components
```
src/components/ui/
├── accordion.tsx             # Collapsible sections
├── collapsible.tsx           # Collapsible content
├── toggle.tsx                # Toggle button
├── toggle-group.tsx          # Toggle button group
└── command.tsx               # Command palette
```

#### Utilities
```
src/components/ui/
├── utils.ts                  # Utility functions (cn, etc.)
└── use-mobile.ts             # Mobile detection hook
```

---

## 📁 Complete File Tree

```
GameXchange_2.0/
└── src/                                    # Frontend source code
    ├── main.tsx                            # ⚛️ React entry point
    ├── App.tsx                             # ⚛️ Root component
    │
    └── components/                         # React components
        │
        ├── 📄 Page Components (19 files)
        ├── landing-page.tsx                # ⚛️ Homepage
        ├── dashboard.tsx                   # ⚛️ User dashboard
        ├── buy-accounts-page.tsx           # ⚛️ Browse accounts
        ├── verify-email-page.tsx           # ⚛️ Email verification
        ├── valorant-marketplace.tsx        # ⚛️ Marketplace
        ├── account-detail-modal.tsx        # ⚛️ Account details
        ├── sell-account-form.tsx           # ⚛️ Sell form
        ├── checkout-modal.tsx              # ⚛️ Checkout
        ├── active-trades.tsx               # ⚛️ Trades list
        ├── trade-detail-modal.tsx          # ⚛️ Trade details
        ├── manual-trade-detail-modal.tsx   # ⚛️ Manual payment
        ├── seller-credentials-modal.tsx    # ⚛️ Credentials
        ├── login-form.tsx                  # ⚛️ Login/signup
        ├── profile-details-modal.tsx       # ⚛️ Profile
        ├── settings-modal.tsx              # ⚛️ Settings
        ├── wallet-details-modal.tsx        # ⚛️ Wallet
        ├── animated-background.tsx         # ⚛️ Background
        ├── loading-transition.tsx          # ⚛️ Loader
        └── wallet-loading.tsx              # ⚛️ Wallet loader
        │
        └── ui/                             # UI primitives (47 files)
            ├── 🧩 Form Components (11)
            ├── button.tsx                  # ⚛️
            ├── input.tsx                   # ⚛️
            ├── input-otp.tsx              # ⚛️
            ├── textarea.tsx               # ⚛️
            ├── checkbox.tsx               # ⚛️
            ├── radio-group.tsx            # ⚛️
            ├── switch.tsx                 # ⚛️
            ├── slider.tsx                 # ⚛️
            ├── select.tsx                 # ⚛️
            ├── form.tsx                   # ⚛️
            └── label.tsx                  # ⚛️
            │
            ├── 🧩 Layout Components (7)
            ├── card.tsx                   # ⚛️
            ├── separator.tsx              # ⚛️
            ├── aspect-ratio.tsx           # ⚛️
            ├── resizable.tsx              # ⚛️
            ├── scroll-area.tsx            # ⚛️
            ├── sidebar.tsx                # ⚛️
            └── table.tsx                  # ⚛️
            │
            ├── 🧩 Navigation Components (4)
            ├── navigation-menu.tsx        # ⚛️
            ├── menubar.tsx               # ⚛️
            ├── breadcrumb.tsx            # ⚛️
            ├── pagination.tsx            # ⚛️
            └── tabs.tsx                  # ⚛️
            │
            ├── 🧩 Overlay Components (9)
            ├── dialog.tsx                # ⚛️
            ├── alert-dialog.tsx          # ⚛️
            ├── sheet.tsx                 # ⚛️
            ├── drawer.tsx                # ⚛️
            ├── popover.tsx               # ⚛️
            ├── tooltip.tsx               # ⚛️
            ├── hover-card.tsx            # ⚛️
            ├── dropdown-menu.tsx         # ⚛️
            └── context-menu.tsx          # ⚛️
            │
            ├── 🧩 Feedback Components (5)
            ├── alert.tsx                 # ⚛️
            ├── sonner.tsx                # ⚛️
            ├── progress.tsx              # ⚛️
            ├── skeleton.tsx              # ⚛️
            └── badge.tsx                 # ⚛️
            │
            ├── 🧩 Data Display Components (4)
            ├── avatar.tsx                # ⚛️
            ├── chart.tsx                 # ⚛️
            ├── calendar.tsx              # ⚛️
            └── carousel.tsx              # ⚛️
            │
            ├── 🧩 Interactive Components (5)
            ├── accordion.tsx             # ⚛️
            ├── collapsible.tsx           # ⚛️
            ├── toggle.tsx                # ⚛️
            ├── toggle-group.tsx          # ⚛️
            └── command.tsx               # ⚛️
            │
            └── 🧩 Utilities (2)
                ├── utils.ts              # Helper functions
                └── use-mobile.ts         # Mobile hook
```

---

## 🔍 React Usage by Category

### 1. **Core React Files** (2)
- Entry point and root component
- Handle app initialization and routing

### 2. **Business Logic Components** (19)
- Pages, features, and user flows
- Marketplace, trading, authentication
- Custom to GameXchange application

### 3. **UI Primitives** (47)
- Reusable building blocks
- Based on Radix UI + shadcn/ui
- Used across all pages and features

---

## 📦 React Dependencies

### Main Libraries:
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "motion": "*",                    // Framer Motion (animations)
  "@radix-ui/*": "various",         // UI primitives
  "lucide-react": "^0.487.0",       // Icons
  "react-hook-form": "^7.55.0",     // Form handling
  "react-day-picker": "^8.10.1",    // Date picker
  "recharts": "^2.15.2"             // Charts
}
```

### Build Tools:
```json
{
  "@vitejs/plugin-react": "^4.7.0",  // Vite React plugin
  "vite": "6.3.5"                     // Build tool
}
```

---

## 🎨 React Features Used

### Hooks Used:
- ✅ `useState` - State management
- ✅ `useEffect` - Side effects
- ✅ `useRef` - DOM references
- ✅ `useCallback` - Memoized callbacks
- ✅ `useMemo` - Memoized values
- ✅ `useContext` - Context API (theme)
- ✅ Custom hooks - `use-mobile.ts`

### React Patterns:
- ✅ **Functional Components** - All components are functions
- ✅ **TypeScript** - Full type safety with `.tsx`
- ✅ **Component Composition** - Reusable UI primitives
- ✅ **Props & Interfaces** - Typed component props
- ✅ **Conditional Rendering** - Dynamic UI
- ✅ **Event Handling** - User interactions
- ✅ **Form Handling** - React Hook Form
- ✅ **Animations** - Framer Motion

### Advanced Features:
- ✅ **Portal Rendering** - Modals, dialogs
- ✅ **Context API** - Theme management
- ✅ **Lazy Loading** - Code splitting
- ✅ **Error Boundaries** - Error handling
- ✅ **Accessibility** - ARIA attributes (Radix UI)

---

## 🚫 Non-React Files

### Backend (Node.js/Express):
```
server/
├── index.js                    # ❌ Node.js server
├── db.js                       # ❌ Database logic
├── email.js                    # ❌ Email service
└── encryption.js               # ❌ Encryption utils

api/
├── server.js                   # ❌ Vercel serverless
├── db.js                       # ❌ Database logic
└── email.js                    # ❌ Email service
```

### Configuration:
```
GameXchange_2.0/
├── vite.config.ts              # ⚛️ Uses React plugin (not a component)
├── package.json                # ❌ Dependencies
├── .env                        # ❌ Environment variables
└── vercel.json                 # ❌ Deployment config
```

### Utilities:
```
src/
├── utils/
│   └── api.ts                  # ❌ API client (not React)
├── types/
│   └── marketplace.ts          # ❌ TypeScript types
└── styles/
    └── *.css                   # ❌ Stylesheets
```

---

## 📊 File Count Summary

| Category | Count | Location |
|----------|-------|----------|
| **Main App** | 2 | `src/` |
| **Page Components** | 19 | `src/components/` |
| **UI Primitives** | 47 | `src/components/ui/` |
| **Total React Files** | **68** | |
| **Backend Files** | ~10 | `server/`, `api/` |
| **Config Files** | ~5 | Root directory |

---

## 🎯 Quick Reference

### To Find React Files:
```bash
# All React/TypeScript files
find src -name "*.tsx" -o -name "*.ts"

# Only React components (tsx)
find src -name "*.tsx"

# Count React files
find src -name "*.tsx" | wc -l
```

### To Search in React Files:
```bash
# Find useState usage
grep -r "useState" src/

# Find specific component
grep -r "LandingPage" src/
```

---

## 🔧 Development Commands

```bash
# Start React development server
npm run dev:client

# Build React app
npm run build

# Preview production build
npm run preview
```

---

## 📚 Documentation

- **React Docs**: https://react.dev/
- **Radix UI**: https://www.radix-ui.com/
- **shadcn/ui**: https://ui.shadcn.com/
- **Framer Motion**: https://www.framer.com/motion/
- **Vite**: https://vitejs.dev/

---

**Summary:** React is used in **68 files** located in the `src/` directory, primarily in `src/components/` for pages and features, and `src/components/ui/` for reusable UI primitives.
