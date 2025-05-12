'use client'

import { useState, useEffect } from 'react'
import { format, parseISO, isBefore, isAfter } from 'date-fns'

const PromotionsAndOffersManagement = () => {
    // State for form inputs
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        offerType: 'discount',
        discountValue: 0,
        isPercentage: false,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        targetAudience: [],
        isActive: true,
    })

    const [offers, setOffers] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [currentOfferId, setCurrentOfferId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filters, setFilters] = useState({
        status: 'all',
        offerType: 'all',
        searchQuery: '',
    })

    // Mock API calls
    useEffect(() => {
        // In a real app, you would fetch from your API
        const mockOffers = [
            {
                id: '1',
                title: 'Summer Special',
                description: 'Get 20% off on all annual memberships',
                offerType: 'seasonal',
                discountValue: 20,
                isPercentage: true,
                startDate: '2023-06-01',
                endDate: '2023-08-31',
                targetAudience: ['new_joiners', 'all_members'],
                isActive: true,
                createdAt: '2023-05-15T10:00:00Z',
            },
            {
                id: '2',
                title: 'Referral Bonus',
                description: 'Get $50 credit for each friend who joins',
                offerType: 'referral',
                discountValue: 50,
                isPercentage: false,
                startDate: '2023-05-01',
                endDate: '2023-12-31',
                targetAudience: ['all_members'],
                isActive: true,
                createdAt: '2023-04-20T14:30:00Z',
            },
            {
                id: '3',
                title: 'New Year Resolution',
                description: '15% off for expired members',
                offerType: 'festival',
                discountValue: 15,
                isPercentage: true,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
                targetAudience: ['expired_members'],
                isActive: false,
                createdAt: '2023-12-15T09:15:00Z',
            },
        ]
        setOffers(mockOffers)
    }, [])

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    // Handle audience selection
    const handleAudienceChange = (e) => {
        const { value, checked } = e.target
        let newAudience = [...formData.targetAudience]

        if (checked) {
            newAudience.push(value)
        } else {
            newAudience = newAudience.filter(item => item !== value)
        }

        setFormData({
            ...formData,
            targetAudience: newAudience,
        })
    }

    // Form validation
    const validateForm = () => {
        if (!formData.title.trim()) {
            alert('Title is required')
            return false
        }
        if (formData.discountValue <= 0) {
            alert('Discount value must be greater than 0')
            return false
        }
        if (formData.isPercentage && formData.discountValue > 100) {
            alert('Percentage discount cannot exceed 100%')
            return false
        }
        if (isBefore(new Date(formData.endDate), new Date(formData.startDate))) {
            alert('End date must be after start date')
            return false
        }
        return true
    }

    // Submit form (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            if (isEditing) {
                // Update existing offer
                const updatedOffers = offers.map(offer =>
                    offer.id === currentOfferId ? { ...formData, id: currentOfferId } : offer
                )
                setOffers(updatedOffers)
                // In real app: await fetch(`/api/promotions/${currentOfferId}`, { method: 'PUT', body: JSON.stringify(formData) })
            } else {
                // Create new offer
                const newOffer = {
                    ...formData,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString(),
                }
                setOffers([newOffer, ...offers])
                // In real app: await fetch('/api/promotions', { method: 'POST', body: JSON.stringify(formData) })
            }

            resetForm()
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error saving offer:', error)
            alert('Failed to save offer')
        }
    }

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            offerType: 'discount',
            discountValue: 0,
            isPercentage: false,
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
            targetAudience: [],
            isActive: true,
        })
        setIsEditing(false)
        setCurrentOfferId(null)
    }

    // Edit an existing offer
    const handleEdit = (offer) => {
        setFormData({
            title: offer.title,
            description: offer.description,
            offerType: offer.offerType,
            discountValue: offer.discountValue,
            isPercentage: offer.isPercentage,
            startDate: offer.startDate,
            endDate: offer.endDate,
            targetAudience: offer.targetAudience,
            isActive: offer.isActive,
        })
        setIsEditing(true)
        setCurrentOfferId(offer.id)
        setIsModalOpen(true)
    }

    // Delete an offer
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this offer?')) {
            setOffers(offers.filter(offer => offer.id !== id))
            // In real app: await fetch(`/api/promotions/${id}`, { method: 'DELETE' })
        }
    }

    // Toggle offer active status
    const toggleActiveStatus = (id) => {
        setOffers(offers.map(offer =>
            offer.id === id ? { ...offer, isActive: !offer.isActive } : offer
        ))
        // In real app: await fetch(`/api/promotions/${id}/toggle`, { method: 'PATCH' })
    }

    // Get offer status based on dates
    const getOfferStatus = (offer) => {
        const now = new Date()
        const startDate = new Date(offer.startDate)
        const endDate = new Date(offer.endDate)

        if (isBefore(now, startDate)) return 'Upcoming'
        if (isAfter(now, endDate)) return 'Expired'
        return 'Active'
    }

    // Filter offers based on selected filters
    const filteredOffers = offers.filter(offer => {
        // Status filter
        if (filters.status !== 'all') {
            const status = getOfferStatus(offer)
            if (filters.status !== status.toLowerCase()) return false
        }

        // Offer type filter
        if (filters.offerType !== 'all' && offer.offerType !== filters.offerType) {
            return false
        }

        // Search query filter
        if (filters.searchQuery &&
            !offer.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
            !offer.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
            return false
        }

        return true
    })

    // Audience options
    const audienceOptions = [
        { value: 'new_joiners', label: 'New Joiners' },
        { value: 'expired_members', label: 'Expired Members' },
        { value: 'all_members', label: 'All Members' },
    ]

    // Offer type options
    const offerTypes = [
        { value: 'discount', label: 'Discount' },
        { value: 'referral', label: 'Referral' },
        { value: 'seasonal', label: 'Seasonal' },
        { value: 'festival', label: 'Festival' },
        { value: 'loyalty', label: 'Loyalty' },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Promotions & Offers</h1>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <button
                        onClick={() => {
                            resetForm()
                            setIsModalOpen(true)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    >
                        Create New Offer
                    </button>
                </div>

                <div className="flex space-x-4">
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="border rounded-md px-3 py-2 pr-8 appearance-none"
                        >
                            <option value="all">All Statuses</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>

                    <div className="relative">
                        <select
                            value={filters.offerType}
                            onChange={(e) => setFilters({ ...filters, offerType: e.target.value })}
                            className="border rounded-md px-3 py-2 pr-8 appearance-none"
                        >
                            <option value="all">All Types</option>
                            {offerTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Search offers..."
                            value={filters.searchQuery}
                            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                            className="border rounded-md px-3 py-2"
                        />
                    </div>
                </div>
            </div>

            {/* Offers List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOffers.length > 0 ? (
                                filteredOffers.map((offer) => (
                                    <tr key={offer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{offer.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600 line-clamp-2">{offer.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {offer.offerType.charAt(0).toUpperCase() + offer.offerType.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-gray-900">
                                                {offer.discountValue}{offer.isPercentage ? '%' : '$'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {format(parseISO(offer.startDate), 'MMM dd, yyyy')} - {format(parseISO(offer.endDate), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOfferStatus(offer) === 'Active' ? 'bg-green-100 text-green-800' :
                                                getOfferStatus(offer) === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {getOfferStatus(offer)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(offer)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(offer.id)}
                                                className="text-red-600 hover:text-red-900 mr-3"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => toggleActiveStatus(offer.id)}
                                                className={`${offer.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                                                    }`}
                                            >
                                                {offer.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        No offers found. Create your first promotion!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Offer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {isEditing ? 'Edit Offer' : 'Create New Offer'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        resetForm()
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="offerType" className="block text-sm font-medium text-gray-700 mb-1">
                                            Offer Type
                                        </label>
                                        <select
                                            id="offerType"
                                            name="offerType"
                                            value={formData.offerType}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {offerTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount Value *
                                            </label>
                                            <input
                                                type="number"
                                                id="discountValue"
                                                name="discountValue"
                                                value={formData.discountValue}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="isPercentage"
                                                    name="isPercentage"
                                                    checked={formData.isPercentage}
                                                    onChange={handleInputChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="isPercentage" className="ml-2 block text-sm text-gray-700">
                                                    Is Percentage?
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                                Start Date *
                                            </label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                                End Date *
                                            </label>
                                            <input
                                                type="date"
                                                id="endDate"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                min={formData.startDate}
                                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Target Audience
                                        </label>
                                        <div className="space-y-2">
                                            {audienceOptions.map(option => (
                                                <div key={option.value} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`audience-${option.value}`}
                                                        name="targetAudience"
                                                        value={option.value}
                                                        checked={formData.targetAudience.includes(option.value)}
                                                        onChange={handleAudienceChange}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor={`audience-${option.value}`} className="ml-2 block text-sm text-gray-700">
                                                        {option.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                            Active
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false)
                                            resetForm()
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {isEditing ? 'Update Offer' : 'Create Offer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PromotionsAndOffersManagement;
