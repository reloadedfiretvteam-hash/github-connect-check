import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description: string | null;
  meta_keywords: string[] | null;
  featured_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    meta_keywords: '',
    featured_image: '',
    is_published: false
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await (supabase
        .from('seo_blogs' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any);

      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const blogData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      content: formData.content,
      meta_description: formData.meta_description || null,
      meta_keywords: formData.meta_keywords ? formData.meta_keywords.split(',').map(k => k.trim()) : null,
      featured_image: formData.featured_image || null,
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null
    };

    try {
      if (editingBlog) {
        const { error } = await (supabase
          .from('seo_blogs' as any)
          .update(blogData)
          .eq('id', editingBlog.id) as any);
        if (error) throw error;
        toast({ title: "Blog updated successfully" });
      } else {
        const { error } = await (supabase
          .from('seo_blogs' as any)
          .insert([blogData]) as any);
        if (error) throw error;
        toast({ title: "Blog created successfully" });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      meta_description: blog.meta_description || '',
      meta_keywords: blog.meta_keywords?.join(', ') || '',
      featured_image: blog.featured_image || '',
      is_published: blog.is_published
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const { error } = await (supabase
        .from('seo_blogs' as any)
        .delete()
        .eq('id', id) as any);
      if (error) throw error;
      toast({ title: "Blog deleted" });
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const togglePublish = async (blog: Blog) => {
    try {
      const { error } = await (supabase
        .from('seo_blogs' as any)
        .update({ 
          is_published: !blog.is_published,
          published_at: !blog.is_published ? new Date().toISOString() : null
        })
        .eq('id', blog.id) as any);
      if (error) throw error;
      toast({ title: blog.is_published ? "Blog unpublished" : "Blog published" });
      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      meta_keywords: '',
      featured_image: '',
      is_published: false
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">SEO Blog Management</h2>
          <p className="text-slate-400">{blogs.length} total blogs • {blogs.filter(b => b.is_published).length} published</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlog ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      title: e.target.value,
                      slug: prev.slug || generateSlug(e.target.value)
                    }));
                  }}
                  className="bg-slate-700 border-slate-600"
                  required
                />
              </div>

              <div>
                <Label>Slug (URL-friendly)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="auto-generated-from-title"
                />
              </div>

              <div>
                <Label>Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-slate-700 border-slate-600 min-h-[200px]"
                  required
                />
              </div>

              <div>
                <Label>Meta Description (for SEO)</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  rows={2}
                  maxLength={160}
                  placeholder="Max 160 characters for search engines"
                />
                <p className="text-xs text-slate-500 mt-1">{formData.meta_description.length}/160</p>
              </div>

              <div>
                <Label>Keywords (comma-separated)</Label>
                <Input
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="streaming, iptv, fire stick, cord cutting"
                />
              </div>

              <div>
                <Label>Featured Image URL</Label>
                <Input
                  value={formData.featured_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="rounded"
                />
                <Label>Publish immediately</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  <Save className="w-4 h-4 mr-2" />
                  {editingBlog ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{blog.title}</p>
                        {blog.meta_description && (
                          <p className="text-xs text-slate-500 truncate max-w-xs">{blog.meta_description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">/blog/{blog.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${blog.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {blog.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => togglePublish(blog)} title={blog.is_published ? 'Unpublish' : 'Publish'}>
                          {blog.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(blog)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleDelete(blog.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No blogs yet. Create your first one!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogs;
