"use client"

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    ArrowRight,
    Check,
    User,
    MapPin,
    CreditCard,
    Palette,
    Building2,
    Mail,
    Globe,
    Clock,
    Calendar,
    Banknote,
    FileText,
    Brush
} from "lucide-react"

const businessTypes = ["Gym", "CrossFit", "Yoga", "Fitness", "Martial Arts", "Other"]

const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"]
const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"]
const languages = ["English", "Spanish", "French", "German", "Chinese"]
const paymentProviders = ["Stripe", "PayPal", "Square", "Authorize.net"]

export default function OrganizationSetupForm() {
    const [formData, setFormData] = useState({
        basicInfo: {
            tenant: '',
            name: '',
            businessType: '',
            businessEmail: '',
            websiteUrl: '',
            logoUrl: '',
        },
        location: {
            country: '',
            state: '',
            city: '',
            timezone: '',
            currency: '',
            language: '',
        },
        billing: {
            billingAddress: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
            },
            taxId: '',
            invoiceEmail: '',
            paymentProvider: '',
            paymentAccountId: '',
        },
        branding: {
            brandColor: '#3b82f6',
            logo: '',
            businessHours: {},
        },
    })

    const [currentTab, setCurrentTab] = useState('basic')
    const [completedTabs, setCompletedTabs] = useState({
        basic: false,
        location: false,
        billing: false,
        branding: false,
    })

    // Calculate progress
    const completedCount = Object.values(completedTabs).filter(Boolean).length
    const progress = (completedCount / Object.keys(completedTabs).length) * 100

    const setCompletedTab = (tab, isComplete) => {
        setCompletedTabs(prev => ({
            ...prev,
            [tab]: isComplete,
        }))
    }

    // Tab validation effects
    useEffect(() => {
        const isComplete = !!formData.basicInfo.name &&
            !!formData.basicInfo.businessType &&
            !!formData.basicInfo.businessEmail
        setCompletedTab('basic', isComplete)
    }, [formData.basicInfo])

    useEffect(() => {
        const isComplete = !!formData.location.country &&
            !!formData.location.state &&
            !!formData.location.city &&
            !!formData.location.currency &&
            !!formData.location.language
        setCompletedTab('location', isComplete)
    }, [formData.location])

    useEffect(() => {
        const isComplete = !!formData.billing.billingAddress.addressLine1 &&
            !!formData.billing.billingAddress.city &&
            !!formData.billing.billingAddress.state &&
            !!formData.billing.billingAddress.zipCode &&
            !!formData.billing.billingAddress.country &&
            !!formData.billing.invoiceEmail &&
            !!formData.billing.paymentProvider &&
            !!formData.billing.paymentAccountId
        setCompletedTab('billing', isComplete)
    }, [formData.billing])

    useEffect(() => {
        const isComplete = !!formData.branding.brandColor
        setCompletedTab('branding', isComplete)
    }, [formData.branding])

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const handleNestedChange = (section, parentField, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [parentField]: {
                    ...prev[section][parentField],
                    [field]: value
                }
            }
        }))
    }

    const handleBusinessHoursChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            branding: {
                ...prev.branding,
                businessHours: {
                    ...prev.branding.businessHours,
                    [day]: {
                        ...prev.branding.businessHours[day],
                        [field]: value
                    }
                }
            }
        }))
    }

    const handleNext = () => {
        const tabs = [
            { id: 'basic', label: 'Basic Info' },
            { id: 'location', label: 'Location' },
            { id: 'billing', label: 'Billing' },
            { id: 'branding', label: 'Branding' },
            { id: 'review', label: 'Review' },
        ]
        const currentIndex = tabs.findIndex(tab => tab.id === currentTab)
        if (currentIndex < tabs.length - 1) {
            setCurrentTab(tabs[currentIndex + 1].id)
        }
    }

    const handlePrev = () => {
        const tabs = [
            { id: 'basic', label: 'Basic Info' },
            { id: 'location', label: 'Location' },
            { id: 'billing', label: 'Billing' },
            { id: 'branding', label: 'Branding' },
            { id: 'review', label: 'Review' },
        ]
        const currentIndex = tabs.findIndex(tab => tab.id === currentTab)
        if (currentIndex > 0) {
            setCurrentTab(tabs[currentIndex - 1].id)
        }
    }

    const handleSubmit = () => {
        console.log("Form submitted:", formData)
        alert("Organization setup completed successfully!")
    }

    const BasicInfoTab = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>

            <Card className="p-6 space-y-6 dark:bg-gray-800 dark:border-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Organization Name *</Label>
                        <Input
                            placeholder="Acme Inc."
                            className='dark:bg-gray-900 dark:text-white py-6 rounded-sm dark:border-none bg-white'
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select
                            value={formData.basicInfo.businessType}
                            onValueChange={(value) => handleChange('basicInfo', 'businessType', value)}
                        >
                            <SelectTrigger className='rounded-sm dark:bg-gray-900 dark:border-none p-6'>
                                <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                                {businessTypes.map(type => (
                                    <SelectItem key={type} value={type} className='hover:cursor-pointer hover:bg-blue-600 hover:text-white'>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="businessEmail">Business Email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="businessEmail"
                                type="email"
                                className="pl-9 py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none"
                                placeholder="contact@acme.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="websiteUrl">Website URL</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="websiteUrl"
                                className="pl-9 py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none"
                                placeholder="https://acme.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logoUrl">Logo URL</Label>
                        <Input
                            id="logoUrl"
                            className="py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none"
                            placeholder="https://acme.com/logo.png"
                        />
                    </div>
                </div>
            </Card>
        </div>
    )

    const LocationTab = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Location & Locale</h2>
            </div>

            <Card className="p-6 space-y-6 dark:bg-gray-800 dark:border-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select
                            value={formData.location.country}
                            onValueChange={(value) => handleChange('location', 'country', value)}
                        >
                            <SelectTrigger className='py-6 dark:bg-gray-900 rounded-sm dark:border-none'>
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(country => (
                                    <SelectItem key={country} value={country} className='cursor-pointer hover:bg-blue-500'>{country}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state">State/Province *</Label>
                        <Input
                            id="state"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="California"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                            id="city"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="San Francisco"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                            id="timezone"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="PST (UTC-8)"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency *</Label>
                        <Select
                            value={formData.location.currency}
                            onValueChange={(value) => handleChange('location', 'currency', value)}
                        >
                            <SelectTrigger className='py-6 rounded-sm dark:border-none dark:bg-gray-900 bg-white'>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map(currency => (
                                    <SelectItem key={currency} value={currency} className='cursor-pointer hover:bg-blue-500'>{currency}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language">Language *</Label>
                        <Select
                            value={formData.location.language}
                            onValueChange={(value) => handleChange('location', 'language', value)}
                        >
                            <SelectTrigger className='py-6 rounded-sm dark:bg-gray-900 bg-white dark:border-none'>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(language => (
                                    <SelectItem key={language} value={language} className='cursor-pointer hover:bg-blue-500'>{language}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
        </div>
    )

    const BillingTab = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Billing & Payments</h2>
            </div>

            <Card className="p-6 space-y-6 dark:bg-gray-800 dark:border-none">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-medium">Billing Address</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="addressLine1">Address Line 1 *</Label>
                            <Input
                                id="addressLine1"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="123 Main St"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addressLine2">Address Line 2</Label>
                            <Input
                                id="addressLine2"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="Apt 4B"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="billingCity">City *</Label>
                            <Input
                                id="billingCity"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="San Francisco"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="billingState">State *</Label>
                            <Input
                                id="billingState"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="CA"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                            <Input
                                id="zipCode"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="94105"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="billingCountry">Country *</Label>
                            <Select
                                value={formData.billing.billingAddress.country}
                                onValueChange={(value) => handleNestedChange('billing', 'billingAddress', 'country', value)}
                            >
                                <SelectTrigger className='py-6 dark:border-none dark:bg-gray-900'>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map(country => (
                                        <SelectItem key={country} value={country} className='hover:bg-blue-500 cursor-pointer'>{country}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID</Label>
                        <Input
                            id="taxId"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="123-45-6789"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="invoiceEmail">Invoice Email *</Label>
                        <Input
                            id="invoiceEmail"
                            type="email"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="billing@acme.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentProvider">Payment Provider *</Label>
                        <Select
                            value={formData.billing.paymentProvider}
                            onValueChange={(value) => handleChange('billing', 'paymentProvider', value)}
                        >
                            <SelectTrigger className='py-6 dark:border-none dark:bg-gray-900'>
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentProviders.map(provider => (
                                    <SelectItem className='hover:bg-blue-500 cursor-pointer' key={provider} value={provider}>{provider}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentAccountId">Payment Account ID *</Label>
                        <Input
                            id="paymentAccountId"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="acct_123456789"
                        />
                    </div>
                </div>
            </Card>
        </div>
    )

    const BrandingTab = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Branding & Preferences</h2>
            </div>

            <Card className="p-6 space-y-6 dark:bg-gray-800 dark:border-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="brandColor">Brand Color</Label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                id="brandColor"
                                value={formData.branding.brandColor}
                                onChange={(e) => handleChange('branding', 'brandColor', e.target.value)}
                                className="w-12 h-12 rounded-full cursor-pointer"
                            />
                            <Input
                                value={formData.branding.brandColor}
                                onChange={(e) => handleChange('branding', 'brandColor', e.target.value)}
                                placeholder="#3b82f6"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Logo URL</Label>
                        <Input
                            id="logo"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="https://acme.com/logo.png"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <h3 className="font-medium">Business Hours</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <Label className="font-normal">Opening - Closing</Label>
                            <Input
                                type="time"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="09:00"
                            />
                            <Input
                                type="time"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="17:00"
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )

    const ReviewTab = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Review & Submit</h2>
            </div>

            <Card className="p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Organization Name</p>
                            <p>{formData.basicInfo.name || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Business Type</p>
                            <p>{formData.basicInfo.businessType || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Business Email</p>
                            <p>{formData.basicInfo.businessEmail || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Website URL</p>
                            <p>{formData.basicInfo.websiteUrl || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Location & Locale
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Country</p>
                            <p>{formData.location.country || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">State/Province</p>
                            <p>{formData.location.state || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">City</p>
                            <p>{formData.location.city || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Timezone</p>
                            <p>{formData.location.timezone || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Currency</p>
                            <p>{formData.location.currency || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Language</p>
                            <p>{formData.location.language || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Billing & Payments
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Billing Address</p>
                            <p>
                                {formData.billing.billingAddress.addressLine1 || <span className="text-muted-foreground">Not provided</span>}
                                {formData.billing.billingAddress.addressLine2 && (
                                    <span>, {formData.billing.billingAddress.addressLine2}</span>
                                )}
                            </p>
                            <p>
                                {formData.billing.billingAddress.city && `${formData.billing.billingAddress.city}, `}
                                {formData.billing.billingAddress.state} {formData.billing.billingAddress.zipCode}
                            </p>
                            <p>{formData.billing.billingAddress.country}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Tax ID</p>
                                <p>{formData.billing.taxId || <span className="text-muted-foreground">Not provided</span>}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Invoice Email</p>
                                <p>{formData.billing.invoiceEmail || <span className="text-muted-foreground">Not provided</span>}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payment Provider</p>
                                <p>{formData.billing.paymentProvider || <span className="text-muted-foreground">Not provided</span>}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payment Account ID</p>
                                <p>{formData.billing.paymentAccountId || <span className="text-muted-foreground">Not provided</span>}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Branding & Preferences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Brand Color</p>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: formData.branding.brandColor }}
                                />
                                <p>{formData.branding.brandColor}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Logo URL</p>
                            <p>{formData.branding.logo || <span className="text-muted-foreground">Not provided</span>}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Business Hours</p>
                        <div className="space-y-2">
                            {/* <div key={day} className="flex items-center gap-4">
                                    <p className="w-24">{day}</p>
                                    <p>
                                        {formData.branding.businessHours[day]?.open
                                            ? `${formData.branding.businessHours[day].open} - ${formData.branding.businessHours[day].close}` 
                                            : <span className="text-muted-foreground">Not set</span>}
                                    </p>
                                </div> */}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: <User className="w-4 h-4 mr-2" />, component: <BasicInfoTab /> },
        { id: 'location', label: 'Location', icon: <MapPin className="w-4 h-4 mr-2" />, component: <LocationTab /> },
        { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4 mr-2" />, component: <BillingTab /> },
        { id: 'branding', label: 'Branding', icon: <Palette className="w-4 h-4 mr-2" />, component: <BrandingTab /> },
        { id: 'review', label: 'Review', icon: <Check className="w-4 h-4 mr-2" />, component: <ReviewTab /> },
    ]

    return (
        <div className="w-full p-8 dark:text-white dark:bg-gray-900">
            <h1 className="text-2xl font-bold mb-4">Organization Setup</h1>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Setup Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <div className="mt-4">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="grid w-full py-0 grid-cols-5 mb-6 px-0">
                        {tabs.map(tab => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex items-center py-4 justify-center"
                            >
                                {completedTabs[tab.id] ? (
                                    <Check className="w-4 h-4 mr-2 text-green-500" />
                                ) : (
                                    tab.icon
                                )}
                                <span className='hidden md:flex'>
                                    {tab.label}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <Card className="p-6 dark:bg-gray-800 dark:border-none">
                        {tabs.map(tab => (
                            <TabsContent key={tab.id} value={tab.id}>
                                {tab.component}
                            </TabsContent>
                        ))}

                        <div className="flex justify-between mt-8">
                            <Button
                                variant="outline"
                                onClick={handlePrev}
                                disabled={currentTab === 'basic'}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>
                            {currentTab !== 'review' ? (
                                <Button onClick={handleNext}>
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={handleSubmit}
                                >
                                    Submit Organization
                                </Button>
                            )}
                        </div>
                    </Card>
                </Tabs>
            </div>
        </div>
    )
}