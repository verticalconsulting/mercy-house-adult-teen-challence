import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, Save, Sparkles, Globe, Facebook } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function BlogGenerator() {
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [postToFacebook, setPostToFacebook] = useState(false);

  const promptTemplates = [
    {
      title: 'Success Story',
      description: 'Generate an inspiring success story',
      template: 'Write an inspiring 500-word blog post about a success story from our recovery program. Include themes of transformation, hope, and faith. Make it emotional and uplifting.'
    },
    {
      title: 'Testimonial Feature',
      description: 'Feature a graduate testimonial',
      template: 'Write a compelling 400-word blog post featuring a graduate testimonial. Focus on their journey from struggle to success, highlighting the role of faith and community support.'
    },
    {
      title: 'Program Impact',
      description: 'Showcase program effectiveness',
      template: 'Write a 600-word blog post about the impact of our faith-based recovery program. Include statistics about lives changed, family restoration, and community transformation. Make it compelling for donors.'
    }
  ];

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt or select a template');
      return;
    }

    setGenerating(true);
    try {
      const response = await base44.functions.invoke('generateBlogPost', { prompt });
      setGeneratedContent(response.data);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const saveBlogPost = async (publish = false) => {
    if (!generatedContent) return;

    setSaving(true);
    try {
      const slug = generatedContent.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const blogPost = await base44.entities.BlogPost.create({
        title: generatedContent.title,
        slug: slug,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        category: 'success_story',
        published: publish,
        tags: generatedContent.tags || [],
        publish_date: new Date().toISOString().split('T')[0]
      });

      toast.success(publish ? 'Blog post published!' : 'Blog post saved as draft!');

      // Post to Facebook if checkbox is checked and publishing
      if (postToFacebook && publish) {
        try {
          const appUrl = window.location.origin;
          const blogUrl = `${appUrl}${window.location.pathname}#/BlogPost?id=${blogPost.id}`;
          
          const fbResponse = await base44.functions.invoke('postToFacebook', {
            message: `${generatedContent.title}\n\n${generatedContent.excerpt}\n\nRead more:`,
            link: blogUrl
          });

          if (fbResponse.data?.success) {
            toast.success('Also posted to Facebook! 📘');
          }
        } catch (fbError) {
          console.error('Facebook posting error:', fbError);
          toast.error('Blog saved but failed to post to Facebook');
        }
      }

      setGeneratedContent(null);
      setPrompt('');
      setPostToFacebook(false);
    } catch (error) {
      toast.error('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy dark:text-gold mb-2">
          AI Blog Post Generator
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Generate engaging blog content about success stories and testimonials using AI
        </p>
      </div>

      {/* Template Shortcuts */}
      <div className="grid md:grid-cols-3 gap-4">
        {promptTemplates.map((template, idx) => (
          <Card
            key={idx}
            className="cursor-pointer hover:border-gold transition-colors"
            onClick={() => setPrompt(template.template)}
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                {template.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Custom Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Prompt</CardTitle>
          <CardDescription>
            Describe the blog post you want to create, or use a template above
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Prompt</Label>
            <Textarea
              placeholder="Example: Write a blog post about a woman who overcame life-controlling issues and reunited with her children..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          <Button
            onClick={generateContent}
            disabled={generating || !prompt.trim()}
            className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Blog Post
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content Preview */}
      {generatedContent && (
        <Card className="border-gold">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Content</span>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="postToFacebook"
                    checked={postToFacebook}
                    onCheckedChange={setPostToFacebook}
                  />
                  <Label htmlFor="postToFacebook" className="text-sm font-normal cursor-pointer">
                    Also post to Facebook when publishing
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => saveBlogPost(false)}
                    disabled={saving}
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => saveBlogPost(true)}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        {postToFacebook && <Facebook className="w-4 h-4 mr-1" />}
                      </>
                    )}
                    {postToFacebook ? 'Publish & Post to FB' : 'Publish Now'}
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gold">Title</Label>
              <Input
                value={generatedContent.title}
                onChange={(e) =>
                  setGeneratedContent({ ...generatedContent, title: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-gold">Excerpt</Label>
              <Textarea
                value={generatedContent.excerpt}
                onChange={(e) =>
                  setGeneratedContent({ ...generatedContent, excerpt: e.target.value })
                }
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-gold">Content</Label>
              <Textarea
                value={generatedContent.content}
                onChange={(e) =>
                  setGeneratedContent({ ...generatedContent, content: e.target.value })
                }
                rows={12}
                className="mt-1 font-mono text-sm"
              />
            </div>

            {generatedContent.tags && generatedContent.tags.length > 0 && (
              <div>
                <Label className="text-gold">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generatedContent.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-navy/10 dark:bg-gold/10 text-navy dark:text-gold rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {generatedContent.meta_description && (
              <div>
                <Label className="text-gold">SEO Meta Description</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {generatedContent.meta_description}
                </p>
              </div>
            )}

            {generatedContent.meta_keywords && generatedContent.meta_keywords.length > 0 && (
              <div>
                <Label className="text-gold">SEO Keywords</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {generatedContent.meta_keywords.join(', ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}