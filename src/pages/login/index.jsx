import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginOwner, loginStaff, userRole } = useAuth();

    // Determine initial role from navigation state or default to 'staff'
    const initialRole = location.state?.role || 'staff';
    const [activeTab, setActiveTab] = useState(initialRole);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        pin: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userRole === 'owner') navigate('/owner-dashboard');
        if (userRole === 'staff') navigate('/staff-billing');
    }, [userRole, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (activeTab === 'owner') {
                await loginOwner(formData.email, formData.password);
                navigate('/owner-dashboard');
            } else {
                await loginStaff(formData.pin);
                navigate('/staff-billing');
            }
        } catch (err) {
            console.error(err);
            setError(activeTab === 'owner' ? 'Invalid email or password' : 'Invalid PIN');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login - SmartBill Lite</title>
            </Helmet>
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
                            <p className="text-muted-foreground">Sign in to access your dashboard</p>
                        </div>

                        {/* Tabs */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-lg mb-8">
                            <button
                                onClick={() => { setActiveTab('staff'); setError(''); }}
                                className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'staff'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Staff Login
                            </button>
                            <button
                                onClick={() => { setActiveTab('owner'); setError(''); }}
                                className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'owner'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Owner Login
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                                    <Icon name="AlertCircle" size={16} />
                                    {error}
                                </div>
                            )}

                            {activeTab === 'owner' ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Email</label>
                                        <div className="relative">
                                            <Icon name="Mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="owner@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Password</label>
                                        <div className="relative">
                                            <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Access PIN</label>
                                    <div className="relative">
                                        <Icon name="Key" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="password"
                                            name="pin"
                                            value={formData.pin}
                                            onChange={handleChange}
                                            maxLength={6}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none tracking-widest"
                                            placeholder="Enter PIN"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Default PIN: 1234</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                loading={loading}
                                fullWidth
                                size="lg"
                                className="mt-6"
                            >
                                {activeTab === 'owner' ? 'Sign In' : 'Access Billing'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
