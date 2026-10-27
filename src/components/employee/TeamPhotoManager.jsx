import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { team } from '@/lib/teamMembers';
import { compressPortrait } from '@/lib/compressPortrait';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import TeamPhotoRow from './TeamPhotoRow';

/**
 * Staff photo manager. Each employee finds their own name, uploads a portrait,
 * and it appears on the Meet Our Team page. Photos are cropped to 4:5, resized
 * to 800px and JPEG-compressed in the browser, then uploaded to Cloudflare
 * Images through the uploadTeamPhoto backend function.
 */
export default function TeamPhotoManager() {
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = async () => {
    const { items } = await base44.entities.TeamMemberPhoto.filter({}, { limit: 100 });
    const map = {};
    items.forEach((photo) => {
      map[photo.member_name] = photo;
    });
    setPhotos(map);
  };

  useEffect(() => {
    load()
      .catch(() => toast.error('Could not load team photos'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (member, file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setBusy(member.name);
    try {
      const { dataUrl, bytes } = await compressPortrait(file);
      const { data } = await base44.functions.invoke('uploadTeamPhoto', {
        image: dataUrl,
        memberName: member.name,
      });
      if (!data?.url) throw new Error(data?.error || 'Upload failed');

      const payload = {
        member_name: member.name,
        photo_url: data.url,
        cloudflare_image_id: data.id,
        alt_text: `${member.name}, ${member.title}`,
      };
      const existing = photos[member.name];
      if (existing?.id) {
        await base44.entities.TeamMemberPhoto.update(existing.id, payload);
      } else {
        const me = await base44.auth.me().catch(() => null);
        await base44.entities.TeamMemberPhoto.create({
          ...payload,
          uploaded_by_email: me?.email || '',
        });
      }
      await load();
      toast.success(`${member.name}'s photo saved (${Math.round(bytes / 1024)} KB)`);
    } catch (err) {
      toast.error(err.message || 'Could not upload that photo');
    } finally {
      setBusy(null);
    }
  };

  const handleRemove = async (member) => {
    const existing = photos[member.name];
    if (!existing?.id) return;
    setBusy(member.name);
    try {
      await base44.entities.TeamMemberPhoto.delete(existing.id);
      await load();
      toast.success(`${member.name}'s photo removed`);
    } catch (err) {
      toast.error(err.message || 'Could not remove that photo');
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-navy dark:text-gold" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-navy dark:text-gold">Team Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Find your name and upload a portrait. Photos are cropped to a 4:5 portrait, resized to 800px
          and compressed to JPEG in your browser before they are stored on Cloudflare Images, so the
          team page stays fast.
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          {team.map((member) => (
            <TeamPhotoRow
              key={member.name}
              member={member}
              photoUrl={photos[member.name]?.photo_url}
              busy={busy === member.name}
              onUpload={(file) => handleUpload(member, file)}
              onRemove={() => handleRemove(member)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}