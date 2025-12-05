import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    google_verification: '',
    bing_verification: '',
    google_analytics: '',
    site_title: '',
    site_description: '',
    contact_email: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await (supabase
        .from('site_settings' as any)
        .select('*') as any);

      if (error) throw error;
      
      const settingsMap: Record<string, any> = {};
      (data || []).forEach((setting: any) => {
        settingsMap[setting.key] = setting.value;
      });
      
      setFormData({
        google_verification: settingsMap.google_verification || '',
        bing_verification: settingsMap.bing_verification || '',
        google_analytics: settingsMap.google_analytics || '',
        site_title: settingsMap.site_title || 'Stream Stick Pro',
        site_description: settingsMap.site_description || '',
        contact_email: settingsMap.contact_email || '',
        social_facebook: settingsMap.social_facebook || '',
        social_twitter: settingsMap.social_twitter || '',
        social_instagram: settingsMap.social_instagram || ''
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

  const saveSetting = async (key: string, value: any) => {
    try {
      const { data: existing } = await (supabase
        .from('site_settings' as any)
        .select('id')
        .eq('key', key)
        .maybeSingle() as any);

      if (existing) {
        const { error } = await (supabase
          .from('site_settings' as any)
          .update({ value })
          .eq('key', key) as any);
        if (error) throw error;
      } else {
        const { error } = await (supabase
          .from('site_settings' as any)
          .insert([{ key, value }]) as any);
        if (error) throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(formData)) {
        await saveSetting(key, value);
      }
      toast({ title: "Settings saved successfully" });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Site Settings</h2>
        <Button onClick={handleSaveAll} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            SEO & Search Engine Verification
          </CardTitle>
          <CardDescription>Add your verification codes to connect to Google Search Console and Bing Webmaster Tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Search Console Verification Code</Label>
            <Input
              value={formData.google_verification}
              onChange={(e) => setFormData(prev => ({ ...prev, google_verification: e.target.value }))}
              className="bg-slate-700 border-slate-600 font-mono"
              placeholder="google-site-verification=YOUR_CODE_HERE"
            />
            <p className="text-xs text-slate-500 mt-1">Get this from Google Search Console → Settings → Ownership verification</p>
          </div>

          <div>
            <Label>Bing Webmaster Verification Code</Label>
            <Input
              value={formData.bing_verification}
              onChange={(e) => setFormData(prev => ({ ...prev, bing_verification: e.target.value }))}
              className="bg-slate-700 border-slate-600 font-mono"
              placeholder="YOUR_BING_CODE_HERE"
            />
            <p className="text-xs text-slate-500 mt-1">Get this from Bing Webmaster Tools → Settings → Ownership verification</p>
          </div>

          <div>
            <Label>Google Analytics ID</Label>
            <Input
              value={formData.google_analytics}
              onChange={(e) => setFormData(prev => ({ ...prev, google_analytics: e.target.value }))}
              className="bg-slate-700 border-slate-600 font-mono"
              placeholder="G-XXXXXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Site Title</Label>
            <Input
              value={formData.site_title}
              onChange={(e) => setFormData(prev => ({ ...prev, site_title: e.target.value }))}
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div>
            <Label>Site Description (Meta Description)</Label>
            <Textarea
              value={formData.site_description}
              onChange={(e) => setFormData(prev => ({ ...prev, site_description: e.target.value }))}
              className="bg-slate-700 border-slate-600"
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-slate-500 mt-1">{formData.site_description.length}/160 characters</p>
          </div>

          <div>
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              className="bg-slate-700 border-slate-600"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Facebook URL</Label>
            <Input
              value={formData.social_facebook}
              onChange={(e) => setFormData(prev => ({ ...prev, social_facebook: e.target.value }))}
              className="bg-slate-700 border-slate-600"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <Label>Twitter/X URL</Label>
            <Input
              value={formData.social_twitter}
              onChange={(e) => setFormData(prev => ({ ...prev, social_twitter: e.target.value }))}
              className="bg-slate-700 border-slate-600"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <Label>Instagram URL</Label>
            <Input
              value={formData.social_instagram}
              onChange={(e) => setFormData(prev => ({ ...prev, social_instagram: e.target.value }))}
              className="bg-slate-700 border-slate-600"
              placeholder="https://instagram.com/..."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-900/20 border-blue-700">
        <CardHeader>
          <CardTitle className="text-blue-400">How to Use Verification Codes</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-2 text-sm">
          <p><strong>Google Search Console:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Go to <a href="https://search.google.com/search-console" target="_blank" className="text-orange-400 hover:underline">Google Search Console</a></li>
            <li>Add your property (website URL)</li>
            <li>Choose "HTML tag" verification method</li>
            <li>Copy the content value from the meta tag</li>
            <li>Paste it above and save</li>
          </ol>
          
          <p className="mt-4"><strong>Bing Webmaster Tools:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Go to <a href="https://www.bing.com/webmasters" target="_blank" className="text-orange-400 hover:underline">Bing Webmaster Tools</a></li>
            <li>Add your site</li>
            <li>Choose "HTML Meta Tag" verification</li>
            <li>Copy the content value</li>
            <li>Paste it above and save</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
