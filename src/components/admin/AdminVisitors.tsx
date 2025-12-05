import { useState, useEffect } from 'react';
import { adminQuery } from '@/lib/supabaseAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Users, Globe, Monitor, TrendingUp } from 'lucide-react';

interface VisitorLog {
  id: string;
  page_url: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  visited_at: string;
}

const AdminVisitors = () => {
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0, uniqueCountries: 0, topPages: [] as { page: string; count: number }[], deviceBreakdown: [] as { device: string; count: number }[] });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchVisitors(); }, []);

  const fetchVisitors = async () => {
    try {
      const data = await adminQuery('visitor_logs', { select: '*', limit: 100 });
      const visitorData = data || [];
      setVisitors(visitorData);

      const today = new Date().toISOString().split('T')[0];
      const todayVisits = visitorData.filter((v: VisitorLog) => v.visited_at?.startsWith(today)).length;
      const countries = new Set(visitorData.map((v: VisitorLog) => v.country).filter(Boolean));

      const pageCounts: Record<string, number> = {};
      visitorData.forEach((v: VisitorLog) => { if (v.page_url) pageCounts[v.page_url] = (pageCounts[v.page_url] || 0) + 1; });
      const topPages = Object.entries(pageCounts).map(([page, count]) => ({ page, count })).sort((a, b) => b.count - a.count).slice(0, 5);

      const deviceCounts: Record<string, number> = {};
      visitorData.forEach((v: VisitorLog) => { const d = v.device_type || 'Unknown'; deviceCounts[d] = (deviceCounts[d] || 0) + 1; });
      const deviceBreakdown = Object.entries(deviceCounts).map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count);

      setStats({ total: visitorData.length, today: todayVisits, uniqueCountries: countries.size, topPages, deviceBreakdown });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-8 text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Visitor Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ icon: Users, label: 'Total', value: stats.total, color: 'blue' }, { icon: TrendingUp, label: 'Today', value: stats.today, color: 'green' }, { icon: Globe, label: 'Countries', value: stats.uniqueCountries, color: 'purple' }, { icon: Monitor, label: 'Devices', value: stats.deviceBreakdown.length, color: 'orange' }].map((s, i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 bg-${s.color}-500/20 rounded-lg`}><s.icon className={`w-6 h-6 text-${s.color}-400`} /></div>
              <div><p className="text-sm text-slate-400">{s.label}</p><p className="text-2xl font-bold text-white">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white text-lg">Top Pages</CardTitle></CardHeader><CardContent>{stats.topPages.length > 0 ? stats.topPages.map((p, i) => <div key={i} className="flex justify-between py-1"><span className="text-slate-300 truncate">{p.page}</span><span className="text-orange-400">{p.count}</span></div>) : <p className="text-slate-500">No data</p>}</CardContent></Card>
        <Card className="bg-slate-800/50 border-slate-700"><CardHeader><CardTitle className="text-white text-lg">Devices</CardTitle></CardHeader><CardContent>{stats.deviceBreakdown.length > 0 ? stats.deviceBreakdown.map((d, i) => <div key={i} className="flex justify-between py-1"><span className="text-slate-300 capitalize">{d.device}</span><span className="text-orange-400">{d.count}</span></div>) : <p className="text-slate-500">No data</p>}</CardContent></Card>
      </div>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader><CardTitle className="text-white">Recent Visitors</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-700/50"><tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">Page</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Device</th><th className="px-4 py-3">Browser</th></tr></thead>
            <tbody>
              {visitors.slice(0, 20).map((v) => (
                <tr key={v.id} className="border-b border-slate-700">
                  <td className="px-4 py-3 text-xs">{new Date(v.visited_at).toLocaleString()}</td>
                  <td className="px-4 py-3">{v.page_url || '-'}</td>
                  <td className="px-4 py-3">{v.city && v.country ? `${v.city}, ${v.country}` : v.country || '-'}</td>
                  <td className="px-4 py-3 capitalize">{v.device_type || '-'}</td>
                  <td className="px-4 py-3">{v.browser || '-'}</td>
                </tr>
              ))}
              {visitors.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No visitor data yet</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVisitors;
