import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmployeeForm from './EmployeeForm';
import { getEmployeeById, updateEmployee } from '../services/employeeService';
import { useEmployeeContext } from '../context/EmployeeContext';

const UpdateEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { dispatch } = useEmployeeContext();

    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const data = await getEmployeeById(id);
                setInitialData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || ''
                });
            } catch (error) {
                toast.error('Failed to fetch employee details.');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployee();
    }, [id, navigate]);

    const handleUpdateSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            const updatedEmployee = await updateEmployee(id, formData);
            dispatch({ type: 'UPDATE_EMPLOYEE', payload: updatedEmployee });
            toast.success('Employee updated successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Failed to update employee: ' + (error.response?.data?.message || 'Server Error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EmployeeForm
                initialData={initialData}
                onSubmit={handleUpdateSubmit}
                isLoading={isSubmitting}
                isEdit={true}
            />
        </div>
    );
};

export default UpdateEmployee;
