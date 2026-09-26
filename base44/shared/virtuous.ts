/*
 * Virtuous CRM+ API helpers.
 *
 * Used by the Stripe webhook to sync sponsorship donations into Virtuous
 * as Gift Transactions. Virtuous recommends the Gift Transaction endpoint
 * because it runs contact matching (email/phone/address/name) and avoids
 * duplicate contacts. Transactions are batched and processed nightly.
 *
 * Auth: Bearer API key (server-to-server). Base: https://api.virtuoussoftware.com
 * Docs: https://docs.virtuous.org/crm/recipes/stripe-to-virtuous
 */

const VIRTUOUS_API_BASE = 'https://api.virtuoussoftware.com';

export function splitName(fullName: string): { firstname: string; lastname: string } {
  if (!fullName) return { firstname: '', lastname: '' };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstname: parts[0], lastname: '' };
  return { firstname: parts[0], lastname: parts.slice(1).join(' ') };
}

export interface VirtuousContactInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;
}

export async function submitGiftTransaction(params: {
  apiKey: string;
  transactionId: string;
  customer: VirtuousContactInput;
  amount: number; // dollars
  giftDate: string; // ISO 8601
  currencyCode?: string;
  projectCode?: string;
}) {
  const { apiKey, transactionId, customer, amount, giftDate, currencyCode = 'USD', projectCode } = params;
  const { firstname, lastname } = splitName(customer.name || '');

  const contact: any = {
    referenceId: customer.id,
    referenceSource: 'Stripe',
    type: 'Household',
    firstname,
    lastname,
    emailType: 'Home Email',
    email: customer.email || '',
  };

  if (customer.phone) {
    contact.phone = customer.phone;
    contact.phoneType = 'Mobile Phone';
  }
  if (customer.address) {
    contact.address1 = customer.address.line1 || '';
    contact.city = customer.address.city || '';
    contact.state = customer.address.state || '';
    contact.postal = customer.address.postal_code || '';
    contact.country = customer.address.country || '';
  }

  const body: any = {
    transactionSource: 'Stripe',
    transactionId,
    contact,
    giftDate,
    giftType: 'Cash',
    amount,
    currencyCode,
  };

  if (projectCode) {
    body.giftDesignations = [{ projectCode, amountDesignated: amount }];
  }

  const res = await fetch(`${VIRTUOUS_API_BASE}/api/v2/Gift/Transaction`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Virtuous Gift Transaction failed (${res.status}): ${text}`);
  }
  return res.json();
}