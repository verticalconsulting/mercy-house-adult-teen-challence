# Runbook: Verify the Search Console Domain property for mercyhouseatc.com

**Who runs this:** someone with Search Console access *and* DNS access for the
domain. Both are required — the verification record is a DNS change.

## Why a Domain property, not a URL-prefix property

A URL-prefix property covers exactly one origin: `https://mercyhouseatc.com/`
and nothing else. A **Domain** property covers every subdomain and both
protocols under `mercyhouseatc.com`. That is what this migration needs,
because traffic will arrive on the apex, on `www`, and on `http` before the
redirects settle, and all of it must roll up into one property. Domain
properties can only be verified by DNS — there is no HTML-file or meta-tag
option.

## Steps

1. Search Console → property dropdown → **Add property** → **Domain**.
2. Enter `mercyhouseatc.com` — the bare domain. No `https://`, no `www.`, no
   trailing slash.
3. Copy the TXT record Google shows. It looks like
   `google-site-verification=<token>`.
4. At the DNS host, add a **TXT** record:
   - Host/Name: `@` (the apex). **Not** `www`, and not a subdomain — a record
     on `www` will never verify a Domain property.
   - Value: the full `google-site-verification=<token>` string.
   - TTL: the default is fine.
5. Wait for propagation, then confirm from a shell before clicking anything:

   ```bash
   dig TXT mercyhouseatc.com +short
   # or, on Windows without dig:
   nslookup -type=TXT mercyhouseatc.com
   ```

   Expected: a line containing your `google-site-verification=` token. If it
   is absent, the record has not propagated or was added to the wrong host.
   Clicking Verify before this shows the token wastes a retry.
6. Back in Search Console, click **Verify**.

## After verification

7. **Do not delete the verification TXT record.** Google re-checks it
   periodically and will unverify the property if it disappears.
8. Submit the sitemap: Search Console → Sitemaps → enter `sitemap.xml` →
   Submit. The full URL is `https://mercyhouseatc.com/sitemap.xml`.
9. **Keep the old `.org` property.** It is the only place you can watch the
   301s drain: its Page Indexing report will show URLs moving to
   "Page with redirect" over the following weeks. Deleting it destroys the
   evidence that the migration worked.
10. In the `.org` property, use **Settings → Change of address** to point it
    at the `.com` property. This is what tells Google the move is
    intentional and site-wide rather than a set of unrelated redirects.

## Confirming it is done

- The property appears in Search Console with no verification warning.
- `dig TXT mercyhouseatc.com +short` still returns the token.
- Sitemaps shows `sitemap.xml` with status Success and a discovered-URL
  count matching `grep -c '<loc>' public/sitemap.xml`.
