# 👨‍👩‍👧‍👦 FamFinance - Family Expense, Wealth & Asset Management Hub

A modern, responsive, and privacy-first web application designed for the **CH** family to manage daily expenses, track family wealth, monitor real estate & land properties, manage bank balances, and oversee active loans and insurance policies in **Indian Rupees (₹)**.

---

## 🌟 Comprehensive Features

### 1. 🏠 Executive Dashboard & Net Worth Overview
- **Family Estimated Net Worth**: Real-time aggregation of Real Estate Valuations + Liquid Bank Balances + Investment Portfolio - Active Loan Liabilities.
- **Investment Indicator**: Dedicated Net Worth banner pill showing total portfolio valuation across Mutual Funds, Stocks, ETFs, and Gold.
- **📅 Monthly & Yearly Period Selector**:
  - **Month Dropdown**: Select any month (January – December) or view "All Months".
  - **Year Dropdown**: Dynamically populated from your transaction history (or "All Years").
  - **"Current Month" Quick-Jump**: One-click button (`📅 Current Month`) to instantly reset the filter to today.
- **Dynamic Period-Aware Cash Flow KPIs**: Net Balance, Family Monthly Income, Family Monthly Expenses, and Savings Rate (%) automatically recalculate for the selected month and year.
- **Interactive Visualizations**:
  - **Spending by Category** Donut Chart (filtered by selected month/year).
  - **Income vs. Expense Trend** Bar Chart.
- **Category Budget Health**: Live progress bars showing utilization against monthly limits for the selected period.
- **Member Spending Distribution**: Dynamic breakdown of spending share across all family members for the chosen timeframe.
- **Filtered Recent Transactions**: Displays transactions matching the active period with full search and details.

### 2. 📈 Investment Portfolio (Mutual Funds & Stocks)
- **Mutual Funds**: Track SIPs and lump-sum investments across fund houses (Parag Parikh Flexi Cap, Mirae Asset, SBI Bluechip, etc.) with folio numbers and monthly SIP amounts.
- **Stocks & Equity**: Record bluechip and growth equity holdings (TCS, Reliance, etc.) with ticker symbols, shares held, and brokers (Zerodha Kite, Groww, ICICI Direct).
- **Index ETFs & Gold**: Monitor passive index exchange-traded funds (NIFTYBEES) and Sovereign Gold Bonds (SGB).
- **Portfolio Analytics**: Real-time tracking of Invested Capital vs. Current Market Valuation with automated absolute returns and percentage gain/loss pills.
- **Asset Filtering**: Filter portfolio cards by All Assets, Mutual Funds, Stocks & Equity, Index ETFs, and Sovereign Gold Bonds.

### 3. 🏦 Family Bank Accounts & Liquid Balances
- Monitor savings accounts, salary deposits, current accounts, and Fixed Deposits (FDs).
- Track bank names (HDFC, SBI, ICICI, etc.), branch locations, IFSC codes, and masked account numbers.
- View total liquid cash available to the family at any time.

### 4. 🏡 Properties & Land Registry
- Maintain comprehensive records of residential apartments, villas, agricultural land, and layout plots.
- Record survey numbers, khata details, plot numbers, and land area (in sq.ft, acres, sq.yards, cents, or guntas).
- Calculate capital appreciation: Purchase Price vs. Current Estimated Market Value with percentage gains.

### 5. 🏘️ Rental Properties & Tenant Tracker
- Track residential and commercial properties generating rental income.
- Record tenant names, phone numbers, and security deposits held.
- Manage monthly rent collection with 1-click status toggles (**Received** / **Pending**).
- Track lease agreement start and end dates.

### 6. 💳 Loans & Active EMIs
- Track active home loans, car loans, personal loans, and education loans.
- View monthly EMI burden, interest rates (%), original principal, and remaining outstanding balance.
- Monitor remaining loan tenure in months.

### 7. 🛡️ Insurance Policies & Protection
- Track family term life policies, medical health floaters, and vehicle covers.
- Record insurance providers (LIC, HDFC Life, Star Health, ICICI Lombard, etc.), policy numbers, and total sum insured.
- Keep track of annual/monthly premium amounts, upcoming renewal due dates, and policy **Maturity Dates**.

### 8. 💸 Daily Transaction Management
- Categorized logs for expenses and income.
- Full text search, filter by category, member, and type.
- Add, edit, or delete transactions anytime with modal dialogs.
- Press <kbd>N</kbd> anywhere on the dashboard to quickly log a new transaction.

### 8. 🎯 Category Budgets & Savings Goals
- Set monthly spending targets for Groceries, Housing, Utilities, Dining, OTT, and Fuel.
- Create collaborative savings targets (e.g. Family Vacation, Emergency Fund, Education Pool) with "+ Add Deposit" action.

### 9. 🔒 100% Private, Offline Ready & Portable
- All financial records are stored strictly on your device inside browser `localStorage`.
- **Export to CSV**: Export transaction logs formatted for Microsoft Excel and Google Sheets.
- **Full JSON Backup & Restore**: Create comprehensive backups and restore them on any device.
- **Multi-currency Support**: Default configured to Indian Rupee (**₹**) with USD, EUR, GBP, and JPY support.
- **Dark / Light Mode**: Smooth theme switcher with custom glassmorphic styling.

---

## 🚀 How to Run

### Option 1: Double-Click Launcher (Fastest)
Double-click `run.bat` in this folder, or simply double-click `index.html` to open directly in Chrome, Edge, Brave, or Firefox.

### Option 2: Optional Local Server
If you prefer running via a local web server:
1. Right-click `server.ps1` -> **Run with PowerShell**, or in terminal:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\server.ps1
   ```
2. Open `http://localhost:8080/` in your browser.

---

## 📂 File Structure

```
d:\AI\Software\
├── index.html            # Main HTML UI, navigation & all interactive modals
├── css\
│   └── style.css         # Modern glassmorphism design system & asset card styling
├── js\
│   ├── store.js          # LocalStorage data store, wealth calculations, CSV/JSON export
│   ├── charts.js         # Interactive charts (Chart.js + Canvas fallback)
│   └── app.js            # UI controllers, modal managers, filtering & toast alerts
├── run.bat               # 1-click launcher for Windows
├── server.ps1            # Optional PowerShell HTTP server
└── README.md             # Complete documentation
```
