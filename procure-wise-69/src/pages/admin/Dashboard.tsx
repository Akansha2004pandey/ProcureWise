import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, FileText, TrendingUp, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { fetchRFPs, fetchQuotations, RFP, Quotation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/');
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rfpsData, quotationsData] = await Promise.all([
        fetchRFPs(),
        fetchQuotations()
      ]);
      setRfps(rfpsData);
      setQuotations(quotationsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  const openRFPs = rfps.filter(rfp => rfp.status === 'open' || !rfp.status).length;
  const pendingQuotations = quotations.filter(q => !q.score).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your procurement activities</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="Total RFPs"
                value={rfps.length}
                icon={Package}
                description="All requests for proposals"
              />
              <DashboardCard
                title="Open RFPs"
                value={openRFPs}
                icon={Clock}
                description="Currently accepting bids"
              />
              <DashboardCard
                title="Pending Quotations"
                value={pendingQuotations}
                icon={FileText}
                description="Awaiting evaluation"
              />
              <DashboardCard
                title="Avg. Response Time"
                value="2.4 days"
                icon={TrendingUp}
                description="Average vendor response"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg shadow-card p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Recent RFPs</h2>
                {rfps.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No RFPs created yet</p>
                ) : (
                  <div className="space-y-3">
                    {rfps.slice(0, 5).map((rfp) => (
                      <div key={rfp._id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{rfp.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Deadline: {new Date(rfp.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rfp.status === 'open' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {rfp.status || 'Open'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-card rounded-lg shadow-card p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Recent Quotations</h2>
                {quotations.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No quotations received yet</p>
                ) : (
                  <div className="space-y-3">
                    {quotations.slice(0, 5).map((quotation) => (
                      <div key={quotation._id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{quotation.vendorName}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${quotation.cost.toLocaleString()} • {quotation.deliveryTime} days
                          </p>
                        </div>
                        {quotation.score && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                            Score: {quotation.score}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
