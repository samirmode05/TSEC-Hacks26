import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminIssues = () => {
    const navigate = useNavigate();
    // Dummy Data for Issues
    const [issues] = useState([
        {
            id: 1,
            category: 'Pothole',
            latitude: 40.7128,
            longitude: -74.0060,
            status: 'Open',
            risk_score: 85,
            created_at: '2023-10-27',
            reportedBy: 'John Doe'
        },
        {
            id: 2,
            category: 'Water Leak',
            latitude: 40.7138,
            longitude: -74.0070,
            status: 'In Progress',
            risk_score: 95,
            created_at: '2023-10-28',
            reportedBy: 'Jane Smith'
        },
        {
            id: 3,
            category: 'Broken Streetlight',
            latitude: 40.7118,
            longitude: -74.0050,
            status: 'Pending',
            risk_score: 45,
            created_at: '2023-10-26',
            reportedBy: 'Mike Johnson'
        },
        {
            id: 4,
            category: 'Illegal Dumping',
            latitude: 40.7148,
            longitude: -74.0080,
            status: 'Resolved',
            risk_score: 20,
            created_at: '2023-10-25',
            reportedBy: 'Sarah Connor'
        },
        {
            id: 5,
            category: 'Bridge Crack',
            latitude: 40.7158,
            longitude: -74.0090,
            status: 'Open',
            risk_score: 92,
            created_at: '2023-10-28',
            reportedBy: 'Structural Sensor #402'
        }
    ]);

    const getSeverityColor = (score) => {
        if (score >= 80) return 'bg-red-100 text-red-800 border-red-200';
        if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-green-100 text-green-800 border-green-200';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-purple-100 text-purple-800';
            case 'Resolved': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Infrastructure Issues</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and track reported city incidents</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm">
                    Export Report
                </button>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Coordinates
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Risk Score
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {issues.map((issue) => (
                                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{issue.category}</div>
                                                <div className="text-xs text-gray-500">{issue.reportedBy}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(issue.risk_score)}`}>
                                            Score: {issue.risk_score}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {issue.created_at}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => navigate(`/admin/issues/${issue.id}`)}
                                            className="text-primary hover:text-primary-hover font-medium"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminIssues;
