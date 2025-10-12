import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchRFPs, fetchQuotations, fetchVendorScore, RFP, Quotation, VendorScore } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const QuotationReview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [selectedRFP, setSelectedRFP] = useState<string>('');
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [bestVendor, setBestVendor] = useState<VendorScore | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/');
      return;
    }
    loadRFPs();
  }, []);

  const loadRFPs = async () => {
    try {
      const data = await fetchRFPs();
      setRfps(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load RFPs",
        variant: "destructive",
      });
    }
  };

  const loadQuotationsForRFP = async (rfpId: string) => {
    try {
      setLoading(true);
      const [quotationsData, vendorScoreData] = await Promise.all([
        fetchQuotations(rfpId),
        fetchVendorScore(rfpId).catch(() => null)
      ]);
      
      setQuotations(quotationsData);
      setBestVendor(vendorScoreData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quotations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRFPChange = (rfpId: string) => {
    setSelectedRFP(rfpId);
    loadQuotationsForRFP(rfpId);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Quotation Review</h1>
          <p className="text-muted-foreground">Review vendor quotations with AI-powered recommendations</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-foreground mb-2">Select RFP</label>
          <Select value={selectedRFP} onValueChange={handleRFPChange}>
            <SelectTrigger className="w-full md:w-96">
              <SelectValue placeholder="Choose an RFP to review quotations" />
            </SelectTrigger>
            <SelectContent>
              {rfps.map((rfp) => (
                <SelectItem key={rfp._id} value={rfp._id!}>
                  {rfp.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : selectedRFP ? (
          <>
            {bestVendor && (
              <Card className="mb-8 shadow-hover border-2 border-accent animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center text-accent">
                    <Sparkles className="h-5 w-5 mr-2" />
                    AI Recommended Best Vendor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Vendor Name</p>
                      <p className="text-lg font-bold text-foreground">{bestVendor.vendorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">AI Score</p>
                      <p className="text-lg font-bold text-accent">{bestVendor.score}/100</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
                      <p className="text-lg font-bold text-foreground">${bestVendor.cost.toLocaleString()}</p>
                    </div>
                  </div>
                  {bestVendor.reasoning && (
                    <div className="mt-4 p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">AI Reasoning</p>
                      <p className="text-sm text-foreground">{bestVendor.reasoning}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>All Quotations</CardTitle>
              </CardHeader>
              <CardContent>
                {quotations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No quotations received yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-foreground">Vendor</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Cost</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Delivery Time</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Score</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotations.map((quotation) => {
                          const isBest = bestVendor?.vendorName === quotation.vendorName;
                          return (
                            <tr 
                              key={quotation._id} 
                              className={`border-b border-border hover:bg-secondary transition-colors ${
                                isBest ? 'bg-accent/10' : ''
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <span className="font-medium text-foreground">{quotation.vendorName}</span>
                                  {isBest && (
                                    <Badge className="ml-2 bg-accent text-accent-foreground">
                                      Best Choice
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center text-foreground">
                                  <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                                  {quotation.cost.toLocaleString()}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center text-foreground">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  {quotation.deliveryTime} days
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {quotation.score ? (
                                  <Badge variant="outline">{quotation.score}/100</Badge>
                                ) : (
                                  <span className="text-muted-foreground text-sm">Pending</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {quotation.notes || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Select an RFP</h3>
              <p className="text-muted-foreground">Choose an RFP from the dropdown above to view quotations</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default QuotationReview;
