import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// The AI chat talks to the platform host directly instead of going through
// the custom domain. On mercyhouseatc.com, API calls pass through an extra
// proxy layer that drops the anonymous-visitor header, so signed-out visitors
// were rejected with "User must be authenticated to create a conversation".
const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const agentChatClient = createClient({
  appId,
  token,
  functionsVersion,
  appBaseUrl,
  serverUrl: 'https://mercy-house-hope.base44.app',
  requiresAuth: false,
  analytics: { enabled: false }
});