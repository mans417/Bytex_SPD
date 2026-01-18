import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { database } from '../../utils/firebase';
import RoleTransitionHeader from '../../components/ui/RoleTransitionHeader';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import RevenueChart from './components/RevenueChart';
import TopCustomers from './components/TopCustomers';
import PeakHours from './components/PeakHours';
import ReportSummary from './components/ReportSummary';
import AnalyticsFilters from './components/AnalyticsFilters';
import Button from '../../components/ui/Button';


const SalesAnalytics = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dateRange, setDateRange] = useState('daily');
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = () => {
    // Check if Firebase is initialized
    if (!database) {
      console.warn('Firebase not initialized, using mock data');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const billsRef = collection(database, 'bills');
      const billsQuery = query(billsRef, orderBy('timestamp', 'desc'));

      const unsubscribe = onSnapshot(billsQuery, (snapshot) => {
        const billsArray = [];
        snapshot.forEach((doc) => {
          billsArray.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setBills(billsArray);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching bills:', error);
        const localBills = JSON.parse(localStorage.getItem('offlineBills') || '[]');
        setBills(localBills);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up Firebase listener:', error);
      const localBills = JSON.parse(localStorage.getItem('offlineBills') || '[]');
      setBills(localBills);
      setLoading(false);
    }
  };

  const filterBillsByPeriod = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered = [...bills];

    if (selectedPeriod === 'today') {
      filtered = filtered?.filter(b => new Date(b?.timestamp) >= today);
    } else if (selectedPeriod === 'yesterday') {
      const yesterday = new Date(today);
      yesterday?.setDate(yesterday?.getDate() - 1);
      filtered = filtered?.filter(b => {
        const billDate = new Date(b?.timestamp);
        return billDate >= yesterday && billDate < today;
      });
    } else if (selectedPeriod === 'last7days') {
      const weekAgo = new Date(today);
      weekAgo?.setDate(weekAgo?.getDate() - 7);
      filtered = filtered?.filter(b => new Date(b?.timestamp) >= weekAgo);
    } else if (selectedPeriod === 'last30days') {
      const monthAgo = new Date(today);
      monthAgo?.setDate(monthAgo?.getDate() - 30);
      filtered = filtered?.filter(b => new Date(b?.timestamp) >= monthAgo);
    }

    return filtered;
  };

  const filteredBills = filterBillsByPeriod();

  const handleExportReport = () => {
    const reportData = {
      period: selectedPeriod,
      totalRevenue: filteredBills?.reduce((sum, b) => sum + (b?.totalAmount || 0), 0),
      totalTransactions: filteredBills?.length,
      generatedAt: new Date()?.toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-report-${selectedPeriod}-${Date.now()}.json`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Sales Analytics - SmartBill Lite</title>
        <meta name="description" content="Comprehensive business intelligence with revenue trends, customer insights, and performance tracking" />
      </Helmet>
      <RoleTransitionHeader />
      <OfflineStatusIndicator />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2">
                  Sales Analytics
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive business intelligence and performance insights
                </p>
              </div>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportReport}
                disabled={loading || filteredBills?.length === 0}
              >
                Export Report
              </Button>
            </div>
            <AnalyticsFilters
              dateRange={dateRange}
              selectedPeriod={selectedPeriod}
              onDateRangeChange={setDateRange}
              onPeriodChange={setSelectedPeriod}
            />
          </div>

          {/* Revenue Trends Chart */}
          <div className="mb-6 md:mb-8">
            <RevenueChart
              bills={filteredBills}
              dateRange={dateRange}
              loading={loading}
            />
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <TopCustomers bills={filteredBills} loading={loading} />
            <PeakHours bills={filteredBills} loading={loading} />
          </div>

          {/* Report Summary */}
          <ReportSummary
            bills={filteredBills}
            selectedPeriod={selectedPeriod}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default SalesAnalytics;