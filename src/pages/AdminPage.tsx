import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { adminQuery } from '@/lib/supabaseAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Package, FileText, ShoppingCart, Settings, LogOut, Eye, Lock } from 'lucide-react';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminBlogs from '@/components/admin/AdminBlogs';
import AdminVisitors from '@/components/admin/AdminVisitors';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminSettings from '@/components/admin/AdminSettings';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) checkAdminRole(session.user.id);
      else { setIsAuthenticated(false); setIsLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) await checkAdminRole(session.user.id);
    else setIsLoading(false);
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const data = await adminQuery('user_roles', { eq: { column: 'user_id', value: userId } });
      const isAdmin = data?.some((r: any) => r.role === 'admin');
      if (isAdmin) setIsAuthenticated(true);
      else {
        toast({ title: "Access Denied", description: "You don't have admin privileges.", variant: "destructive" });
        await supabase.auth.signOut();
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" });
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setIsAuthenticated(false); };

  if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4"><Lock className="w-8 h-8 text-orange-500" /></div>
          <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
          <p className="text-slate-400">Stream Stick Pro Dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-700 border-slate-600 text-white" required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-700 border-slate-600 text-white" required />
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loginLoading}>{loginLoading ? 'Signing in...' : 'Sign In'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white"><span className="text-orange-500">Stream Stick Pro</span> Admin</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-white"><LogOut className="w-4 h-4 mr-2" />Logout</Button>
        </div>
      </header>
      <main className="p-6">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700 p-1 flex-wrap">
            <TabsTrigger value="products" className="data-[state=active]:bg-orange-500"><Package className="w-4 h-4 mr-2" />Products</TabsTrigger>
            <TabsTrigger value="blogs" className="data-[state=active]:bg-orange-500"><FileText className="w-4 h-4 mr-2" />SEO Blogs</TabsTrigger>
            <TabsTrigger value="visitors" className="data-[state=active]:bg-orange-500"><Eye className="w-4 h-4 mr-2" />Visitors</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500"><ShoppingCart className="w-4 h-4 mr-2" />Orders</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-orange-500"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><AdminProducts /></TabsContent>
          <TabsContent value="blogs"><AdminBlogs /></TabsContent>
          <TabsContent value="visitors"><AdminVisitors /></TabsContent>
          <TabsContent value="orders"><AdminOrders /></TabsContent>
          <TabsContent value="settings"><AdminSettings /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
