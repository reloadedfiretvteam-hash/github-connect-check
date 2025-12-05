import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { adminQuery, adminInsert, adminUpdate, adminDelete } from '@/lib/supabaseAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Save, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: string;
  name: string;
  price: number;
  type: string;
  page: string;
  image_url: string | null;
  badge: string | null;
  features: string[] | null;
  period: string | null;
  popularity: number;
  is_active: boolean;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    type: 'firestick',
    page: 'main',
    image_url: '',
    badge: '',
    features: '',
    period: '',
    popularity: '0',
    is_active: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await adminQuery('products', { select: '*' });
      setProducts(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      type: formData.type,
      page: formData.page,
      image_url: formData.image_url || null,
      badge: formData.badge || null,
      features: formData.features ? formData.features.split('\n').filter(f => f.trim()) : null,
      period: formData.period || null,
      popularity: parseInt(formData.popularity) || 0,
      is_active: formData.is_active
    };

    try {
      if (editingProduct) {
        await adminUpdate('products', productData, 'id', editingProduct.id);
        toast({ title: "Product updated successfully" });
      } else {
        await adminInsert('products', productData);
        toast({ title: "Product created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      type: product.type,
      page: product.page,
      image_url: product.image_url || '',
      badge: product.badge || '',
      features: product.features?.join('\n') || '',
      period: product.period || '',
      popularity: product.popularity.toString(),
      is_active: product.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await adminDelete('products', 'id', id);
      toast({ title: "Product deleted" });
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', type: 'firestick', page: 'main', image_url: '', badge: '', features: '', period: '', popularity: '0', is_active: true });
  };

  if (loading) return <div className="text-center py-8 text-white">Loading products...</div>;

  const mainProducts = products.filter(p => p.page === 'main');
  const secureProducts = products.filter(p => p.page === 'secure');

  const ProductTable = ({ items, title }: { items: Product[]; title: string }) => (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader><CardTitle className="text-white">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-700/50">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                  <td className="px-4 py-3">{p.image_url ? <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-slate-600 rounded" />}</td>
                  <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                  <td className="px-4 py-3 capitalize">{p.type}</td>
                  <td className="px-4 py-3 text-orange-400">${p.price}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No products yet</td></tr>}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Product Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild><Button className="bg-orange-500 hover:bg-orange-600"><Plus className="w-4 h-4 mr-2" />Add Product</Button></DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="bg-slate-700 border-slate-600" required /></div>
                <div><Label>Price ($)</Label><Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} className="bg-slate-700 border-slate-600" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Type</Label><Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}><SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="firestick">Fire Stick</SelectItem><SelectItem value="iptv">IPTV</SelectItem><SelectItem value="website">Website</SelectItem><SelectItem value="addon">Add-on</SelectItem></SelectContent></Select></div>
                <div><Label>Page</Label><Select value={formData.page} onValueChange={(v) => setFormData(prev => ({ ...prev, page: v }))}><SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="main">Main Page</SelectItem><SelectItem value="secure">Secure Domain</SelectItem></SelectContent></Select></div>
              </div>
              <div><Label>Image</Label><div className="flex gap-2"><Input value={formData.image_url} onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))} placeholder="Image URL" className="bg-slate-700 border-slate-600" /><label className="cursor-pointer"><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /><Button type="button" variant="outline" disabled={uploading} asChild><span><Upload className="w-4 h-4" /></span></Button></label></div>{formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-20 object-cover rounded" />}</div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Badge</Label><Input value={formData.badge} onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))} placeholder="e.g., Popular" className="bg-slate-700 border-slate-600" /></div>
                <div><Label>Period</Label><Input value={formData.period} onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))} placeholder="e.g., 1 Month" className="bg-slate-700 border-slate-600" /></div>
              </div>
              <div><Label>Features (one per line)</Label><Textarea value={formData.features} onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))} className="bg-slate-700 border-slate-600" rows={3} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} />Active</label>
              <div className="flex gap-2 justify-end"><Button type="button" variant="ghost" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button><Button type="submit" className="bg-orange-500 hover:bg-orange-600"><Save className="w-4 h-4 mr-2" />{editingProduct ? 'Update' : 'Create'}</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <ProductTable items={mainProducts} title="Main Page Products" />
      <ProductTable items={secureProducts} title="Secure Domain Products" />
    </div>
  );
};

export default AdminProducts;
