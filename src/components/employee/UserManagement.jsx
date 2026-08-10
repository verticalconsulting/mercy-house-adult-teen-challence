import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { UserPlus, Shield, Trash2, Mail, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const [inviting, setInviting] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: pendingInvites = [] } = useQuery({
    queryKey: ['pendingInvites'],
    queryFn: () => base44.entities.PendingInvite.list('-created_date'),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => base44.entities.User.update(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated');
    },
    onError: (err) => toast.error(`Failed to update role: ${err.message}`),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => base44.entities.User.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User removed');
      setRemoveTarget(null);
    },
    onError: (err) => toast.error(`Failed to remove user: ${err.message}`),
  });

  const cancelInviteMutation = useMutation({
    mutationFn: (id) => base44.entities.PendingInvite.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
      toast.success('Invitation cancelled');
    },
    onError: (err) => toast.error(`Failed to cancel invitation: ${err.message}`),
  });

  // Pending invitations whose email isn't already a registered user (those drop
  // off automatically once the person accepts and joins).
  const userEmails = new Set(users.map((u) => (u.email || '').toLowerCase()));
  const pendingNotJoined = pendingInvites.filter(
    (p) => !userEmails.has((p.email || '').toLowerCase())
  );

  const handleInvite = async () => {
    setInviting(true);
    try {
      await base44.users.inviteUser(inviteEmail, inviteRole);
      // Persist a record so the admin can see who's been invited even though
      // the User record isn't created until the invitee accepts.
      await base44.entities.PendingInvite.create({
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
      });
      toast.success(`Invitation sent to ${inviteEmail}`);
      queryClient.invalidateQueries({ queryKey: ['pendingInvites'] });
      setInviteOpen(false);
      setInviteEmail('');
      setInviteRole('user');
    } catch (err) {
      toast.error(`Failed to invite: ${err.message}`);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy dark:text-gold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            User Access Control
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage who can access the Employee Portal and assign admin roles.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-navy dark:text-gold">Team Members ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy dark:border-gold" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Pending invitations — shown until the invitee accepts */}
              {pendingNotJoined.map((p) => (
                <div key={`pending-${p.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      {p.email}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                      Invitation sent — awaiting account creation
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge className="bg-amber-200 text-amber-800">{p.role || 'user'}</Badge>
                    <Badge variant="outline">Pending</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => cancelInviteMutation.mutate(p.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label="Cancel invitation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {users.map((u) => (
                <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{u.full_name || u.email}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                      <Mail className="w-3.5 h-3.5" /> {u.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge className={u.role === 'admin' ? 'bg-navy text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}>
                      {u.role || 'user'}
                    </Badge>
                    <Select
                      value={u.role || 'user'}
                      onValueChange={(role) => updateRoleMutation.mutate({ id: u.id, role })}
                    >
                      <SelectTrigger className="w-32 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setRemoveTarget(u)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label="Remove user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {users.length === 0 && pendingNotJoined.length === 0 && (
                <p className="text-center text-slate-500 py-8">No users found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-navy dark:text-gold flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite New User
            </DialogTitle>
            <DialogDescription>
              Send an invitation email. The recipient will be able to create an account and access the portal with the selected role. They'll appear in the list as "Pending" until they create their account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="invite_email" className="text-base font-semibold">Email Address</Label>
              <Input
                id="invite_email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="name@mercyhouseatc.com"
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label className="text-base font-semibold">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — full portal access</SelectItem>
                  <SelectItem value="user">User — limited access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)} disabled={inviting}>Cancel</Button>
            <Button onClick={handleInvite} disabled={inviting || !inviteEmail} className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
              {inviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <Dialog open={!!removeTarget} onOpenChange={(o) => !o && setRemoveTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Remove User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{removeTarget?.full_name || removeTarget?.email}</strong>? This will revoke their portal access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteUserMutation.mutate(removeTarget.id)} disabled={deleteUserMutation.isPending} className="bg-red-600 hover:bg-red-700">
              {deleteUserMutation.isPending ? 'Removing...' : 'Remove User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}