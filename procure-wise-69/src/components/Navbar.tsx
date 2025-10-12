import { Link, useLocation } from "react-router-dom";
import { Building2, Package, FileText, ShieldCheck, List, PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  role: 'admin' | 'vendor';
  onLogout: () => void;
}

export const Navbar = ({ role, onLogout }: NavbarProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Building2 },
    { path: '/admin/rfp-management', label: 'RFP Management', icon: Package },
    { path: '/admin/quotation-review', label: 'Quotations', icon: FileText },
    { path: '/admin/contract-audit', label: 'Contract Audit', icon: ShieldCheck },
  ];
  
  const vendorLinks = [
    { path: '/vendor/rfps', label: 'Browse RFPs', icon: List },
    { path: '/vendor/submit', label: 'Submit Quotation', icon: PlusCircle },
  ];
  
  const links = role === 'admin' ? adminLinks : vendorLinks;
  
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                ProcureAI
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Role: <span className="font-medium text-foreground capitalize">{role}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
