import React, { useState } from 'react';
import { User, UserRole, Event, Registration, StatCardProps } from '../types';
import { 
  Users, Calendar, TrendingUp, Activity, AlertCircle, Plus, FileText, CheckCircle, Filter, Shield, MoreHorizontal, Clock, Check, X as XIcon, Download
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { MOCK_USERS, MOCK_ADMIN_LOGS } from '../constants';

interface DashboardProps {
  user: User;
  events: Event[];
  registrations: Registration[];
  onCreateEventClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {change && (
        <p className={`text-xs mt-2 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change} <span className="text-gray-400 font-normal">vs last month</span>
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, events, registrations, onCreateEventClick }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Determine dashboard type
  const isAdmin = user.role === UserRole.SUPER_ADMIN;
  const isOrganizer = user.role === UserRole.COLLEGE_ADMIN;
  
  // Tabs Configuration
  const adminTabs = ['Overview', 'User Management', 'Event Management', 'Registrations', 'Admin Logs'];
  const organizerTabs = ['Overview', 'My Events', 'Analytics'];
  const studentTabs = ['Overview', 'My Events'];

  const currentTabs = isAdmin ? adminTabs : isOrganizer ? organizerTabs : studentTabs;

  // Mock data for charts
  const data = [
    { name: 'Jan', events: 4, participants: 240 },
    { name: 'Feb', events: 3, participants: 139 },
    { name: 'Mar', events: 9, participants: 980 },
    { name: 'Apr', events: 6, participants: 390 },
    { name: 'May', events: 8, participants: 480 },
    { name: 'Jun', events: 5, participants: 380 },
  ];

  const getEventName = (id: string) => events.find(e => e.id === id)?.title || 'Unknown Event';
  const getUserName = (id: string) => MOCK_USERS.find(u => u.id === id)?.name || 'Unknown User';
  const getAdminName = (id: string) => MOCK_USERS.find(u => u.id === id)?.name || 'System';

  const RecentEventsTable = ({ limit }: { limit?: number }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">{activeTab === 'event management' ? 'Event Management' : 'Recent Events'}</h3>
        {(isAdmin && activeTab === 'event management') && 
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Approve Pending Flagged Events
            </button>
        }
        {!isAdmin && activeTab !== 'event management' &&
             <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
        }
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">Event Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              {isAdmin && <th className="px-6 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {events.slice(0, limit || events.length).map((event) => (
              <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-medium line-clamp-1">{event.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{event.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(event.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                    ${event.status === 'upcoming' ? 'bg-blue-50 text-blue-600' : 
                      event.status === 'ongoing' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {event.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium hover:underline">View Actions</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const UserActivityTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">User Activity</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All Users</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                    <tr>
                        <th className="px-6 py-3 font-medium">User</th>
                        <th className="px-6 py-3 font-medium">Role</th>
                        <th className="px-6 py-3 font-medium">College</th>
                        <th className="px-6 py-3 font-medium">Last Active</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_USERS.map((u) => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase ${
                                        u.role === UserRole.STUDENT ? 'bg-blue-100 text-blue-700' : 
                                        u.role === UserRole.COLLEGE_ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {u.name.charAt(0)}
                                    </div>
                                    {u.name}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                    ${u.role === UserRole.STUDENT ? 'bg-green-100 text-green-700' : 
                                      u.role === UserRole.COLLEGE_ADMIN ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {u.role === UserRole.COLLEGE_ADMIN ? 'Organizer' : u.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{u.college || '-'}</td>
                            <td className="px-6 py-4 text-gray-500">{u.lastActive || 'Never'}</td>
                            <td className="px-6 py-4">
                                <span className={`text-xs font-medium ${u.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                    {u.status || 'Active'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const RegistrationsTable = () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Event Registrations</h3>
              <div className="flex gap-2">
                  <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
                      <Filter className="w-4 h-4" />
                  </button>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Export CSV</button>
              </div>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                      <tr>
                          <th className="px-6 py-3 font-medium">Student</th>
                          <th className="px-6 py-3 font-medium">Event</th>
                          <th className="px-6 py-3 font-medium">Date Registered</th>
                          <th className="px-6 py-3 font-medium">Status</th>
                          <th className="px-6 py-3 font-medium text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {registrations.length === 0 ? (
                          <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                  No registrations found.
                              </td>
                          </tr>
                      ) : (
                          registrations.map((reg) => (
                              <tr key={reg.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                  <td className="px-6 py-4 font-medium text-gray-900">
                                      {getUserName(reg.userId)}
                                  </td>
                                  <td className="px-6 py-4 text-gray-600">
                                      {getEventName(reg.eventId)}
                                  </td>
                                  <td className="px-6 py-4 text-gray-500">
                                      {new Date(reg.timestamp).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                          ${reg.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                            reg.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                          {reg.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      {reg.status === 'pending' && (
                                          <div className="flex justify-end gap-2">
                                              <button className="p-1 text-green-600 hover:bg-green-50 rounded" title="Approve">
                                                  <Check className="w-4 h-4" />
                                              </button>
                                              <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject">
                                                  <XIcon className="w-4 h-4" />
                                              </button>
                                          </div>
                                      )}
                                      {reg.status !== 'pending' && (
                                          <button className="text-gray-400 hover:text-gray-600 p-1">
                                              <MoreHorizontal className="w-4 h-4" />
                                          </button>
                                      )}
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const AdminLogsTable = () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">System Logs</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                <Download className="w-4 h-4" /> Download
              </button>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                      <tr>
                          <th className="px-6 py-3 font-medium">Timestamp</th>
                          <th className="px-6 py-3 font-medium">Admin</th>
                          <th className="px-6 py-3 font-medium">Action</th>
                          <th className="px-6 py-3 font-medium">Details</th>
                      </tr>
                  </thead>
                  <tbody>
                      {MOCK_ADMIN_LOGS.map((log) => (
                          <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                  <div className="flex items-center">
                                      <Clock className="w-3 h-3 mr-2 text-gray-400" />
                                      {new Date(log.timestamp).toLocaleString()}
                                  </div>
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900">
                                  {getAdminName(log.userId)}
                              </td>
                              <td className="px-6 py-4">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {log.action}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                  {log.details}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  // Layout logic: Full width for management tables, Split width for overview
  const isFullWidth = ['user management', 'event management', 'registrations', 'admin logs'].includes(activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'Admin Dashboard' : isOrganizer ? 'Event Organizer Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin ? 'Manage platform activities and monitor performance' : 
             isOrganizer ? 'Manage your events and track performance' : 'Track your participating events'}
          </p>
        </div>
        <div className="flex gap-2">
            {isAdmin ? (
                 <>
                    <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium">
                        <Shield className="w-4 h-4" /> Security
                    </button>
                 </>
            ) : isOrganizer ? (
                <button 
                  onClick={onCreateEventClick}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Create Event
                </button>
            ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {currentTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.toLowerCase()
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Stats Grid - Always visible on Overview, maybe modified for others */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Events" 
          value={events.length} 
          change="12%" 
          isPositive={true} 
          icon={<Calendar className="w-5 h-5" />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title={isAdmin ? "Active Users" : "Active Events"} 
          value={isAdmin ? "1,234" : "2"} 
          change="8%" 
          isPositive={true} 
          icon={isAdmin ? <Users className="w-5 h-5" /> : <Activity className="w-5 h-5" />} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Registrations" 
          value={registrations.length > 0 ? registrations.length : "0"} 
          change="23%" 
          isPositive={true} 
          icon={<TrendingUp className="w-5 h-5" />} 
          color="bg-purple-500" 
        />
        <StatCard 
          title={isAdmin ? "Pending Reviews" : "Average Participants"} 
          value="0" 
          change={isAdmin ? "-2%" : "0"} 
          isPositive={false} 
          icon={isAdmin ? <AlertCircle className="w-5 h-5" /> : <Users className="w-5 h-5" />} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className={`${isFullWidth ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-6`}>
            
           {/* Logic for switching tab content */}
           {activeTab === 'overview' && (
               <>
                    {(isAdmin || isOrganizer) && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4">Registration Trends</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                            itemStyle={{color: '#4f46e5'}}
                                        />
                                        <Line type="monotone" dataKey="participants" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                    <RecentEventsTable limit={5} />
               </>
           )}

           {activeTab === 'user management' && <UserActivityTable />}
           {activeTab === 'event management' && <RecentEventsTable />}
           {activeTab === 'registrations' && <RegistrationsTable />}
           {activeTab === 'admin logs' && <AdminLogsTable />}
           
           {(activeTab !== 'overview' && activeTab !== 'user management' && activeTab !== 'event management' && activeTab !== 'registrations' && activeTab !== 'admin logs' && activeTab !== 'my events') && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                   <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                   <h3 className="text-lg font-medium text-gray-900">No content available</h3>
                   <p>This section is under development.</p>
               </div>
           )}
           {activeTab === 'my events' && <RecentEventsTable />}
        </div>

        {/* Sidebar Area - Only visible for Overview */}
        {!isFullWidth && (
            <div className="space-y-6">
                 {activeTab === 'overview' ? (
                     <>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                {isOrganizer && (
                                    <button onClick={onCreateEventClick} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2">
                                        <Plus className="w-4 h-4" /> Create New Event
                                    </button>
                                )}
                                <button className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200">
                                    View All Registrations
                                </button>
                                <button className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200">
                                    Export Event Data
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">System Health</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Server Status</span>
                                    <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Healthy</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Database</span>
                                    <span className="text-green-600 font-medium">Connected</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">API Response</span>
                                    <span className="text-gray-900 font-medium">152ms</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Uptime</span>
                                    <span className="text-gray-900 font-medium">99.9%</span>
                                </div>
                            </div>
                        </div>
                     </>
                 ) : (
                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                         <h3 className="font-semibold text-gray-900 mb-4">Information</h3>
                         <p className="text-sm text-gray-500 mb-4">
                             Select an item from the main list to view more details here.
                         </p>
                     </div>
                 )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;