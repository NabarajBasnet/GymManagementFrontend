"use client"

import { useForm } from 'react-hook-form'
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

    const [currentTab, setCurrentTab] = useState('basic')
    const [completedTabs, setCompletedTabs] = useState({
        basic: false,
        location: false,
        billing: false,
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

    const handleNext = () => {
        const tabs = [
            { id: 'basic', label: 'Basic Info' },
            { id: 'location', label: 'Location' },
            { id: 'billing', label: 'Billing' },
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
            { id: 'review', label: 'Review' },
        ]
        const currentIndex = tabs.findIndex(tab => tab.id === currentTab)
        if (currentIndex > 0) {
            setCurrentTab(tabs[currentIndex - 1].id)
        }
    }

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
    } = useForm()

    const onSubmitData = async (data) => {
        try {
            console.log("Data: ", data);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

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

            <form className="mt-4" onSubmit={handleSubmit(onSubmitData)}>
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="grid w-full py-0 grid-cols-4 mb-6 px-0">
                        <TabsTrigger value={'basic'} className='py-4'>Basic Information</TabsTrigger>
                        <TabsTrigger value={'location'} className='py-4'>Location & Locale</TabsTrigger>
                        <TabsTrigger value={'billing'} className='py-4'>Billing & Payment</TabsTrigger>
                        <TabsTrigger value={'review'} className='py-4'>Review & Submit</TabsTrigger>
                    </TabsList>

                    <Card className="p-6 dark:bg-gray-800 dark:border-none">

                        <TabsContent value={'basic'}>
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
                        </TabsContent>

                        <TabsContent value={'location'}>
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
                        </TabsContent>

                        <TabsContent value={'billing'}>
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
                        </TabsContent>

                        <TabsContent value={'review'}>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Check className="w-6 h-6 text-primary" />
                                    <h2 className="text-xl font-semibold">Review & Submit</h2>
                                </div>

                                <Card className="p-6 space-y-6 dark:border-nong dark:bg-gray-800">
                                    <div className="space-y-4">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <Building2 className="w-5 h-5" />
                                            Basic Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Organization Name</p>
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Business Type</p>
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Business Email</p>
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Website URL</p>
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
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
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">State/Province</p>
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">City</p>
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Timezone</p>
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Currency</p>
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Language</p>
                                                <p>{<span className="text-muted-foreground">Not provided</span>}</p>
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
                                                    {<span className="text-muted-foreground">Not provided</span>}
                                                </p>
                                                <p>
                                                    Kathmandu
                                                    44600
                                                </p>
                                                <p>{'Nepal'}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Tax ID</p>
                                                    <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Invoice Email</p>
                                                    <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Payment Provider</p>
                                                    <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Payment Account ID</p>
                                                    <p>{<span className="text-muted-foreground">Not provided</span>}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </Card>
                            </div>
                        </TabsContent>

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
                                    type='submit'
                                >
                                    Submit Organization
                                </Button>
                            )}
                        </div>
                    </Card>
                </Tabs>
            </form>
        </div>
    )
}