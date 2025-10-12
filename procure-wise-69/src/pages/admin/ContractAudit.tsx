import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, AlertTriangle, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { auditContract, ContractAudit } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ContractAuditPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contractText, setContractText] = useState('');
  const [auditResult, setAuditResult] = useState<ContractAudit | null>(null);
  const [loading, setLoading] = useState(false);

  useState(() => {
    const role = sessionStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/');
    }
  });

  const handleAudit = async () => {
    if (!contractText.trim()) {
      toast({
        title: "Error",
        description: "Please enter contract text to audit",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await auditContract(contractText);
      setAuditResult(result);
      toast({
        title: "Success",
        description: "Contract audited successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to audit contract",
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="admin" onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Contract Audit</h1>
          <p className="text-muted-foreground">AI-powered contract risk analysis and insights</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Contract Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contract">Contract Text</Label>
                  <Textarea
                    id="contract"
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    placeholder="Paste your contract text here for AI analysis..."
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
                <Button 
                  onClick={handleAudit} 
                  disabled={loading || !contractText.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Audit Contract
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {!auditResult ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <ShieldCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Audit</h3>
                  <p className="text-muted-foreground">Enter contract text and click "Audit Contract" to analyze</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="shadow-card animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center text-destructive">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Risk Flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {auditResult.riskFlags.length === 0 ? (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>No Critical Risks</AlertTitle>
                        <AlertDescription>
                          The AI analysis did not detect any major risk flags in this contract.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-3">
                        {auditResult.riskFlags.map((flag, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{flag}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-card animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center text-accent">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {auditResult.insights.length === 0 ? (
                      <p className="text-muted-foreground">No additional insights available</p>
                    ) : (
                      <ul className="space-y-3">
                        {auditResult.insights.map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-2 w-2 rounded-full bg-accent mt-2 mr-3 flex-shrink-0" />
                            <p className="text-sm text-foreground">{insight}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContractAuditPage;
