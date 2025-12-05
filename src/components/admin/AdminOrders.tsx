import { useState, useEffect } from 'react';
import { adminQuery } from '@/lib/supabaseAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, ShoppingCart, Clock, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  customer_email: string;
  customer_name: string | null;
  product_name: string;
  product_price: number;
  status: string;
  username: string | null;
  password: string | null;
  created_at: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminQuery('orders', { select: '*' });
      setOrders(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.product_price, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (loading) return <div className="text-center py-8 text-white">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Order Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ icon: DollarSign, label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'green' }, { icon: ShoppingCart, label: 'Total', value: orders.length, color: 'blue' }, { icon: CheckCircle, label: 'Completed', value: completedOrders, color: 'emerald' }, { icon: Clock, label: 'Pending', value: pendingOrders, color: 'yellow' }].map((s, i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 bg-${s.color}-500/20 rounded-lg`}><s.icon className={`w-6 h-6 text-${s.color}-400`} /></div>
              <div><p className="text-sm text-slate-400">{s.label}</p><p className="text-2xl font-bold text-white">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader><CardTitle className="text-white">All Orders</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-700/50"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Credentials</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-xs">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3"><p className="font-medium text-white">{o.customer_name || 'N/A'}</p><p className="text-xs text-slate-500">{o.customer_email}</p></td>
                  <td className="px-4 py-3">{o.product_name}</td>
                  <td className="px-4 py-3 text-orange-400">${o.product_price}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${o.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{o.status}</span></td>
                  <td className="px-4 py-3">{o.username && o.password ? <div className="text-xs"><p>User: <span className="font-mono text-orange-400">{o.username}</span></p><p>Pass: <span className="font-mono text-orange-400">{o.password}</span></p></div> : '-'}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No orders yet</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
