/**
 * FamFinance - Main Application Controller
 * Full Family Wealth, Expenses & Asset Management Hub
 */

(function() {
  const { store, DEFAULT_CATEGORIES, PAYMENT_METHODS, CURRENCY_SYMBOLS } = window.FamStore;
  const { renderCategoryChart, renderTrendChart } = window.FamCharts;

  class App {
    constructor() {
      this.currentTab = 'dashboard';
      this.activeMemberFilter = 'all';

      // Edit state tracking
      this.editingTxId = null;
      this.editingAccountId = null;
      this.editingPropertyId = null;
      this.editingRentalId = null;
      this.editingEmiId = null;
      this.editingPolicyId = null;
      this.editingInvestmentId = null;
      this.activeInvFilter = 'all';

      // Overview period filter (defaults to current month)
      const now = new Date();
      this.activeOverviewMonth = String(now.getMonth() + 1).padStart(2, '0');
      this.activeOverviewYear = String(now.getFullYear());

      this.initElements();
      this.initEvents();
      this.applySettings();
      this.render();

      // Subscribe to store updates
      store.subscribe(() => {
        this.render();
      });
    }

    initElements() {
      // Nav
      this.navItems = document.querySelectorAll('.nav-item');
      this.tabPanels = document.querySelectorAll('.tab-panel');
      this.pageTitle = document.getElementById('pageTitle');
      this.currentMonthBadge = document.getElementById('currentMonthBadge');

      // Global Header Filter
      this.globalMemberFilter = document.getElementById('globalMemberFilter');
      this.themeToggleBtn = document.getElementById('themeToggleBtn');
      this.quickAddBtn = document.getElementById('quickAddBtn');
      this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
      this.sidebar = document.querySelector('.sidebar');

      // Overview Period Filter Elements
      this.overviewMonthSelect = document.getElementById('overviewMonthSelect');
      this.overviewYearSelect = document.getElementById('overviewYearSelect');
      this.overviewCurrentMonthBtn = document.getElementById('overviewCurrentMonthBtn');
      this.overviewPeriodTitle = document.getElementById('overviewPeriodTitle');
      this.overviewPeriodCaption = document.getElementById('overviewPeriodCaption');

      // Modals
      this.txModal = document.getElementById('txModal');
      this.budgetModal = document.getElementById('budgetModal');
      this.goalModal = document.getElementById('goalModal');
      this.memberModal = document.getElementById('memberModal');
      this.depositModal = document.getElementById('depositModal');

      this.accountModal = document.getElementById('accountModal');
      this.propertyModal = document.getElementById('propertyModal');
      this.rentalModal = document.getElementById('rentalModal');
      this.emiModal = document.getElementById('emiModal');
      this.policyModal = document.getElementById('policyModal');
      this.investmentModal = document.getElementById('investmentModal');

      // Forms
      this.txForm = document.getElementById('txForm');
      this.budgetForm = document.getElementById('budgetForm');
      this.goalForm = document.getElementById('goalForm');
      this.memberForm = document.getElementById('memberForm');
      this.depositForm = document.getElementById('depositForm');

      this.accountForm = document.getElementById('accountForm');
      this.propertyForm = document.getElementById('propertyForm');
      this.rentalForm = document.getElementById('rentalForm');
      this.emiForm = document.getElementById('emiForm');
      this.policyForm = document.getElementById('policyForm');
      this.investmentForm = document.getElementById('investmentForm');

      // Filters on Transactions Tab
      this.txSearchInput = document.getElementById('txSearchInput');
      this.txTypeFilter = document.getElementById('txTypeFilter');
      this.txCategoryFilter = document.getElementById('txCategoryFilter');
      this.txMemberFilter = document.getElementById('txMemberFilter');

      // Toasts
      this.toastContainer = document.getElementById('toastContainer');
    }

    initEvents() {
      // Navigation tabs
      this.navItems.forEach(item => {
        item.addEventListener('click', e => {
          e.preventDefault();
          const tab = item.getAttribute('data-tab');
          this.switchTab(tab);
          if (window.innerWidth <= 768) {
            this.sidebar.classList.remove('open');
          }
        });
      });

      // Mobile sidebar toggle
      if (this.mobileMenuBtn) {
        this.mobileMenuBtn.addEventListener('click', () => {
          this.sidebar.classList.toggle('open');
        });
      }

      // Global Member Filter in Header
      if (this.globalMemberFilter) {
        this.globalMemberFilter.addEventListener('change', e => {
          this.activeMemberFilter = e.target.value;
          this.render();
        });
      }

      // Overview Period Filter Listeners
      this.overviewMonthSelect?.addEventListener('change', e => {
        this.activeOverviewMonth = e.target.value;
        this.render();
      });

      this.overviewYearSelect?.addEventListener('change', e => {
        this.activeOverviewYear = e.target.value;
        this.render();
      });

      this.overviewCurrentMonthBtn?.addEventListener('click', () => {
        const now = new Date();
        this.activeOverviewMonth = String(now.getMonth() + 1).padStart(2, '0');
        this.activeOverviewYear = String(now.getFullYear());
        if (this.overviewMonthSelect) this.overviewMonthSelect.value = this.activeOverviewMonth;
        if (this.overviewYearSelect) this.overviewYearSelect.value = this.activeOverviewYear;
        this.render();
        this.showToast('Overview reset to current month');
      });

      // Theme Toggle
      if (this.themeToggleBtn) {
        this.themeToggleBtn.addEventListener('click', () => {
          const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          store.updateSettings({ theme: newTheme });
          this.applySettings();
          this.render();
        });
      }

      // Quick Add Button
      if (this.quickAddBtn) {
        this.quickAddBtn.addEventListener('click', () => {
          this.openTxModal();
        });
      }

      // Transaction Modal Type Toggles (Expense / Income)
      const expenseToggle = document.getElementById('typeExpenseBtn');
      const incomeToggle = document.getElementById('typeIncomeBtn');
      const txTypeHidden = document.getElementById('txType');

      if (expenseToggle && incomeToggle) {
        expenseToggle.addEventListener('click', () => {
          expenseToggle.classList.add('active');
          incomeToggle.classList.remove('active');
          txTypeHidden.value = 'expense';
          this.populateCategorySelect('txCategory', 'expense');
        });

        incomeToggle.addEventListener('click', () => {
          incomeToggle.classList.add('active');
          expenseToggle.classList.remove('active');
          txTypeHidden.value = 'income';
          this.populateCategorySelect('txCategory', 'income');
        });
      }

      // Form Submissions
      this.txForm?.addEventListener('submit', e => this.handleTxSubmit(e));
      this.budgetForm?.addEventListener('submit', e => this.handleBudgetSubmit(e));
      this.goalForm?.addEventListener('submit', e => this.handleGoalSubmit(e));
      this.memberForm?.addEventListener('submit', e => this.handleMemberSubmit(e));
      this.depositForm?.addEventListener('submit', e => this.handleDepositSubmit(e));

      // Wealth Form Submissions
      this.accountForm?.addEventListener('submit', e => this.handleAccountSubmit(e));
      this.propertyForm?.addEventListener('submit', e => this.handlePropertySubmit(e));
      this.rentalForm?.addEventListener('submit', e => this.handleRentalSubmit(e));
      this.emiForm?.addEventListener('submit', e => this.handleEmiSubmit(e));
      this.policyForm?.addEventListener('submit', e => this.handlePolicySubmit(e));
      this.investmentForm?.addEventListener('submit', e => this.handleInvestmentSubmit(e));

      // Modal Close Buttons & Backdrop Clicks
      document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeAllModals();
        });
      });

      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            this.closeAllModals();
          }
        });
      });

      // Keyboard Shortcuts
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          this.closeAllModals();
        } else if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          this.openTxModal();
        }
      });

      // Transaction Filter Listeners
      this.txSearchInput?.addEventListener('input', () => this.renderTransactionsTable());
      this.txTypeFilter?.addEventListener('change', () => this.renderTransactionsTable());
      this.txCategoryFilter?.addEventListener('change', () => this.renderTransactionsTable());
      this.txMemberFilter?.addEventListener('change', () => this.renderTransactionsTable());

      // Setup Modals trigger buttons
      document.getElementById('openAddBudgetBtn')?.addEventListener('click', () => this.openBudgetModal());
      document.getElementById('openAddGoalBtn')?.addEventListener('click', () => this.openGoalModal());
      document.getElementById('openAddMemberBtn')?.addEventListener('click', () => this.openMemberModal());

      // Wealth triggers
      document.getElementById('openAddAccountBtn')?.addEventListener('click', () => this.openAccountModal());
      document.getElementById('openAddPropertyBtn')?.addEventListener('click', () => this.openPropertyModal());
      document.getElementById('openAddRentalBtn')?.addEventListener('click', () => this.openRentalModal());
      document.getElementById('openAddEmiBtn')?.addEventListener('click', () => this.openEmiModal());
      document.getElementById('openAddPolicyBtn')?.addEventListener('click', () => this.openPolicyModal());
      document.getElementById('openAddInvestmentBtn')?.addEventListener('click', () => this.openInvestmentModal());

      // Investment Filter Buttons
      document.querySelectorAll('.inv-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.inv-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeInvFilter = btn.getAttribute('data-inv-filter') || 'all';
          const settings = store.getSettings();
          this.renderInvestments(settings.currency || '₹');
        });
      });

      // Settings View Listeners
      document.getElementById('saveFamilyNameBtn')?.addEventListener('click', () => {
        const name = document.getElementById('settingsFamilyName').value.trim();
        if (name) {
          store.updateSettings({ familyName: name });
          this.showToast('Family name updated to ' + name);
        }
      });

      document.getElementById('settingsCurrencySelect')?.addEventListener('change', e => {
        store.updateSettings({ currency: e.target.value });
        this.showToast(`Currency changed to ${e.target.value}`);
      });

      document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
        const csv = store.exportToCSV();
        this.downloadFile(csv, 'famfinance_transactions.csv', 'text/csv');
        this.showToast('CSV export downloaded');
      });

      document.getElementById('exportJsonBtn')?.addEventListener('click', () => {
        const json = store.exportToJSON();
        this.downloadFile(json, 'famfinance_backup.json', 'application/json');
        this.showToast('Complete JSON backup downloaded');
      });

      document.getElementById('importJsonBtn')?.addEventListener('click', () => {
        document.getElementById('importJsonInput').click();
      });

      document.getElementById('importJsonInput')?.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            store.importFromJSON(ev.target.result);
            this.showToast('Data imported successfully!');
          } catch (err) {
            this.showToast('Failed to import: ' + err.message, 'error');
          }
        };
        reader.readAsText(file);
      });

      document.getElementById('loadDemoDataBtn')?.addEventListener('click', () => {
        if (confirm('Load sample family data? Current data will be replaced.')) {
          store.resetToDemoData();
          this.showToast('Sample family data loaded');
        }
      });

      document.getElementById('clearAllDataBtn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
          store.clearAllData();
          this.showToast('All records cleared', 'info');
        }
      });

      // Color picker in member modal
      document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
          document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          document.getElementById('memberColorInput').value = opt.getAttribute('data-color');
        });
      });
    }

    applySettings() {
      const settings = store.getSettings();
      document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
      
      // Update theme toggle icon
      if (this.themeToggleBtn) {
        this.themeToggleBtn.innerHTML = settings.theme === 'light' 
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      }

      // Update family name display in sidebar
      const familyNameElem = document.getElementById('sidebarFamilyName');
      if (familyNameElem) familyNameElem.textContent = settings.familyName;

      // Update settings inputs
      const settingsFamilyName = document.getElementById('settingsFamilyName');
      if (settingsFamilyName) settingsFamilyName.value = settings.familyName;

      const settingsCurrency = document.getElementById('settingsCurrencySelect');
      if (settingsCurrency) settingsCurrency.value = settings.currency;
    }

    switchTab(tabName) {
      this.currentTab = tabName;

      this.navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-tab') === tabName);
      });

      this.tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabName}`);
      });

      const titles = {
        dashboard: 'Family Overview & Net Worth',
        transactions: 'All Transactions',
        budgets: 'Monthly Budgets',
        goals: 'Family Savings Goals',
        accounts: 'Bank Accounts & Balances',
        properties: 'Properties & Land Registry',
        rentals: 'Rental Properties & Tenants',
        emis: 'Active Loans & EMIs',
        policies: 'Insurance Policies & Cover',
        investments: 'Investment Portfolio, Mutual Funds & Stocks',
        members: 'Family Members',
        settings: 'Settings & Data'
      };

      if (this.pageTitle) {
        this.pageTitle.innerHTML = `${titles[tabName] || 'Overview'}`;
      }

      this.render();
    }

    render() {
      const settings = store.getSettings();
      const currency = settings.currency || '₹';

      // Update current date badge
      if (this.currentMonthBadge) {
        if (this.currentTab === 'dashboard') {
          this.currentMonthBadge.textContent = this.getOverviewPeriodLabel();
        } else {
          const now = new Date();
          this.currentMonthBadge.textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        }
      }

      // Update Member dropdowns across all modals
      this.populateMemberDropdowns();

      // Render active tab content
      if (this.currentTab === 'dashboard') {
        this.renderDashboard(currency);
      } else if (this.currentTab === 'transactions') {
        this.renderTransactionsTable(currency);
      } else if (this.currentTab === 'budgets') {
        this.renderBudgets(currency);
      } else if (this.currentTab === 'goals') {
        this.renderGoals(currency);
      } else if (this.currentTab === 'accounts') {
        this.renderBankAccounts(currency);
      } else if (this.currentTab === 'properties') {
        this.renderProperties(currency);
      } else if (this.currentTab === 'rentals') {
        this.renderRentalProperties(currency);
      } else if (this.currentTab === 'emis') {
        this.renderEmis(currency);
      } else if (this.currentTab === 'policies') {
        this.renderPolicies(currency);
      } else if (this.currentTab === 'investments') {
        this.renderInvestments(currency);
      } else if (this.currentTab === 'members') {
        this.renderMembers(currency);
      }
    }

    populateMemberDropdowns() {
      const members = store.getMembers();

      // Header Member Filter
      if (this.globalMemberFilter) {
        const currentVal = this.activeMemberFilter;
        this.globalMemberFilter.innerHTML = `<option value="all">Entire Family</option>` +
          members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        this.globalMemberFilter.value = currentVal;
      }

      // Transactions tab filter
      if (this.txMemberFilter) {
        const currentVal = this.txMemberFilter.value;
        this.txMemberFilter.innerHTML = `<option value="all">All Members</option>` +
          members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        if (currentVal) this.txMemberFilter.value = currentVal;
      }

      // Modals Member Selects
      const memberDropdownIds = [
        'txMember', 'accMemberSelect', 'propOwnerSelect', 
        'rentalOwnerSelect', 'emiMemberSelect', 'polMemberSelect',
        'invMemberSelect'
      ];

      memberDropdownIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const cur = el.value;
          el.innerHTML = members.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
          if (cur) el.value = cur;
        }
      });

      // Sidebar avatars preview
      const sidebarAvatars = document.getElementById('sidebarAvatarsPreview');
      if (sidebarAvatars) {
        sidebarAvatars.innerHTML = members.slice(0, 4).map(m => `
          <div class="avatar-mini" style="background-color: ${m.avatarColor}">${m.avatarInitial}</div>
        `).join('');
      }
    }

    populateCategorySelect(selectId, type = 'expense') {
      const select = document.getElementById(selectId);
      if (!select) return;

      const filtered = DEFAULT_CATEGORIES.filter(c => c.type === type || c.type === 'both');
      select.innerHTML = filtered.map(c => `
        <option value="${c.name}">${c.icon} ${c.name}</option>
      `).join('');
    }

    populateOverviewYearSelect() {
      if (!this.overviewYearSelect) return;
      const currentYear = new Date().getFullYear();
      const txYears = (store.data.transactions || [])
        .map(t => parseInt((t.date || '').substring(0, 4)))
        .filter(y => !isNaN(y));
      const yearSet = new Set([currentYear - 1, currentYear, currentYear + 1, ...txYears]);
      const sortedYears = Array.from(yearSet).sort((a, b) => b - a);

      const curVal = this.activeOverviewYear || String(currentYear);
      this.overviewYearSelect.innerHTML = `<option value="all">All Years</option>` +
        sortedYears.map(y => `<option value="${y}" ${String(y) === curVal ? 'selected' : ''}>${y}</option>`).join('');
      if (curVal) this.overviewYearSelect.value = curVal;
    }

    getOverviewFilter() {
      const filter = {};
      if (this.activeMemberFilter !== 'all') {
        filter.memberId = this.activeMemberFilter;
      }
      if (this.activeOverviewMonth !== 'all' && this.activeOverviewYear !== 'all') {
        filter.month = `${this.activeOverviewYear}-${this.activeOverviewMonth}`;
      } else if (this.activeOverviewYear !== 'all') {
        filter.month = `${this.activeOverviewYear}`;
      } else if (this.activeOverviewMonth !== 'all') {
        filter.monthOnly = this.activeOverviewMonth;
      }
      return filter;
    }

    getOverviewPeriodLabel() {
      const monthNames = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
      };

      if (this.activeOverviewMonth !== 'all' && this.activeOverviewYear !== 'all') {
        return `${monthNames[this.activeOverviewMonth] || this.activeOverviewMonth} ${this.activeOverviewYear}`;
      } else if (this.activeOverviewMonth === 'all' && this.activeOverviewYear !== 'all') {
        return `Full Year ${this.activeOverviewYear}`;
      } else if (this.activeOverviewMonth !== 'all' && this.activeOverviewYear === 'all') {
        return `All ${monthNames[this.activeOverviewMonth]}s (All Years)`;
      }
      return 'All Time Overview';
    }

    renderDashboard(currency) {
      // Sync Month & Year selector state
      this.populateOverviewYearSelect();
      if (this.overviewMonthSelect) this.overviewMonthSelect.value = this.activeOverviewMonth;
      if (this.overviewYearSelect) this.overviewYearSelect.value = this.activeOverviewYear;

      const periodLabel = this.getOverviewPeriodLabel();
      if (this.overviewPeriodTitle) this.overviewPeriodTitle.textContent = `Monthly Overview: ${periodLabel}`;
      if (this.overviewPeriodCaption) this.overviewPeriodCaption.textContent = `Showing cash flow, expenses & budget performance for ${periodLabel}`;
      if (this.currentMonthBadge) this.currentMonthBadge.textContent = periodLabel;

      const filter = this.getOverviewFilter();
      const metrics = store.getMetrics(filter);
      const wealth = store.getWealthSummary();

      // 1. Net Worth Banner elements
      const netWorthEl = document.getElementById('netWorthDisplay');
      const bannerPropEl = document.getElementById('bannerPropertyValue');
      const bannerCashEl = document.getElementById('bannerLiquidCash');
      const bannerLiabEl = document.getElementById('bannerLiabilities');
      const bannerRentEl = document.getElementById('bannerMonthlyRent');
      const bannerInvEl = document.getElementById('bannerInvestments');

      if (netWorthEl) netWorthEl.textContent = `${currency}${wealth.netWorth.toLocaleString('en-IN')}`;
      if (bannerPropEl) bannerPropEl.textContent = `${currency}${wealth.totalPropertyValue.toLocaleString('en-IN')}`;
      if (bannerCashEl) bannerCashEl.textContent = `${currency}${wealth.totalLiquidCash.toLocaleString('en-IN')}`;
      if (bannerLiabEl) bannerLiabEl.textContent = `${currency}${wealth.totalLiabilities.toLocaleString('en-IN')}`;
      if (bannerRentEl) bannerRentEl.textContent = `${currency}${wealth.totalMonthlyRent.toLocaleString('en-IN')}/mo`;
      if (bannerInvEl) bannerInvEl.textContent = `${currency}${wealth.totalInvestments.toLocaleString('en-IN')}`;

      // 2. Cash Flow KPI cards
      const balEl = document.getElementById('kpiTotalBalance');
      const incEl = document.getElementById('kpiMonthlyIncome');
      const expEl = document.getElementById('kpiMonthlyExpense');
      const savEl = document.getElementById('kpiSavingsRate');

      if (balEl) balEl.textContent = `${currency}${metrics.netSavings.toLocaleString('en-IN')}`;
      if (incEl) incEl.textContent = `${currency}${metrics.totalIncome.toLocaleString('en-IN')}`;
      if (expEl) expEl.textContent = `${currency}${metrics.totalExpense.toLocaleString('en-IN')}`;
      if (savEl) savEl.textContent = `${metrics.savingsRate}%`;

      // 3. Charts
      const categorySpending = store.getCategorySpending(filter);
      renderCategoryChart('categoryChart', categorySpending, currency);

      const trendFilter = this.activeMemberFilter !== 'all' ? { memberId: this.activeMemberFilter } : {};
      const allTx = store.getTransactions(trendFilter);
      renderTrendChart('trendChart', allTx, currency);

      // 4. Budgets preview
      this.renderDashboardBudgetsPreview(currency, filter);

      // 5. Member breakdown
      this.renderDashboardMemberBreakdown(currency, metrics.totalExpense, filter);

      // 6. Recent activity
      this.renderRecentTransactions(currency, filter);
    }

    renderDashboardBudgetsPreview(currency, filter = {}) {
      const container = document.getElementById('dashboardBudgetsList');
      if (!container) return;

      const budgets = store.getBudgets();
      const monthExpenses = store.getTransactions({ ...filter, type: 'expense' });

      if (budgets.length === 0) {
        container.innerHTML = `<div class="empty-state" style="padding: 20px;"><p>No budgets configured yet.</p></div>`;
        return;
      }

      const itemsHtml = budgets.slice(0, 4).map(b => {
        const catObj = DEFAULT_CATEGORIES.find(c => c.name === b.category) || { icon: '🏷️' };
        const spent = monthExpenses
          .filter(t => t.category === b.category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const percent = Math.min(100, Math.round((spent / b.monthlyLimit) * 100));
        let statusClass = 'normal';
        if (percent >= 100) statusClass = 'danger';
        else if (percent >= 80) statusClass = 'warning';

        return `
          <div class="progress-item">
            <div class="progress-info">
              <span class="progress-name">
                <span class="progress-category-icon">${catObj.icon}</span>
                ${b.category}
              </span>
              <span class="progress-values">
                <strong>${currency}${spent.toLocaleString('en-IN')}</strong> / ${currency}${b.monthlyLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${statusClass}" style="width: ${percent}%"></div>
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = itemsHtml;
    }

    renderDashboardMemberBreakdown(currency, totalFamilyExpense, filter = {}) {
      const container = document.getElementById('dashboardMemberBreakdown');
      if (!container) return;

      const memberBreakdown = store.getMemberSpending(filter);

      if (memberBreakdown.length === 0) {
        container.innerHTML = `<div class="empty-state" style="padding: 20px;"><p>No member data found.</p></div>`;
        return;
      }

      container.innerHTML = memberBreakdown.map(item => {
        const m = item.member;
        const spent = item.total;
        const share = totalFamilyExpense > 0 ? Math.round((spent / totalFamilyExpense) * 100) : 0;

        return `
          <div class="member-spending-row">
            <div class="member-identity">
              <div class="avatar" style="background-color: ${m.avatarColor}">${m.avatarInitial}</div>
              <div class="member-details-text">
                <span class="member-name-text">${m.name}</span>
                <span class="member-role-tag">${m.role}</span>
              </div>
            </div>
            <div>
              <div class="member-amount-text">${currency}${spent.toLocaleString('en-IN')}</div>
              <div class="member-share-pill">${share}% of period total</div>
            </div>
          </div>
        `;
      }).join('');
    }

    renderRecentTransactions(currency, filter = {}) {
      const container = document.getElementById('dashboardRecentTxTable');
      if (!container) return;

      const transactions = store.getTransactions(filter).slice(0, 5);

      if (transactions.length === 0) {
        container.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="empty-state">
                <div class="empty-state-icon">💸</div>
                <h3>No transactions recorded</h3>
                <p>No transactions found for ${this.getOverviewPeriodLabel()}.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      container.innerHTML = transactions.map(t => {
        const member = store.getMember(t.memberId);
        const catObj = DEFAULT_CATEGORIES.find(c => c.name === t.category) || { icon: '🏷️' };
        const isIncome = t.type === 'income';

        return `
          <tr>
            <td>
              <div class="tx-title-cell">
                <div class="tx-category-badge">${catObj.icon}</div>
                <div class="tx-details">
                  <span class="tx-title">${this.escapeHtml(t.title)}</span>
                  <span class="tx-notes">${t.category} • ${t.paymentMethod}</span>
                </div>
              </div>
            </td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="avatar-mini" style="background-color: ${member ? member.avatarColor : '#6366f1'}">
                  ${member ? member.avatarInitial : '?'}
                </div>
                <span>${member ? member.name : 'Unknown'}</span>
              </div>
            </td>
            <td>${t.date}</td>
            <td>
              <span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}">
                ${isIncome ? 'Income' : 'Expense'}
              </span>
            </td>
            <td class="${isIncome ? 'amount-income' : 'amount-expense'}" style="text-align: right;">
              ${isIncome ? '+' : '-'}${currency}${t.amount.toLocaleString('en-IN')}
            </td>
          </tr>
        `;
      }).join('');
    }

    renderTransactionsTable(currency = store.getSettings().currency || '₹') {
      const container = document.getElementById('transactionsTableBody');
      if (!container) return;

      const filter = {
        search: this.txSearchInput ? this.txSearchInput.value : '',
        type: this.txTypeFilter ? this.txTypeFilter.value : 'all',
        category: this.txCategoryFilter ? this.txCategoryFilter.value : 'all',
        memberId: this.txMemberFilter ? this.txMemberFilter.value : 'all'
      };

      const transactions = store.getTransactions(filter);

      if (transactions.length === 0) {
        container.innerHTML = `
          <tr>
            <td colspan="7">
              <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No matching transactions</h3>
                <p>Try clearing your filters or add a new transaction.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      container.innerHTML = transactions.map(t => {
        const member = store.getMember(t.memberId);
        const catObj = DEFAULT_CATEGORIES.find(c => c.name === t.category) || { icon: '🏷️' };
        const isIncome = t.type === 'income';

        return `
          <tr>
            <td>
              <div class="tx-title-cell">
                <div class="tx-category-badge">${catObj.icon}</div>
                <div class="tx-details">
                  <span class="tx-title">${this.escapeHtml(t.title)}</span>
                  ${t.notes ? `<span class="tx-notes">${this.escapeHtml(t.notes)}</span>` : ''}
                </div>
              </div>
            </td>
            <td>${t.category}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="avatar-mini" style="background-color: ${member ? member.avatarColor : '#6366f1'}">
                  ${member ? member.avatarInitial : '?'}
                </div>
                <span>${member ? member.name : 'Unknown'}</span>
              </div>
            </td>
            <td>${t.paymentMethod}</td>
            <td>${t.date}</td>
            <td class="${isIncome ? 'amount-income' : 'amount-expense'}">
              ${isIncome ? '+' : '-'}${currency}${t.amount.toLocaleString('en-IN')}
            </td>
            <td>
              <div class="action-buttons-cell">
                <button class="icon-btn btn-sm" title="Edit" onclick="window.famApp.openTxModal('${t.id}')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="icon-btn btn-sm" title="Delete" onclick="window.famApp.deleteTx('${t.id}')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // --- 1. RENDER BANK ACCOUNTS ---
    renderBankAccounts(currency) {
      const container = document.getElementById('bankAccountsCardsGrid');
      if (!container) return;

      const accounts = store.getBankAccounts();
      if (accounts.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🏦</div>
            <h3>No Bank Accounts Added</h3>
            <p>Add your family savings accounts, salary deposits, and fixed deposits to track total liquid cash.</p>
            <button class="btn btn-primary" onclick="window.famApp.openAccountModal()">+ Add First Account</button>
          </div>
        `;
        return;
      }

      container.innerHTML = accounts.map(a => {
        const member = store.getMember(a.holderMemberId);
        return `
          <div class="bank-card">
            <div class="bank-card-header">
              <div class="bank-identity">
                <div class="bank-icon">🏦</div>
                <div>
                  <h4 class="bank-name">${this.escapeHtml(a.bankName)}</h4>
                  <span class="bank-type-tag">${a.accountType}</span>
                </div>
              </div>
              <div class="action-buttons-cell">
                <button class="icon-btn btn-sm" onclick="window.famApp.openAccountModal('${a.id}')" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="icon-btn btn-sm" onclick="window.famApp.deleteAccount('${a.id}')" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div class="bank-balance-box">
              <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Available Balance</span>
              <div class="bank-balance-val">${currency}${a.balance.toLocaleString('en-IN')}</div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
              <span class="bank-card-number">
                •••• ${a.accountNumberLast4 || 'XXXX'}
              </span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <div class="avatar-mini" style="background-color: ${member ? member.avatarColor : '#6366f1'}; width: 20px; height: 20px; font-size: 0.6rem;">
                  ${member ? member.avatarInitial : '?'}
                </div>
                <span style="color: var(--text-secondary);">${member ? member.name : 'Unknown'}</span>
              </div>
            </div>

            ${a.branch || a.ifscCode ? `
              <div style="font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 8px;">
                ${a.branch ? `<span>${this.escapeHtml(a.branch)}</span>` : ''}
                ${a.ifscCode ? `<span> • IFSC: ${this.escapeHtml(a.ifscCode)}</span>` : ''}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    // --- 2. RENDER PROPERTIES & LAND ---
    renderProperties(currency) {
      const container = document.getElementById('propertiesCardsGrid');
      if (!container) return;

      const properties = store.getProperties();
      if (properties.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🏡</div>
            <h3>No Properties or Land Recorded</h3>
            <p>Maintain an accurate record of apartments, ancestral farmland, residential plots, and market gains.</p>
            <button class="btn btn-primary" onclick="window.famApp.openPropertyModal()">+ Add First Property</button>
          </div>
        `;
        return;
      }

      container.innerHTML = properties.map(p => {
        const member = store.getMember(p.ownerMemberId);
        const gain = (p.currentValue || 0) - (p.purchasePrice || 0);
        const gainPercent = p.purchasePrice > 0 ? Math.round((gain / p.purchasePrice) * 100) : 0;
        let icon = '🏠';
        if (p.propertyType.includes('Agricultural')) icon = '🌾';
        else if (p.propertyType.includes('Plot')) icon = '📐';
        else if (p.propertyType.includes('Villa')) icon = '🏡';
        else if (p.propertyType.includes('Commercial')) icon = '🏢';

        return `
          <div class="property-card">
            <div class="property-card-top">
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div class="property-icon-box">${icon}</div>
                <div class="property-meta">
                  <h4>${this.escapeHtml(p.propertyName)}</h4>
                  <span>${this.escapeHtml(p.location)}</span>
                </div>
              </div>
              <div class="action-buttons-cell">
                <button class="icon-btn btn-sm" onclick="window.famApp.openPropertyModal('${p.id}')" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="icon-btn btn-sm" onclick="window.famApp.deleteProperty('${p.id}')" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div class="property-chips">
              <span class="property-chip">🏷️ ${p.propertyType}</span>
              ${p.area ? `<span class="property-chip">📏 ${p.area} ${p.areaUnit}</span>` : ''}
              ${p.surveyNo ? `<span class="property-chip">📜 ${this.escapeHtml(p.surveyNo)}</span>` : ''}
            </div>

            <div class="property-valuation-box">
              <div class="property-val-item">
                <span class="property-val-label">Purchase Price</span>
                <span class="property-val-amount" style="font-size: 1rem; color: var(--text-secondary);">${currency}${p.purchasePrice.toLocaleString('en-IN')}</span>
              </div>
              <div class="property-val-item">
                <span class="property-val-label">Estimated Market Value</span>
                <span class="property-val-amount" style="color: var(--income);">${currency}${p.currentValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="property-gain-badge">
                ▲ +${gainPercent}% appreciation (+${currency}${gain.toLocaleString('en-IN')})
              </span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <div class="avatar-mini" style="background-color: ${member ? member.avatarColor : '#6366f1'}; width: 20px; height: 20px; font-size: 0.6rem;">
                  ${member ? member.avatarInitial : '?'}
                </div>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">${member ? member.name : 'Family'}</span>
              </div>
            </div>

            ${p.notes ? `
              <div style="font-size: 0.76rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 8px;">
                ${this.escapeHtml(p.notes)}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    // --- 3. RENDER RENTAL PROPERTIES ---
    renderRentalProperties(currency) {
      const container = document.getElementById('rentalsCardsGrid');
      if (!container) return;

      const rentals = store.getRentalProperties();
      if (rentals.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🏘️</div>
            <h3>No Rental Properties</h3>
            <p>Track rent collection from residential and commercial tenants along with security deposits.</p>
            <button class="btn btn-primary" onclick="window.famApp.openRentalModal()">+ Add Rental Unit</button>
          </div>
        `;
        return;
      }

      container.innerHTML = rentals.map(r => {
        const isReceived = r.paymentStatus === 'Received';
        return `
          <div class="rental-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 700;">${this.escapeHtml(r.propertyName)}</h4>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${this.escapeHtml(r.address || '')}</span>
              </div>
              <div class="action-buttons-cell">
                <button class="icon-btn btn-sm" onclick="window.famApp.openRentalModal('${r.id}')" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="icon-btn btn-sm" onclick="window.famApp.deleteRental('${r.id}')" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div class="rental-tenant-box">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Tenant</span>
                <div style="font-weight: 600; font-size: 0.92rem;">${this.escapeHtml(r.tenantName)}</div>
                ${r.tenantContact ? `<span style="font-size: 0.76rem; color: var(--primary);">${this.escapeHtml(r.tenantContact)}</span>` : ''}
              </div>
              <button class="status-badge ${isReceived ? 'status-received' : 'status-pending'}" onclick="window.famApp.toggleRentalStatus('${r.id}')" title="Click to toggle status">
                ${isReceived ? '✓ Rent Received' : '⏳ Pending Rent'}
              </button>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: baseline; background: var(--bg-surface-elevated); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Monthly Rent</span>
                <div class="rental-rent-val">${currency}${r.monthlyRent.toLocaleString('en-IN')}<span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">/mo</span></div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Deposit Held</span>
                <div style="font-weight: 700; font-size: 1.05rem;">${currency}${r.securityDeposit.toLocaleString('en-IN')}</div>
              </div>
            </div>

            ${r.leaseEndDate ? `
              <div style="font-size: 0.78rem; color: var(--text-secondary); display: flex; justify-content: space-between;">
                <span>Lease Valid Through:</span>
                <strong>${r.leaseEndDate}</strong>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    // --- 4. RENDER LOANS & EMIS ---
    renderEmis(currency) {
      const container = document.getElementById('emisCardsGrid');
      if (!container) return;

      const emis = store.getEmis();
      if (emis.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">💳</div>
            <h3>No Active Loans or EMIs</h3>
            <p>Keep track of home loans, car loans, interest rates, and monthly debt repayments.</p>
            <button class="btn btn-primary" onclick="window.famApp.openEmiModal()">+ Add Loan / EMI</button>
          </div>
        `;
        return;
      }

      container.innerHTML = emis.map(e => {
        const member = store.getMember(e.linkedMemberId);
        return `
          <div class="emi-card">
            <div class="emi-header">
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 700;">${this.escapeHtml(e.loanName)}</h4>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${this.escapeHtml(e.lender)} • ${e.loanType}</span>
              </div>
              <div class="action-buttons-cell">
                <button class="icon-btn btn-sm" onclick="window.famApp.openEmiModal('${e.id}')" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="icon-btn btn-sm" onclick="window.famApp.deleteEmi('${e.id}')" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: baseline;">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Monthly EMI Outflow</span>
                <div class="emi-amount-highlight">${currency}${e.monthlyEmi.toLocaleString('en-IN')}<span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">/mo</span></div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Outstanding</span>
                <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">${currency}${e.outstandingPrincipal.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div class="emi-stats-row">
              <div class="emi-stat-item">
                <span>Original Loan</span>
                <strong>${currency}${e.originalPrincipal.toLocaleString('en-IN')}</strong>
              </div>
              <div class="emi-stat-item">
                <span>Interest</span>
                <strong>${e.interestRate}%</strong>
              </div>
              <div class="emi-stat-item">
                <span>Tenure Left</span>
                <strong>${e.remainingTenureMonths} Mo</strong>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
              <span>Borrower:</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <div class="avatar-mini" style="background-color: ${member ? member.avatarColor : '#6366f1'}; width: 20px; height: 20px; font-size: 0.6rem;">
                  ${member ? member.avatarInitial : '?'}
                </div>
                <span style="color: var(--text-secondary);">${member ? member.name : 'Unknown'}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // --- 5. RENDER POLICIES & INSURANCE ---
    renderPolicies(currency) {
      const container = document.getElementById('policiesCardsGrid');
      if (!container) return;

      const policies = store.getPolicies();
      if (policies.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🛡️</div>
            <h3>No Insurance Policies Added</h3>
            <p>Maintain your term life, medical health floaters, and vehicle covers in one place.</p>
            <button class="btn btn-primary" onclick="window.famApp.openPolicyModal()">+ Add Policy</button>
          </div>
        `;
        return;
      }

      container.innerHTML = policies.map(p => {
        const member = store.getMember(p.insuredMemberId);
        return `
          <div class="policy-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h4 style="font-size: 1.1rem; font-weight: 700;">${this.escapeHtml(p.policyName)}</h4>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${this.escapeHtml(p.provider)} • ${p.policyType}</span>
              </div>
              <div class="action-buttons-cell">
                <button class="icon-btn btn-sm" onclick="window.famApp.openPolicyModal('${p.id}')" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="icon-btn btn-sm" onclick="window.famApp.deletePolicy('${p.id}')" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div class="policy-cover-box">
              <div>
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Sum Insured / Total Cover</span>
                <div class="policy-cover-amount">${currency}${p.sumInsured.toLocaleString('en-IN')}</div>
              </div>
              <span class="badge badge-income">${p.status || 'Active'}</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; font-size: 0.88rem; background: var(--bg-surface-elevated); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <span style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">Premium</span>
                <div style="font-weight: 700; font-size: 0.92rem;">${currency}${p.premiumAmount.toLocaleString('en-IN')} <span style="font-size: 0.72rem; color: var(--text-muted);">(${p.premiumFrequency})</span></div>
              </div>
              <div style="text-align: center;">
                <span style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">Next Due</span>
                <div style="font-weight: 600; color: var(--warning); font-size: 0.85rem;">${p.nextDueDate || 'N/A'}</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">Maturity Date</span>
                <div style="font-weight: 600; color: #10b981; font-size: 0.85rem;">${p.maturityDate || 'Lifetime / Ongoing'}</div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted);">
              <span>Insured:</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <div class="avatar-mini" style="background-color: ${member ? member.avatarColor : '#6366f1'}; width: 20px; height: 20px; font-size: 0.6rem;">
                  ${member ? member.avatarInitial : '?'}
                </div>
                <span style="color: var(--text-secondary);">${member ? member.name : 'Entire Family'}</span>
              </div>
            </div>

            ${p.policyNumber ? `
              <div style="font-size: 0.75rem; font-family: monospace; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 6px;">
                Policy No: ${this.escapeHtml(p.policyNumber)}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    // --- 6. RENDER INVESTMENTS (MUTUAL FUNDS, STOCKS, ETFS, GOLD) ---
    renderInvestments(currency) {
      const container = document.getElementById('investmentsCardsGrid');
      if (!container) return;

      const wealth = store.getWealthSummary();

      // Update stat cards
      const valEl = document.getElementById('invStatCurrentValue');
      const costEl = document.getElementById('invStatInvestedCost');
      const gainEl = document.getElementById('invStatTotalGain');
      const gainPctEl = document.getElementById('invStatGainPercent');
      const sipEl = document.getElementById('invStatMonthlySip');

      if (valEl) valEl.textContent = `${currency}${wealth.totalInvestments.toLocaleString('en-IN')}`;
      if (costEl) costEl.textContent = `${currency}${wealth.totalInvestedCost.toLocaleString('en-IN')}`;
      if (gainEl) {
        const sign = wealth.totalInvestmentGain >= 0 ? '+' : '';
        gainEl.textContent = `${sign}${currency}${wealth.totalInvestmentGain.toLocaleString('en-IN')}`;
        gainEl.style.color = wealth.totalInvestmentGain >= 0 ? '#10b981' : 'var(--expense)';
      }
      if (gainPctEl) {
        const sign = wealth.totalInvestmentGain >= 0 ? '+' : '';
        gainPctEl.textContent = `${sign}${wealth.investmentGainPercent}% overall return`;
        gainPctEl.style.color = wealth.totalInvestmentGain >= 0 ? '#10b981' : 'var(--expense)';
      }
      if (sipEl) sipEl.textContent = `${currency}${wealth.totalMonthlySips.toLocaleString('en-IN')}/mo`;

      // Filter investments
      let investments = store.getInvestments(this.activeInvFilter);
      if (this.activeMemberFilter !== 'all') {
        investments = investments.filter(inv => inv.holderMemberId === this.activeMemberFilter);
      }

      if (investments.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">📈</div>
            <h3>No Investments Found</h3>
            <p>Add Mutual Funds, direct Equity stocks, ETFs, or Sovereign Gold Bonds to manage and track your family wealth.</p>
            <button class="btn btn-primary" onclick="window.famApp.openInvestmentModal()">+ Add First Investment</button>
          </div>
        `;
        return;
      }

      container.innerHTML = investments.map(inv => {
        const member = store.getMember(inv.holderMemberId);
        const gain = (inv.currentValue || 0) - (inv.investedAmount || 0);
        const gainPct = inv.investedAmount > 0 ? ((gain / inv.investedAmount) * 100).toFixed(1) : 0;
        const isPositive = gain >= 0;

        let icon = '📈';
        let badgeClass = 'inv-type-mf';
        if (inv.type === 'Stock / Equity') {
          icon = '📊';
          badgeClass = 'inv-type-stock';
        } else if (inv.type === 'ETF / Index Fund') {
          icon = '🌐';
          badgeClass = 'inv-type-etf';
        } else if (inv.type === 'SGB / Gold') {
          icon = '🪙';
          badgeClass = 'inv-type-gold';
        } else if (inv.type === 'Other Asset') {
          icon = '💎';
          badgeClass = 'inv-type-other';
        }

        return `
          <div class="investment-card">
            <div class="inv-card-top">
              <div class="inv-identity">
                <div class="inv-icon-box">${icon}</div>
                <div>
                  <h4 class="inv-name">${this.escapeHtml(inv.name)}</h4>
                  <span class="inv-type-badge ${badgeClass}">${inv.type}</span>
                </div>
              </div>
              <div class="action-buttons-cell">
                <button class="icon-btn btn-sm" onclick="window.famApp.openInvestmentModal('${inv.id}')" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="icon-btn btn-sm" onclick="window.famApp.deleteInvestment('${inv.id}')" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div class="inv-chips">
              ${inv.platform ? `<span class="inv-chip">🏢 ${this.escapeHtml(inv.platform)}</span>` : ''}
              ${inv.symbolOrFolio ? `<span class="inv-chip">📜 ${this.escapeHtml(inv.symbolOrFolio)}</span>` : ''}
              ${inv.unitsOrQty ? `<span class="inv-chip">📦 ${this.escapeHtml(inv.unitsOrQty)}</span>` : ''}
            </div>

            <div class="inv-valuation-box">
              <div>
                <span class="inv-val-label">Invested Cost</span>
                <span class="inv-val-amount" style="color: var(--text-secondary);">${currency}${inv.investedAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style="text-align: right;">
                <span class="inv-val-label">Current Value</span>
                <span class="inv-val-amount" style="color: var(--text-primary);">${currency}${inv.currentValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <span class="inv-return-pill ${isPositive ? 'inv-return-positive' : 'inv-return-negative'}">
                ${isPositive ? '▲ +' : '▼ '}${gainPct}% (${isPositive ? '+' : ''}${currency}${gain.toLocaleString('en-IN')})
              </span>

              ${inv.sipAmount > 0 ? `
                <span class="inv-sip-badge" title="Active monthly SIP">
                  🔄 ${currency}${inv.sipAmount.toLocaleString('en-IN')}/mo SIP
                </span>
              ` : ''}

              <div style="display: flex; align-items: center; gap: 6px; margin-left: auto;">
                <div class="avatar-mini" style="background-color: ${member ? member.avatarColor : '#6366f1'}; width: 20px; height: 20px; font-size: 0.6rem;">
                  ${member ? member.avatarInitial : '?'}
                </div>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">${member ? member.name : 'Family'}</span>
              </div>
            </div>

            ${inv.notes ? `
              <div style="font-size: 0.76rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 8px;">
                ${this.escapeHtml(inv.notes)}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    // --- BUDGETS & GOALS RENDERING ---
    renderBudgets(currency) {
      const container = document.getElementById('budgetsCardsGrid');
      if (!container) return;

      const budgets = store.getBudgets();
      const currentMonth = new Date().toISOString().substring(0, 7);
      const monthExpenses = store.getTransactions({ month: currentMonth, type: 'expense' });

      if (budgets.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">📊</div>
            <h3>No Monthly Budgets Set</h3>
            <p>Establish spending limits for your family categories to keep finances on track.</p>
            <button class="btn btn-primary" onclick="window.famApp.openBudgetModal()">+ Create First Budget</button>
          </div>
        `;
        return;
      }

      container.innerHTML = budgets.map(b => {
        const catObj = DEFAULT_CATEGORIES.find(c => c.name === b.category) || { icon: '🏷️' };
        const spent = monthExpenses
          .filter(t => t.category === b.category)
          .reduce((sum, t) => sum + t.amount, 0);

        const percent = Math.round((spent / b.monthlyLimit) * 100);
        const remaining = b.monthlyLimit - spent;

        let statusClass = 'normal';
        let statusText = 'On Track';
        let badgeStyle = 'background: var(--income-bg); color: var(--income);';

        if (percent >= 100) {
          statusClass = 'danger';
          statusText = 'Over Budget';
          badgeStyle = 'background: var(--expense-bg); color: var(--expense);';
        } else if (percent >= 80) {
          statusClass = 'warning';
          statusText = 'Near Limit';
          badgeStyle = 'background: var(--warning-bg); color: var(--warning);';
        }

        return `
          <div class="budget-card">
            <div class="budget-card-header">
              <div class="budget-category-info">
                <div class="budget-icon">${catObj.icon}</div>
                <div>
                  <h4 class="budget-title">${b.category}</h4>
                  <span class="budget-status-pill" style="${badgeStyle}">${statusText}</span>
                </div>
              </div>
              <div class="action-buttons-cell">
                <button class="icon-btn btn-sm" onclick="window.famApp.openBudgetModal('${b.category}', ${b.monthlyLimit})" title="Edit limit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="icon-btn btn-sm" onclick="window.famApp.deleteBudget('${b.id}')" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div class="budget-amounts">
              <div>
                <span style="font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase;">Spent this month</span>
                <div class="budget-spent">${currency}${spent.toLocaleString('en-IN')}</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase;">Limit</span>
                <div class="budget-limit">${currency}${b.monthlyLimit.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div class="budget-progress-container">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill ${statusClass}" style="width: ${Math.min(100, percent)}%"></div>
              </div>
              <div class="budget-remaining-text">
                <span>${percent}% used</span>
                <span>${remaining >= 0 ? `${currency}${remaining.toLocaleString('en-IN')} left` : `${currency}${Math.abs(remaining).toLocaleString('en-IN')} over`}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    renderGoals(currency) {
      const container = document.getElementById('goalsCardsGrid');
      if (!container) return;

      const goals = store.getGoals();

      if (goals.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🎯</div>
            <h3>No Family Savings Goals</h3>
            <p>Plan ahead for vacations, renovations, or an emergency fund together.</p>
            <button class="btn btn-primary" onclick="window.famApp.openGoalModal()">+ Create Goal</button>
          </div>
        `;
        return;
      }

      container.innerHTML = goals.map(g => {
        const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));

        return `
          <div class="goal-card">
            <div class="goal-card-top">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="goal-icon-badge">${g.icon || '🎯'}</div>
                <div>
                  <h4 class="goal-name">${this.escapeHtml(g.name)}</h4>
                  ${g.targetDate ? `<span class="goal-target-date">Target: ${g.targetDate}</span>` : ''}
                </div>
              </div>
              <button class="icon-btn btn-sm" onclick="window.famApp.deleteGoal('${g.id}')" title="Delete Goal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>

            <div class="goal-numbers">
              <div>
                <span style="font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase;">Saved</span>
                <div class="goal-current">${currency}${g.currentAmount.toLocaleString('en-IN')}</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase;">Target</span>
                <div class="goal-target">${currency}${g.targetAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div class="budget-progress-container">
              <div class="progress-bar-bg">
                <div class="progress-bar-fill normal" style="width: ${percent}%; background: linear-gradient(90deg, #10b981, #06b6d4);"></div>
              </div>
              <div class="budget-remaining-text">
                <span>${percent}% achieved</span>
                <span>${currency}${(g.targetAmount - g.currentAmount > 0 ? g.targetAmount - g.currentAmount : 0).toLocaleString('en-IN')} remaining</span>
              </div>
            </div>

            <div class="goal-actions">
              <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="window.famApp.openDepositModal('${g.id}', '${this.escapeHtml(g.name)}')">
                + Add Deposit
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    renderMembers(currency) {
      const container = document.getElementById('membersCardsGrid');
      if (!container) return;

      const members = store.getMembers();
      const currentMonth = new Date().toISOString().substring(0, 7);
      const transactions = store.getTransactions({ month: currentMonth });

      container.innerHTML = members.map(m => {
        const memberTxs = transactions.filter(t => t.memberId === m.id);
        const spent = memberTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const earned = memberTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

        return `
          <div class="member-card">
            <div class="member-card-header">
              <div class="member-avatar-lg" style="background-color: ${m.avatarColor}">
                ${m.avatarInitial}
              </div>
              <div class="member-meta">
                <h3>${this.escapeHtml(m.name)}</h3>
                <span>${m.role}</span>
              </div>
              ${members.length > 1 ? `
                <button class="icon-btn btn-sm" onclick="window.famApp.deleteMember('${m.id}')" title="Remove member">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: var(--expense);"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              ` : ''}
            </div>

            <div class="member-stats-box">
              <div class="member-stat">
                <span class="member-stat-label">Spent (This Mo.)</span>
                <span class="member-stat-value expense-val">${currency}${spent.toLocaleString('en-IN')}</span>
              </div>
              <div class="member-stat">
                <span class="member-stat-label">Income (This Mo.)</span>
                <span class="member-stat-value income-val">${currency}${earned.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // --- MODAL OPENERS ---
    openTxModal(txId = null) {
      this.editingTxId = txId;
      const modalTitle = document.getElementById('txModalTitle');
      const form = this.txForm;
      form.reset();

      const expenseBtn = document.getElementById('typeExpenseBtn');
      const incomeBtn = document.getElementById('typeIncomeBtn');
      const typeInput = document.getElementById('txType');

      document.getElementById('txDate').value = new Date().toISOString().split('T')[0];

      const paymentSelect = document.getElementById('txPaymentMethod');
      paymentSelect.innerHTML = PAYMENT_METHODS.map(p => `<option value="${p}">${p}</option>`).join('');

      if (txId) {
        modalTitle.textContent = 'Edit Transaction';
        const tx = store.data.transactions.find(t => t.id === txId);
        if (tx) {
          document.getElementById('txTitle').value = tx.title;
          document.getElementById('txAmount').value = tx.amount;
          document.getElementById('txDate').value = tx.date;
          document.getElementById('txNotes').value = tx.notes || '';
          document.getElementById('txMember').value = tx.memberId;
          paymentSelect.value = tx.paymentMethod;

          typeInput.value = tx.type;
          if (tx.type === 'income') {
            incomeBtn.classList.add('active');
            expenseBtn.classList.remove('active');
            this.populateCategorySelect('txCategory', 'income');
          } else {
            expenseBtn.classList.add('active');
            incomeBtn.classList.remove('active');
            this.populateCategorySelect('txCategory', 'expense');
          }
          document.getElementById('txCategory').value = tx.category;
        }
      } else {
        modalTitle.textContent = 'Add Transaction';
        typeInput.value = 'expense';
        expenseBtn.classList.add('active');
        incomeBtn.classList.remove('active');
        this.populateCategorySelect('txCategory', 'expense');
        if (this.activeMemberFilter !== 'all') {
          document.getElementById('txMember').value = this.activeMemberFilter;
        }
      }

      this.txModal.classList.add('active');
    }

    openBudgetModal(category = '', limit = '') {
      const catSelect = document.getElementById('budgetCategorySelect');
      const expenseCategories = DEFAULT_CATEGORIES.filter(c => c.type === 'expense');
      catSelect.innerHTML = expenseCategories.map(c => `
        <option value="${c.name}">${c.icon} ${c.name}</option>
      `).join('');

      if (category) catSelect.value = category;
      document.getElementById('budgetAmountInput').value = limit || '';
      this.budgetModal.classList.add('active');
    }

    openGoalModal() {
      this.goalForm.reset();
      this.goalModal.classList.add('active');
    }

    openMemberModal() {
      this.memberForm.reset();
      this.memberModal.classList.add('active');
    }

    openDepositModal(goalId, goalName) {
      document.getElementById('depositGoalId').value = goalId;
      document.getElementById('depositGoalName').textContent = goalName;
      document.getElementById('depositAmountInput').value = '';
      this.depositModal.classList.add('active');
    }

    // Wealth Modals
    openAccountModal(accountId = null) {
      this.editingAccountId = accountId;
      const title = document.getElementById('accountModalTitle');
      this.accountForm.reset();

      if (accountId) {
        title.textContent = 'Edit Bank Account';
        const a = store.getBankAccounts().find(acc => acc.id === accountId);
        if (a) {
          document.getElementById('accBankNameInput').value = a.bankName;
          document.getElementById('accTypeSelect').value = a.accountType;
          document.getElementById('accLast4Input').value = a.accountNumberLast4 || '';
          document.getElementById('accBalanceInput').value = a.balance;
          document.getElementById('accBranchInput').value = a.branch || '';
          document.getElementById('accIfscInput').value = a.ifscCode || '';
          document.getElementById('accMemberSelect').value = a.holderMemberId;
          document.getElementById('accNotesInput').value = a.notes || '';
        }
      } else {
        title.textContent = 'Add Bank Account';
      }
      this.accountModal.classList.add('active');
    }

    openPropertyModal(propertyId = null) {
      this.editingPropertyId = propertyId;
      const title = document.getElementById('propertyModalTitle');
      this.propertyForm.reset();

      if (propertyId) {
        title.textContent = 'Edit Property / Land';
        const p = store.getProperties().find(prop => prop.id === propertyId);
        if (p) {
          document.getElementById('propNameInput').value = p.propertyName;
          document.getElementById('propTypeSelect').value = p.propertyType;
          document.getElementById('propStatusSelect').value = p.status || 'Owned';
          document.getElementById('propLocationInput').value = p.location || '';
          document.getElementById('propSurveyInput').value = p.surveyNo || '';
          document.getElementById('propAreaInput').value = p.area || '';
          document.getElementById('propAreaUnitSelect').value = p.areaUnit || 'sq.ft';
          document.getElementById('propPurchasePriceInput').value = p.purchasePrice || '';
          document.getElementById('propCurrentValInput').value = p.currentValue || '';
          document.getElementById('propYearInput').value = p.purchaseYear || '';
          document.getElementById('propOwnerSelect').value = p.ownerMemberId;
          document.getElementById('propNotesInput').value = p.notes || '';
        }
      } else {
        title.textContent = 'Add Property / Land';
      }
      this.propertyModal.classList.add('active');
    }

    openRentalModal(rentalId = null) {
      this.editingRentalId = rentalId;
      const title = document.getElementById('rentalModalTitle');
      this.rentalForm.reset();

      if (rentalId) {
        title.textContent = 'Edit Rental Property';
        const r = store.getRentalProperties().find(rent => rent.id === rentalId);
        if (r) {
          document.getElementById('rentalPropertyNameInput').value = r.propertyName;
          document.getElementById('rentalAddressInput').value = r.address || '';
          document.getElementById('rentalTenantNameInput').value = r.tenantName;
          document.getElementById('rentalTenantContactInput').value = r.tenantContact || '';
          document.getElementById('rentalMonthlyRentInput').value = r.monthlyRent;
          document.getElementById('rentalDepositInput').value = r.securityDeposit || '';
          document.getElementById('rentalLeaseStartInput').value = r.leaseStartDate || '';
          document.getElementById('rentalLeaseEndInput').value = r.leaseEndDate || '';
          document.getElementById('rentalPaymentStatusSelect').value = r.paymentStatus || 'Received';
          document.getElementById('rentalOwnerSelect').value = r.ownerMemberId;
          document.getElementById('rentalNotesInput').value = r.notes || '';
        }
      } else {
        title.textContent = 'Add Rental Property';
      }
      this.rentalModal.classList.add('active');
    }

    openEmiModal(emiId = null) {
      this.editingEmiId = emiId;
      const title = document.getElementById('emiModalTitle');
      this.emiForm.reset();

      if (emiId) {
        title.textContent = 'Edit Loan & EMI';
        const e = store.getEmis().find(item => item.id === emiId);
        if (e) {
          document.getElementById('emiLoanNameInput').value = e.loanName;
          document.getElementById('emiLoanTypeSelect').value = e.loanType;
          document.getElementById('emiLenderInput').value = e.lender;
          document.getElementById('emiMonthlyAmountInput').value = e.monthlyEmi;
          document.getElementById('emiInterestRateInput').value = e.interestRate || '';
          document.getElementById('emiOutstandingInput').value = e.outstandingPrincipal || '';
          document.getElementById('emiTenureMonthsInput').value = e.remainingTenureMonths || '';
          document.getElementById('emiMemberSelect').value = e.linkedMemberId;
          document.getElementById('emiNotesInput').value = e.notes || '';
        }
      } else {
        title.textContent = 'Add Loan & EMI';
      }
      this.emiModal.classList.add('active');
    }

    openPolicyModal(policyId = null) {
      this.editingPolicyId = policyId;
      const title = document.getElementById('policyModalTitle');
      this.policyForm.reset();

      if (policyId) {
        title.textContent = 'Edit Insurance Policy';
        const pol = store.getPolicies().find(p => p.id === policyId);
        if (pol) {
          document.getElementById('polNameInput').value = pol.policyName;
          document.getElementById('polTypeSelect').value = pol.policyType;
          document.getElementById('polProviderInput').value = pol.provider;
          document.getElementById('polNumberInput').value = pol.policyNumber || '';
          document.getElementById('polSumInsuredInput').value = pol.sumInsured;
          document.getElementById('polPremiumInput').value = pol.premiumAmount;
          document.getElementById('polFrequencySelect').value = pol.premiumFrequency || 'Annual';
          document.getElementById('polDueDateInput').value = pol.nextDueDate || '';
          document.getElementById('polMaturityDateInput').value = pol.maturityDate || '';
          document.getElementById('polMemberSelect').value = pol.insuredMemberId;
          document.getElementById('polNotesInput').value = pol.notes || '';
        }
      } else {
        title.textContent = 'Add Insurance Policy';
      }
      this.policyModal.classList.add('active');
    }

    openInvestmentModal(investmentId = null) {
      this.editingInvestmentId = investmentId;
      const title = document.getElementById('investmentModalTitle');
      this.investmentForm.reset();

      if (investmentId) {
        title.textContent = 'Edit Investment';
        const inv = store.getInvestment(investmentId);
        if (inv) {
          document.getElementById('invNameInput').value = inv.name;
          document.getElementById('invTypeSelect').value = inv.type;
          document.getElementById('invPlatformInput').value = inv.platform || '';
          document.getElementById('invSymbolInput').value = inv.symbolOrFolio || '';
          document.getElementById('invUnitsInput').value = inv.unitsOrQty || '';
          document.getElementById('invInvestedAmountInput').value = inv.investedAmount;
          document.getElementById('invCurrentValueInput').value = inv.currentValue;
          document.getElementById('invSipAmountInput').value = inv.sipAmount || 0;
          document.getElementById('invMemberSelect').value = inv.holderMemberId;
          document.getElementById('invNotesInput').value = inv.notes || '';
        }
      } else {
        title.textContent = 'Add Investment';
        document.getElementById('invSipAmountInput').value = 0;
      }
      this.investmentModal.classList.add('active');
    }

    closeAllModals() {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      this.editingTxId = null;
      this.editingAccountId = null;
      this.editingPropertyId = null;
      this.editingRentalId = null;
      this.editingEmiId = null;
      this.editingPolicyId = null;
      this.editingInvestmentId = null;
    }

    // --- SUBMISSION HANDLERS ---
    handleTxSubmit(e) {
      e.preventDefault();
      const title = document.getElementById('txTitle').value.trim();
      const amount = parseFloat(document.getElementById('txAmount').value);
      const type = document.getElementById('txType').value;
      const category = document.getElementById('txCategory').value;
      const memberId = document.getElementById('txMember').value;
      const paymentMethod = document.getElementById('txPaymentMethod').value;
      const date = document.getElementById('txDate').value;
      const notes = document.getElementById('txNotes').value.trim();

      if (!title || isNaN(amount) || amount <= 0) {
        this.showToast('Please enter a valid title and amount.', 'error');
        return;
      }

      if (this.editingTxId) {
        store.updateTransaction(this.editingTxId, {
          title, amount, type, category, memberId, paymentMethod, date, notes
        });
        this.showToast('Transaction updated');
      } else {
        store.addTransaction({
          title, amount, type, category, memberId, paymentMethod, date, notes
        });
        this.showToast('Transaction added');
      }

      this.closeAllModals();
    }

    handleAccountSubmit(e) {
      e.preventDefault();
      const bankName = document.getElementById('accBankNameInput').value.trim();
      const accountType = document.getElementById('accTypeSelect').value;
      const accountNumberLast4 = document.getElementById('accLast4Input').value.trim();
      const balance = parseFloat(document.getElementById('accBalanceInput').value);
      const branch = document.getElementById('accBranchInput').value.trim();
      const ifscCode = document.getElementById('accIfscInput').value.trim();
      const holderMemberId = document.getElementById('accMemberSelect').value;
      const notes = document.getElementById('accNotesInput').value.trim();

      if (!bankName || isNaN(balance)) {
        this.showToast('Please provide bank name and balance.', 'error');
        return;
      }

      if (this.editingAccountId) {
        store.updateBankAccount(this.editingAccountId, {
          bankName, accountType, accountNumberLast4, balance, branch, ifscCode, holderMemberId, notes
        });
        this.showToast('Bank account updated');
      } else {
        store.addBankAccount({
          bankName, accountType, accountNumberLast4, balance, branch, ifscCode, holderMemberId, notes
        });
        this.showToast('Bank account added');
      }
      this.closeAllModals();
    }

    handlePropertySubmit(e) {
      e.preventDefault();
      const propertyName = document.getElementById('propNameInput').value.trim();
      const propertyType = document.getElementById('propTypeSelect').value;
      const status = document.getElementById('propStatusSelect').value;
      const location = document.getElementById('propLocationInput').value.trim();
      const surveyNo = document.getElementById('propSurveyInput').value.trim();
      const area = document.getElementById('propAreaInput').value.trim();
      const areaUnit = document.getElementById('propAreaUnitSelect').value;
      const purchasePrice = parseFloat(document.getElementById('propPurchasePriceInput').value) || 0;
      const currentValue = parseFloat(document.getElementById('propCurrentValInput').value) || purchasePrice;
      const purchaseYear = document.getElementById('propYearInput').value.trim();
      const ownerMemberId = document.getElementById('propOwnerSelect').value;
      const notes = document.getElementById('propNotesInput').value.trim();

      if (!propertyName || !location) {
        this.showToast('Please enter property name and location.', 'error');
        return;
      }

      if (this.editingPropertyId) {
        store.updateProperty(this.editingPropertyId, {
          propertyName, propertyType, status, location, surveyNo, area, areaUnit,
          purchasePrice, currentValue, purchaseYear, ownerMemberId, notes
        });
        this.showToast('Property updated');
      } else {
        store.addProperty({
          propertyName, propertyType, status, location, surveyNo, area, areaUnit,
          purchasePrice, currentValue, purchaseYear, ownerMemberId, notes
        });
        this.showToast('Property added to registry');
      }
      this.closeAllModals();
    }

    handleRentalSubmit(e) {
      e.preventDefault();
      const propertyName = document.getElementById('rentalPropertyNameInput').value.trim();
      const address = document.getElementById('rentalAddressInput').value.trim();
      const tenantName = document.getElementById('rentalTenantNameInput').value.trim();
      const tenantContact = document.getElementById('rentalTenantContactInput').value.trim();
      const monthlyRent = parseFloat(document.getElementById('rentalMonthlyRentInput').value);
      const securityDeposit = parseFloat(document.getElementById('rentalDepositInput').value) || 0;
      const leaseStartDate = document.getElementById('rentalLeaseStartInput').value;
      const leaseEndDate = document.getElementById('rentalLeaseEndInput').value;
      const paymentStatus = document.getElementById('rentalPaymentStatusSelect').value;
      const ownerMemberId = document.getElementById('rentalOwnerSelect').value;
      const notes = document.getElementById('rentalNotesInput').value.trim();

      if (!propertyName || !tenantName || isNaN(monthlyRent) || monthlyRent <= 0) {
        this.showToast('Please enter property, tenant name, and valid monthly rent.', 'error');
        return;
      }

      if (this.editingRentalId) {
        store.updateRentalProperty(this.editingRentalId, {
          propertyName, address, tenantName, tenantContact, monthlyRent, securityDeposit,
          leaseStartDate, leaseEndDate, paymentStatus, ownerMemberId, notes
        });
        this.showToast('Rental property updated');
      } else {
        store.addRentalProperty({
          propertyName, address, tenantName, tenantContact, monthlyRent, securityDeposit,
          leaseStartDate, leaseEndDate, paymentStatus, ownerMemberId, notes
        });
        this.showToast('Rental property added');
      }
      this.closeAllModals();
    }

    handleEmiSubmit(e) {
      e.preventDefault();
      const loanName = document.getElementById('emiLoanNameInput').value.trim();
      const loanType = document.getElementById('emiLoanTypeSelect').value;
      const lender = document.getElementById('emiLenderInput').value.trim();
      const monthlyEmi = parseFloat(document.getElementById('emiMonthlyAmountInput').value);
      const interestRate = parseFloat(document.getElementById('emiInterestRateInput').value) || 0;
      const originalPrincipal = parseFloat(document.getElementById('emiOutstandingInput').value) || 0;
      const outstandingPrincipal = originalPrincipal;
      const remainingTenureMonths = parseInt(document.getElementById('emiTenureMonthsInput').value) || 0;
      const linkedMemberId = document.getElementById('emiMemberSelect').value;
      const notes = document.getElementById('emiNotesInput').value.trim();

      if (!loanName || isNaN(monthlyEmi) || monthlyEmi <= 0) {
        this.showToast('Please enter loan name and monthly EMI amount.', 'error');
        return;
      }

      if (this.editingEmiId) {
        store.updateEmi(this.editingEmiId, {
          loanName, loanType, lender, monthlyEmi, interestRate, originalPrincipal,
          outstandingPrincipal, remainingTenureMonths, linkedMemberId, notes
        });
        this.showToast('Loan EMI updated');
      } else {
        store.addEmi({
          loanName, loanType, lender, monthlyEmi, interestRate, originalPrincipal,
          outstandingPrincipal, remainingTenureMonths, linkedMemberId, notes
        });
        this.showToast('Loan EMI added');
      }
      this.closeAllModals();
    }

    handlePolicySubmit(e) {
      e.preventDefault();
      const policyName = document.getElementById('polNameInput').value.trim();
      const policyType = document.getElementById('polTypeSelect').value;
      const provider = document.getElementById('polProviderInput').value.trim();
      const policyNumber = document.getElementById('polNumberInput').value.trim();
      const sumInsured = parseFloat(document.getElementById('polSumInsuredInput').value) || 0;
      const premiumAmount = parseFloat(document.getElementById('polPremiumInput').value) || 0;
      const premiumFrequency = document.getElementById('polFrequencySelect').value;
      const nextDueDate = document.getElementById('polDueDateInput').value;
      const maturityDate = document.getElementById('polMaturityDateInput').value;
      const insuredMemberId = document.getElementById('polMemberSelect').value;
      const notes = document.getElementById('polNotesInput').value.trim();

      if (!policyName || !provider || sumInsured <= 0) {
        this.showToast('Please enter policy name, provider, and sum insured.', 'error');
        return;
      }

      if (this.editingPolicyId) {
        store.updatePolicy(this.editingPolicyId, {
          policyName, policyType, provider, policyNumber, sumInsured, premiumAmount,
          premiumFrequency, nextDueDate, maturityDate, insuredMemberId, notes
        });
        this.showToast('Insurance policy updated');
      } else {
        store.addPolicy({
          policyName, policyType, provider, policyNumber, sumInsured, premiumAmount,
          premiumFrequency, nextDueDate, maturityDate, insuredMemberId, notes
        });
        this.showToast('Insurance policy added');
      }
      this.closeAllModals();
    }

    handleInvestmentSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('invNameInput').value.trim();
      const type = document.getElementById('invTypeSelect').value;
      const platform = document.getElementById('invPlatformInput').value.trim();
      const symbolOrFolio = document.getElementById('invSymbolInput').value.trim();
      const unitsOrQty = document.getElementById('invUnitsInput').value.trim();
      const investedAmount = parseFloat(document.getElementById('invInvestedAmountInput').value) || 0;
      const currentValue = parseFloat(document.getElementById('invCurrentValueInput').value) || 0;
      const sipAmount = parseFloat(document.getElementById('invSipAmountInput').value) || 0;
      const holderMemberId = document.getElementById('invMemberSelect').value;
      const notes = document.getElementById('invNotesInput').value.trim();

      if (!name || isNaN(investedAmount) || isNaN(currentValue)) {
        this.showToast('Please enter asset name, invested amount, and current valuation.', 'error');
        return;
      }

      if (this.editingInvestmentId) {
        store.updateInvestment(this.editingInvestmentId, {
          name, type, platform, symbolOrFolio, unitsOrQty, investedAmount, currentValue, sipAmount, holderMemberId, notes
        });
        this.showToast('Investment updated');
      } else {
        store.addInvestment({
          name, type, platform, symbolOrFolio, unitsOrQty, investedAmount, currentValue, sipAmount, holderMemberId, notes
        });
        this.showToast('Investment added to portfolio');
      }
      this.closeAllModals();
    }

    handleBudgetSubmit(e) {
      e.preventDefault();
      const category = document.getElementById('budgetCategorySelect').value;
      const limit = parseFloat(document.getElementById('budgetAmountInput').value);

      if (isNaN(limit) || limit <= 0) {
        this.showToast('Please enter a valid budget limit amount.', 'error');
        return;
      }

      store.saveBudget(category, limit);
      this.showToast(`Budget for ${category} saved`);
      this.closeAllModals();
    }

    handleGoalSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('goalNameInput').value.trim();
      const targetAmount = parseFloat(document.getElementById('goalTargetInput').value);
      const currentAmount = parseFloat(document.getElementById('goalCurrentInput').value) || 0;
      const targetDate = document.getElementById('goalDateInput').value;
      const icon = document.getElementById('goalIconInput').value.trim() || '🎯';

      if (!name || isNaN(targetAmount) || targetAmount <= 0) {
        this.showToast('Please enter a valid goal name and target amount.', 'error');
        return;
      }

      store.addGoal({ name, targetAmount, currentAmount, targetDate, icon });
      this.showToast(`Savings goal "${name}" created`);
      this.closeAllModals();
    }

    handleMemberSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('memberNameInput').value.trim();
      const role = document.getElementById('memberRoleInput').value.trim() || 'Member';
      const avatarColor = document.getElementById('memberColorInput').value || '#6366f1';

      if (!name) {
        this.showToast('Please enter a member name.', 'error');
        return;
      }

      store.addMember({ name, role, avatarColor });
      this.showToast(`Added ${name} to family`);
      this.closeAllModals();
    }

    handleDepositSubmit(e) {
      e.preventDefault();
      const goalId = document.getElementById('depositGoalId').value;
      const amount = parseFloat(document.getElementById('depositAmountInput').value);

      if (isNaN(amount) || amount <= 0) {
        this.showToast('Please enter a valid deposit amount.', 'error');
        return;
      }

      store.contributeToGoal(goalId, amount);
      this.showToast(`Deposited towards goal!`);
      this.closeAllModals();
    }

    // --- DELETIONS & STATUS TOGGLES ---
    deleteTx(id) {
      if (confirm('Delete this transaction?')) {
        store.deleteTransaction(id);
        this.showToast('Transaction deleted');
      }
    }

    deleteBudget(id) {
      if (confirm('Remove this category budget?')) {
        store.deleteBudget(id);
        this.showToast('Budget removed');
      }
    }

    deleteGoal(id) {
      if (confirm('Delete this savings goal?')) {
        store.deleteGoal(id);
        this.showToast('Goal deleted');
      }
    }

    deleteMember(id) {
      try {
        if (confirm('Remove this family member? Their transactions will remain.')) {
          store.deleteMember(id);
          this.showToast('Member removed');
        }
      } catch (err) {
        this.showToast(err.message, 'error');
      }
    }

    deleteAccount(id) {
      if (confirm('Remove this bank account?')) {
        store.deleteBankAccount(id);
        this.showToast('Bank account removed');
      }
    }

    deleteProperty(id) {
      if (confirm('Remove this property from registry?')) {
        store.deleteProperty(id);
        this.showToast('Property removed');
      }
    }

    deleteRental(id) {
      if (confirm('Remove this rental unit?')) {
        store.deleteRentalProperty(id);
        this.showToast('Rental property removed');
      }
    }

    toggleRentalStatus(id) {
      const r = store.toggleRentStatus(id);
      if (r) {
        this.showToast(`Rent marked as ${r.paymentStatus}`);
      }
    }

    deleteEmi(id) {
      if (confirm('Remove this loan / EMI record?')) {
        store.deleteEmi(id);
        this.showToast('Loan EMI record removed');
      }
    }

    deletePolicy(id) {
      if (confirm('Remove this insurance policy?')) {
        store.deletePolicy(id);
        this.showToast('Policy removed');
      }
    }

    deleteInvestment(id) {
      if (confirm('Are you sure you want to remove this investment from your family portfolio?')) {
        store.deleteInvestment(id);
        this.showToast('Investment removed from portfolio');
      }
    }

    // --- UTILITIES ---
    showToast(message, type = 'success') {
      if (!this.toastContainer) return;
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      if (type === 'error') {
        icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      } else if (type === 'info') {
        icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
      }

      toast.innerHTML = `${icon} <span>${message}</span>`;
      this.toastContainer.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 10);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }

    downloadFile(content, fileName, contentType) {
      const a = document.createElement('a');
      const file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }

  // Bootstrap
  window.addEventListener('DOMContentLoaded', () => {
    window.famApp = new App();
  });
})();
