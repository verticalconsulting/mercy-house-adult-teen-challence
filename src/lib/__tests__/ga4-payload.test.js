import { describe, it, expect } from 'vitest';
import { buildGa4MonthlyGiftPayload } from '../../../base44/functions/virtuousGiftWebhook/payload.js';

describe('buildGa4MonthlyGiftPayload', () => {
  it('names the event monthly_gift_complete', () => {
    const p = buildGa4MonthlyGiftPayload({ giftId: 'g1', amount: 50 });
    expect(p.events[0].name).toBe('monthly_gift_complete');
  });

  it('includes engagement_time_msec and session_id so GA4 reports the event', () => {
    // Measurement Protocol events without these are accepted (204) but do not
    // appear in standard reports — the silent-drop failure this guards.
    const params = buildGa4MonthlyGiftPayload({ giftId: 'g1', amount: 50 }).events[0].params;
    expect(params.engagement_time_msec).toBeDefined();
    expect(params.session_id).toBeDefined();
  });

  it('derives a stable client_id and session_id from the gift id', () => {
    const a = buildGa4MonthlyGiftPayload({ giftId: 'g1', amount: 50 });
    const b = buildGa4MonthlyGiftPayload({ giftId: 'g1', amount: 50 });
    expect(a.client_id).toBe(b.client_id);
    expect(a.events[0].params.session_id).toBe(b.events[0].params.session_id);
  });

  it('coerces a non-numeric amount to 0 rather than emitting NaN', () => {
    const p = buildGa4MonthlyGiftPayload({ giftId: 'g1', amount: { nested: true } });
    expect(p.events[0].params.value).toBe(0);
    expect(JSON.stringify(p)).not.toContain('null');
  });

  it('accepts a numeric string amount', () => {
    expect(buildGa4MonthlyGiftPayload({ giftId: 'g1', amount: '25.50' }).events[0].params.value).toBe(25.5);
  });

  it('carries the transaction id for downstream dedupe', () => {
    expect(buildGa4MonthlyGiftPayload({ giftId: 'g9', amount: 1 }).events[0].params.transaction_id).toBe('g9');
  });
});
