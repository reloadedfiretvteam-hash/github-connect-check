import { useState, useEffect } from 'react';
import { adminQuery, adminInsert, adminUpdate } from '@/lib/supabaseAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Globe, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    google_verification: '', bing_verification: '', google_analytics: '', site_title: 'Stream Stick Pro', site_description: '', contact_email: '', social_facebook: '', social_twitter: '', social_instagram: ''
  });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminQuery('site_settings', { select: '*' });
      const map: Record<string, string> = {};
      (data || []).forEach((s: any) => { map[s.key] = s.value; });
      setFormData(prev => ({ ...prev, ...map }));
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      const existing = await adminQuery('site_settings', { eq: { column: 'key', value: key } });
      if (existing && existing.length > 0) {
        await adminUpdate('site_settings', { value }, 'key', key);
      } else {
        await adminInsert('site_settings', { key, value });
      }
    } catch (error) { throw error; }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(formData)) {
        await saveSetting(key, value);
      }
      toast({ title: "Settings saved" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-8 text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Site Settings</h2>
        <Button onClick={handleSaveAll} disabled={saving} className="bg-orange-500 hover:bg-orange-600"><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save All'}</Button>
      </div>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader><CardTitle className="text-white flex items-center gap-2"><Search className="w-5 h-5" />SEO & Verification</CardTitle><CardDescription>Connect Google Search Console & Bing Webmaster</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Google Verification Code</Label><Input value={formData.google_verification} onChange={(e) => setFormData(p => ({ ...p, google_verification: e.target.value }))} className="bg-slate-700 border-slate-600 font-mono" placeholder="google-site-verification=..." /></div>
          <div><Label>Bing Verification Code</Label><Input value={formData.bing_verification} onChange={(e) => setFormData(p => ({ ...p, bing_verification: e.target.value }))} className="bg-slate-700 border-slate-600 font-mono" /></div>
          <div><Label>Google Analytics ID</Label><Input value={formData.google_analytics} onChange={(e) => setFormData(p => ({ ...p, google_analytics: e.target.value }))} className="bg-slate-700 border-slate-600 font-mono" placeholder="G-XXXXXXXXXX" /></div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader><CardTitle className="text-white flex items-center gap-2"><Globe className="w-5 h-5" />General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Site Title</Label><Input value={formData.site_title} onChange={(e) => setFormData(p => ({ ...p, site_title: e.target.value }))} className="bg-slate-700 border-slate-600" /></div>
          <div><Label>Meta Description</Label><Textarea value={formData.site_description} onChange={(e) => setFormData(p => ({ ...p, site_description: e.target.value }))} className="bg-slate-700 border-slate-600" rows={3} maxLength={160} /><p className="text-xs text-slate-500">{formData.site_description.length}/160</p></div>
          <div><Label>Contact Email</Label><Input type="email" value={formData.contact_email} onChange={(e) => setFormData(p => ({ ...p, contact_email: e.target.value }))} className="bg-slate-700 border-slate-600" /></div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader><CardTitle className="text-white">Social Media</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Facebook</Label><Input value={formData.social_facebook} onChange={(e) => setFormData(p => ({ ...p, social_facebook: e.target.value }))} className="bg-slate-700 border-slate-600" /></div>
          <div><Label>Twitter/X</Label><Input value={formData.social_twitter} onChange={(e) => setFormData(p => ({ ...p, social_twitter: e.target.value }))} className="bg-slate-700 border-slate-600" /></div>
          <div><Label>Instagram</Label><Input value={formData.social_instagram} onChange={(e) => setFormData(p => ({ ...p, social_instagram: e.target.value }))} className="bg-slate-700 border-slate-600" /></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
