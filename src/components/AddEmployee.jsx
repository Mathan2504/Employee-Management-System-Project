import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmployeeForm from './EmployeeForm';
import { createEmployee } from '../services/employeeService';
import { useEmployeeContext } from '../context/EmployeeContext';

const AddEmployee = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { dispatch } = useEmployeeContext();
    const navigate = useNavigate();

    const handleAddSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            const newEmployee = await createEmployee(formData);
            dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
            toast.success('Employee created successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Failed to create employee: ' + (error.response?.data?.message || 'Server Error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EmployeeForm
                onSubmit={handleAddSubmit}
                isLoading={isSubmitting}
                isEdit={false}
            />
        </div>
    );
};

export default AddEmployee;
