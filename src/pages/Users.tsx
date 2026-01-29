import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  useUsersQuery,
  //   useUpdateUserMutation,
  //   useDeleteUserMutation,
} from "@/lib/api/users";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RegisterDialog from "./Register";
const UsersPage = () => {
  const { data: users = [], isLoading } = useUsersQuery();
  //   const { mutate: updateUser, isPending: isUpdating } =
  //     useUpdateUserMutation();
  //   const { mutate: deleteUser, isPending: isDeleting } =
  //     useDeleteUserMutation();
  const navigate = useNavigate();

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  const openEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.roles?.[0] || "",
    });
  };
  const [open, setOpen] = useState(false);

  //   const handleUpdate = () => {
  //     updateUser(
  //       { id: editingUser.id, data: formData },
  //       {
  //         onSuccess: () => {
  //           toast.success("User updated successfully");
  //           setEditingUser(null);
  //         },
  //         onError: () => toast.error("Failed to update user"),
  //       }
  //     );
  //   };

  //   const handleStatusToggle = (user: any) => {
  //     updateUser(
  //       { id: user.id, data: { active: !user.active } },
  //       {
  //         onSuccess: () => toast.success("User status updated"),
  //         onError: () => toast.error("Failed to update status"),
  //       }
  //     );
  //   };

  //   const handleDelete = (id: number) => {
  //     if (!confirm("Are you sure you want to delete this user?")) return;

  //     deleteUser(id, {
  //       onSuccess: () => toast.success("User deleted successfully"),
  //       onError: () => toast.error("Failed to delete user"),
  //     });
  //   };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Users</h1>
          <p className="text-muted-foreground">
            Manage all registered user accounts
          </p>
          <Button
            className="gap-2"
            onClick={() => setOpen(true)}
            variant="outline"
          >
            <User></User>
            Add User
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="flex justify-center items-center h-64">
              No users found
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user: any) => (
              <Card key={user.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{user.name}</CardTitle>
                  <Badge variant={user.active ? "default" : "destructive"}>
                    {user.active ? "Active" : "Disabled"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p>{user.username}</p>

                  <div className="flex gap-2 flex-wrap">
                    {user.roles?.map((role: string) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(user)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant={user.active ? "secondary" : "default"}
                      //   onClick={() => handleStatusToggle(user)}
                      //   disabled={isUpdating}
                    >
                      {user.active ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      //   onClick={() => handleDelete(user.id)}
                      //   disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <Label>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DISASTER_MANAGER">
                  Disaster Manager
                </SelectItem>
                <SelectItem value="INCIDENT_VALIDATOR">
                  Incident Validator
                </SelectItem>
                <SelectItem value="RESPONSE_TEAM">
                  Emergency Response Team
                </SelectItem>
                <SelectItem value="ADMIN">Administrator</SelectItem>
                <SelectItem value="USER">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              // onClick={handleUpdate}
              // disabled={isUpdating}
              className="w-full"
            >
              {/* {isUpdating && <Loader className="h-4 w-4 mr-2 animate-spin" />} */}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <RegisterDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => toast.success("User created successfully")}
      />
      ;
    </DashboardLayout>
  );
};

export default UsersPage;
