import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
    employees: [],
    loading: false,
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, employees: action.payload };
        case 'FETCH_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'ADD_EMPLOYEE':
            return { ...state, employees: [...state.employees, action.payload] };
        case 'UPDATE_EMPLOYEE':
            return {
                ...state,
                employees: state.employees.map((emp) =>
                    emp.id === action.payload.id ? action.payload : emp
                ),
            };
        case 'DELETE_EMPLOYEE':
            return {
                ...state,
                employees: state.employees.filter((emp) => emp.id !== action.payload),
            };
        default:
            return state;
    }
};

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <EmployeeContext.Provider value={{ state, dispatch }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployeeContext = () => useContext(EmployeeContext);
