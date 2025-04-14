// PersonalTrainingManager.js
"use client";
import { useState, useEffect, useCallback } from 'react';
import { format, addMonths, subMonths, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parse, addDays } from 'date-fns';

export default function PersonalTrainingManager() {
  // State management
  const [view, setView] = useState('calendar'); // calendar, list, form, details
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    trainerId: '',
    packageId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    duration: 60,
    notes: '',
    status: 'scheduled'
  });

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoints
        const [sessionsData, trainersData, clientsData, packagesData] = await Promise.all([
          fetch('/api/sessions').then(res => res.json()),
          fetch('/api/trainers').then(res => res.json()),
          fetch('/api/clients').then(res => res.json()),
          fetch('/api/packages').then(res => res.json())
        ]);
        
        setSessions(sessionsData || []);
        setTrainers(trainersData || []);
        setClients(clientsData || []);
        setPackages(packagesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error state here if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get sessions for selected day
  const dailySessions = useCallback(() => {
    return sessions.filter(session => 
      isSameDay(new Date(session.date), selectedDay)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [sessions, selectedDay]);

  // Calendar navigation
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Date helpers
  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formattedData = {
        ...formData,
        date: formData.date,
        duration: parseInt(formData.duration),
        clientId: parseInt(formData.clientId),
        trainerId: parseInt(formData.trainerId),
        packageId: formData.packageId ? parseInt(formData.packageId) : null
      };

      const method = selectedSession ? 'PUT' : 'POST';
      const url = selectedSession 
        ? `/api/sessions/${selectedSession.id}` 
        : '/api/sessions';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error('Failed to save session');
      }

      const savedSession = await response.json();
      
      if (selectedSession) {
        setSessions(sessions.map(s => s.id === savedSession.id ? savedSession : s));
      } else {
        setSessions([...sessions, savedSession]);
      }

      // Reset form and return to calendar view
      setFormData({
        title: '',
        clientId: '',
        trainerId: '',
        packageId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        duration: 60,
        notes: '',
        status: 'scheduled'
      });
      setSelectedSession(null);
      setView('calendar');
    } catch (error) {
      console.error("Error saving session:", error);
      // Handle error state if needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setFormData({
      title: session.title,
      clientId: session.clientId.toString(),
      trainerId: session.trainerId.toString(),
      packageId: session.packageId ? session.packageId.toString() : '',
      date: session.date,
      startTime: session.startTime,
      duration: session.duration.toString(),
      notes: session.notes || '',
      status: session.status
    });
    setView('form');
  };

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      setSessions(sessions.filter(s => s.id !== sessionId));
      setView('calendar');
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (!confirm('Are you sure you want to cancel this session?')) return;
    
    setIsLoading(true);
    try {
      const session = sessions.find(s => s.id === sessionId);
      const updatedSession = { ...session, status: 'cancelled' };
      
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSession)
      });

      if (!response.ok) {
        throw new Error('Failed to cancel session');
      }

      const savedSession = await response.json();
      setSessions(sessions.map(s => s.id === savedSession.id ? savedSession : s));
    } catch (error) {
      console.error("Error cancelling session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get client and trainer details
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
  };

  const getTrainerName = (trainerId) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Unknown Trainer';
  };

  // Get package details
  const getPackageName = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
    return pkg ? pkg.name : 'No Package';
  };

  // Calculate time slots
  const getTimeSlots = () => {
    const slots = [];
    for (let i = 5; i < 22; i++) {
      for (let j = 0; j < 60; j += 30) {
        slots.push(`${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  // Filter sessions for list view
  const getFilteredSessions = () => {
    let filtered = [...sessions];
    
    if (selectedTrainer) {
      filtered = filtered.filter(s => s.trainerId === selectedTrainer);
    }
    
    if (selectedClient) {
      filtered = filtered.filter(s => s.clientId === selectedClient);
    }
    
    return filtered.sort((a, b) => {
      // Sort by date first
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      
      // Then by start time
      return a.startTime.localeCompare(b.startTime);
    });
  };

  // Calendar grid days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the first day of the week of the month
    const startDate = startOfWeek(firstDay);
    
    // Get the last day of the week of the last day of the month
    const endDate = endOfWeek(lastDay);

    // Return array of dates
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  // Check if day has sessions
  const dayHasSessions = (day) => {
    return sessions.some(session => 
      isSameDay(new Date(session.date), day)
    );
  };

  const renderCalendarView = () => {
    const days = getDaysInMonth();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="calendar-container">
        <div className="calendar-header flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
            &lt; Prev
          </button>
          <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={nextMonth} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
            Next &gt;
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center font-semibold py-2 bg-gray-100">
              {day}
            </div>
          ))}
          
          {days.map((day, i) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDay);
            const hasSessions = dayHasSessions(day);
            
            return (
              <div 
                key={i}
                className={`
                  min-h-24 p-2 border border-gray-200 cursor-pointer
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${isToday ? 'bg-blue-50' : ''}
                  ${isSelected ? 'bg-blue-100 border-blue-500' : ''}
                  ${hasSessions ? 'font-semibold' : ''}
                `}
                onClick={() => {
                  setSelectedDay(day);
                  setView('details');
                }}
              >
                <div className="flex justify-between">
                  <span>{format(day, 'd')}</span>
                  {hasSessions && (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs">
                      {sessions.filter(s => isSameDay(new Date(s.date), day)).length}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => setView('list')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            List View
          </button>
          <button
            onClick={() => {
              setSelectedSession(null);
              setFormData({
                ...formData,
                date: format(selectedDay, 'yyyy-MM-dd')
              });
              setView('form');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Session
          </button>
        </div>
      </div>
    );
  };

  const renderDayDetailView = () => {
    const sessions = dailySessions();
    return (
      <div className="day-detail">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{format(selectedDay, 'EEEE, MMMM d, yyyy')}</h2>
          <button
            onClick={() => setView('calendar')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Calendar
          </button>
        </div>
        
        {sessions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-gray-500">No sessions scheduled for this day.</p>
            <button
              onClick={() => {
                setSelectedSession(null);
                setFormData({
                  ...formData,
                  date: format(selectedDay, 'yyyy-MM-dd')
                });
                setView('form');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <div key={session.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">{session.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p>{session.startTime} ({session.duration} min)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p>{getClientName(session.clientId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trainer</p>
                    <p>{getTrainerName(session.trainerId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Package</p>
                    <p>{session.packageId ? getPackageName(session.packageId) : 'No Package'}</p>
                  </div>
                </div>
                
                {session.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-sm">{session.notes}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end space-x-2">
                  {session.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => handleCancelSession(session.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEditSession(session)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                    </>
                  )}
                  {session.status === 'cancelled' && (
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSelectedSession(null);
                  setFormData({
                    ...formData,
                    date: format(selectedDay, 'yyyy-MM-dd')
                  });
                  setView('form');
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Session
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderListView = () => {
    const filteredSessions = getFilteredSessions();

    return (
      <div className="list-view">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Sessions</h2>
          <button
            onClick={() => setView('calendar')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Calendar
          </button>
        </div>
        
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="w-64">
            <label className="block mb-1 text-sm">Filter by Trainer</label>
            <select
              value={selectedTrainer || ''}
              onChange={(e) => setSelectedTrainer(e.target.value === '' ? null : parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="">All Trainers</option>
              {trainers.map(trainer => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.firstName} {trainer.lastName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-64">
            <label className="block mb-1 text-sm">Filter by Client</label>
            <select
              value={selectedClient || ''}
              onChange={(e) => setSelectedClient(e.target.value === '' ? null : parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-gray-500">No sessions found with the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Time</th>
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Client</th>
                  <th className="py-2 px-4 text-left">Trainer</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map(session => (
                  <tr key={session.id} className="border-t">
                    <td className="py-2 px-4">{format(new Date(session.date), 'MMM d, yyyy')}</td>
                    <td className="py-2 px-4">{session.startTime}</td>
                    <td className="py-2 px-4">{session.title}</td>
                    <td className="py-2 px-4">{getClientName(session.clientId)}</td>
                    <td className="py-2 px-4">{getTrainerName(session.trainerId)}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedDay(new Date(session.date));
                            setView('details');
                          }}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                        >
                          View
                        </button>
                        {session.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => handleEditSession(session)}
                              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCancelSession(session.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setSelectedSession(null);
              setFormData({
                ...formData,
                date: format(new Date(), 'yyyy-MM-dd')
              });
              setView('form');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            New Session
          </button>
        </div>
      </div>
    );
  };

  const renderFormView = () => {
    return (
      <div className="form-view">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selectedSession ? 'Edit Session' : 'Create New Session'}
          </h2>
          <button
            onClick={() => setView(selectedSession ? 'details' : 'calendar')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
                placeholder="Session Title"
              />
            </div>
            
            <div>
              <label className="block mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Start Time</label>
              <select
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              >
                {getTimeSlots().map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Duration (minutes)</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Client</label>
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Trainer</label>
              <select
                name="trainerId"
                value={formData.trainerId}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Trainer</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.firstName} {trainer.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Package (Optional)</label>
              <select
                name="packageId"
                value={formData.packageId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">No Package</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="4"
              placeholder="Session notes, client goals, exercises, etc."
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setView(selectedSession ? 'details' : 'calendar')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (selectedSession ? 'Update Session' : 'Create Session')}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Loading state
  if (isLoading && (sessions.length === 0 || trainers.length === 0 || clients.length === 0)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Render component based on current view
  return (
    <div className="personal-training-manager">
      <h1 className="text-2xl font-bold mb-6">Personal Training Session Management</h1>
      
      {view === 'calendar' && renderCalendarView()}
      {view === 'details' && renderDayDetailView()}
      {view === 'list' && renderListView()}
      {view === 'form' && renderFormView()}
    </div>
  );
}