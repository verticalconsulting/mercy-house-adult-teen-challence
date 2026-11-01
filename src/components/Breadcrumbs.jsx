import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getBreadcrumbTrail } from '@/lib/breadcrumbs';
import { useBreadcrumbLabel } from '@/hooks/useBreadcrumbLabel';
import { useJsonLd } from '@/hooks/useJsonLd';

// Same origin as useDocumentMeta / useOrganizationSchema — override together
// via VITE_SITE_URL so the BreadcrumbList URLs match the canonical site.
const SITE_ORIGIN = import.meta.env.VITE_SITE_URL || 'https://mercyhouseatc.com';

/**
 * The site-wide trail, rendered once in Layout above the page so every page has
 * one. Renders nothing on the homepage, on the paid-traffic landing pages, and
 * on any URL that is not one of our pages (the 404 included).
 */
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const currentLabel = useBreadcrumbLabel();
  const trail = getBreadcrumbTrail(pathname, currentLabel);

  // Mirror the visible trail as BreadcrumbList structured data so search
  // engines can show the path in results, not just on the page.
  const schema = trail
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.label,
          item: `${SITE_ORIGIN}${crumb.path === '/' ? '' : crumb.path}`,
        })),
      }
    : null;
  useJsonLd('breadcrumb-schema', schema);

  if (!trail) return null;

  return (
    /* pr-28 on phones clears the floating Donate button that sits just below
       the header, so a long trail never ends up hidden under it. */
    <Breadcrumb className="mx-auto w-full max-w-7xl px-4 pr-28 pt-4 sm:px-6 sm:pr-6 lg:px-8">
      <BreadcrumbList>
        {trail.map((crumb, index) => {
          const isCurrent = index === trail.length - 1;
          return (
            <React.Fragment key={crumb.path}>
              {index > 0 && (
                <BreadcrumbSeparator className="text-slate-400 dark:text-slate-500" />
              )}
              <BreadcrumbItem className="min-w-0">
                {isCurrent ? (
                  <BreadcrumbPage className="max-w-[70vw] truncate font-semibold text-navy dark:text-gold sm:max-w-md">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="text-slate-600 hover:text-navy dark:text-slate-300 dark:hover:text-gold"
                  >
                    <Link to={crumb.path}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}