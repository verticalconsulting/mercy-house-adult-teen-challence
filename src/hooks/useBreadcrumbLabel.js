import { useEffect, useSyncExternalStore } from 'react';

/**
 * The page on screen publishes its own name here; the site-wide <Breadcrumbs />
 * in Layout reads it for the trail's final crumb.
 *
 * Module state rather than a context provider, matching useDocumentMeta: a page
 * telling the shell what it is called is a side channel, not app data. It also
 * keeps the label arriving after a record loads from re-rendering the page tree
 * — only the trail re-renders.
 */
let currentLabel = '';
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentLabel;
}

/** Read the label the current page has published. */
export function useBreadcrumbLabel() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Publish this page's own name for the trail — a blog post's title, an event's
 * title, a graduate's story. Cleared when the page unmounts, so a static page
 * that follows falls back to its route label.
 */
export function useSetBreadcrumbLabel(label) {
  const value = label ? String(label).trim() : '';

  useEffect(() => {
    currentLabel = value;
    emit();
    return () => {
      currentLabel = '';
      emit();
    };
  }, [value]);
}