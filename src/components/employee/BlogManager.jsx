import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Loader2, Save, Sparkles, Globe, Facebook, Plus, Pencil, Trash2, Eye, EyeOff, X, ChevronLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import ImageUploadInput from '@/components/ImageUploadInput';

const categoryColors = {
  news: 'bg-blue-100 text-blue-800',
  event: 'bg-purple-100 text-purple-800',
  success_story: 'bg-green-100 text-green-800',
  announcement: 'bg-yellow-100 text-yellow-800',
};

const emptyPost = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featured_image: '',
  category: 'news',
  published: false,
  publish_date: new Date().toISOString().split('T')[0],
  tags: [],
};

function PostForm({ post, onSave, onCancel, saving }) {
  const [form, setForm] = useState(post);
  const [tagInput, setTagInput] = useState('');

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleTitleChange = (val) => {
    update('title', val);
    if (!post.id) update('slug', autoSlug(val));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags?.includes(t)) {
      update('tags', [...(form.tags || []), t]);
    }
    setTagInput('');
  };

  const removeTag = (tag) => update('tags', form.tags.filter(t => t !== tag));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h3 className="text-xl font-bold text-navy dark:text-gold">
          {post.id ? 'Edit Post' : 'New Blog Post'}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Title *</Label>
          <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} className="mt-1" placeholder="Post title..." />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={form.slug} onChange={e => update('slug', e.target.value)} className="mt-1" placeholder="url-friendly-slug" />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={v => update('category', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="success_story">Success Story</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Publish Date</Label>
          <Input type="date" value={form.publish_date} onChange={e => update('publish_date', e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Featured Image</Label>
          <ImageUploadInput
            value={form.featured_image || ''}
            onChange={url => update('featured_image', url)}
            maxWidth={1600}
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Excerpt</Label>
          <Textarea value={form.excerpt || ''} onChange={e => update('excerpt', e.target.value)} rows={2} className="mt-1" placeholder="Brief summary shown in previews..." />
        </div>
        <div className="md:col-span-2">
          <Label>Content (Markdown) *</Label>
          <Textarea value={form.content} onChange={e => update('content', e.target.value)} rows={14} className="mt-1 font-mono text-sm" placeholder="Write your post content here..." />
        </div>
        <div className="md:col-span-2">
          <Label>Tags</Label>
          <div className="flex gap-2 mt-1">
            <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag and press Enter..." />
            <Button type="button" variant="outline" onClick={addTag}>Add</Button>
          </div>
          {form.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-navy/10 dark:bg-gold/10 text-navy dark:text-gold rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button onClick={() => onSave({ ...form, published: false })} disabled={saving || !form.title || !form.content} variant="outline">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save as Draft
        </Button>
        <Button onClick={() => onSave({ ...form, published: true })} disabled={saving || !form.title || !form.content} className="bg-green-600 hover:bg-green-700">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
          {form.published ? 'Save & Keep Published' : 'Publish Now'}
        </Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

function PostList({ posts, onEdit, onDelete, onTogglePublish }) {
  return (
    <div className="space-y-3">
      {posts.length === 0 && (
        <p className="text-slate-500 text-center py-10">No blog posts yet. Create one above.</p>
      )}
      {posts.map(post => (
        <Card key={post.id} className="hover:border-gold/50 transition-colors">
          <CardContent className="flex items-start justify-between gap-4 pt-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || 'bg-slate-100 text-slate-700'}`}>
                  {post.category?.replace('_', ' ')}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                {post.publish_date && (
                  <span className="text-xs text-slate-400">{format(new Date(post.publish_date), 'MMM d, yyyy')}</span>
                )}
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{post.title}</h4>
              {post.excerpt && <p className="text-sm text-slate-500 truncate mt-0.5">{post.excerpt}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost" title={post.published ? 'Unpublish' : 'Publish'} onClick={() => onTogglePublish(post)}>
                {post.published ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-green-600" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onEdit(post)}>
                <Pencil className="w-4 h-4 text-navy dark:text-gold" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(post.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function BlogManager() {
  const queryClient = useQueryClient();
  const [view, setView] = useState('list'); // 'list' | 'new' | 'edit' | 'ai'
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);

  // AI generator state
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [postToFacebook, setPostToFacebook] = useState(false);

  const { data: posts = [] } = useQuery({
    queryKey: ['blogPosts-admin'],
    queryFn: () => base44.entities.BlogPost.list('-publish_date', 100),
  });

  const savePost = async (formData) => {
    setSaving(true);
    try {
      if (formData.id) {
        await base44.entities.BlogPost.update(formData.id, formData);
        toast.success('Post updated!');
      } else {
        if (!formData.slug) formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await base44.entities.BlogPost.create(formData);
        toast.success(formData.published ? 'Post published!' : 'Draft saved!');
      }
      queryClient.invalidateQueries({ queryKey: ['blogPosts-admin'] });
      setView('list');
      setEditingPost(null);
    } catch (e) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return;
    await base44.entities.BlogPost.delete(id);
    queryClient.invalidateQueries({ queryKey: ['blogPosts-admin'] });
    toast.success('Post deleted');
  };

  const togglePublish = async (post) => {
    await base44.entities.BlogPost.update(post.id, { published: !post.published });
    queryClient.invalidateQueries({ queryKey: ['blogPosts-admin'] });
    toast.success(post.published ? 'Post unpublished' : 'Post published!');
  };

  const promptTemplates = [
    { title: 'Success Story', template: 'Write an inspiring 500-word blog post about a success story from our recovery program. Include themes of transformation, hope, and faith. Make it emotional and uplifting.' },
    { title: 'Testimonial Feature', template: 'Write a compelling 400-word blog post featuring a graduate testimonial. Focus on their journey from struggle to success, highlighting the role of faith and community support.' },
    { title: 'Program Impact', template: 'Write a 600-word blog post about the impact of our faith-based recovery program. Include statistics about lives changed, family restoration, and community transformation. Make it compelling for donors.' },
  ];

  const generateContent = async () => {
    if (!prompt.trim()) { toast.error('Please enter a prompt'); return; }
    setGenerating(true);
    try {
      const response = await base44.functions.invoke('generateBlogPost', { prompt });
      setGeneratedContent(response.data);
      toast.success('Content generated!');
    } catch (e) {
      toast.error('Generation failed: ' + e.message);
    } finally {
      setGenerating(false);
    }
  };

  const saveAIPost = async (publish) => {
    if (!generatedContent) return;
    setSaving(true);
    try {
      const slug = generatedContent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const blogPost = await base44.entities.BlogPost.create({
        title: generatedContent.title,
        slug,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        category: 'success_story',
        published: publish,
        tags: generatedContent.tags || [],
        publish_date: new Date().toISOString().split('T')[0],
      });
      toast.success(publish ? 'Published!' : 'Saved as draft!');
      if (postToFacebook && publish) {
        try {
          await base44.functions.invoke('postToFacebook', { message: `${generatedContent.title}\n\n${generatedContent.excerpt}`, link: window.location.origin });
          toast.success('Posted to Facebook!');
        } catch { toast.error('Saved but failed to post to Facebook'); }
      }
      queryClient.invalidateQueries({ queryKey: ['blogPosts-admin'] });
      setGeneratedContent(null);
      setPrompt('');
      setView('list');
    } catch (e) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy dark:text-gold mb-2">Blog Manager</h2>
        <p className="text-slate-600 dark:text-slate-400">Create, edit, and manage blog posts — manually or with AI</p>
      </div>

      {/* Tab Bar */}
      {view === 'list' && (
        <>
          <div className="flex gap-3">
            <Button onClick={() => { setEditingPost(null); setView('new'); }} className="bg-navy dark:bg-gold text-white dark:text-navy">
              <Plus className="w-4 h-4 mr-2" /> New Post
            </Button>
            <Button variant="outline" onClick={() => setView('ai')}>
              <Wand2 className="w-4 h-4 mr-2" /> Generate with AI
            </Button>
          </div>
          <PostList posts={posts} onEdit={p => { setEditingPost(p); setView('edit'); }} onDelete={deletePost} onTogglePublish={togglePublish} />
        </>
      )}

      {(view === 'new' || view === 'edit') && (
        <PostForm
          post={editingPost || emptyPost}
          onSave={savePost}
          onCancel={() => { setView('list'); setEditingPost(null); }}
          saving={saving}
        />
      )}

      {view === 'ai' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setView('list'); setGeneratedContent(null); setPrompt(''); }}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h3 className="text-xl font-bold text-navy dark:text-gold">AI Blog Post Generator</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {promptTemplates.map((t, idx) => (
              <Card key={idx} className="cursor-pointer hover:border-gold transition-colors" onClick={() => setPrompt(t.template)}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" /> {t.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-5 space-y-4">
              <div>
                <Label>Prompt</Label>
                <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="mt-1" placeholder="Describe the blog post you want to create..." />
              </div>
              <Button onClick={generateContent} disabled={generating || !prompt.trim()} className="w-full bg-navy dark:bg-gold hover:bg-navy/90">
                {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Wand2 className="w-4 h-4 mr-2" /> Generate Blog Post</>}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card className="border-gold">
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={generatedContent.title} onChange={e => setGeneratedContent({ ...generatedContent, title: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Excerpt</Label>
                  <Textarea value={generatedContent.excerpt || ''} onChange={e => setGeneratedContent({ ...generatedContent, excerpt: e.target.value })} rows={2} className="mt-1" />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea value={generatedContent.content} onChange={e => setGeneratedContent({ ...generatedContent, content: e.target.value })} rows={12} className="mt-1 font-mono text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="fb" checked={postToFacebook} onCheckedChange={setPostToFacebook} />
                  <Label htmlFor="fb" className="text-sm font-normal cursor-pointer">Also post to Facebook when publishing</Label>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => saveAIPost(false)} disabled={saving} variant="outline">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save as Draft
                  </Button>
                  <Button onClick={() => saveAIPost(true)} disabled={saving} className="bg-green-600 hover:bg-green-700">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
                    {postToFacebook ? 'Publish & Post to FB' : 'Publish Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}