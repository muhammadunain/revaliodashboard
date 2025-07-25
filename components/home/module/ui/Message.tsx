'use client'
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Edit3, 
  Trash2, 
  Upload, 
  Send, 
  Download,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Bell,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Bot
} from 'lucide-react';

// Mock data
const propertyData = {
  address: "789 Pine Road",
  location: "Cleveland, Shaker Heights Township, Cuyahoga County",
  activeFilings: 0,
  pendingAuthorizations: 0,
  filingHistory: 1,
  outstandingInvoices: 0
};

const mockMessages = [
  { id: 1, sender: "Property Manager", message: "Monthly inspection completed successfully. Everything looks great! The HVAC system is running efficiently and all safety checks passed.", timestamp: "2024-01-15 10:30 AM", type: "system", avatar: "PM" },
  { id: 2, sender: "You", message: "When is the next maintenance scheduled?", timestamp: "2024-01-14 2:15 PM", type: "user", avatar: "Y" },
  { id: 3, sender: "Property Manager", message: "Welcome to your property dashboard! I'm here to help with any questions about your property at 789 Pine Road.", timestamp: "2024-01-10 9:00 AM", type: "system", avatar: "PM" }
];

const mockDocuments = [
  { id: 1, name: "Property Lease Agreement.pdf", size: "2.4 MB", uploadDate: "2024-01-10", type: "pdf", category: "Legal" },
  { id: 2, name: "Insurance Certificate.pdf", size: "1.8 MB", uploadDate: "2024-01-08", type: "pdf", category: "Insurance" },
  { id: 3, name: "Property Photos.zip", size: "15.2 MB", uploadDate: "2024-01-05", type: "zip", category: "Media" },
  { id: 4, name: "Inspection Report Q4.pdf", size: "3.1 MB", uploadDate: "2024-01-03", type: "pdf", category: "Reports" }
];

const mockPayments = [
  { id: 1, description: "Monthly Rent - January 2025", amount: 2500, dueDate: "2025-01-01", status: "paid", paidDate: "2024-12-28", method: "Bank Transfer" },
  { id: 2, description: "Property Management Fee", amount: 150, dueDate: "2025-01-15", status: "pending", method: "Auto Pay" },
  { id: 3, description: "Maintenance Fee", amount: 75, dueDate: "2025-01-20", status: "overdue", method: "Credit Card" }
];

const autoResponses = [
  "Thank you for your message! I'll look into that and get back to you shortly.",
  "I've received your request. Let me check the property records and respond within 24 hours.",
  "Great question! I'll coordinate with the maintenance team and update you soon.",
  "I'll review this with our property management team and provide an update by tomorrow.",
  "Thanks for reaching out! I'm checking on this matter and will respond with details shortly.",
  "I've noted your concern and will investigate this promptly. Expect a response within 2 business hours.",
  "Your message has been received. I'm coordinating with the relevant departments to address this.",
  "I'll look into the property maintenance schedule and get back to you with the exact dates."
];

const MessagingComponent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState(mockDocuments);
  const [payments, setPayments] = useState(mockPayments);
  const [newPaymentAmount, setNewPaymentAmount] = useState('');
  const [newPaymentDescription, setNewPaymentDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Tab navigation with notification badges
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'documents', label: 'Documents', icon: FileText, badge: documents.length },
    // @ts-ignore

    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messages.filter(m => m.type === 'system' && !m.read).length || null },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: payments.filter(p => p.status === 'overdue').length || null }
  ];

  // Enhanced message handling with auto-response
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        sender: "You",
        message: newMessage,
        timestamp: new Date().toLocaleString(),
        type: "user",
        avatar: "Y"
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      // Simulate typing delay and auto-response
      setTimeout(() => {
        setIsTyping(false);
        const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
        const systemMessage = {
          id: messages.length + 2,
          sender: "Property Manager",
          message: randomResponse,
          timestamp: new Date().toLocaleString(),
          type: "system",
          avatar: "PM"
        };
        setMessages(prev => [...prev, systemMessage]);
      }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
    }
  };

  // Enhanced document upload
  const handleDocumentUpload = (event:any) => {
    const files:any = Array.from(event.target.files);
    // @ts-ignore
    files.forEach(file => {
      const newDoc = {
        id: documents.length + Math.random(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        type: file.name.split('.').pop().toLowerCase(),
        category: "New Upload"
      };
      setDocuments(prev => [...prev, newDoc]);
    });
  };

  // Enhanced payment handling
  const handlePaymentSubmission = () => {
    if (newPaymentAmount && newPaymentDescription) {
      const payment = {
        id: payments.length + 1,
        description: newPaymentDescription,
        amount: parseFloat(newPaymentAmount),
        dueDate: new Date().toISOString().split('T')[0],
        status: "pending",
        method: "Manual"
      };
      setPayments([...payments, payment]);
      setNewPaymentAmount('');
      setNewPaymentDescription('');
    }
  };

  const getStatusBadge = (status:any) => {
    const statusStyles = {
      'In Progress': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg',
      'Action Required': 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse',
      'Total Filings': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg',
      'Payment Due': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg',
      'paid': 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg',
      'pending': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg',
      'overdue': 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-bounce'
    };

    const icons:any = {
      'paid': CheckCircle,
      'pending': Clock,
      'overdue': AlertCircle
    };

    const Icon = icons[status];

    return (
    // @ts-ignore

      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusStyles[status] || statusStyles['pending']}`}>
        {Icon && <Icon className="w-3 h-3" />}
        {status === 'paid' ? 'Paid' : status === 'pending' ? 'Pending' : status === 'overdue' ? 'Overdue' : status}
      </span>
    );
  };

  const getFileIcon = (type:any) => {
    const iconMap:any = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      zip: '🗂️',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️'
    };
    return iconMap[type] || '📄';
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header with gradient */}
      <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-700 text-white shadow-xl">
        <div className="px-6 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{propertyData.address}</h1>
              <p className="text-blue-100 flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                {propertyData.location}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Active Property</span>
                <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200">
                <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold shadow-lg">
                <Edit3 className="w-4 h-4" />
                Edit Property
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="px-6">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 py-4 px-6 font-semibold text-sm transition-all duration-200 rounded-t-lg ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-t from-blue-50 to-white text-blue-700 border-b-2 border-blue-500 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  {getStatusBadge('In Progress')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Filings</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{propertyData.activeFilings}</p>
                  <p className="text-xs text-gray-500">For this property</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  {getStatusBadge('Action Required')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Authorizations</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{propertyData.pendingAuthorizations}</p>
                  <p className="text-xs text-gray-500">Documents awaiting signature</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-gray-600" />
                  </div>
                  {getStatusBadge('Total Filings')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Filing History</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{propertyData.filingHistory}</p>
                  <p className="text-xs text-gray-500">All time filings</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  {getStatusBadge('Payment Due')}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Outstanding Invoices</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{propertyData.outstandingInvoices}</p>
                  <p className="text-xs text-gray-500">Awaiting payment</p>
                </div>
              </div>
            </div>

            {/* Enhanced Property Details and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Home className="w-6 h-6 text-blue-600" />
                  Property Details
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 text-lg">{propertyData.address}</h4>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">Cleveland, Shaker Heights</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <Home className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-medium">Cuyahoga County</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Filing History
                    </h5>
                    <div className="flex items-center justify-between py-3 px-4 bg-yellow-50 rounded-xl">
                      <span className="font-medium text-gray-700">2025</span>
                      {getStatusBadge('pending')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="w-full flex items-center gap-4 p-4 text-left rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="p-3 bg-blue-100 group-hover:bg-blue-200 rounded-xl transition-colors duration-200">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700">View Documents</p>
                      <p className="text-sm text-gray-500">Access all property documents</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('payments')}
                    className="w-full flex items-center gap-4 p-4 text-left rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all duration-200 group"
                  >
                    <div className="p-3 bg-green-100 group-hover:bg-green-200 rounded-xl transition-colors duration-200">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-green-700">Manage Payments</p>
                      <p className="text-sm text-gray-500">View and pay invoices</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('messages')}
                    className="w-full flex items-center gap-4 p-4 text-left rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200 group"
                  >
                    <div className="p-3 bg-purple-100 group-hover:bg-purple-200 rounded-xl transition-colors duration-200">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-purple-700">Contact Support</p>
                      <p className="text-sm text-gray-500">Get help with your filings</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <input
                  type="file"
                  id="document-upload"
                  className="hidden"
                  onChange={handleDocumentUpload}
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                />
                <label
                  htmlFor="document-upload"
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 cursor-pointer transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Upload className="w-4 h-4" />
                  Upload Document
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="group p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 hover:shadow-md">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-2xl">{getFileIcon(doc.type)}</div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">{doc.name}</p>
                        <p className="text-sm text-gray-500 mb-2">{doc.size} • {doc.uploadDate}</p>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          {doc.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-full">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Property Support</h3>
                    <p className="text-sm text-gray-600">We typically respond within 2 hours</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-b border-gray-100">
                <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`flex gap-3 max-w-xs lg:max-w-md ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          msg.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {msg.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                          msg.type === 'user' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md' 
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                            {msg.sender} • {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex gap-3 max-w-xs lg:max-w-md">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-gray-700" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-md">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="p-6 bg-gray-50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                <DollarSign className="w-4 h-4" />
                Make Payment
              </button>
            </div>

            {/* Enhanced Payment Submission */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-green-600" />
                Submit New Payment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Description</label>
                  <input
                    type="text"
                    value={newPaymentDescription}
                    onChange={(e) => setNewPaymentDescription(e.target.value)}
                    placeholder="e.g., Monthly Rent, Maintenance Fee..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                    <input
                      type="number"
                      value={newPaymentAmount}
                      onChange={(e) => setNewPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                    />
                  </div>
                  <div className="self-end">
                    <button
                      onClick={handlePaymentSubmission}
                      disabled={!newPaymentAmount || !newPaymentDescription}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Payment History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-gray-600" />
                  Payment History
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="group p-6 border border-gray-200 rounded-xl hover:border-green-200 hover:bg-green-50 transition-all duration-200 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            payment.status === 'paid' ? 'bg-green-100' : 
                            payment.status === 'overdue' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            <DollarSign className={`w-6 h-6 ${
                              payment.status === 'paid' ? 'text-green-600' : 
                              payment.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg group-hover:text-green-700 transition-colors duration-200">
                              {payment.description}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-sm text-gray-500">
                                Due: {payment.dueDate}
                              </p>
                              {payment.paidDate && (
                                <p className="text-sm text-green-600 font-medium">
                                  Paid: {payment.paidDate}
                                </p>
                              )}
                              <span className="text-sm text-gray-500">
                                via {payment.method}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-2xl text-gray-900">${payment.amount}</span>
                          {getStatusBadge(payment.status)}
                          {payment.status !== 'paid' && (
                            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100">
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Paid</p>
                    <p className="text-2xl font-bold">
                      ${payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold">
                      ${payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Overdue</p>
                    <p className="text-2xl font-bold">
                      ${payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-200" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MessagingComponent;