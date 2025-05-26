import React, { useState } from 'react';
import { Theme } from '../BaseCard/types';
import { X, Phone, Mail, Eye, UserPlus, Send, Calendar, MapPin, Globe, Building } from 'lucide-react';

interface BusinessPopupProps {
  theme: Theme;
  onClose: () => void;
}

// Call Contact Page
export const CallContactPopup: React.FC<BusinessPopupProps> = ({ theme, onClose }) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);

  const contact = {
    name: 'John Smith',
    title: 'Business Development Manager',
    company: 'TreeAI Solutions',
    phone: '+1 (555) 123-4567',
    mobile: '+1 (555) 987-6543'
  };

  const handleCall = (number: string) => {
    setCallStatus('calling');
    console.log('Calling:', number);
    
    // Simulate call connection
    setTimeout(() => {
      setCallStatus('connected');
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Auto end call after 10 seconds for demo
      setTimeout(() => {
        clearInterval(interval);
        setCallStatus('ended');
      }, 10000);
    }, 3000);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Phone className="text-green-500" size={24} />
          Call Contact
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
          {contact.name.split(' ').map(n => n[0]).join('')}
        </div>

        <div>
          <h3 className="text-xl font-semibold">{contact.name}</h3>
          <p className="text-sm opacity-70">{contact.title}</p>
          <p className="text-sm opacity-70">{contact.company}</p>
        </div>

        {callStatus === 'idle' && (
          <div className="space-y-4">
            <button
              onClick={() => handleCall(contact.phone)}
              className="w-full bg-green-500 text-white py-4 rounded-lg font-medium hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Call Office: {contact.phone}
            </button>
            <button
              onClick={() => handleCall(contact.mobile)}
              className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Call Mobile: {contact.mobile}
            </button>
          </div>
        )}

        {callStatus === 'calling' && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg">Calling...</p>
            <p className="text-sm opacity-70">Connecting to {contact.phone}</p>
          </div>
        )}

        {callStatus === 'connected' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto animate-pulse">
              <Phone size={24} />
            </div>
            <p className="text-lg font-semibold text-green-500">Connected</p>
            <p className="text-2xl font-mono">{formatDuration(callDuration)}</p>
            <button
              onClick={handleEndCall}
              className="bg-red-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-red-600"
            >
              End Call
            </button>
          </div>
        )}

        {callStatus === 'ended' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center text-white mx-auto">
              <Phone size={24} />
            </div>
            <p className="text-lg">Call Ended</p>
            <p className="text-sm opacity-70">Duration: {formatDuration(callDuration)}</p>
            <button
              onClick={() => {
                setCallStatus('idle');
                setCallDuration(0);
              }}
              className="bg-green-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-600"
            >
              Call Again
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Send Email Page
export const SendEmailPopup: React.FC<BusinessPopupProps> = ({ theme, onClose }) => {
  const [emailData, setEmailData] = useState({
    to: 'john.smith@treeai.com',
    subject: '',
    message: '',
    priority: 'normal' as 'low' | 'normal' | 'high'
  });
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!emailData.subject.trim() || !emailData.message.trim()) return;

    setIsSending(true);
    console.log('Sending email:', emailData);

    // Simulate email sending
    setTimeout(() => {
      setIsSending(false);
      console.log('Email sent successfully');
      onClose();
    }, 2000);
  };

  const templates = [
    { name: 'Introduction', subject: 'Introduction - TreeAI Partnership', message: 'Hello,\n\nI hope this email finds you well. I wanted to reach out to introduce myself and discuss potential partnership opportunities...' },
    { name: 'Follow Up', subject: 'Following up on our conversation', message: 'Hi,\n\nThank you for taking the time to speak with me earlier. As discussed, I wanted to follow up with...' },
    { name: 'Meeting Request', subject: 'Meeting Request - TreeAI Collaboration', message: 'Hello,\n\nI would like to schedule a meeting to discuss how TreeAI can help your business...' }
  ];

  const useTemplate = (template: any) => {
    setEmailData({
      ...emailData,
      subject: template.subject,
      message: template.message
    });
  };

  return (
    <div className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="text-blue-500" size={24} />
          Send Email
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <input
            type="email"
            value={emailData.to}
            onChange={(e) => setEmailData({...emailData, to: e.target.value})}
            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <input
            type="text"
            value={emailData.subject}
            onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
            placeholder="Enter email subject"
            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <select
            value={emailData.priority}
            onChange={(e) => setEmailData({...emailData, priority: e.target.value as any})}
            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            value={emailData.message}
            onChange={(e) => setEmailData({...emailData, message: e.target.value})}
            placeholder="Type your message here..."
            rows={6}
            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Quick Templates</label>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => useTemplate(template)}
                className={`p-2 text-xs rounded border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSendEmail}
            disabled={!emailData.subject.trim() || !emailData.message.trim() || isSending}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Email
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// View Details Page
export const ViewDetailsPopup: React.FC<BusinessPopupProps> = ({ theme, onClose }) => {
  const businessDetails = {
    company: 'TreeAI Solutions',
    contact: 'John Smith',
    title: 'Business Development Manager',
    email: 'john.smith@treeai.com',
    phone: '+1 (555) 123-4567',
    mobile: '+1 (555) 987-6543',
    website: 'https://treeai.com',
    address: '123 Innovation Drive, San Francisco, CA 94105',
    industry: 'Technology / AI Solutions',
    employees: '50-100',
    founded: '2020',
    revenue: '$5M - $10M',
    description: 'TreeAI Solutions specializes in artificial intelligence and machine learning solutions for businesses. We help companies automate processes and gain insights from their data.',
    lastContact: '2024-01-15',
    nextFollowUp: '2024-01-22',
    tags: ['AI', 'Technology', 'B2B', 'SaaS', 'Hot Lead']
  };

  return (
    <div className={`p-6 h-full overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Eye className="text-orange-500" size={24} />
          Business Details
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Company Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
            {businessDetails.company.split(' ').map(w => w[0]).join('')}
          </div>
          <h3 className="text-xl font-semibold">{businessDetails.company}</h3>
          <p className="text-sm opacity-70">{businessDetails.industry}</p>
        </div>

        {/* Contact Information */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Building size={16} />
            Contact Information
          </h4>
          <div className="space-y-2 text-sm">
            <div><strong>Contact:</strong> {businessDetails.contact}</div>
            <div><strong>Title:</strong> {businessDetails.title}</div>
            <div><strong>Email:</strong> {businessDetails.email}</div>
            <div><strong>Phone:</strong> {businessDetails.phone}</div>
            <div><strong>Mobile:</strong> {businessDetails.mobile}</div>
            <div className="flex items-center gap-2">
              <strong>Website:</strong> 
              <a href={businessDetails.website} className="text-blue-500 hover:underline flex items-center gap-1">
                <Globe size={14} />
                {businessDetails.website}
              </a>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin size={16} />
            Company Details
          </h4>
          <div className="space-y-2 text-sm">
            <div><strong>Address:</strong> {businessDetails.address}</div>
            <div><strong>Employees:</strong> {businessDetails.employees}</div>
            <div><strong>Founded:</strong> {businessDetails.founded}</div>
            <div><strong>Revenue:</strong> {businessDetails.revenue}</div>
          </div>
        </div>

        {/* Description */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className="font-semibold mb-3">About</h4>
          <p className="text-sm">{businessDetails.description}</p>
        </div>

        {/* Activity */}
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar size={16} />
            Activity
          </h4>
          <div className="space-y-2 text-sm">
            <div><strong>Last Contact:</strong> {businessDetails.lastContact}</div>
            <div><strong>Next Follow-up:</strong> {businessDetails.nextFollowUp}</div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h4 className="font-semibold mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {businessDetails.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600"
        >
          Close Details
        </button>
      </div>
    </div>
  );
};

// Add to CRM Page
export const AddToCrmPopup: React.FC<BusinessPopupProps> = ({ theme, onClose }) => {
  const [crmData, setCrmData] = useState({
    leadSource: 'website',
    leadStatus: 'new',
    priority: 'medium',
    assignedTo: 'current-user',
    notes: '',
    followUpDate: '',
    estimatedValue: '',
    tags: [] as string[]
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCrm = async () => {
    setIsAdding(true);
    console.log('Adding to CRM:', crmData);

    // Simulate CRM addition
    setTimeout(() => {
      setIsAdding(false);
      console.log('Successfully added to CRM');
      onClose();
    }, 2000);
  };

  const addTag = (tag: string) => {
    if (!crmData.tags.includes(tag)) {
      setCrmData({...crmData, tags: [...crmData.tags, tag]});
    }
  };

  const removeTag = (tag: string) => {
    setCrmData({...crmData, tags: crmData.tags.filter(t => t !== tag)});
  };

  const suggestedTags = ['Hot Lead', 'Enterprise', 'Technology', 'Follow Up', 'Demo Scheduled'];

  return (
    <div className={`p-6 h-full overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus className="text-purple-500" size={24} />
          Add to CRM
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Lead Source</label>
            <select
              value={crmData.leadSource}
              onChange={(e) => setCrmData({...crmData, leadSource: e.target.value})}
              className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            >
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="cold-call">Cold Call</option>
              <option value="social-media">Social Media</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lead Status</label>
            <select
              value={crmData.leadStatus}
              onChange={(e) => setCrmData({...crmData, leadStatus: e.target.value})}
              className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={crmData.priority}
              onChange={(e) => setCrmData({...crmData, priority: e.target.value})}
              className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assigned To</label>
            <select
              value={crmData.assignedTo}
              onChange={(e) => setCrmData({...crmData, assignedTo: e.target.value})}
              className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            >
              <option value="current-user">Me</option>
              <option value="sales-team">Sales Team</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Follow-up Date</label>
            <input
              type="date"
              value={crmData.followUpDate}
              onChange={(e) => setCrmData({...crmData, followUpDate: e.target.value})}
              className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Estimated Value</label>
            <input
              type="text"
              value={crmData.estimatedValue}
              onChange={(e) => setCrmData({...crmData, estimatedValue: e.target.value})}
              placeholder="$0"
              className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={crmData.notes}
            onChange={(e) => setCrmData({...crmData, notes: e.target.value})}
            placeholder="Add any relevant notes..."
            rows={3}
            className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {crmData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:bg-purple-600 rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.filter(tag => !crmData.tags.includes(tag)).map((tag, index) => (
              <button
                key={index}
                onClick={() => addTag(tag)}
                className={`px-3 py-1 text-sm rounded-full border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleAddToCrm}
            disabled={isAdding}
            className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding to CRM...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Add to CRM
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}; 