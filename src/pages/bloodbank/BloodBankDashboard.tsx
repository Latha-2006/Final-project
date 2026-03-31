import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplet, RefreshCw } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BloodBankDashboard = () => {
  const navigate = useNavigate();
  
  const bloodInventory = [
    { type: "A+", units: 45, capacity: 100, status: "normal" },
    { type: "A-", units: 12, capacity: 50, status: "low" },
    { type: "B+", units: 38, capacity: 100, status: "normal" },
    { type: "B-", units: 8, capacity: 50, status: "critical" },
    { type: "AB+", units: 22, capacity: 50, status: "normal" },
    { type: "AB-", units: 5, capacity: 30, status: "critical" },
    { type: "O+", units: 67, capacity: 150, status: "good" },
    { type: "O-", units: 15, capacity: 80, status: "low" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-success";
      case "normal": return "text-primary";
      case "low": return "text-warning";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const handleUpdate = (bloodType: string) => {
    toast.success(`${bloodType} inventory updated successfully`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-success to-primary text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold mb-1">Blood Bank Dashboard</h1>
              <p className="text-sm opacity-90">Central Blood Bank - Downtown</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Bank Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Bank Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank Name:</span>
              <span className="font-medium">Central Blood Bank</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium">123 Medical Street, Downtown</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact:</span>
              <span className="font-medium">+1 234-567-8900</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">central@bloodbank.com</span>
            </div>
          </CardContent>
        </Card>

        {/* Blood Inventory */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Blood Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bloodInventory.map((blood) => {
              const percentage = (blood.units / blood.capacity) * 100;
              return (
                <Card key={blood.type} className="hover:shadow-md transition">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Droplet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{blood.type}</h3>
                          <p className={`text-sm font-medium ${getStatusColor(blood.status)}`}>
                            {blood.status.charAt(0).toUpperCase() + blood.status.slice(1)}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdate(blood.type)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available Units</span>
                        <span className="font-semibold">{blood.units} / {blood.capacity}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-success">257</p>
              <p className="text-sm text-muted-foreground">Total Units</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">560</p>
              <p className="text-sm text-muted-foreground">Capacity</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-warning">2</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-destructive">2</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BloodBankDashboard;
