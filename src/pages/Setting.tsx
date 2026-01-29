import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Copy,
  Check,
  Loader,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateMyProfileMutation } from "@/lib/api/users";
import { normalizeRole } from "@/config/roleUI";
import { toast } from "sonner";

const Setting = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
  });
  const { mutate: updateProfile, isPending } = useUpdateMyProfileMutation();

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user]);

  if (!user) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      updateProfile(
        { userId: user.id, data: formData },
        {
          onSuccess: () => {
            setEditMode(false);
            toast.success("Profile updated successfully");
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || "Failed to update profile",
            );
          },
        },
      );
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const userRoles = Array.isArray(user.roles) ? user.roles : ["user"];

  // Normalize first role for display
  const firstNormalizedRole =
    userRoles.length > 0 ? normalizeRole(userRoles[0]) : undefined;

  const roleColors: Record<string, string> = {
    "disaster-manager": "bg-red-100 text-red-800",
    "incident-validator": "bg-yellow-100 text-yellow-800",
    "response-team": "bg-blue-100 text-blue-800",
    administrator: "bg-purple-100 text-purple-800",
  };

  const roleColor =
    firstNormalizedRole && roleColors[firstNormalizedRole]
      ? roleColors[firstNormalizedRole]
      : "bg-gray-100 text-gray-800";

  // Format role display name
  const formatRoleName = (role: string): string => {
    const normalized = normalizeRole(role);
    if (normalized) {
      return normalized
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return role
      .split(/[\s-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {editMode ? formData.name : user.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={roleColor}>
                  {formatRoleName(userRoles[0])}
                </Badge>
                {user.isAccountDisabled && (
                  <Badge variant="destructive">Disabled</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button onClick={handleSave} disabled={isPending}>
                    {isPending && (
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Name Field */}
            {editMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isPending}
                />
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Contact Information
              </h3>

              <div className="space-y-3">
                {editMode ? (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={isPending}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-foreground font-medium">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(user.email)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}

                {editMode ? (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      disabled={isPending}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground">
                        @
                      </span>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Username
                        </p>
                        <p className="text-foreground font-medium">
                          {user.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(user.username)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="font-semibold text-foreground">Account Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-foreground font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="text-foreground font-medium">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="font-semibold text-foreground">Assigned Roles</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(user.roles) && user.roles.length > 0 ? (
                  user.roles.map((role) => {
                    const normalized = normalizeRole(role);
                    const roleColorClass =
                      normalized && roleColors[normalized]
                        ? roleColors[normalized]
                        : "bg-gray-100 text-gray-800";
                    return (
                      <Badge key={role} className={`text-sm ${roleColorClass}`}>
                        {formatRoleName(role)}
                      </Badge>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No roles assigned
                  </p>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="font-semibold text-foreground">Account Status</h3>
              <div className="p-3 rounded-lg border border-border bg-background">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Account Status
                    </p>
                    <p className="text-foreground font-medium">
                      {user.isAccountDisabled ? "Disabled" : "Active"}
                    </p>
                  </div>
                  <Badge
                    variant={user.isAccountDisabled ? "destructive" : "default"}
                  >
                    {user.isAccountDisabled ? "Disabled" : "Active"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage your password and security settings
            </p>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Setting;
