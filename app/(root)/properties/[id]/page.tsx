import { getProperties } from '@/lib/actions/property.action'
import React from 'react'
import { MapPin, Building, Edit, Trash2, FileText, CreditCard } from 'lucide-react'

// {params}: {params: Promise<{ slug: string }>}
const pages = async ({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params
    const response = await getProperties()
    const properties = response.data?.filter((property)=>property.id===id)
    
    if (!response.success || !response.data) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No properties found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {properties?.map((property) => (
                <div key={property.id} className="max-w-7xl mx-auto space-y-6">
                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Active Filings */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Active Filings</h3>
                                <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                                    In Progress
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {property.activeFilingsCount || 0}
                            </div>
                            <p className="text-sm text-gray-500">For this property</p>
                        </div>

                        {/* Pending Authorizations */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Pending Authorizations</h3>
                                <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                                    Action Required
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {property.pendingAuthorizations || 0}
                            </div>
                            <p className="text-sm text-gray-500">Documents awaiting your signature</p>
                        </div>

                        {/* Filing History */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Filing History</h3>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {property.filingHistoryCount || 0}
                            </div>
                            <div className="text-sm text-gray-500">
                                <span className="font-medium">Total Filings</span>
                                <br />
                                All time filings for this property
                            </div>
                        </div>

                        {/* Outstanding Invoices */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Outstanding Invoices</h3>
                                <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                                    Payment Due
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                {property.outstandingInvoices || 0}
                            </div>
                            <p className="text-sm text-gray-500">Invoices awaiting payment</p>
                        </div>
                    </div>

                    {/* Main Content Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Property Details - Left Column */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Property Details</h2>
                                
                                {/* Property Header */}
                                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {property.address}
                                            </h3>
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span>{property.city}, {property.country}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Building className="w-4 h-4 mr-2" />
                                                <span>{property.towerShip}</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Property Specifications */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                        Property Specifications
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Property Type</span>
                                                <span className="text-sm font-medium text-gray-900">{property.propertyType}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Bedrooms</span>
                                                <span className="text-sm font-medium text-gray-900">{property.bedrooms}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Bathrooms</span>
                                                <span className="text-sm font-medium text-gray-900">{property.bathrooms}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Area (Sq Ft)</span>
                                                <span className="text-sm font-medium text-gray-900">{property.areaSqFt}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Floor</span>
                                                <span className="text-sm font-medium text-gray-900">{property.floor}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Total Floors</span>
                                                <span className="text-sm font-medium text-gray-900">{property.totalFloors}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Zip Code</span>
                                                <span className="text-sm font-medium text-gray-900">{property.zipCode}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm text-gray-600">Price</span>
                                                <span className="text-sm font-medium text-green-600">${property.price?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Filing History Section */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                                        Filing History
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-center py-8">
                                            <div className="text-center">
                                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-sm text-gray-500">No recent filings to display</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions - Right Column */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                                    
                                    <div className="space-y-4">
                                        <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">View Documents</p>
                                                    <p className="text-sm text-gray-500">Access all property documents</p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        <button className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                    <CreditCard className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Manage Payments</p>
                                                    <p className="text-sm text-gray-500">View and manage payment history</p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default pages