import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, FileText, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchRFPs, RFP } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const RFPList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    if (role !== 'vendor') {
      navigate('/');
      return;
    }
    loadRFPs();
  }, []);

  const loadRFPs = async () => {
    try {
      setLoading(true);
      const data = await fetchRFPs();
      setRfps(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load RFPs",
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

  const handleSubmitQuotation = (rfpId: string) => {
    navigate(`/vendor/submit?rfpId=${rfpId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="vendor" onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Available RFPs</h1>
          <p className="text-muted-foreground">Browse open requests for proposals and submit your quotations</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : rfps.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No RFPs Available</h3>
              <p className="text-muted-foreground">Check back later for new procurement opportunities</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {rfps.map((rfp) => (
              <Card key={rfp._id} className="shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-foreground mr-3">{rfp.title}</h3>
                        <Badge variant={rfp.status === 'open' ? 'default' : 'secondary'}>
                          {rfp.status || 'Open'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{rfp.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Required Items:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {rfp.items.map((item, index) => (
                        <div key={index} className="flex items-center text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Deadline: {new Date(rfp.deadline).toLocaleDateString()}
                    </div>
                    <Button 
                      onClick={() => handleSubmitQuotation(rfp._id!)}
                      disabled={rfp.status === 'closed'}
                    >
                      Submit Quotation
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RFPList;
