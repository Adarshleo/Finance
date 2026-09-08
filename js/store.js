/**
 * FamFinance - Data Store & LocalStorage Manager
 * Comprehensive Family Wealth, Expenses & Asset Management Hub
 */

(function(root) {
  const STORAGE_KEY = 'famfinance_data_v4';

  // Default Category Definitions
  const DEFAULT_CATEGORIES = [
    { id: 'groceries', name: 'Groceries', icon: '🛒', type: 'expense' },
    { id: 'housing', name: 'Housing & Rent', icon: '🏠', type: 'expense' },
    { id: 'utilities', name: 'Utilities & Bills', icon: '💡', type: 'expense' },
    { id: 'dining', name: 'Dining & Takeout', icon: '🍽️', type: 'expense' },
    { id: 'transport', name: 'Transportation & Fuel', icon: '🚗', type: 'expense' },
    { id: 'healthcare', name: 'Healthcare & Medical', icon: '💊', type: 'expense' },
    { id: 'education', name: 'Education & Kids', icon: '📚', type: 'expense' },
    { id: 'entertainment', name: 'Entertainment & OTT', icon: '🎬', type: 'expense' },
    { id: 'shopping', name: 'Shopping & Apparel', icon: '🛍️', type: 'expense' },
    { id: 'salary', name: 'Salary & Earnings', icon: '💼', type: 'income' },
    { id: 'investments', name: 'Investments & Returns', icon: '📈', type: 'income' },
    { id: 'rental_income', name: 'Rental Income', icon: '🏘️', type: 'income' },
    { id: 'other_income', name: 'Other Income / Gifts', icon: '🎁', type: 'income' },
    { id: 'other_expense', name: 'Miscellaneous', icon: '📦', type: 'expense' }
  ];

  const PAYMENT_METHODS = [
    'UPI / Debit Card',
    'Credit Card',
    'Bank Transfer',
    'Cash',
    'Net Banking'
  ];

  const CURRENCY_SYMBOLS = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'AU$',
    JPY: '¥'
  };

  // Initial Realistic Family Demo Data
  const INITIAL_DATA = {
    settings: {
      familyName: 'CH',
      currency: '₹',
      theme: 'dark'
    },
    members: [
      { id: 'mem_1', name: 'Dad (Robert)', role: 'Parent', avatarColor: '#6366f1', avatarInitial: 'R' },
      { id: 'mem_2', name: 'Mom (Sarah)', role: 'Parent', avatarColor: '#ec4899', avatarInitial: 'S' },
      { id: 'mem_3', name: 'Alex', role: 'Teenager', avatarColor: '#10b981', avatarInitial: 'A' },
      { id: 'mem_4', name: 'Maya', role: 'Child', avatarColor: '#f59e0b', avatarInitial: 'M' }
    ],
    // --- 1. POLICIES & INSURANCE ---
    policies: [
      {
        id: 'pol_1',
        policyName: 'HDFC Click 2 Protect Life',
        policyType: 'Term Life Insurance',
        provider: 'HDFC Life',
        policyNumber: 'HD-88492019',
        sumInsured: 15000000,
        premiumAmount: 24500,
        premiumFrequency: 'Annual',
        nextDueDate: '2026-11-20',
        maturityDate: '2055-11-20',
        insuredMemberId: 'mem_1',
        status: 'Active',
        notes: 'Pure term cover up to age 75 with critical illness rider'
      },
      {
        id: 'pol_2',
        policyName: 'Star Health Family Floater',
        policyType: 'Health Insurance',
        provider: 'Star Health',
        policyNumber: 'SH-55198422',
        sumInsured: 2500000,
        premiumAmount: 28000,
        premiumFrequency: 'Annual',
        nextDueDate: '2026-10-15',
        maturityDate: '2030-10-15',
        insuredMemberId: 'mem_2',
        status: 'Active',
        notes: 'Covers entire family with cashless network hospital access'
      },
      {
        id: 'pol_3',
        policyName: 'ICICI Lombard Comprehensive Car',
        policyType: 'Vehicle Insurance',
        provider: 'ICICI Lombard',
        policyNumber: 'IC-99210045',
        sumInsured: 1250000,
        premiumAmount: 16200,
        premiumFrequency: 'Annual',
        nextDueDate: '2027-02-10',
        maturityDate: '2027-02-10',
        insuredMemberId: 'mem_1',
        status: 'Active',
        notes: 'Zero depreciation with roadside assistance'
      }
    ],
    // --- 2. PROPERTIES & LAND ---
    properties: [
      {
        id: 'prop_1',
        propertyName: 'Greenwood Enclave Flat 402',
        propertyType: 'Residential Flat (3BHK)',
        location: 'Whitefield, Bengaluru',
        surveyNo: 'Khata A-402/89',
        area: '1680',
        areaUnit: 'sq.ft',
        purchaseYear: '2021',
        purchasePrice: 6500000,
        currentValue: 9200000,
        ownerMemberId: 'mem_1',
        status: 'Owned',
        notes: 'Primary family residence. Clear title & OC obtained.'
      },
      {
        id: 'prop_2',
        propertyName: 'Devenahalli Agricultural Farmland',
        propertyType: 'Agricultural Land',
        location: 'Devenahalli Outskirts',
        surveyNo: 'Sy. No. 142/3B',
        area: '2.5',
        areaUnit: 'acres',
        purchaseYear: '2016',
        purchasePrice: 2800000,
        currentValue: 5800000,
        ownerMemberId: 'mem_2',
        status: 'Owned',
        notes: 'Ancestral mango & teak plantation near proposed ring road.'
      },
      {
        id: 'prop_3',
        propertyName: 'Heritage Palms Residential Plot',
        propertyType: 'Residential Plot',
        location: 'Electronic City Phase 2',
        surveyNo: 'Plot No. 54, Sy 88',
        area: '2400',
        areaUnit: 'sq.ft',
        purchaseYear: '2023',
        purchasePrice: 3600000,
        currentValue: 4500000,
        ownerMemberId: 'mem_1',
        status: 'Owned',
        notes: 'Gated layout plot with club access and BMRDA approval.'
      }
    ],
    // --- 3. BANK ACCOUNTS & LIQUID CASH ---
    bankAccounts: [
      {
        id: 'acc_1',
        bankName: 'HDFC Bank',
        accountType: 'Salary Account',
        accountNumberLast4: '4921',
        ifscCode: 'HDFC0001234',
        branch: 'Indiranagar Branch',
        balance: 185400,
        holderMemberId: 'mem_1',
        notes: 'Primary salary credit account'
      },
      {
        id: 'acc_2',
        bankName: 'State Bank of India',
        accountType: 'Savings Account',
        accountNumberLast4: '8832',
        ifscCode: 'SBIN0004567',
        branch: 'MG Road Main Branch',
        balance: 94200,
        holderMemberId: 'mem_2',
        notes: 'Family emergency buffer account'
      },
      {
        id: 'acc_3',
        bankName: 'ICICI Bank',
        accountType: 'Fixed Deposit (FD)',
        accountNumberLast4: '1098',
        ifscCode: 'ICIC0007890',
        branch: 'Koramangala Branch',
        balance: 500000,
        holderMemberId: 'mem_1',
        notes: '7.25% p.a. maturity in Dec 2027'
      }
    ],
    // --- 4. LOANS & ACTIVE EMIS ---
    emis: [
      {
        id: 'emi_1',
        loanName: 'SBI Home Loan (Greenwood Flat)',
        loanType: 'Home Loan',
        lender: 'State Bank of India',
        originalPrincipal: 4200000,
        outstandingPrincipal: 3150000,
        monthlyEmi: 36500,
        interestRate: 8.5,
        remainingTenureMonths: 138,
        linkedMemberId: 'mem_1',
        notes: 'Auto-debited on 5th of every month from HDFC Salary A/c'
      },
      {
        id: 'emi_2',
        loanName: 'HDFC Car Loan (SUV)',
        loanType: 'Vehicle Loan',
        lender: 'HDFC Bank',
        originalPrincipal: 850000,
        outstandingPrincipal: 380000,
        monthlyEmi: 16800,
        interestRate: 8.75,
        remainingTenureMonths: 26,
        linkedMemberId: 'mem_1',
        notes: 'Auto-debited on 10th of every month'
      }
    ],
    // --- 5. RENTAL PROPERTIES OWNED ---
    rentalProperties: [
      {
        id: 'rent_1',
        propertyName: 'Palm Meadows 2BHK Apartment',
        address: 'Flat 201, Palm Meadows, Koramangala 4th Block',
        tenantName: 'Vikram Sharma',
        tenantContact: '+91 98765 43210',
        monthlyRent: 32000,
        securityDeposit: 150000,
        leaseStartDate: '2025-06-01',
        leaseEndDate: '2026-05-31',
        paymentStatus: 'Received',
        ownerMemberId: 'mem_2',
        notes: 'Agreement renewed annually with 5% escalation.'
      },
      {
        id: 'rent_2',
        propertyName: 'Commerce Hub Office Unit 3B',
        address: 'Suite 3B, Commerce Hub, Residency Road',
        tenantName: 'Nexus Digital Technologies',
        tenantContact: '+91 91234 56789',
        monthlyRent: 48000,
        securityDeposit: 250000,
        leaseStartDate: '2025-01-01',
        leaseEndDate: '2027-12-31',
        paymentStatus: 'Received',
        ownerMemberId: 'mem_1',
        notes: '3-year registered commercial lease.'
      }
    ],
    // --- 6. INVESTMENTS (MUTUAL FUNDS, STOCKS, ETFS & GOLD) ---
    investments: [
      {
        id: 'inv_1',
        name: 'Parag Parikh Flexi Cap Fund',
        type: 'Mutual Fund',
        symbolOrFolio: 'Folio: PPFAS-89421',
        platform: 'Zerodha / Coin',
        investedAmount: 350000,
        currentValue: 485000,
        unitsOrQty: '6,245.80 Units',
        sipAmount: 15000,
        holderMemberId: 'mem_1',
        notes: 'Core long-term equity compounding fund with international diversification'
      },
      {
        id: 'inv_2',
        name: 'Tata Consultancy Services (TCS)',
        type: 'Stock / Equity',
        symbolOrFolio: 'TCS.NS',
        platform: 'Zerodha Kite',
        investedAmount: 180000,
        currentValue: 245000,
        unitsOrQty: '60 Shares',
        sipAmount: 0,
        holderMemberId: 'mem_1',
        notes: 'Bluechip IT market leader with consistent dividend yields'
      },
      {
        id: 'inv_3',
        name: 'Mirae Asset Large & Midcap Fund',
        type: 'Mutual Fund',
        symbolOrFolio: 'Folio: MIRA-55120',
        platform: 'Groww',
        investedAmount: 200000,
        currentValue: 280000,
        unitsOrQty: '2,150.40 Units',
        sipAmount: 10000,
        holderMemberId: 'mem_2',
        notes: 'Wealth accumulator for family long-term goals'
      },
      {
        id: 'inv_4',
        name: 'Reliance Industries Ltd',
        type: 'Stock / Equity',
        symbolOrFolio: 'RELIANCE.NS',
        platform: 'Zerodha Kite',
        investedAmount: 150000,
        currentValue: 198000,
        unitsOrQty: '75 Shares',
        sipAmount: 0,
        holderMemberId: 'mem_1',
        notes: 'Heavyweight index stock (Retail, Jio & New Energy)'
      },
      {
        id: 'inv_5',
        name: 'Nifty 50 Index ETF (NIFTYBEES)',
        type: 'ETF / Index Fund',
        symbolOrFolio: 'NIFTYBEES',
        platform: 'Groww',
        investedAmount: 120000,
        currentValue: 158000,
        unitsOrQty: '550 Units',
        sipAmount: 5000,
        holderMemberId: 'mem_1',
        notes: 'Passive broad-market index ETF'
      },
      {
        id: 'inv_6',
        name: 'Sovereign Gold Bonds (SGB 2028 Series)',
        type: 'SGB / Gold',
        symbolOrFolio: 'SGB2028-IV',
        platform: 'RBI Retail Direct',
        investedAmount: 100000,
        currentValue: 165000,
        unitsOrQty: '20 Grams',
        sipAmount: 0,
        holderMemberId: 'mem_2',
        notes: '2.5% semi-annual interest with tax-free redemption'
      }
    ],
    budgets: [
      { id: 'b_1', category: 'Groceries', monthlyLimit: 20000 },
      { id: 'b_2', category: 'Housing & Rent', monthlyLimit: 35000 },
      { id: 'b_3', category: 'Dining & Takeout', monthlyLimit: 8000 },
      { id: 'b_4', category: 'Utilities & Bills', monthlyLimit: 6000 },
      { id: 'b_5', category: 'Entertainment & OTT', monthlyLimit: 4000 },
      { id: 'b_6', category: 'Transportation & Fuel', monthlyLimit: 7000 }
    ],
    savingsGoals: [
      { id: 'goal_1', name: 'Family Vacation', targetAmount: 150000, currentAmount: 95000, targetDate: '2026-10-15', icon: '🏖️' },
      { id: 'goal_2', name: 'Emergency Fund', targetAmount: 300000, currentAmount: 185000, targetDate: '2026-12-31', icon: '🛡️' },
      { id: 'goal_3', name: 'Education Pool', targetAmount: 500000, currentAmount: 120000, targetDate: '2027-06-01', icon: '🎓' }
    ],
    transactions: [
      // Income
      { id: 'tx_1', title: 'Monthly Primary Salary', amount: 85000, type: 'income', category: 'Salary & Earnings', memberId: 'mem_1', paymentMethod: 'Bank Transfer', date: '2026-09-01', notes: 'Monthly payroll deposit' },
      { id: 'tx_2', title: 'Professional Consulting', amount: 62000, type: 'income', category: 'Salary & Earnings', memberId: 'mem_2', paymentMethod: 'Bank Transfer', date: '2026-09-02', notes: 'Consulting retainer' },
      { id: 'tx_3', title: 'Mutual Fund Dividend', amount: 6500, type: 'income', category: 'Investments & Returns', memberId: 'mem_1', paymentMethod: 'Bank Transfer', date: '2026-09-04', notes: 'Index fund distribution' },
      { id: 'tx_rent_1', title: 'Palm Meadows Flat Rent', amount: 32000, type: 'income', category: 'Rental Income', memberId: 'mem_2', paymentMethod: 'Bank Transfer', date: '2026-09-05', notes: 'September rent received' },
      { id: 'tx_rent_2', title: 'Commerce Hub Office Rent', amount: 48000, type: 'income', category: 'Rental Income', memberId: 'mem_1', paymentMethod: 'Bank Transfer', date: '2026-09-05', notes: 'September commercial rent' },
      
      // Expenses - Current Month
      { id: 'tx_4', title: 'Home Loan EMI (SBI)', amount: 36500, type: 'expense', category: 'Housing & Rent', memberId: 'mem_1', paymentMethod: 'Bank Transfer', date: '2026-09-05', notes: 'Monthly home loan EMI' },
      { id: 'tx_emi_car', title: 'Car Loan EMI (HDFC)', amount: 16800, type: 'expense', category: 'Transportation & Fuel', memberId: 'mem_1', paymentMethod: 'Bank Transfer', date: '2026-09-10', notes: 'Vehicle loan EMI' },
      { id: 'tx_5', title: 'Supermarket Groceries & Pantry', amount: 5450, type: 'expense', category: 'Groceries', memberId: 'mem_2', paymentMethod: 'UPI / Debit Card', date: '2026-09-03', notes: 'Monthly staples & groceries' },
      { id: 'tx_6', title: 'Electricity & Gas Bill', amount: 3200, type: 'expense', category: 'Utilities & Bills', memberId: 'mem_1', paymentMethod: 'UPI / Debit Card', date: '2026-09-04', notes: 'Utility payment' },
      { id: 'tx_7', title: 'Family Weekend Dinner', amount: 2650, type: 'expense', category: 'Dining & Takeout', memberId: 'mem_2', paymentMethod: 'Credit Card', date: '2026-09-05', notes: 'Restaurant dinner' },
      { id: 'tx_8', title: 'Fiber Broadband Internet', amount: 999, type: 'expense', category: 'Utilities & Bills', memberId: 'mem_1', paymentMethod: 'UPI / Debit Card', date: '2026-09-05', notes: 'Monthly high-speed plan' },
      { id: 'tx_9', title: 'Sports & School Gear', amount: 1800, type: 'expense', category: 'Education & Kids', memberId: 'mem_3', paymentMethod: 'UPI / Debit Card', date: '2026-09-06', notes: 'Football kit' },
      { id: 'tx_10', title: 'Vehicle Petrol / Fuel', amount: 3500, type: 'expense', category: 'Transportation & Fuel', memberId: 'mem_1', paymentMethod: 'UPI / Debit Card', date: '2026-09-06', notes: 'Tank fill-up' },
      { id: 'tx_11', title: 'Maya Art & Drawing Supplies', amount: 750, type: 'expense', category: 'Education & Kids', memberId: 'mem_4', paymentMethod: 'Cash', date: '2026-09-07', notes: 'Color set & sketch book' },
      { id: 'tx_12', title: 'Monthly Wholesale Provisions', amount: 6800, type: 'expense', category: 'Groceries', memberId: 'mem_2', paymentMethod: 'Credit Card', date: '2026-09-07', notes: 'Wholesale grains & dairy' },
      { id: 'tx_13', title: 'OTT Subscriptions', amount: 649, type: 'expense', category: 'Entertainment & OTT', memberId: 'mem_1', paymentMethod: 'Credit Card', date: '2026-09-08', notes: 'Family entertainment pack' },
      { id: 'tx_14', title: 'School Cafeteria & Books', amount: 1200, type: 'expense', category: 'Education & Kids', memberId: 'mem_3', paymentMethod: 'UPI / Debit Card', date: '2026-09-08', notes: 'Academic supplies' },

      // Previous Month Transactions for Trend Analytics
      { id: 'tx_prev_1', title: 'August Salary', amount: 85000, type: 'income', category: 'Salary & Earnings', memberId: 'mem_1', paymentMethod: 'Bank Transfer', date: '2026-08-01', notes: 'August payroll' },
      { id: 'tx_prev_2', title: 'August Consulting', amount: 62000, type: 'income', category: 'Salary & Earnings', memberId: 'mem_2', paymentMethod: 'Bank Transfer', date: '2026-08-02', notes: 'August income' },
      { id: 'tx_prev_rent', title: 'August Total Rentals', amount: 80000, type: 'income', category: 'Rental Income', memberId: 'mem_1', paymentMethod: 'Bank Transfer', date: '2026-08-05', notes: 'August rentals' },
      { id: 'tx_prev_3', title: 'August Home EMI', amount: 36500, type: 'expense', category: 'Housing & Rent', memberId: 'mem_1', paymentMethod: 'Bank Transfer', date: '2026-08-05', notes: 'Home loan EMI' },
      { id: 'tx_prev_4', title: 'August Groceries Total', amount: 18400, type: 'expense', category: 'Groceries', memberId: 'mem_2', paymentMethod: 'UPI / Debit Card', date: '2026-08-15', notes: 'Monthly provisions' },
      { id: 'tx_prev_5', title: 'August Weekend Trip', amount: 8500, type: 'expense', category: 'Entertainment & OTT', memberId: 'mem_1', paymentMethod: 'Credit Card', date: '2026-08-20', notes: 'Family outing' }
    ]
  };

  class Store {
    constructor() {
      this.data = this.load();
      this.listeners = [];
    }

    load() {
      try {
        let serialized = localStorage.getItem(STORAGE_KEY);
        // Check for v1/v2/v3 storage migration
        if (!serialized) {
          const v3Data = localStorage.getItem('famfinance_data_v3');
          const v2Data = localStorage.getItem('famfinance_data_v2');
          const v1Data = localStorage.getItem('famfinance_data_v1');
          if (v3Data || v2Data || v1Data) {
            try {
              const prev = JSON.parse(v3Data || v2Data || v1Data);
              serialized = JSON.stringify({
                ...INITIAL_DATA,
                ...prev,
                settings: { ...INITIAL_DATA.settings, ...(prev.settings || {}) },
                policies: prev.policies || INITIAL_DATA.policies,
                properties: prev.properties || INITIAL_DATA.properties,
                bankAccounts: prev.bankAccounts || INITIAL_DATA.bankAccounts,
                emis: prev.emis || INITIAL_DATA.emis,
                rentalProperties: prev.rentalProperties || INITIAL_DATA.rentalProperties,
                investments: prev.investments || INITIAL_DATA.investments
              });
            } catch (e) {}
          }
        }
        if (serialized) {
          const parsed = JSON.parse(serialized);
          const settings = { ...INITIAL_DATA.settings, ...(parsed.settings || {}) };
          if (settings.familyName === 'The Johnson Family') settings.familyName = 'CH';
          if (settings.currency === '$') settings.currency = '₹';

          return {
            settings,
            members: parsed.members && parsed.members.length ? parsed.members : INITIAL_DATA.members,
            budgets: parsed.budgets && parsed.budgets.length ? parsed.budgets : INITIAL_DATA.budgets,
            savingsGoals: parsed.savingsGoals && parsed.savingsGoals.length ? parsed.savingsGoals : INITIAL_DATA.savingsGoals,
            transactions: parsed.transactions || INITIAL_DATA.transactions,
            policies: parsed.policies || INITIAL_DATA.policies,
            properties: parsed.properties || INITIAL_DATA.properties,
            bankAccounts: parsed.bankAccounts || INITIAL_DATA.bankAccounts,
            emis: parsed.emis || INITIAL_DATA.emis,
            rentalProperties: parsed.rentalProperties || INITIAL_DATA.rentalProperties,
            investments: parsed.investments || INITIAL_DATA.investments
          };
        }
      } catch (e) {
        console.warn('Failed to load local storage, falling back to initial data', e);
      }
      this.persist(INITIAL_DATA);
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }

    persist(dataToSave = this.data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (e) {
        console.error('LocalStorage persist error:', e);
      }
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }

    notify() {
      this.persist();
      this.listeners.forEach(fn => fn(this.data));
    }

    // --- TRANSACTIONS ---
    getTransactions(filter = {}) {
      let list = [...this.data.transactions];

      if (filter.memberId && filter.memberId !== 'all') {
        list = list.filter(t => t.memberId === filter.memberId);
      }

      if (filter.type && filter.type !== 'all') {
        list = list.filter(t => t.type === filter.type);
      }

      if (filter.category && filter.category !== 'all') {
        list = list.filter(t => t.category === filter.category);
      }

      if (filter.search && filter.search.trim() !== '') {
        const q = filter.search.toLowerCase().trim();
        list = list.filter(t => 
          t.title.toLowerCase().includes(q) || 
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
        );
      }

      if (filter.month) {
        list = list.filter(t => t.date.startsWith(filter.month));
      }

      if (filter.monthOnly) {
        list = list.filter(t => (t.date || '').slice(5, 7) === filter.monthOnly);
      }

      return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    addTransaction(tx) {
      const newTx = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        title: tx.title.trim(),
        amount: parseFloat(tx.amount) || 0,
        type: tx.type || 'expense',
        category: tx.category,
        memberId: tx.memberId,
        paymentMethod: tx.paymentMethod || 'UPI / Debit Card',
        date: tx.date || new Date().toISOString().split('T')[0],
        notes: (tx.notes || '').trim()
      };
      this.data.transactions.unshift(newTx);
      this.notify();
      return newTx;
    }

    updateTransaction(id, updatedFields) {
      const idx = this.data.transactions.findIndex(t => t.id === id);
      if (idx !== -1) {
        this.data.transactions[idx] = {
          ...this.data.transactions[idx],
          ...updatedFields,
          amount: parseFloat(updatedFields.amount) || this.data.transactions[idx].amount
        };
        this.notify();
        return this.data.transactions[idx];
      }
      return null;
    }

    deleteTransaction(id) {
      this.data.transactions = this.data.transactions.filter(t => t.id !== id);
      this.notify();
    }

    // --- MEMBERS ---
    getMembers() {
      return this.data.members;
    }

    getMember(id) {
      return this.data.members.find(m => m.id === id);
    }

    addMember(member) {
      const newMember = {
        id: 'mem_' + Date.now(),
        name: member.name.trim(),
        role: member.role || 'Member',
        avatarColor: member.avatarColor || '#6366f1',
        avatarInitial: member.name.trim().charAt(0).toUpperCase()
      };
      this.data.members.push(newMember);
      this.notify();
      return newMember;
    }

    deleteMember(id) {
      if (this.data.members.length <= 1) {
        throw new Error('At least one family member must remain.');
      }
      this.data.members = this.data.members.filter(m => m.id !== id);
      this.notify();
    }

    // --- 1. POLICIES & INSURANCE CRUD ---
    getPolicies() {
      return this.data.policies || [];
    }

    addPolicy(policy) {
      const newPolicy = {
        id: 'pol_' + Date.now(),
        policyName: policy.policyName.trim(),
        policyType: policy.policyType || 'Life / Term Insurance',
        provider: policy.provider.trim(),
        policyNumber: (policy.policyNumber || '').trim(),
        sumInsured: parseFloat(policy.sumInsured) || 0,
        premiumAmount: parseFloat(policy.premiumAmount) || 0,
        premiumFrequency: policy.premiumFrequency || 'Annual',
        nextDueDate: policy.nextDueDate || '',
        maturityDate: policy.maturityDate || '',
        insuredMemberId: policy.insuredMemberId || 'mem_1',
        status: policy.status || 'Active',
        notes: (policy.notes || '').trim()
      };
      if (!this.data.policies) this.data.policies = [];
      this.data.policies.unshift(newPolicy);
      this.notify();
      return newPolicy;
    }

    updatePolicy(id, fields) {
      const idx = this.data.policies.findIndex(p => p.id === id);
      if (idx !== -1) {
        this.data.policies[idx] = {
          ...this.data.policies[idx],
          ...fields,
          sumInsured: parseFloat(fields.sumInsured) || this.data.policies[idx].sumInsured,
          premiumAmount: parseFloat(fields.premiumAmount) || this.data.policies[idx].premiumAmount
        };
        this.notify();
        return this.data.policies[idx];
      }
      return null;
    }

    deletePolicy(id) {
      this.data.policies = (this.data.policies || []).filter(p => p.id !== id);
      this.notify();
    }

    // --- 2. PROPERTIES & LAND CRUD ---
    getProperties() {
      return this.data.properties || [];
    }

    addProperty(property) {
      const newProp = {
        id: 'prop_' + Date.now(),
        propertyName: property.propertyName.trim(),
        propertyType: property.propertyType || 'Residential Flat',
        location: (property.location || '').trim(),
        surveyNo: (property.surveyNo || '').trim(),
        area: (property.area || '').trim(),
        areaUnit: property.areaUnit || 'sq.ft',
        purchaseYear: property.purchaseYear || '',
        purchasePrice: parseFloat(property.purchasePrice) || 0,
        currentValue: parseFloat(property.currentValue) || parseFloat(property.purchasePrice) || 0,
        ownerMemberId: property.ownerMemberId || 'mem_1',
        status: property.status || 'Owned',
        notes: (property.notes || '').trim()
      };
      if (!this.data.properties) this.data.properties = [];
      this.data.properties.unshift(newProp);
      this.notify();
      return newProp;
    }

    updateProperty(id, fields) {
      const idx = this.data.properties.findIndex(p => p.id === id);
      if (idx !== -1) {
        this.data.properties[idx] = {
          ...this.data.properties[idx],
          ...fields,
          purchasePrice: parseFloat(fields.purchasePrice) || this.data.properties[idx].purchasePrice,
          currentValue: parseFloat(fields.currentValue) || this.data.properties[idx].currentValue
        };
        this.notify();
        return this.data.properties[idx];
      }
      return null;
    }

    deleteProperty(id) {
      this.data.properties = (this.data.properties || []).filter(p => p.id !== id);
      this.notify();
    }

    // --- 3. BANK ACCOUNTS CRUD ---
    getBankAccounts() {
      return this.data.bankAccounts || [];
    }

    addBankAccount(account) {
      const newAcc = {
        id: 'acc_' + Date.now(),
        bankName: account.bankName.trim(),
        accountType: account.accountType || 'Savings Account',
        accountNumberLast4: (account.accountNumberLast4 || '').trim(),
        ifscCode: (account.ifscCode || '').trim().toUpperCase(),
        branch: (account.branch || '').trim(),
        balance: parseFloat(account.balance) || 0,
        holderMemberId: account.holderMemberId || 'mem_1',
        notes: (account.notes || '').trim()
      };
      if (!this.data.bankAccounts) this.data.bankAccounts = [];
      this.data.bankAccounts.unshift(newAcc);
      this.notify();
      return newAcc;
    }

    updateBankAccount(id, fields) {
      const idx = this.data.bankAccounts.findIndex(a => a.id === id);
      if (idx !== -1) {
        this.data.bankAccounts[idx] = {
          ...this.data.bankAccounts[idx],
          ...fields,
          balance: parseFloat(fields.balance) || this.data.bankAccounts[idx].balance
        };
        this.notify();
        return this.data.bankAccounts[idx];
      }
      return null;
    }

    deleteBankAccount(id) {
      this.data.bankAccounts = (this.data.bankAccounts || []).filter(a => a.id !== id);
      this.notify();
    }

    // --- 4. LOANS & EMIS CRUD ---
    getEmis() {
      return this.data.emis || [];
    }

    addEmi(emi) {
      const newEmi = {
        id: 'emi_' + Date.now(),
        loanName: emi.loanName.trim(),
        loanType: emi.loanType || 'Home Loan',
        lender: (emi.lender || '').trim(),
        originalPrincipal: parseFloat(emi.originalPrincipal) || 0,
        outstandingPrincipal: parseFloat(emi.outstandingPrincipal) || parseFloat(emi.originalPrincipal) || 0,
        monthlyEmi: parseFloat(emi.monthlyEmi) || 0,
        interestRate: parseFloat(emi.interestRate) || 0,
        remainingTenureMonths: parseInt(emi.remainingTenureMonths) || 0,
        linkedMemberId: emi.linkedMemberId || 'mem_1',
        notes: (emi.notes || '').trim()
      };
      if (!this.data.emis) this.data.emis = [];
      this.data.emis.unshift(newEmi);
      this.notify();
      return newEmi;
    }

    updateEmi(id, fields) {
      const idx = this.data.emis.findIndex(e => e.id === id);
      if (idx !== -1) {
        this.data.emis[idx] = {
          ...this.data.emis[idx],
          ...fields,
          originalPrincipal: parseFloat(fields.originalPrincipal) || this.data.emis[idx].originalPrincipal,
          outstandingPrincipal: parseFloat(fields.outstandingPrincipal) || this.data.emis[idx].outstandingPrincipal,
          monthlyEmi: parseFloat(fields.monthlyEmi) || this.data.emis[idx].monthlyEmi,
          interestRate: parseFloat(fields.interestRate) || this.data.emis[idx].interestRate,
          remainingTenureMonths: parseInt(fields.remainingTenureMonths) || this.data.emis[idx].remainingTenureMonths
        };
        this.notify();
        return this.data.emis[idx];
      }
      return null;
    }

    deleteEmi(id) {
      this.data.emis = (this.data.emis || []).filter(e => e.id !== id);
      this.notify();
    }

    // --- 5. RENTAL PROPERTIES CRUD ---
    getRentalProperties() {
      return this.data.rentalProperties || [];
    }

    addRentalProperty(rental) {
      const newRental = {
        id: 'rent_' + Date.now(),
        propertyName: rental.propertyName.trim(),
        address: (rental.address || '').trim(),
        tenantName: (rental.tenantName || '').trim(),
        tenantContact: (rental.tenantContact || '').trim(),
        monthlyRent: parseFloat(rental.monthlyRent) || 0,
        securityDeposit: parseFloat(rental.securityDeposit) || 0,
        leaseStartDate: rental.leaseStartDate || '',
        leaseEndDate: rental.leaseEndDate || '',
        paymentStatus: rental.paymentStatus || 'Received',
        ownerMemberId: rental.ownerMemberId || 'mem_1',
        notes: (rental.notes || '').trim()
      };
      if (!this.data.rentalProperties) this.data.rentalProperties = [];
      this.data.rentalProperties.unshift(newRental);
      this.notify();
      return newRental;
    }

    updateRentalProperty(id, fields) {
      const idx = this.data.rentalProperties.findIndex(r => r.id === id);
      if (idx !== -1) {
        this.data.rentalProperties[idx] = {
          ...this.data.rentalProperties[idx],
          ...fields,
          monthlyRent: parseFloat(fields.monthlyRent) || this.data.rentalProperties[idx].monthlyRent,
          securityDeposit: parseFloat(fields.securityDeposit) || this.data.rentalProperties[idx].securityDeposit
        };
        this.notify();
        return this.data.rentalProperties[idx];
      }
      return null;
    }

    toggleRentStatus(id) {
      const rental = (this.data.rentalProperties || []).find(r => r.id === id);
      if (rental) {
        rental.paymentStatus = rental.paymentStatus === 'Received' ? 'Pending' : 'Received';
        this.notify();
        return rental;
      }
      return null;
    }

    deleteRentalProperty(id) {
      this.data.rentalProperties = (this.data.rentalProperties || []).filter(r => r.id !== id);
      this.notify();
    }

    // --- 6. INVESTMENTS (MUTUAL FUNDS, STOCKS, ETFS & GOLD) ---
    getInvestments(typeFilter = 'all') {
      if (!typeFilter || typeFilter === 'all') return this.data.investments || [];
      return (this.data.investments || []).filter(inv => inv.type === typeFilter);
    }

    getInvestment(id) {
      return (this.data.investments || []).find(inv => inv.id === id);
    }

    addInvestment(inv) {
      const newInv = {
        id: 'inv_' + Date.now(),
        name: (inv.name || '').trim(),
        type: inv.type || 'Mutual Fund',
        symbolOrFolio: (inv.symbolOrFolio || '').trim(),
        platform: (inv.platform || '').trim(),
        investedAmount: parseFloat(inv.investedAmount) || 0,
        currentValue: parseFloat(inv.currentValue) || 0,
        unitsOrQty: (inv.unitsOrQty || '').trim(),
        sipAmount: parseFloat(inv.sipAmount) || 0,
        holderMemberId: inv.holderMemberId || (this.data.members && this.data.members[0] ? this.data.members[0].id : 'mem_1'),
        notes: (inv.notes || '').trim()
      };
      if (!this.data.investments) this.data.investments = [];
      this.data.investments.unshift(newInv);
      this.notify();
      return newInv;
    }

    updateInvestment(id, fields) {
      if (!this.data.investments) this.data.investments = [];
      const idx = this.data.investments.findIndex(inv => inv.id === id);
      if (idx !== -1) {
        this.data.investments[idx] = {
          ...this.data.investments[idx],
          ...fields,
          investedAmount: fields.investedAmount !== undefined && !isNaN(parseFloat(fields.investedAmount)) ? parseFloat(fields.investedAmount) : this.data.investments[idx].investedAmount,
          currentValue: fields.currentValue !== undefined && !isNaN(parseFloat(fields.currentValue)) ? parseFloat(fields.currentValue) : this.data.investments[idx].currentValue,
          sipAmount: fields.sipAmount !== undefined && !isNaN(parseFloat(fields.sipAmount)) ? parseFloat(fields.sipAmount) : (this.data.investments[idx].sipAmount || 0)
        };
        this.notify();
        return this.data.investments[idx];
      }
      return null;
    }

    deleteInvestment(id) {
      this.data.investments = (this.data.investments || []).filter(inv => inv.id !== id);
      this.notify();
    }

    // --- BUDGETS ---
    getBudgets() {
      return this.data.budgets;
    }

    saveBudget(category, monthlyLimit) {
      const existingIndex = this.data.budgets.findIndex(b => b.category === category);
      if (existingIndex !== -1) {
        this.data.budgets[existingIndex].monthlyLimit = parseFloat(monthlyLimit);
      } else {
        this.data.budgets.push({
          id: 'b_' + Date.now(),
          category,
          monthlyLimit: parseFloat(monthlyLimit)
        });
      }
      this.notify();
    }

    deleteBudget(id) {
      this.data.budgets = this.data.budgets.filter(b => b.id !== id);
      this.notify();
    }

    // --- SAVINGS GOALS ---
    getGoals() {
      return this.data.savingsGoals;
    }

    addGoal(goal) {
      const newGoal = {
        id: 'goal_' + Date.now(),
        name: goal.name.trim(),
        targetAmount: parseFloat(goal.targetAmount) || 0,
        currentAmount: parseFloat(goal.currentAmount) || 0,
        targetDate: goal.targetDate || '',
        icon: goal.icon || '🎯'
      };
      this.data.savingsGoals.push(newGoal);
      this.notify();
      return newGoal;
    }

    contributeToGoal(id, depositAmount) {
      const goal = this.data.savingsGoals.find(g => g.id === id);
      if (goal) {
        goal.currentAmount = Math.max(0, goal.currentAmount + (parseFloat(depositAmount) || 0));
        this.notify();
        return goal;
      }
      return null;
    }

    deleteGoal(id) {
      this.data.savingsGoals = this.data.savingsGoals.filter(g => g.id !== id);
      this.notify();
    }

    // --- SETTINGS ---
    getSettings() {
      return this.data.settings;
    }

    updateSettings(newSettings) {
      this.data.settings = { ...this.data.settings, ...newSettings };
      this.notify();
    }

    // --- WEALTH & PORTFOLIO AGGREGATE CALCULATIONS ---
    getWealthSummary() {
      // 1. Liquid Bank Balance
      const totalLiquidCash = (this.data.bankAccounts || []).reduce((sum, a) => sum + (a.balance || 0), 0);

      // 2. Real Estate Valuation & Purchase Cost
      const totalPropertyValue = (this.data.properties || []).reduce((sum, p) => sum + (p.currentValue || 0), 0);
      const totalPropertyCost = (this.data.properties || []).reduce((sum, p) => sum + (p.purchasePrice || 0), 0);
      const totalPropertyGain = totalPropertyValue - totalPropertyCost;
      const propertyGainPercent = totalPropertyCost > 0 ? Math.round((totalPropertyGain / totalPropertyCost) * 100) : 0;

      // 3. Active Liabilities (Outstanding Principal)
      const totalLiabilities = (this.data.emis || []).reduce((sum, e) => sum + (e.outstandingPrincipal || 0), 0);
      const totalMonthlyEmis = (this.data.emis || []).reduce((sum, e) => sum + (e.monthlyEmi || 0), 0);

      // 4. Monthly Passive Rental Income
      const totalMonthlyRent = (this.data.rentalProperties || []).reduce((sum, r) => sum + (r.monthlyRent || 0), 0);
      const totalRentalDeposits = (this.data.rentalProperties || []).reduce((sum, r) => sum + (r.securityDeposit || 0), 0);

      // 5. Total Life & Health Insurance Coverage
      const totalInsuranceCover = (this.data.policies || []).reduce((sum, p) => sum + (p.sumInsured || 0), 0);
      const totalAnnualPremiums = (this.data.policies || []).reduce((sum, p) => sum + (p.premiumAmount || 0), 0);

      // 6. Investments Portfolio (Mutual Funds, Stocks, ETFs, Gold)
      const totalInvestments = (this.data.investments || []).reduce((sum, i) => sum + (i.currentValue || 0), 0);
      const totalInvestedCost = (this.data.investments || []).reduce((sum, i) => sum + (i.investedAmount || 0), 0);
      const totalInvestmentGain = totalInvestments - totalInvestedCost;
      const investmentGainPercent = totalInvestedCost > 0 ? Math.round((totalInvestmentGain / totalInvestedCost) * 100) : 0;
      const totalMonthlySips = (this.data.investments || []).reduce((sum, i) => sum + (i.sipAmount || 0), 0);

      // 7. Net Worth = Real Estate + Liquid Cash + Investments - Active Loan Liabilities
      const netWorth = totalPropertyValue + totalLiquidCash + totalInvestments - totalLiabilities;

      return {
        totalLiquidCash,
        totalPropertyValue,
        totalPropertyCost,
        totalPropertyGain,
        propertyGainPercent,
        totalLiabilities,
        totalMonthlyEmis,
        totalMonthlyRent,
        totalRentalDeposits,
        totalInsuranceCover,
        totalAnnualPremiums,
        totalInvestments,
        totalInvestedCost,
        totalInvestmentGain,
        investmentGainPercent,
        totalMonthlySips,
        netWorth
      };
    }

    getMetrics(filter = {}) {
      const transactions = this.getTransactions(filter);

      let totalIncome = 0;
      let totalExpense = 0;

      transactions.forEach(t => {
        if (t.type === 'income') {
          totalIncome += t.amount;
        } else if (t.type === 'expense') {
          totalExpense += t.amount;
        }
      });

      const netSavings = totalIncome - totalExpense;
      const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

      return {
        totalIncome,
        totalExpense,
        netSavings,
        savingsRate
      };
    }

    getCategorySpending(filter = {}) {
      const expenseTxs = this.getTransactions({ ...filter, type: 'expense' });
      const categoryTotals = {};

      expenseTxs.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

      return categoryTotals;
    }

    getMemberSpending(filter = {}) {
      const expenseTxs = this.getTransactions({ ...filter, type: 'expense' });
      const memberTotals = {};

      this.data.members.forEach(m => {
        memberTotals[m.id] = {
          member: m,
          total: 0
        };
      });

      expenseTxs.forEach(t => {
        if (memberTotals[t.memberId]) {
          memberTotals[t.memberId].total += t.amount;
        }
      });

      return Object.values(memberTotals);
    }

    // --- EXPORT & IMPORT ---
    exportToCSV() {
      const headers = ['Date', 'Type', 'Title', 'Category', 'Family Member', 'Amount', 'Payment Method', 'Notes'];
      const rows = this.data.transactions.map(t => {
        const member = this.getMember(t.memberId);
        return [
          `"${t.date}"`,
          `"${t.type}"`,
          `"${(t.title || '').replace(/"/g, '""')}"`,
          `"${t.category}"`,
          `"${member ? member.name.replace(/"/g, '""') : 'Unknown'}"`,
          t.amount.toFixed(2),
          `"${t.paymentMethod}"`,
          `"${(t.notes || '').replace(/"/g, '""')}"`
        ].join(',');
      });

      return [headers.join(','), ...rows].join('\r\n');
    }

    exportToJSON() {
      return JSON.stringify(this.data, null, 2);
    }

    importFromJSON(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (!parsed.transactions || !parsed.members) {
          throw new Error('Invalid JSON structure. Missing transactions or members.');
        }
        this.data = {
          ...INITIAL_DATA,
          ...parsed,
          policies: parsed.policies || INITIAL_DATA.policies,
          properties: parsed.properties || INITIAL_DATA.properties,
          bankAccounts: parsed.bankAccounts || INITIAL_DATA.bankAccounts,
          emis: parsed.emis || INITIAL_DATA.emis,
          rentalProperties: parsed.rentalProperties || INITIAL_DATA.rentalProperties,
          investments: parsed.investments || INITIAL_DATA.investments
        };
        this.notify();
        return true;
      } catch (e) {
        console.error('Import failed', e);
        throw e;
      }
    }

    resetToDemoData() {
      this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
      this.notify();
    }

    clearAllData() {
      this.data = {
        settings: { ...INITIAL_DATA.settings },
        members: [{ id: 'mem_1', name: 'Primary Member', role: 'Head of Family', avatarColor: '#6366f1', avatarInitial: 'P' }],
        budgets: [],
        savingsGoals: [],
        transactions: [],
        policies: [],
        properties: [],
        bankAccounts: [],
        emis: [],
        rentalProperties: [],
        investments: []
      };
      this.notify();
    }
  }

  const storeInstance = new Store();

  root.FamStore = {
    store: storeInstance,
    DEFAULT_CATEGORIES,
    PAYMENT_METHODS,
    CURRENCY_SYMBOLS
  };
})(window);
