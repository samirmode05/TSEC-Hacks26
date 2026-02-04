import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LayoutGrid, Map as MapIcon, Megaphone, Activity, Shield, Zap } from 'lucide-react';
import HazardMap from '../../components/admin/HazardMap';
import DashboardStats from '../../components/admin/DashboardStats';
import { Toaster, toast } from 'react-hot-toast';
import api from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({
        active: 0,
        critical: 0,
        pending: 0,
        resolvedToday: 0,
        total: 0
    });

    const [hazards, setHazards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '', category: 'General' });

    useEffect(() => {
        fetchData();
        // Poll every 5 seconds for real-time updates
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [reportsRes, statsRes] = await Promise.all([
                api.get('/admin/reports'),
                api.get('/admin/stats')
            ]);

            const reportsData = reportsRes.data || [];
            const statsData = statsRes.data || {};

            setReports(reportsData);

            // Map Backend Reports to Hazard Map Format
            const mappedHazards = reportsData
                .filter(report => report.latitude && report.longitude)
                .map(report => ({
                    id: report.id,
                    lat: parseFloat(report.latitude),
                    lng: parseFloat(report.longitude),
                    severity: parseInt(report.risk_score || 0),
                    type: report.category || 'Hazard',
                    status: report.status || 'UNKNOWN',
                    reportedAt: report.created_at || new Date().toISOString()
                }));

            setHazards(mappedHazards);

            // Calculate Critical and Resolved Today
            const criticalCount = reportsData.filter(r => (r.risk_score || 0) >= 70 && r.status !== 'RESOLVED').length;
            const today = new Date().toISOString().split('T')[0];
            const resolvedTodayCount = reportsData.filter(r => r.status === 'RESOLVED' && r.updated_at?.startsWith(today)).length;

            setStats({
                active: (Number(statsData.inProgress) || 0) + (Number(statsData.pending) || 0),
                critical: criticalCount,
                pending: Number(statsData.pending) || 0,
                resolvedToday: resolvedTodayCount,
                total: reportsData.length
            });

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            if (!loading) toast.error('Connection lost. Retrying...');
        }
    };

    const handleStatusUpdate = async (reportId, newStatus) => {
        try {
            await api.patch(`/admin/reports/${reportId}`, { status: newStatus });
            toast.success(`Report ${newStatus.toLowerCase()}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans pb-12">
            <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

            {/* Top Navigation Bar */}
            <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6 shadow-md sticky top-0 z-50">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🏙️</span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">
                        City<span className="text-blue-500">Watch</span> <span className="hidden sm:inline text-gray-400 font-medium">Command Center</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => setShowAnnouncementModal(true)}
                        className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-500 text-sm font-bold rounded shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        <Megaphone size={16} /> <span className="hidden sm:inline">Announcement</span>
                    </button>
                    <button
                        onClick={() => { setLoading(true); fetchData(); }}
                        className="p-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                        title="Refresh Data"
                    >
                        <Activity size={16} />
                    </button>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-xs">
                        <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></span>
                        <span className="text-gray-300">{loading ? 'Syncing...' : 'Live System'}</span>
                    </div>
                </div>
            </header>

            {/* Feature Access Bar */}
            <div className="bg-gray-800/40 border-b border-gray-700 px-6 py-4">
                <div className="max-w-[1600px] mx-auto flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/admin/emergency-routes')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-xl font-bold transition-all hover:scale-105"
                        >
                            🚑 Emergency Route Finder
                        </button>
                        <button
                            onClick={() => navigate('/admin/optimization')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-xl font-bold transition-all hover:scale-105"
                        >
                            ⚡ Resource Optimization
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <Shield size={16} className="text-blue-400" />
                        <span>Infrastructure Integrity: 98.4%</span>
                    </div>
                </div>
            </div>

            <main className="p-6 max-w-[1600px] mx-auto space-y-6">
                <DashboardStats stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Column */}
                    <div className="lg:col-span-2 flex flex-col bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl relative group h-[600px]">
                        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-mono text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                            Live Infrastructure Status
                        </div>
                        <div className="flex-1 w-full h-full">
                            <HazardMap hazards={hazards} />
                        </div>
                    </div>

                    {/* Alerts Feed Column */}
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 flex flex-col shadow-xl overflow-hidden h-[600px]">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                            <h2 className="font-bold text-gray-200 flex items-center gap-2">
                                <LayoutGrid size={18} className="text-blue-400" />
                                Recent Incidents
                            </h2>
                            <span className="text-[10px] font-bold text-gray-400 px-2 py-1 bg-gray-700 rounded-md uppercase tracking-tighter">
                                {reports.length} Total
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {loading && reports.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                                    <Activity className="animate-spin text-blue-500" size={32} />
                                    <p className="text-sm font-medium">Synchronizing with field data...</p>
                                </div>
                            ) : (
                                reports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((report) => (
                                    <div
                                        key={report.id}
                                        className="p-4 bg-gray-900/40 rounded-xl hover:bg-gray-700/40 transition-all border border-gray-700/50 hover:border-blue-500/50 group cursor-pointer"
                                        onClick={() => navigate(`/admin/issues/${report.id}`)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                                                    {report.category || 'General'}
                                                </span>
                                                <h3 className="font-bold text-sm text-gray-100 group-hover:text-white leading-tight">
                                                    {report.title || 'Incident Reported'}
                                                </h3>
                                            </div>
                                            <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-tighter ${(report.risk_score || 0) >= 70 ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                                                    (report.risk_score || 0) >= 40 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                                                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                }`}>
                                                {report.risk_score || 0}% Risk
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end mt-4 pt-3 border-t border-gray-700/30">
                                            <div className="text-[10px] text-gray-500 font-medium">
                                                <p>{new Date(report.created_at).toLocaleDateString()} • {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${report.status === 'RESOLVED' ? 'bg-green-500' :
                                                        report.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                                            'bg-amber-500'
                                                    }`}></span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                    {report.status?.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Announcement Modal */}
            {showAnnouncementModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl scale-in-center">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Megaphone className="text-purple-400" size={24} />
                            Create Announcement
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Severity Level</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['General', 'Critical', 'Utility', 'Event'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setAnnouncementForm({ ...announcementForm, category: cat })}
                                            className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${announcementForm.category === cat
                                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                                                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={announcementForm.title}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                    placeholder="Brief title..."
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Details</label>
                                <textarea
                                    value={announcementForm.message}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                                    placeholder="Enter announcement message..."
                                    rows="4"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowAnnouncementModal(false)}
                                className="px-6 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={async () => {
                                    if (!announcementForm.title || !announcementForm.message) return toast.error('Incomplete data');
                                    try {
                                        await api.post('/announcements', announcementForm);
                                        toast.success('Broadcast live!');
                                        setShowAnnouncementModal(false);
                                        setAnnouncementForm({ title: '', message: '', category: 'General' });
                                    } catch (e) {
                                        toast.error('Transmission failed');
                                    }
                                }}
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl shadow-xl transition-all hover:scale-105 uppercase text-xs tracking-widest"
                            >
                                Dispatch
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
