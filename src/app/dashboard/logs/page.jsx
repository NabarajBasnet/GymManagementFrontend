// StaffManagement.jsx
"use client";
import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, ChevronDown, ArrowUpDown } from 'lucide-react';

export default function StaffManagement() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'trainer',
    status: 'active',
    hireDate: '',
    schedule: [],
    certifications: []
  });

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const mockStaff = [
      { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-123-4567', role: 'trainer', status: 'active', hireDate: '2023-01-15', schedule: ['Monday', 'Wednesday', 'Friday'], certifications: ['CPR', 'Fitness Nutrition'] },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-987-6543', role: 'manager', status: 'active', hireDate: '2022-06-20', schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], certifications: ['Management', 'First Aid'] },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '555-567-8901', role: 'receptionist', status: 'inactive', hireDate: '2023-03-10', schedule: ['Tuesday', 'Thursday', 'Saturday'], certifications: ['Customer Service'] }
    ];
    setStaffMembers(mockStaff);
    setFilteredStaff(mockStaff);
  }, []);

  // Filter staff based on search term
  useEffect(() => {
    const filtered = staffMembers.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  }, [searchTerm, staffMembers]);

  // Sort staff members
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedStaff = [...filteredStaff].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredStaff(sortedStaff);
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const value = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // CRUD operations (to be implemented with actual API calls)
  const handleAddStaff = (e) => {
    e.preventDefault();
    // Add staff logic - API call would go here
    const newStaff = {
      ...formData,
      id: Date.now().toString()
    };
    setStaffMembers([...staffMembers, newStaff]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditStaff = (e) => {
    e.preventDefault();
    // Edit staff logic - API call would go here
    const updatedStaff = staffMembers.map(staff => 
      staff.id === formData.id ? formData : staff
    );
    setStaffMembers(updatedStaff);
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteStaff = () => {
    // Delete staff logic - API call would go here
    const updatedStaff = staffMembers.filter(staff => staff.id !== currentStaff.id);
    setStaffMembers(updatedStaff);
    setIsDeleteModalOpen(false);
    setCurrentStaff(null);
  };

  const openEditModal = (staff) => {
    setFormData(staff);
    setCurrentStaff(staff);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (staff) => {
    setCurrentStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      role: 'trainer',
      status: 'active',
      hireDate: '',
      schedule: [],
      certifications: []
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Staff Management</h1>
      
      {/* Search and Add Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search staff..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Add New Staff
        </button>
      </div>
      
      {/* Staff List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('role')}
                >
                  <div className="flex items-center">
                    Role
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{staff.name}</div>
                      <div className="text-sm text-gray-500">Since {new Date(staff.hireDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{staff.email}</div>
                      <div className="text-sm text-gray-500">{staff.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.status === 'active' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.schedule.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(staff)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(staff)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No staff members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Add New Staff Member</h2>
              <form onSubmit={handleAddStaff}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="trainer">Trainer</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="nutritionist">Nutritionist</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hireDate">
                    Hire Date
                  </label>
                  <input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="schedule">
                    Work Schedule
                  </label>
                  <select
                    id="schedule"
                    name="schedule"
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleMultiSelectChange}
                    size="5"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple days</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="certifications">
                    Certifications
                  </label>
                  <select
                    id="certifications"
                    name="certifications"
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleMultiSelectChange}
                    size="5"
                  >
                    <option value="CPR">CPR</option>
                    <option value="First Aid">First Aid</option>
                    <option value="Personal Training">Personal Training</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Group Fitness">Group Fitness</option>
                    <option value="Management">Management</option>
                    <option value="Customer Service">Customer Service</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple certifications</p>
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Staff Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Staff Member</h2>
              <form onSubmit={handleEditStaff}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
                    Full Name
                  </label>
                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Repeat the same fields as in Add Modal, with pre-filled values */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-email">
                    Email
                  </label>
                  <input
                    id="edit-email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-phone">
                    Phone
                  </label>
                  <input
                    id="edit-phone"
                    name="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-role">
                    Role
                  </label>
                  <select
                    id="edit-role"
                    name="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="trainer">Trainer</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="nutritionist">Nutritionist</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-status">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-hireDate">
                    Hire Date
                  </label>
                  <input
                    id="edit-hireDate"
                    name="hireDate"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete <span className="font-semibold">{currentStaff.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStaff}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}