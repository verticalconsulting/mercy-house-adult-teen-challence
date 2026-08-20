import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot, MessageSquare, Save, Plus, Trash2, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

// Entities staff can grant the agent access to.
const ENTITY_OPTIONS = [
  'Application',
  'BedCount',
  'BlogPost',
  'Campaign',
  'CareerListing',
  'Event',
  'GolfTeamRegistration',
  'InternshipApplication',
  'MediaResource',
  'Resident',
  'Testimonial',
  'VehicleDonation',
  'Volunteer',
  'VolunteerShift',
  'WomensCampusMedia',
];

const ALL_OPERATIONS = ['create', 'read', 'update', 'delete'];

// Defaults seeded from the live agent config file (base44/agents/mercy_house_assistant.jsonc)
// so the portal starts in sync with what the running agent actually does.
const DEFAULT_CONFIG = {
  description: 'AI assistant that answers questions about Mercy House Adult Teen Challenge',
  instructions:
    "ROLE\nYou are the Mercy House Website Assistant.\nYour job is to help visitors understand Mercy House and guide them to take action (get help, donate, volunteer, shop thrift, or learn more).\nAlways stay focused on Mercy House topics.\nKNOWLEDGE SCOPE\nYou only answer questions related to Mercy House recovery programs, addiction recovery and faith-based support, Mercy House mission and ministry, vehicle donations, thrift store operations, volunteering, financial donations, contacting Mercy House, events or ministry outreach, and Mercy House staff and their roles.\nIf a question is unrelated, respond: \"I'm here to help with Mercy House programs, recovery support, donations, and volunteering. How can I assist with Mercy House today?\"\nRESPONSE STYLE\nKeep responses short and direct. Default length 1–3 sentences. Expand only if the user asks for more detail. Use bullet points only when helpful.\nFACT ACCURACY\nNever invent information. If unsure, say: \"I don't have that information, but Mercy House staff can help you directly.\"\nTONE\nCompassionate, encouraging, clear, professional, faith-respecting.",
  whatsapp_greeting: '',
  model: 'automatic',
  tool_configs: [
    { entity_name: 'Application', allowed_operations: ['read'] },
    { entity_name: 'BlogPost', allowed_operations: ['read'] },
    { entity_name: 'Volunteer', allowed_operations: ['read'] },
    { entity_name: 'Event', allowed_operations: ['read'] },
    { entity_name: 'VehicleDonation', allowed_operations: ['read'] },
    { entity_name: 'BedCount', allowed_operations: ['read'] },
  ],
};

export default function AgentManager() {
  const [configId, setConfigId] = useState(null);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newEntity, setNewEntity] = useState('');

  const load = useCallback(async () => {
    try {
      const records = await base44.entities.AgentConfig.list('-updated_date', 1);
      if (records && records.length > 0) {
        const r = records[0];
        setConfigId(r.id);
        setConfig({
          description: r.description ?? DEFAULT_CONFIG.description,
          instructions: r.instructions ?? DEFAULT_CONFIG.instructions,
          whatsapp_greeting: r.whatsapp_greeting ?? '',
          model: r.model ?? 'automatic',
          tool_configs: Array.isArray(r.tool_configs) ? r.tool_configs : DEFAULT_CONFIG.tool_configs,
        });
      }
    } catch (err) {
      // First time / no records — keep defaults.
      console.error('AgentConfig load failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      let me;
      try {
        me = await base44.auth.me();
      } catch {
        me = null;
      }
      const payload = {
        ...config,
        updated_by: me?.full_name || 'Admin',
      };
      if (configId) {
        await base44.entities.AgentConfig.update(configId, payload);
      } else {
        const created = await base44.entities.AgentConfig.create(payload);
        setConfigId(created.id);
      }
      toast.success('Agent configuration saved.');
    } catch (err) {
      console.error('AgentConfig save failed', err);
      toast.error('Could not save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleOperation = (entityIndex, op) => {
    setConfig((prev) => {
      const next = [...prev.tool_configs];
      const entry = { ...next[entityIndex] };
      const ops = entry.allowed_operations || [];
      entry.allowed_operations = ops.includes(op)
        ? ops.filter((o) => o !== op)
        : [...ops, op];
      next[entityIndex] = entry;
      return { ...prev, tool_configs: next };
    });
  };

  const removeCapability = (entityIndex) => {
    setConfig((prev) => ({
      ...prev,
      tool_configs: prev.tool_configs.filter((_, i) => i !== entityIndex),
    }));
  };

  const addCapability = () => {
    if (!newEntity) return;
    if (config.tool_configs.some((t) => t.entity_name === newEntity)) {
      toast.error(`${newEntity} is already in the capabilities list.`);
      return;
    }
    setConfig((prev) => ({
      ...prev,
      tool_configs: [...prev.tool_configs, { entity_name: newEntity, allowed_operations: ['read'] }],
    }));
    setNewEntity('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading agent configuration…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy dark:text-gold mb-2">AI Agent Management</h2>
        <p className="text-slate-600 dark:text-slate-400">Configure the Mercy House intake &amp; support AI agent</p>
      </div>

      {/* Sync notice */}
      <div className="flex items-start gap-3 rounded-lg border border-gold/40 bg-gold/5 dark:bg-gold/10 p-4 text-sm text-slate-700 dark:text-slate-300">
        <Info className="w-5 h-5 text-gold mt-0.5 shrink-0" />
        <p>
          Saved changes are stored securely and persist for all staff. To apply them to the <strong>live</strong>{' '}
          assistant, contact your developer to sync the saved configuration into the agent file — this portal is the
          working draft.
        </p>
      </div>

      {/* Agent Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-navy dark:text-gold" />
            Intake Support Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm text-slate-600 dark:text-slate-400">Status</div>
              <div className="text-lg font-semibold text-green-600">Active</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm text-slate-600 dark:text-slate-400">Model</div>
              <Select value={config.model} onValueChange={(v) => setConfig({ ...config, model: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="gpt_5_mini">GPT-5 Mini</SelectItem>
                  <SelectItem value="gemini_3_flash">Gemini 3 Flash</SelectItem>
                  <SelectItem value="claude_sonnet_4_6">Claude Sonnet 4.6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Agent Description</Label>
            <Input
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Instructions</Label>
            <Textarea
              value={config.instructions}
              onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
              rows={10}
              className="mt-1 font-mono text-sm"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              The system prompt that defines the agent's role, knowledge scope, and tone.
            </p>
          </div>

          <div>
            <Label>WhatsApp Greeting</Label>
            <Textarea
              value={config.whatsapp_greeting}
              onChange={(e) => setConfig({ ...config, whatsapp_greeting: e.target.value })}
              rows={3}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Shown when a user first messages the agent on WhatsApp (optional).
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="bg-navy dark:bg-gold text-white dark:text-navy">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Agent Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-navy dark:text-gold" />
            Agent Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Choose which app entities the agent can access and which operations it may perform. Read-only is safest.
          </p>

          <div className="space-y-3">
            {config.tool_configs.map((entry, idx) => (
              <div
                key={entry.entity_name}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 p-3"
              >
                <div className="flex items-center justify-between gap-2 sm:w-56">
                  <span className="font-semibold text-navy dark:text-gold">{entry.entity_name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCapability(idx)}
                    aria-label={`Remove ${entry.entity_name}`}
                    className="text-slate-400 hover:text-destructive h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {ALL_OPERATIONS.map((op) => (
                    <label key={op} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                      <Checkbox
                        checked={(entry.allowed_operations || []).includes(op)}
                        onCheckedChange={() => toggleOperation(idx, op)}
                      />
                      {op}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add new capability */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <Select value={newEntity} onValueChange={setNewEntity}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Add an entity…" />
              </SelectTrigger>
              <SelectContent>
                {ENTITY_OPTIONS.filter(
                  (e) => !config.tool_configs.some((t) => t.entity_name === e)
                ).map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addCapability} variant="outline" disabled={!newEntity}>
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>

          <Button onClick={handleSave} disabled={saving} className="bg-navy dark:bg-gold text-white dark:text-navy">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}