import { useEffect, useState } from "react";
import { getReports, resolveReport, suspendUser, banUser, getStats, } from '../services/admin';
import type { Report, Stats } from '../services/admin';
import { Navbar } from '../components/Navbar';

export function AdminPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getReports(), getStats()]).then(([reportsData, statsData]) => {
            setReports(reportsData);
            setStats(statsData);
            setLoading(false);
        });
    }, []);

    const handleResolve = async (id: string, resolution: 'REVIEWED' | 'DISMISSED') => {
        const updated = await resolveReport(id, resolution);
        setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    };

    const handleSuspend = async (userId: string) => {
        await suspendUser(userId);
        alert('Kullanıcı askıya alındı.');
    };

    const handleBan = async (userId: string) => {
        if (!window.confirm('Bu kullanıcıyı kalıcı olarak engellemek istediğine emin misin?')) return;
        await banUser(userId);
        alert('Kullanıcı engellendi');
    };

    if(loading) {
        return (
            <div className="min-h-screen bg-dark">
                <Navbar />
                <p className="text-light/60 text-center mt-10">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-light mb-6">Admin Paneli</h1>
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-surface/40 border border-purple/20 rounded-xl p-4 text-center">
                            <p className="text-purple text-2xl font-bold">{stats.activeUsers}</p>
                            <p className="text-light/60 text-xs mt-1">Aktif Kullanıcı</p>
                        </div>
                        <div className="bg-surface/40 border border-purple/20 rounded-xl p-4 text-center">
                            <p className="text-purple text-2xl font-bold">{stats.totalEvents}</p>
                            <p className="text-light/60 text-xs mt-1">Toplam Etkinlik</p>
                        </div>
                        <div className="bg-surface/40 border border-purple/20 rounded-xl p-4 text-center">
                            <p className="text-purple text-2xl font-bold">{stats.attendanceRate}</p>
                            <p className="text-light/60 text-xs mt-1">Katılım Oranı</p>
                        </div>
                        <div className="bg-surface/40 border border-purple/20 rounded-xl p-4 text-center">
                            <p className="text-purple text-2xl font-bold">{stats.categoryDistribution.length}</p>
                            <p className="text-light/60 text-xs mt-1">Kategori Sayısı</p>
                        </div>
                    </div>
                )}
                <h2 className="text-xl font-bold text-light mb-4">Raporlar</h2>
                {reports.length === 0 ? (
                    <p className="text-light/60">Hiç rapor yok.</p>
                ): (
                    <div className="flex flex-col gap-3">{reports.map((r) => (
                        <div key={r.id} className="bg-surface/40 border border-purple/20 rounded-xl p-4">
                            <p className="text-light">{r.reason}</p>
                            <p className="text-light/40 text-xs mt-1">{r.reportedUserId ? `Kullanıcı: ${r.reportedUserId}` : `Etkinlik: ${r.reportedEventId}`} {' · '} {new Date(r.createdAt).toLocaleString('tr-TR')} {' · Durum: '} {r.resolved}</p>
                            <div className="flex gap-2 mt-3">{r.resolved === 'PENDING' && (
                                <>
                                <button onClick={() => handleResolve(r.id, 'REVIEWED')} className="bg-yellow text-dark text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition">İncelendi Olarak İşaretle</button>
                                <button onClick={() => handleResolve(r.id, 'DISMISSED')} className="bg-transparent border border-light/30 text-light text-xs px-3 py-1.5 rounded-lg hover:border-yellow transition">Asılsız Say</button>
                                </> )} {r.reportedUserId && (
                                    <>
                                    <button onClick={() => handleSuspend(r.reportedUserId!)} className="bg-transparent border border-yellow text-yellow text-xs px-3 py-1.5 rounded-lg hover:bg-yellow/10 transition">Kullanıcıyı Askıya Al</button>
                                    <button onClick={() => handleBan(r.reportedUserId!)} className="bg-transparent border border-red-400 text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition">Kullanıcıyı Engelle</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
}