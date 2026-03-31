import { addDonor } from "@/services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

const DonorRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",
    photo: null as File | null,
  });

  // ✅ FIXED HANDLE SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const donorData = {
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        city: formData.address, // using address as city
        lastDonationDate: new Date().toISOString().split("T")[0],
      };

      const res = await addDonor(donorData);

      console.log("Saved:", res);

      toast.success("Donor registered successfully ✅");

      navigate("/donor/dashboard");

    } catch (error) {
      console.error(error);
      toast.error("Error registering donor ❌");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        photo: e.target.files[0],
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">

          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-2xl font-bold">Donor Registration</h1>
            <p className="text-sm opacity-90">
              Complete your profile to become a donor
            </p>
          </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

        <Card>

          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Please provide accurate information
            </CardDescription>
          </CardHeader>

          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <Label>Blood Group *</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bloodGroup: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label>Address *</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>

            </form>

          </CardContent>

        </Card>

      </div>

    </div>
  );
};

export default DonorRegistration;