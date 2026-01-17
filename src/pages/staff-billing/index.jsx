import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../../utils/firebase';
import RoleTransitionHeader from '../../components/ui/RoleTransitionHeader';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import SyncProgressFeedback from '../../components/ui/SyncProgressFeedback';
import BillingForm from './components/BillingForm';
import ItemsList from './components/ItemsList';
import BillSummary from './components/BillSummary';
import SuccessModal from './components/SuccessModal';
import Button from '../../components/ui/Button';

const StaffBilling = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastGeneratedBill, setLastGeneratedBill] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineBills();
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

  const syncOfflineBills = async () => {
    try {
      const offlineBills = JSON.parse(localStorage.getItem('offlineBills') || '[]');
      if (offlineBills?.length === 0) return;

      setIsSyncing(true);
      setSyncProgress(0);

      const billsRef = collection(database, 'bills');

      for (let i = 0; i < offlineBills?.length; i++) {
        const bill = offlineBills?.[i];
        // Ensure no local ID conflict if Firestore generates one, or we can use setDoc with id
        // For simplicity, we use addDoc to auto-generate ID
        await addDoc(billsRef, { ...bill, synced: true });
        setSyncProgress(((i + 1) / offlineBills?.length) * 100);
      }

      localStorage.removeItem('offlineBills');
      setIsSyncing(false);
    } catch (error) {
      console.error('Error syncing offline bills:', error);
      setIsSyncing(false);
    }
  };

  const handleAddItem = (item) => {
    setItems([...items, item]);
  };

  const handleRemoveItem = (itemId) => {
    setItems(items?.filter(item => item?.id !== itemId));
  };

  const handleGenerateBill = async (customerData) => {
    const subtotal = items?.reduce((sum, item) => sum + item?.total, 0);
    const taxAmount = subtotal * 0.18;
    const totalAmount = subtotal + taxAmount;

    const billData = {
      // id: Date.now(), // Firestore will generate ID, but we keep this for local ref if needed
      localId: Date.now(),
      customerName: customerData?.customerName,
      customerPhone: customerData?.customerPhone,
      items: items,
      subtotal: subtotal,
      tax: taxAmount,
      totalAmount: totalAmount,
      timestamp: Date.now(),
      createdBy: 'Staff Member',
      synced: false
    };

    setLastGeneratedBill(billData);
    setShowSuccessModal(true);
    setItems([]);

    if (isOffline) {
      const offlineBills = JSON.parse(localStorage.getItem('offlineBills') || '[]');
      offlineBills?.push(billData);
      localStorage.setItem('offlineBills', JSON.stringify(offlineBills));
    } else {
      try {
        setIsSyncing(true);
        const billsRef = collection(database, 'bills');
        await addDoc(billsRef, { ...billData, synced: true });
        setIsSyncing(false);
      } catch (error) {
        console.error('Error saving bill to Firebase:', error);
        const offlineBills = JSON.parse(localStorage.getItem('offlineBills') || '[]');
        offlineBills?.push(billData);
        localStorage.setItem('offlineBills', JSON.stringify(offlineBills));
        setIsSyncing(false);
      }
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setLastGeneratedBill(null);
  };

  return (
    <>
      <Helmet>
        <title>Staff Billing - SmartBill Lite</title>
        <meta name="description" content="Create digital bills quickly with offline-first capability for small businesses" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <RoleTransitionHeader />
        <OfflineStatusIndicator />
        <SyncProgressFeedback
          isSyncing={isSyncing}
          syncProgress={syncProgress}
        />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <div className="mb-6 md:mb-8 lg:mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 md:mb-3">Staff Billing</h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                Create digital bills quickly and efficiently
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/staff-bill-history')}
              iconName="History"
              iconPosition="left"
              className="hidden md:flex"
            >
              Bill History
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <BillingForm
                onAddItem={handleAddItem}
                items={items}
                onRemoveItem={handleRemoveItem}
                onGenerateBill={handleGenerateBill}
                isOffline={isOffline}
              />
              <ItemsList items={items} onRemoveItem={handleRemoveItem} />
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <BillSummary items={items} />
              </div>
            </div>
          </div>

          <div className="md:hidden fixed bottom-4 right-4 z-50">
            <Button
              variant="default"
              size="icon"
              onClick={() => navigate('/staff-bill-history')}
              iconName="History"
              className="w-14 h-14 rounded-full shadow-lg"
            />
          </div>
        </main>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          billData={lastGeneratedBill}
        />
      </div>
    </>
  );
};

export default StaffBilling;