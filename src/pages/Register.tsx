import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/lib/mockData";
import type { NewUserType } from "@/types/types";
import { useRegisterUserMutation } from "@/lib/api/userRegister";

const Register = () => {
  const { mutate, isPending } = useRegisterUserMutation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "citizen" as UserRole, // fix this shit to use array yeabtsega
    password: "",
    confirmPassword: "",
  });

  const passwordsMatch =
    formData.password === formData.confirmPassword ||
    formData.confirmPassword === "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    if (!passwordsMatch) {
      setLocalError("Passwords do not match");
      return;
    }

    if (!formData.email || !formData.password) {
      setLocalError("Email and password are required");
      return;
    }

    if (!formData.name) {
      setLocalError("Name is required");
      return;
    }

    if (!formData.email.includes("@")) {
      setLocalError("Invalid email address");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    const submissionData: NewUserType = {
      name: formData.name,
      username: formData.email.split("@")[0], // currently using email split
      email: formData.email,
      password: formData.password,
      roles: [formData.role],
    };

    mutate(submissionData, {
      onSuccess: () => {
        setLocalError(null);
        navigate("/dashboard");
      },
      onError: (err) => {
        const message = err.message || "Registration failed. Please try again.";
        setLocalError(message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">ISDREM</h1>
          </div>
          <p className="text-muted-foreground text-center">
            Create your account to access the system
          </p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Register
            </CardTitle>
            <CardDescription className="text-center">
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email / Phone</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email or phone"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="decision-maker">
                      Decision Maker
                    </SelectItem>
                    <SelectItem value="field-agent">
                      Field Agent / Responder
                    </SelectItem>
                    <SelectItem value="citizen">Citizen / Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="bg-card pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`bg-card pr-10 ${!passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {localError && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20 flex items-center gap-2">
                  <span className="font-medium">Error:</span> {localError}
                </div>
              )}

              <Button
                type="submit"
                className={`w-full ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isPending}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
