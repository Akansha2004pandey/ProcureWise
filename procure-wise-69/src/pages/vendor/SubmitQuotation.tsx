import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Send, Package } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchRFPs, createQuotation, RFP } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const SubmitQuotation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const rfpIdFromUrl = searchParams.get('rfpId');
  
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [selectedRFP, setSelectedRFP] = useState<string>(rfpIdFromUrl || '');
  const [formData, setFormData] = useState({
    vendorName: '',
    cost: '',
    deliveryTime: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

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
      const data = await fetchRFPs();
      const openRFPs = data.filter(rfp => rfp.status === 'open' || !rfp.status);
      setRfps(openRFPs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load RFPs",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRFP) {
      toast({
        title: "Error",
        description: "Please select an RFP",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await createQuotation({
        rfpId: selectedRFP,
        vendorName: formData.vendorName,
        cost: Number(formData.cost),
        deliveryTime: Number(formData.deliveryTime),
        notes: formData.notes,
      });
      
      toast({
        title: "Success",
        description: "Quotation submitted successfully",
      });
      
      setFormData({ vendorName: '', cost: '', deliveryTime: '', notes: '' });
      navigate('/vendor/rfps');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quotation",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  const selectedRFPData = rfps.find(rfp => rfp._id === selectedRFP);

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="vendor" onLogout={handleLogout} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Submit Quotation</h1>
          <p className="text-muted-foreground">Provide your best quote for the selected RFP</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quotation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="rfp">Select RFP</Label>
                    <Select value={selectedRFP} onValueChange={setSelectedRFP}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an RFP" />
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
                  
                  <div>
                    <Label htmlFor="vendorName">Vendor Name</Label>
                    <Input
                      id="vendorName"
                      value={formData.vendorName}
                      onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                      placeholder="Your company name"
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cost">Total Cost ($)</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        placeholder="e.g., 50000"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="deliveryTime">Delivery Time (days)</Label>
                      <Input
                        id="deliveryTime"
                        type="number"
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                        placeholder="e.g., 30"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional information about your quotation..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Quotation
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedRFPData ? (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">RFP Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Title</p>
                    <p className="text-sm text-muted-foreground">{selectedRFPData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Description</p>
                    <p className="text-sm text-muted-foreground">{selectedRFPData.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Items</p>
                    <ul className="space-y-1">
                      {selectedRFPData.items.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                          <div className="h-1 w-1 rounded-full bg-primary mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedRFPData.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Select an RFP to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitQuotation;
