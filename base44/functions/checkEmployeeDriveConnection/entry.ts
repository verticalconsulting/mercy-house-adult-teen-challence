import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Workspace-registered app-user connector for Google Drive ("Employee Google Drive").
const CONNECTOR_ID = '6ac5c9964235104eaaa6024e';

// Returns whether the current app user has connected their own Google Drive
// via the app-user connector. Used by the Employee Portal "Employee Drive"
// card to show connected/not-connected status.
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);
      if (!accessToken) {
        return Response.json({ connected: false });
      }
      return Response.json({ connected: true, email: user.email });
    } catch (err) {
      // No app-user connection established yet.
      return Response.json({ connected: false });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}