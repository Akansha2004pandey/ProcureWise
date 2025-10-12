import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'vendor' | null>(null);

  const handleRoleSelect = (role: 'admin' | 'vendor') => {
    setSelectedRole(role);
    // Store role in sessionStorage for demo purposes
    sessionStorage.setItem('userRole', role);
    
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/vendor/rfps');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-4xl w-full animate-slide-up">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            ProcureAI Platform
          </h1>
          <p className="text-xl text-white/90">
            AI-Powered Procurement Automation for Modern Businesses
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-hover hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                onClick={() => handleRoleSelect('admin')}>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-center text-2xl">Admin / Company</CardTitle>
              <CardDescription className="text-center">
                Manage RFPs, review quotations, and audit contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                  Create and manage RFPs
                </li>
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                  Review vendor quotations
                </li>
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                  AI-powered vendor recommendations
                </li>
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                  Contract risk analysis
                </li>
              </ul>
              <Button className="w-full" size="lg">
                Enter as Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-hover hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-accent"
                onClick={() => handleRoleSelect('vendor')}>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Store className="h-12 w-12 text-accent" />
              </div>
              <CardTitle className="text-center text-2xl">Vendor</CardTitle>
              <CardDescription className="text-center">
                Browse RFPs and submit competitive quotations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mr-2" />
                  Browse available RFPs
                </li>
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mr-2" />
                  Submit quotations
                </li>
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mr-2" />
                  Track submission status
                </li>
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mr-2" />
                  Competitive bidding
                </li>
              </ul>
              <Button className="w-full" size="lg" variant="secondary">
                Enter as Vendor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
