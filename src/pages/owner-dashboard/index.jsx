
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { database } from '../../utils/firebase';
import RoleTransitionHeader from '../../components/ui/RoleTransitionHeader';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import SyncProgressFeedback from '../../components/ui/SyncProgressFeedback';
import MetricCard from './components/MetricCard';
import FilterControls from './components/FilterControls';
import TransactionsTable from './components/TransactionsTable';
import ConnectionStatus from './components/ConnectionStatus';
import Icon from '../../components/AppIcon';

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [filters, setFilters] = useState({ dateRange: 'today', staff: 'all' });
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

  // Mock data for demonstration/fallback
  const mockTransactions = [
    {
      id: 'TXN001',
      items: [
        { name: 'Wireless Mouse', quantity: 2, price: 25.99 },
        { name: 'USB-C Cable', quantity: 3, price: 12.50 },
        { name: 'Laptop Stand', quantity: 1, price: 45.00 }
      ],
      totalAmount: 126.48,
      timestamp: new Date().getTime(),
      createdBy: 'Sarah Johnson'
    },
    {
      id: 'TXN002',
      items: [
        { name: 'Mechanical Keyboard', quantity: 1, price: 89.99 }
      ],
      totalAmount: 89.99,
      timestamp: new Date().getTime() - 3600000,
      createdBy: 'Michael Chen'
    }
  ];

  useEffect(() => {
    // If no database (e.g. env vars missing), use mock data
    if (!database) {
      console.warn("Using mock data for Owner Dashboard (Firebase not configured)");
      setTransactions(mockTransactions);

      // Extract unique staff members from mock
      const uniqueStaff = [...new Set(mockTransactions.map(bill => bill.createdBy))].map(name => ({
        id: name,
        name: name
      }));
      setStaffMembers(uniqueStaff);

      setLoading(false);
      return;
    }

    // Create a reference to the 'bills' collection
    const billsCollectionRef = collection(database, 'bills');
    // Create a query to order by timestamp descending
    const q = query(billsCollectionRef, orderBy('timestamp', 'desc'));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const billsArray = [];
      snapshot.forEach((doc) => {
        billsArray.push({ id: doc.id, ...doc.data() });
      });

      setTransactions(billsArray);

      // Extract unique staff members
      const uniqueStaff = [...new Set(billsArray.map(bill => bill.createdBy))].map(name => ({
        id: name,
        name: name
      }));
      setStaffMembers(uniqueStaff);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bills:", error);
      setLoading(false);
    });

    // Simulate periodic sync
    const syncInterval = setInterval(() => {
      setIsSyncing(true);
      setSyncProgress(0);

      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setIsSyncing(false);
              setSyncProgress(0);
            }, 500);
            return 100;
          }
          return prev + 20;
        });
      }, 200);
    }, 45000);

    return () => {
      // Unsubscribe when component unmounts
      unsubscribe();
      clearInterval(syncInterval);
    };
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...transactions];

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (filters?.dateRange === 'today') {
      filtered = filtered?.filter(t => new Date(t.timestamp) >= today);
    } else if (filters?.dateRange === 'yesterday') {
      const yesterday = new Date(today);
      yesterday?.setDate(yesterday?.getDate() - 1);
      filtered = filtered?.filter(t => {
        const txDate = new Date(t.timestamp);
        return txDate >= yesterday && txDate < today;
      });
    } else if (filters?.dateRange === 'last7days') {
      const weekAgo = new Date(today);
      weekAgo?.setDate(weekAgo?.getDate() - 7);
      filtered = filtered?.filter(t => new Date(t.timestamp) >= weekAgo);
    } else if (filters?.dateRange === 'last30days') {
      const monthAgo = new Date(today);
      monthAgo?.setDate(monthAgo?.getDate() - 30);
      filtered = filtered?.filter(t => new Date(t.timestamp) >= monthAgo);
    }

    // Staff filter
    if (filters?.staff !== 'all') {
      filtered = filtered?.filter(t => t?.createdBy === filters?.staff);
    }

    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  const calculateMetrics = () => {
    const totalSales = filteredTransactions?.reduce((sum, t) => sum + t?.totalAmount, 0);
    const totalTransactions = filteredTransactions?.length;

    // Calculate today's sales for trend
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    const todaySales = filteredTransactions?.filter(t => new Date(t.timestamp) >= today)?.reduce((sum, t) => sum + t?.totalAmount, 0);

    return {
      totalSales,
      totalTransactions,
      todaySales
    };
  };

  const metrics = calculateMetrics();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Helmet>
        <title>Owner Dashboard - SmartBill Lite</title>
        <meta name="description" content="Monitor your business sales performance in real-time with comprehensive transaction oversight and analytics" />
      </Helmet>
      <RoleTransitionHeader />
      <OfflineStatusIndicator />
      <SyncProgressFeedback
        isSyncing={isSyncing}
        syncProgress={syncProgress}
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          {/* Header Section */}
          <div className="mb-6 md:mb-8 lg:mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2">
                  Sales Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Real-time business performance monitoring and analytics
                </p>
              </div>
              <ConnectionStatus />
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8 lg:mb-10">
            <MetricCard
              title="Total Sales"
              value={new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'INR'
              })?.format(metrics?.totalSales)}
              icon="DollarSign"
              iconColor="bg-success/10 text-success"
              trend="up"
              trendValue="Live"
              loading={loading}
            />
            <MetricCard
              title="Total Transactions"
              value={metrics?.totalTransactions?.toString()}
              icon="Receipt"
              iconColor="bg-primary/10 text-primary"
              trend="up"
              trendValue="Live"
              loading={loading}
            />
            <MetricCard
              title="Today's Sales"
              value={new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'INR'
              })?.format(metrics?.todaySales)}
              icon="TrendingUp"
              iconColor="bg-accent/10 text-accent"
              trend="neutral"
              trendValue="Today"
              loading={loading}
            />
          </div>

          {/* Filter Controls */}
          <FilterControls
            onFilterChange={handleFilterChange}
            staffMembers={staffMembers}
          />

          {/* Transactions Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10">
                <Icon name="List" size={20} className="text-primary md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
                  Recent Transactions
                </h2>
                <p className="text-sm md:text-base text-muted-foreground caption">
                  {filteredTransactions?.length} transaction{filteredTransactions?.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            <TransactionsTable
              transactions={filteredTransactions}
              loading={loading}
            />
          </div>

          {/* Footer Info */}
          <div className="mt-8 md:mt-10 lg:mt-12 text-center">
            <p className="text-xs md:text-sm text-muted-foreground caption">
              Data updates in real-time • Last updated: {new Date()?.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;