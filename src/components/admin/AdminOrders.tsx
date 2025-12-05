import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, ShoppingCart, Clock, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  stripe_session_id: string | null;
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await (supabase
        .from('orders' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any);

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.product_price, 0);

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (loading) {
    return <div className="text-center py-8 text-white">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Order Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-white">{completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-white">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Credentials</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-xs">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{order.customer_name || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{order.product_name}</td>
                    <td className="px-4 py-3 text-orange-400 font-medium">${order.product_price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : order.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {order.username && order.password ? (
                        <div className="text-xs">
                          <p>User: <span className="font-mono text-orange-400">{order.username}</span></p>
                          <p>Pass: <span className="font-mono text-orange-400">{order.password}</span></p>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
