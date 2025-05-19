'use client';

import { useState } from "react";
import { FiCopy, FiTrash2, FiEdit, FiPlus, FiX, FiCheck, FiInfo } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import toast from "react-hot-toast";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CreatePersonalTrainingPackages = () => {
  // State for packages
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Starter Pack",
      sessions: 10,
      price: 300,
      duration: 30,
      description: "Perfect for beginners starting their fitness journey",
      active: true
    },
    {
      id: 2,
      name: "Pro Pack",
      sessions: 20,
      price: 550,
      duration: 60,
      description: "For those committed to serious transformation",
      active: true
    }
  ]);

  // State for form
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState({
    id: null,
    name: "",
    sessions: "",
    price: "",
    duration: "",
    description: "",
    active: true
  });
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPackage(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentPackage.name || !currentPackage.sessions || !currentPackage.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isEditing) {
      // Update existing package
      setPackages(packages.map(pkg => 
        pkg.id === currentPackage.id ? currentPackage : pkg
      ));
      toast.success("Package updated successfully");
    } else {
      // Add new package
      const newId = packages.length > 0 ? Math.max(...packages.map(pkg => pkg.id)) + 1 : 1;
      setPackages([...packages, { ...currentPackage, id: newId }]);
      toast.success("Package created successfully");
    }

    resetForm();
  };

  const resetForm = () => {
    setCurrentPackage({
      id: null,
      name: "",
      sessions: "",
      price: "",
      duration: "",
      description: "",
      active: true
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEdit = (pkg) => {
    setCurrentPackage(pkg);
    setIsEditing(true);
    setShowForm(true);
  };

  const confirmDelete = (id) => {
    setPackageToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    setPackages(packages.filter(pkg => pkg.id !== packageToDelete));
    toast.success("Package deleted successfully");
    setShowDeleteDialog(false);
  };

  const toggleStatus = (id) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, active: !pkg.active } : pkg
    ));
  };

  return (
    <div className='w-full bg-gray-50 min-h-screen p-4 md:p-6'>
      {/* Breadcrumb and Header */}
      <div className='w-full mb-6'>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <MdHome className='w-4 h-4' />
              <BreadcrumbLink href="/" className="ml-2">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Personal Training</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink className="font-semibold">Packages</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Personal Training Packages</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="rounded-sm"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </div>
      </div>

      {/* Package Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 lg:px-28 px-16 z-50">
          <Card className="w-full max-w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {isEditing ? "Edit Package" : "Create New Package"}
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <FiX className="h-5 w-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentPackage.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Premium Package"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessions">Number of Sessions *</Label>
                    <Input
                      id="sessions"
                      name="sessions"
                      type="number"
                      value={currentPackage.sessions}
                      onChange={handleInputChange}
                      placeholder="e.g., 12"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (days) *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      value={currentPackage.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 30"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={currentPackage.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 299"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={currentPackage.description}
                    onChange={handleInputChange}
                    placeholder="Describe the package benefits..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="active"
                    name="active"
                    type="checkbox"
                    checked={currentPackage.active}
                    onChange={(e) => setCurrentPackage({...currentPackage, active: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="active">Active (available for purchase)</Label>
                </div>
                
                <CardFooter className="flex justify-end gap-2 px-0 pb-0 pt-6">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {isEditing ? "Update Package" : "Create Package"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Packages</CardTitle>
          <p className="text-sm text-gray-600">
            Manage all personal training packages offered at your gym
          </p>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <div className="text-center py-8">
              <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No packages yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new personal training package.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FiPlus className="h-4 w-4 mr-2" />
                  New Package
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Name</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">
                      {pkg.name}
                      {pkg.description && (
                        <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                      )}
                    </TableCell>
                    <TableCell>{pkg.sessions}</TableCell>
                    <TableCell>{pkg.duration} days</TableCell>
                    <TableCell>${pkg.price}</TableCell>
                    <TableCell>
                      <Badge variant={pkg.active ? "default" : "secondary"}>
                        {pkg.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(pkg.id)}
                      >
                        {pkg.active ? <FiX className="h-4 w-4" /> : <FiCheck className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(pkg)}
                      >
                        <FiEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmDelete(pkg.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the package and remove it from your system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Package
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreatePersonalTrainingPackages;