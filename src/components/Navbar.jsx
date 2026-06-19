import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-indigo-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-indigo-200" />
                        <Link to="/" className="font-bold text-xl tracking-tight hover:text-indigo-200 transition-colors">
                            Employee Manager
                        </Link>
                    </div>
                    <div>
                        <Link
                            to="/add"
                            className="bg-indigo-500 hover:bg-indigo-400 px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm flex items-center"
                        >
                            Add Employee
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
