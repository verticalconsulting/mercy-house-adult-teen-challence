import { useLocation } from 'react-router-dom';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { pageSeo } from '@/lib/seo';

/**
 * Reads the current route and applies that route's SEO metadata.
 * Place once inside Layout so every Layout-wrapped route is covered.
 * Routes with no entry here (dynamic pages like /news/:slug) are skipped
 * so the page can set its own meta via useShareMeta.
 */
export default function SeoManager() {
  const location = useLocation();
  let path = location.pathname;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  const seo = pageSeo[path];
  useDocumentMeta(seo || { title: null });
  return null;
}