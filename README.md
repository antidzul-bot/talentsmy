# Affiliate Management System

A professional web application for managing affiliate marketing campaigns between agencies, suppliers, and clients.

## Features

### 🎯 Client Tracking Portal
- **Code-based tracking** - No login required
- **Real-time progress updates** - Visual timeline showing campaign status
- **Transparent communication** - Clients can see exactly where their campaign is

### 👨‍💼 Admin Dashboard
- **Analytics overview** - Revenue, profit, active orders at a glance
- **Order management** - Create and track all campaigns
- **Progress tracking** - Update order status and milestones
- **Financial insights** - Track client payments and supplier costs

### 🤝 Supplier Portal (Coming Soon)
- **Job board** - View assigned campaigns
- **Progress updates** - Mark milestones as complete
- **Affiliate management** - Add affiliate details and video proofs

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand with LocalStorage persistence
- **Styling**: Vanilla CSS with CSS Modules
- **Design**: Premium dark theme with glassmorphism effects

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

Since PowerShell script execution is disabled on your system, you'll need to enable it first or use Command Prompt:

**Option 1: Enable PowerShell Scripts (Recommended)**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Option 2: Use Command Prompt**
```cmd
# Open Command Prompt and navigate to project directory
cd "c:\Users\cikgu dzul\.gemini\antigravity\playground\sonic-planetary"
npm install
npm run dev
```

### Manual Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Button component with variants
│   ├── Card.tsx        # Card component with glassmorphism
│   ├── Input.tsx       # Form input components
│   └── Timeline.tsx    # Progress timeline component
├── pages/              # Application pages
│   ├── ClientTracking.tsx    # Public tracking page
│   ├── AdminDashboard.tsx    # Admin dashboard
│   └── SupplierPortal.tsx    # Supplier interface (TBD)
├── store/              # State management
│   └── index.ts        # Zustand store with persistence
├── types/              # TypeScript definitions
│   └── index.ts        # All type definitions
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
└── index.css           # Global styles & design system
```

## Usage Guide

### For Clients

1. Navigate to `/track`
2. Enter your unique tracking code (e.g., `ABC12345`)
3. View real-time campaign progress

### For Admin

1. Navigate to `/admin`
2. View dashboard analytics
3. Click on orders to view details
4. Create new orders with the "+ New Order" button

### Data Persistence

- All data is stored in browser LocalStorage
- Data persists across page refreshes
- Clearing browser cache will reset all data

## Workflow

### Client Journey
1. ✅ Pay for package
2. 📋 Provide product samples
3. 📦 Ship samples to affiliates
4. ⏳ Wait for campaign completion
5. 📊 Receive final report

### Admin Journey
1. 💰 Receive client payment
2. 💸 Pay supplier
3. 📝 Prepare content guidelines
4. ✅ Ensure client agreement
5. 👥 Verify affiliate selection
6. 📦 Coordinate sample shipping
7. 💵 Set affiliate commissions
8. 📊 Deliver final report

### Supplier Journey
1. 👥 Select suitable affiliates
2. 📋 Brief affiliates on guidelines
3. 📦 Confirm sample receipt
4. 🎬 Start video production
5. ✅ Complete all videos
6. 📊 Submit final report

## Customization

### Adding New Order Statuses

Edit `src/types/index.ts`:
```typescript
export type OrderStatus = 
  | 'PENDING_PAYMENT'
  | 'YOUR_NEW_STATUS'
  | ...
```

### Modifying Package Types

Edit the package configuration in `src/types/index.ts`:
```typescript
export type PackageType = '100_AFFILIATES' | '50_AFFILIATES' | 'CUSTOM';
```

## Future Enhancements

- [ ] Supplier portal implementation
- [ ] Email notifications
- [ ] File upload for reports and videos
- [ ] Advanced analytics and charts
- [ ] Export data to PDF/Excel
- [ ] Multi-language support
- [ ] Backend API integration
- [ ] User authentication

## Troubleshooting

### PowerShell Script Execution Error

If you see "running scripts is disabled on this system":

1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Type `Y` to confirm

Alternatively, use Command Prompt instead of PowerShell.

### Port Already in Use

If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

## License

MIT License - feel free to use this for your business!

## Support

For issues or questions, please create an issue in the repository.
