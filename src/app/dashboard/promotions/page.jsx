"use client";

import { useState, useEffect } from "react";
import { format, isAfter, isBefore, isToday } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { CalendarIcon, Search, Trash2, Edit, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for offers
const initialOffers = [
    {
        id: "1",
        title: "Summer Fitness Challenge",
        description: "Join our 8-week summer challenge and get 20% off your membership",
        offerType: "discount",
        discountValue: 20,
        isPercentage: true,
        startDate: new Date(2025, 4, 1).toISOString(),
        endDate: new Date(2025, 6, 31).toISOString(),
        targetAudience: ["all_members", "new_joiners"],
        isActive: true,
    },
    {
        id: "2",
        title: "Refer a Friend",
        description: "Get $50 credit when you refer a friend who joins our gym",
        offerType: "referral",
        discountValue: 50,
        isPercentage: false,
        startDate: new Date(2025, 3, 1).toISOString(),
        endDate: new Date(2025, 8, 30).toISOString(),
        targetAudience: ["all_members"],
        isActive: true,
    },
    {
        id: "3",
        title: "Expired Member Comeback",
        description: "Former members get 30% off for 3 months when they rejoin",
        offerType: "discount",
        discountValue: 30,
        isPercentage: true,
        startDate: new Date(2025, 2, 1).toISOString(),
        endDate: new Date(2025, 4, 30).toISOString(),
        targetAudience: ["expired_members"],
        isActive: false,
    },
    {
        id: "4",
        title: "Holiday Special",
        description: "Join during the holidays and get your first month free",
        offerType: "festival",
        discountValue: 100,
        isPercentage: true,
        startDate: new Date(2025, 11, 1).toISOString(),
        endDate: new Date(2025, 11, 31).toISOString(),
        targetAudience: ["new_joiners"],
        isActive: true,
    },
];

// Offer type options
const offerTypeOptions = [
    { value: "discount", label: "Discount" },
    { value: "referral", label: "Referral Program" },
    { value: "festival", label: "Festival/Seasonal" },
    { value: "limited", label: "Limited Time" },
    { value: "bundle", label: "Bundle Offer" },
];

// Target audience options
const targetAudienceOptions = [
    { value: "all_members", label: "All Members" },
    { value: "new_joiners", label: "New Joiners" },
    { value: "expired_members", label: "Expired Members" },
    { value: "premium_members", label: "Premium Members" },
    { value: "inactive_members", label: "Inactive Members" },
];

// Default form values
const defaultFormValues = {
    title: "",
    description: "",
    offerType: "",
    discountValue: 0,
    isPercentage: true,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    targetAudience: [],
    isActive: true,
};

export default function PromotionsAndOffersManagement() {
    // State for offers list
    const [offers, setOffers] = useState(initialOffers);
    const [filteredOffers, setFilteredOffers] = useState(initialOffers);

    // State for form and modals
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentOffer, setCurrentOffer] = useState(null);
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [formErrors, setFormErrors] = useState({});

    // State for filters
    const [filters, setFilters] = useState({
        status: "all",
        offerType: "all",
        searchTerm: "",
    });

    // State for view mode
    const [viewMode, setViewMode] = useState("cards");

    // Calculate offer status
    const getOfferStatus = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (isBefore(now, start)) return "upcoming";
        if (isAfter(now, end)) return "expired";
        return "active";
    };

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormValues({ ...formValues, [field]: value });
        // Clear error when field is edited
        if (formErrors[field]) {
            setFormErrors({ ...formErrors, [field]: null });
        }
    };

    // Handle target audience selection
    const handleTargetAudienceChange = (value) => {
        const updatedTargets = formValues.targetAudience.includes(value)
            ? formValues.targetAudience.filter(item => item !== value)
            : [...formValues.targetAudience, value];

        setFormValues({ ...formValues, targetAudience: updatedTargets });
    };

    // Form validation
    const validateForm = () => {
        const errors = {};

        if (!formValues.title.trim()) errors.title = "Title is required";
        if (!formValues.description.trim()) errors.description = "Description is required";
        if (!formValues.offerType) errors.offerType = "Offer type is required";
        if (formValues.discountValue <= 0) errors.discountValue = "Discount value must be greater than 0";
        if (!formValues.startDate) errors.startDate = "Start date is required";
        if (!formValues.endDate) errors.endDate = "End date is required";
        if (new Date(formValues.startDate) > new Date(formValues.endDate)) {
            errors.endDate = "End date must be after start date";
        }
        if (formValues.targetAudience.length === 0) errors.targetAudience = "At least one target audience must be selected";

        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e?.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (currentOffer) {
                // Update existing offer
                const updatedOffers = offers.map(offer =>
                    offer.id === currentOffer.id ? { ...formValues, id: currentOffer.id } : offer
                );
                setOffers(updatedOffers);
                // Mock API call - would be replaced with actual API call
                // await fetch(`/api/promotions/${currentOffer.id}`, {
                //   method: 'PUT',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(formValues),
                // });
            } else {
                // Create new offer
                const newOffer = {
                    ...formValues,
                    id: String(Date.now()),
                };
                setOffers([...offers, newOffer]);
                // Mock API call - would be replaced with actual API call
                // await fetch('/api/promotions', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(newOffer),
                // });
            }

            // Close dialog and reset form
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setCurrentOffer(null);
            setFormValues(defaultFormValues);
            setFormErrors({});
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error (show message, etc.)
        }
    };

    // Handle offer deletion
    const handleDeleteOffer = async () => {
        if (!currentOffer) return;

        try {
            const updatedOffers = offers.filter(offer => offer.id !== currentOffer.id);
            setOffers(updatedOffers);

            // Mock API call - would be replaced with actual API call
            // await fetch(`/api/promotions/${currentOffer.id}`, {
            //   method: 'DELETE',
            // });

            setIsDeleteDialogOpen(false);
            setCurrentOffer(null);
        } catch (error) {
            console.error("Error deleting offer:", error);
            // Handle error (show message, etc.)
        }
    };

    // Handle offer activation/deactivation
    const handleToggleActiveStatus = async (offerId) => {
        try {
            const updatedOffers = offers.map(offer => {
                if (offer.id === offerId) {
                    return { ...offer, isActive: !offer.isActive };
                }
                return offer;
            });

            setOffers(updatedOffers);

            // Mock API call - would be replaced with actual API call
            // await fetch(`/api/promotions/${offerId}/toggle-status`, {
            //   method: 'PATCH',
            // });
        } catch (error) {
            console.error("Error toggling offer status:", error);
            // Handle error (show message, etc.)
        }
    };

    // Open edit dialog
    const openEditDialog = (offer) => {
        setCurrentOffer(offer);
        setFormValues({
            title: offer.title,
            description: offer.description,
            offerType: offer.offerType,
            discountValue: offer.discountValue,
            isPercentage: offer.isPercentage,
            startDate: offer.startDate,
            endDate: offer.endDate,
            targetAudience: offer.targetAudience,
            isActive: offer.isActive,
        });
        setIsEditDialogOpen(true);
    };

    // Open create dialog
    const openCreateDialog = () => {
        setCurrentOffer(null);
        setFormValues(defaultFormValues);
        setFormErrors({});
        setIsCreateDialogOpen(true);
    };

    // Apply filters
    useEffect(() => {
        let results = [...offers];

        // Filter by status
        if (filters.status !== "all") {
            results = results.filter(offer => {
                const status = getOfferStatus(offer.startDate, offer.endDate);
                return status === filters.status;
            });
        }

        // Filter by offer type
        if (filters.offerType !== "all") {
            results = results.filter(offer => offer.offerType === filters.offerType);
        }

        // Filter by search term
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            results = results.filter(offer =>
                offer.title.toLowerCase().includes(searchLower) ||
                offer.description.toLowerCase().includes(searchLower)
            );
        }

        setFilteredOffers(results);
    }, [offers, filters]);

    // Format date for display
    const formatDate = (dateString) => {
        return format(new Date(dateString), "MMM dd, yyyy");
    };

    // Render status badge
    const renderStatusBadge = (startDate, endDate) => {
        const status = getOfferStatus(startDate, endDate);

        switch (status) {
            case "upcoming":
                return <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>;
            case "active":
                return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
            case "expired":
                return <Badge className="bg-gray-500 hover:bg-gray-600">Expired</Badge>;
            default:
                return null;
        }
    };

    // Render form for create/edit
    const renderOfferForm = () => {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title" className={cn(formErrors.title && "text-red-500")}>
                        Title {formErrors.title && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                        id="title"
                        value={formValues.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className={cn(formErrors.title && "border-red-500")}
                    />
                    {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className={cn(formErrors.description && "text-red-500")}>
                        Description {formErrors.description && <span className="text-red-500">*</span>}
                    </Label>
                    <Textarea
                        id="description"
                        value={formValues.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className={cn("min-h-32", formErrors.description && "border-red-500")}
                    />
                    {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="offerType" className={cn(formErrors.offerType && "text-red-500")}>
                        Offer Type {formErrors.offerType && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                        value={formValues.offerType}
                        onValueChange={(value) => handleInputChange("offerType", value)}
                    >
                        <SelectTrigger className={cn(formErrors.offerType && "border-red-500")}>
                            <SelectValue placeholder="Select offer type" />
                        </SelectTrigger>
                        <SelectContent>
                            {offerTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formErrors.offerType && <p className="text-red-500 text-sm">{formErrors.offerType}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="discountValue" className={cn(formErrors.discountValue && "text-red-500")}>
                            Discount Value {formErrors.discountValue && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            id="discountValue"
                            type="number"
                            value={formValues.discountValue}
                            onChange={(e) => handleInputChange("discountValue", parseFloat(e.target.value) || 0)}
                            className={cn(formErrors.discountValue && "border-red-500")}
                        />
                        {formErrors.discountValue && <p className="text-red-500 text-sm">{formErrors.discountValue}</p>}
                    </div>

                    <div className="space-y-2 flex items-end">
                        <div className="flex items-center space-x-2 h-10">
                            <Checkbox
                                id="isPercentage"
                                checked={formValues.isPercentage}
                                onCheckedChange={(checked) => handleInputChange("isPercentage", checked)}
                            />
                            <Label htmlFor="isPercentage">Is Percentage</Label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate" className={cn(formErrors.startDate && "text-red-500")}>
                            Start Date {formErrors.startDate && <span className="text-red-500">*</span>}
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        formErrors.startDate && "border-red-500"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formValues.startDate ? (
                                        format(new Date(formValues.startDate), "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={new Date(formValues.startDate)}
                                    onSelect={(date) => handleInputChange("startDate", date?.toISOString())}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {formErrors.startDate && <p className="text-red-500 text-sm">{formErrors.startDate}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endDate" className={cn(formErrors.endDate && "text-red-500")}>
                            End Date {formErrors.endDate && <span className="text-red-500">*</span>}
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        formErrors.endDate && "border-red-500"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formValues.endDate ? (
                                        format(new Date(formValues.endDate), "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={new Date(formValues.endDate)}
                                    onSelect={(date) => handleInputChange("endDate", date?.toISOString())}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {formErrors.endDate && <p className="text-red-500 text-sm">{formErrors.endDate}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className={cn(formErrors.targetAudience && "text-red-500")}>
                        Target Audience {formErrors.targetAudience && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {targetAudienceOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`target-${option.value}`}
                                    checked={formValues.targetAudience.includes(option.value)}
                                    onCheckedChange={() => handleTargetAudienceChange(option.value)}
                                />
                                <Label htmlFor={`target-${option.value}`}>{option.label}</Label>
                            </div>
                        ))}
                    </div>
                    {formErrors.targetAudience && <p className="text-red-500 text-sm">{formErrors.targetAudience}</p>}
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="isActive"
                        checked={formValues.isActive}
                        onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                    />
                    <Label htmlFor="isActive">Active</Label>
                </div>
            </div>
        );
    };

    // Render card view
    const renderCardView = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOffers.map((offer) => (
                    <Card key={offer.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{offer.title}</CardTitle>
                                    <CardDescription className="mt-1">{offer.offerTypeOptions?.find(type => type.value === offer.offerType)?.label || offer.offerType}</CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {renderStatusBadge(offer.startDate, offer.endDate)}
                                    {offer.isActive ? (
                                        <Badge className="bg-green-500 hover:bg-green-600">Enabled</Badge>
                                    ) : (
                                        <Badge className="bg-red-500 hover:bg-red-600">Disabled</Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm mb-2">{offer.description}</p>
                            <div className="text-sm text-gray-500 grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <span className="font-medium">Discount:</span>{" "}
                                    {offer.discountValue}{offer.isPercentage ? "%" : "$"}
                                </div>
                                <div>
                                    <span className="font-medium">Target:</span>{" "}
                                    {offer.targetAudience.map(target =>
                                        targetAudienceOptions.find(option => option.value === target)?.label || target
                                    ).join(", ")}
                                </div>
                                <div>
                                    <span className="font-medium">Start:</span> {formatDate(offer.startDate)}
                                </div>
                                <div>
                                    <span className="font-medium">End:</span> {formatDate(offer.endDate)}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(offer)}>
                                <Edit className="mr-1 h-4 w-4" />
                                Edit
                            </Button>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleToggleActiveStatus(offer.id)}
                                    className={cn(
                                        offer.isActive ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"
                                    )}
                                >
                                    {offer.isActive ? "Disable" : "Enable"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => {
                                        setCurrentOffer(offer);
                                        setIsDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    };

    // Render table view
    const renderTableView = () => {
        return (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOffers.map((offer) => (
                            <TableRow key={offer.id}>
                                <TableCell className="font-medium">{offer.title}</TableCell>
                                <TableCell>{offerTypeOptions.find(type => type.value === offer.offerType)?.label || offer.offerType}</TableCell>
                                <TableCell>{offer.discountValue}{offer.isPercentage ? "%" : "$"}</TableCell>
                                <TableCell>
                                    {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {renderStatusBadge(offer.startDate, offer.endDate)}
                                        {offer.isActive ? (
                                            <Badge className="bg-green-500 hover:bg-green-600">Enabled</Badge>
                                        ) : (
                                            <Badge className="bg-red-500 hover:bg-red-600">Disabled</Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(offer)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleActiveStatus(offer.id)}
                                            className={cn(
                                                offer.isActive ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"
                                            )}
                                        >
                                            {offer.isActive ? "Disable" : "Enable"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => {
                                                setCurrentOffer(offer);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    // Main component
    return (
        <div className="px-4 py-6 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Promotions & Offers</h1>
                    <p className="text-gray-500 mt-1">Manage your gym's promotional campaigns and special offers</p>
                </div>
                <Button
                    onClick={openCreateDialog}
                    size="sm"
                    className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Offer
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search offers..."
                                value={filters.searchTerm}
                                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-2">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Status:</span>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => setFilters({ ...filters, status: value })}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Type:</span>
                            <Select
                                value={filters.offerType}
                                onValueChange={(value) => setFilters({ ...filters, offerType: value })}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {offerTypeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilters({
                                status: "all",
                                offerType: "all",
                                searchTerm: "",
                            })}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            {/* View mode toggle */}
            <div className="flex justify-end mb-4">
                <Tabs
                    value={viewMode}
                    onValueChange={setViewMode}
                    className="w-[200px]"
                >
                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="cards">
                            <span className="flex items-center">
                                <Filter className="h-4 w-4 mr-1" /> Cards
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="table">
                            <span className="flex items-center">
                                <TableIcon className="h-4 w-4 mr-1" /> Table
                            </span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Offers list */}
            {filteredOffers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                    <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No offers found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or create a new offer</p>
                    <Button onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Offer
                    </Button>
                </div>
            ) : viewMode === "cards" ? (
                renderCardView()
            ) : (
                renderTableView()
            )}

            {/* Create Offer Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Offer</DialogTitle>
                        <DialogDescription>
                            Fill out the form to create a new promotional offer for your gym.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        {renderOfferForm()}
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Offer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Offer Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Offer</DialogTitle>
                        <DialogDescription>
                            Make changes to your promotional offer here.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        {renderOfferForm()}
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the offer and remove it from your system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteOffer}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function TableIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3v18" />
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M3 15h18" />
        </svg>
    );
}

function FolderOpen(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
        </svg>
    );
}
