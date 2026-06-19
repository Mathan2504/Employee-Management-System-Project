import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, UserPlus, AlertCircle, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllEmployees, deleteEmployee } from '../services/employeeService';
import { useEmployeeContext } from '../context/EmployeeContext';

const EmployeeList = () => {
    const { state, dispatch } = useEmployeeContext();
    const { employees, loading, error } = state;
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        dispatch({ type: 'FETCH_INIT' });
        try {
            const data = await getAllEmployees();
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
            dispatch({
                type: 'FETCH_FAILURE',
                payload: err.message || 'Failed to fetch employees'
            });
            toast.error('Failed to load employees from server');
        }
    };

    const confirmDelete = (id) => {
        setEmployeeToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await deleteEmployee(employeeToDelete);
            dispatch({ type: 'DELETE_EMPLOYEE', payload: employeeToDelete });
            toast.success('Employee deleted successfully');
        } catch (err) {
            toast.error('Failed to delete employee: ' + (err.response?.data?.message || err.message));
        } finally {
            setDeleteModalOpen(false);
            setEmployeeToDelete(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md my-8 max-w-4xl mx-auto">
                <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-red-500 mr-4" />
                    <p className="text-red-700 font-medium">Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
                <Link
                    to="/add"
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm font-medium"
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Employee
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                {(!employees || employees.length === 0) ? (
                    <div className="flex flex-col items-center justify-center p-16 text-gray-500">
                        <Users className="h-16 w-16 text-indigo-200 mb-4" />
                        <p className="text-xl font-medium text-gray-700">No Employees Found</p>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm text-center">Get started by adding a new employee to the system to manage your organization efficiently.</p>
                        <Link to="/add" className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-4 py-2 rounded-md transition-colors">
                            + Add First Employee
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
                                    <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 font-semibold text-sm text-gray-600 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase ring-2 ring-white">
                                                    {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {emp.firstName} {emp.lastName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{emp.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <Link
                                                    to={`/edit/${emp.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors"
                                                    title="Edit Employee"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(emp.id)}
                                                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors cursor-pointer"
                                                    title="Delete Employee"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setDeleteModalOpen(false)}
                    ></div>

                    <div className="bg-white rounded-xl shadow-xl z-10 p-6 max-w-sm w-full mx-4 transform transition-all border border-gray-100">
                        <div className="flex items-center mb-5">
                            <div className="mt-1 bg-red-100 rounded-full p-2 flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="ml-3 text-lg font-bold text-gray-900">Confirm Deletion</h3>
                        </div>

                        <p className="text-sm text-gray-500 mb-6 pl-11">
                            Are you sure you want to delete this employee? This action cannot be undone.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
