import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, Package } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fetchRFPs, createRFP, RFP } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const RFPManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    items: '',
    deadline: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const items = formData.items.split('\n').filter(item => item.trim());
      await createRFP({
        title: formData.title,
        description: formData.description,
        items,
        deadline: formData.deadline,
        status: 'open',
      });
      
      toast({
        title: "Success",
        description: "RFP created successfully",
      });
      
      setFormData({ title: '', description: '', items: '', deadline: '' });
      setShowForm(false);
      loadRFPs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create RFP",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">RFP Management</h1>
            <p className="text-muted-foreground">Create and manage your requests for proposals</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="shadow-hover">
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancel' : 'Create RFP'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 shadow-card animate-slide-up">
            <CardHeader>
              <CardTitle>Create New RFP</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Office Supplies Procurement Q1 2024"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of requirements..."
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="items">Items (one per line)</Label>
                  <Textarea
                    id="items"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    placeholder="Office chairs&#10;Desks&#10;Computer monitors"
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Create RFP
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : rfps.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No RFPs Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first RFP to get started</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create RFP
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {rfps.map((rfp) => (
              <Card key={rfp._id} className="shadow-card hover:shadow-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{rfp.title}</h3>
                      <p className="text-muted-foreground mb-4">{rfp.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rfp.status === 'open' 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {rfp.status || 'Open'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Items:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {rfp.items.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground">{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Deadline: {new Date(rfp.deadline).toLocaleDateString()}
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

export default RFPManagement;
