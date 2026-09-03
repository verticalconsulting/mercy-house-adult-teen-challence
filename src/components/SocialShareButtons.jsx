import React, { useState } from 'react';
import { Facebook, Twitter, Linkedin, Mail, Link2, Check } from 'lucide-react';

/**
 * Social sharing buttons for blog posts and stories.
 * Shares the current page URL to Facebook, X, LinkedIn, email, or copies the link.
 */
export default function SocialShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const openShare = (href) => window.open(href, '_blank', 'noopener,noreferrer,width=600,height=600');

  const btnClass =
    'inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-navy hover:text-white hover:border-navy dark:hover:bg-gold dark:hover:text-navy dark:hover:border-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={() => openShare(shareLinks.facebook)} className={btnClass} aria-label="Share on Facebook">
        <Facebook className="w-4 h-4" />
      </button>
      <button onClick={() => openShare(shareLinks.twitter)} className={btnClass} aria-label="Share on X">
        <Twitter className="w-4 h-4" />
      </button>
      <button onClick={() => openShare(shareLinks.linkedin)} className={btnClass} aria-label="Share on LinkedIn">
        <Linkedin className="w-4 h-4" />
      </button>
      <button onClick={() => openShare(shareLinks.email)} className={btnClass} aria-label="Share by email">
        <Mail className="w-4 h-4" />
      </button>
      <button onClick={handleCopy} className={btnClass} aria-label="Copy link">
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
      </button>
      {copied && <span className="text-xs text-green-600 font-semibold ml-1">Link copied!</span>}
    </div>
  );
}