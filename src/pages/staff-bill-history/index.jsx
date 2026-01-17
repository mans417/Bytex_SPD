import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { database } from '../../utils/firebase';
import RoleTransitionHeader from '../../components/ui/RoleTransitionHeader';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import SyncProgressFeedback from '../../components/ui/SyncProgressFeedback';
import BillHistoryTable from './components/BillHistoryTable';
import SummaryCards from './components/SummaryCards';
import FilterControls from './components/FilterControls';
import SearchBar from './components/SearchBar';

const StaffBillHistory = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [syncStatusFilter, setSyncStatusFilter] = useState('all');

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      fetchBills();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = () => {
    // Check if Firebase is initialized
    if (!database) {
      console.warn('Firebase not initialized, loading from local storage');
      const localBills = JSON.parse(localStorage.getItem('offlineBills') || '[]');
      setBills(localBills);
      setFilteredBills(localBills);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const billsRef = ref(database, 'bills');
      const billsQuery = query(billsRef, orderByChild('timestamp'));

      onValue(billsQuery, (snapshot) => {
        const data = snapshot?.val();
        if (data) {
          const billsArray = Object.keys(data)?.map(key => ({
            ...data?.[key],
            firebaseKey: key,
            synced: true
          }));
          setBills(billsArray?.reverse());
          setFilteredBills(billsArray?.reverse());
        } else {
          setBills([]);
          setFilteredBills([]);
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching bills:', error);
        const localBills = JSON.parse(localStorage.getItem('offlineBills') || '[]');
        setBills(localBills);
        setFilteredBills(localBills);
        setLoading(false);
      });
    } catch (error) {
      console.error('Error setting up Firebase listener:', error);
      const localBills = JSON.parse(localStorage.getItem('offlineBills') || '[]');
      setBills(localBills);
      setFilteredBills(localBills);
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, dateRange, amountRange, syncStatusFilter, bills]);

  const applyFilters = () => {
    let filtered = [...bills];

    if (searchQuery) {
      filtered = filtered?.filter(bill => 
        bill?.customerName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        bill?.id?.toString()?.includes(searchQuery)
      );
    }

    if (dateRange?.start) {
      const startDate = new Date(dateRange.start)?.getTime();
      filtered = filtered?.filter(bill => bill?.timestamp >= startDate);
    }

    if (dateRange?.end) {
      const endDate = new Date(dateRange.end)?.setHours(23, 59, 59, 999);
      filtered = filtered?.filter(bill => bill?.timestamp <= endDate);
    }

    if (amountRange?.min) {
      filtered = filtered?.filter(bill => bill?.totalAmount >= parseFloat(amountRange?.min));
    }

    if (amountRange?.max) {
      filtered = filtered?.filter(bill => bill?.totalAmount <= parseFloat(amountRange?.max));
    }

    if (syncStatusFilter !== 'all') {
      filtered = filtered?.filter(bill => 
        syncStatusFilter === 'synced' ? bill?.synced : !bill?.synced
      );
    }

    setFilteredBills(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
    setAmountRange({ min: '', max: '' });
    setSyncStatusFilter('all');
  };

  const totalRevenue = bills?.reduce((sum, bill) => sum + (bill?.totalAmount || 0), 0);
  const pendingSyncCount = bills?.filter(bill => !bill?.synced)?.length;

  return (
    <>
      <Helmet>
        <title>Bill History - SmartBill Lite</title>
        <meta name="description" content="View and manage your bill history with comprehensive tracking and printing" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <RoleTransitionHeader />
        <OfflineStatusIndicator />
        <SyncProgressFeedback
          isSyncing={isSyncing}
          syncProgress={syncProgress}
        />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <div className="mb-6 md:mb-8 lg:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 md:mb-3">Bill History</h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
              View and manage your previously generated bills
            </p>
          </div>

          <SummaryCards
            totalBills={bills?.length}
            totalRevenue={totalRevenue}
            pendingSyncCount={pendingSyncCount}
            loading={loading}
          />

          <div className="mt-6 md:mt-8 space-y-4 md:space-y-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <FilterControls
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              amountRange={amountRange}
              onAmountRangeChange={setAmountRange}
              syncStatusFilter={syncStatusFilter}
              onSyncStatusChange={setSyncStatusFilter}
              onClearFilters={handleClearFilters}
            />

            <BillHistoryTable
              bills={filteredBills}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default StaffBillHistory;