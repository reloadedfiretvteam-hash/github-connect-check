import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Users, Globe, Monitor, TrendingUp } from 'lucide-react';

interface VisitorLog {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  page_url: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  visited_at: string;
}

interface Stats {
  total: number;
  today: number;
  uniqueCountries: number;
  topPages: { page: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
}

const AdminVisitors = () => {
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    uniqueCountries: 0,
    topPages: [],
    deviceBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const { data, error } = await (supabase
        .from('visitor_logs' as any)
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(100) as any);

      if (error) throw error;
      
      const visitorData = data || [];
      setVisitors(visitorData);
      
      const today = new Date().toISOString().split('T')[0];
      const todayVisits = visitorData.filter((v: VisitorLog) => v.visited_at.startsWith(today)).length;
      
      const countries = new Set(visitorData.map((v: VisitorLog) => v.country).filter(Boolean));
      
      const pageCounts: Record<string, number> = {};
      visitorData.forEach((v: VisitorLog) => {
        if (v.page_url) {
          pageCounts[v.page_url] = (pageCounts[v.page_url] || 0) + 1;
        }
      });
      const topPages = Object.entries(pageCounts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      const deviceCounts: Record<string, number> = {};
      visitorData.forEach((v: VisitorLog) => {
        const device = v.device_type || 'Unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
      const deviceBreakdown = Object.entries(deviceCounts)
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count);

      setStats({
        total: visitorData.length,
        today: todayVisits,
        uniqueCountries: countries.size,
        topPages,
        deviceBreakdown
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading visitor data...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Visitor Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Visits</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Today</p>
                <p className="text-2xl font-bold text-white">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Countries</p>
                <p className="text-2xl font-bold text-white">{stats.uniqueCountries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Monitor className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Device Types</p>
                <p className="text-2xl font-bold text-white">{stats.deviceBreakdown.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topPages.length > 0 ? (
              <div className="space-y-3">
                {stats.topPages.map((page, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-slate-300 truncate max-w-[200px]">{page.page}</span>
                    <span className="text-orange-400 font-medium">{page.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No page data yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.deviceBreakdown.length > 0 ? (
              <div className="space-y-3">
                {stats.deviceBreakdown.map((device, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-slate-300 capitalize">{device.device}</span>
                    <span className="text-orange-400 font-medium">{device.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No device data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Browser</th>
                </tr>
              </thead>
              <tbody>
                {visitors.slice(0, 20).map((visitor) => (
                  <tr key={visitor.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-xs">
                      {new Date(visitor.visited_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 truncate max-w-[150px]">{visitor.page_url || '-'}</td>
                    <td className="px-4 py-3">
                      {visitor.city && visitor.country ? `${visitor.city}, ${visitor.country}` : visitor.country || '-'}
                    </td>
                    <td className="px-4 py-3 capitalize">{visitor.device_type || '-'}</td>
                    <td className="px-4 py-3">{visitor.browser || '-'}</td>
                  </tr>
                ))}
                {visitors.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No visitor data yet. Tracking will start automatically.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVisitors;
