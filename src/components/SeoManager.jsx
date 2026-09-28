import { useLocation } from 'react-router-dom';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { resolveSeo } from '@/lib/seo';

/**
 * Applies the current route's SEO metadata. Mounted once in Layout, so every
 * Layout-wrapped route is covered. Dynamic routes that load their own record
 * (/news/:slug, /events/event/:id, /testimonies/:slug) override these tags
 * afterwards via useShareMeta once their data resolves.
 */
export default function SeoManager() {
  const { pathname } = useLocation();
  useDocumentMeta(resolveSeo(pathname));
  return null;
}
