import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ApplicationViewer({ application, onClose }) {
  const [syncing, setSyncing] = React.useState(false);

  const handleDownload = async () => {
    try {
      const response = await base44.functions.invoke('downloadApplication', { applicationId: application.id });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Application_${application.full_legal_name.replace(/\s/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Application downloaded');
    } catch (error) {
      toast.error('Failed to download application');
    }
  };

  const handleSyncToDrive = async () => {
    setSyncing(true);
    try {
      await base44.functions.invoke('syncApplicationToDrive', { applicationId: application.id });
      toast.success('Application synced to Google Drive');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to sync to Google Drive. Make sure integration is authorized.');
    } finally {
      setSyncing(false);
    }
  };

  const fields = [
    { label: 'Full Legal Name', value: application.full_legal_name },
    { label: 'Date of Birth', value: application.date_of_birth },
    { label: 'Biological Sex', value: application.biological_sex },
    { label: 'SSN', value: application.ssn },
    { label: 'Address', value: `${application.address}, ${application.city}, ${application.state} ${application.zip}` },
    { label: 'Home Phone', value: application.home_phone },
    { label: 'Cell Phone', value: application.cell_phone },
    { label: 'Email', value: application.email },
    { label: 'Driver\'s License', value: application.drivers_license },
    { label: 'Referral Source', value: application.referral_source },
    { label: 'Emergency Contact', value: `${application.emergency_contact_name} (${application.emergency_contact_relationship}) - ${application.emergency_contact_phone}` },
    { label: 'Under Legal Supervision', value: application.under_legal_supervision ? 'Yes' : 'No' },
    { label: 'Legally Mandated Treatment', value: application.legally_mandated_treatment ? 'Yes' : 'No' },
    { label: 'Pending Legal Matters', value: application.pending_legal_matters?.join(', ') || 'None' },
    { label: 'Sexual Offender Registry', value: application.sexual_offender_registry ? 'Yes' : 'No' },
    { label: 'Sexual Offense Charges', value: application.sexual_offense_charges ? 'Yes' : 'No' },
    { label: 'Arson Charges', value: application.arson_charges ? 'Yes' : 'No' },
    { label: 'Violent Offense Charges', value: application.violent_offense_charges ? 'Yes' : 'No' },
    { label: 'Has Health Insurance', value: application.has_health_insurance ? 'Yes' : 'No' },
    { label: 'Blood Type', value: application.blood_type },
    { label: 'Legally Married', value: application.legally_married ? 'Yes' : 'No' },
    { label: 'Treated by Physician', value: application.currently_treated_by_physician ? 'Yes' : 'No' },
    { label: 'Physician Details', value: application.physician_details },
    { label: 'Manual Work Limitations', value: application.manual_work_limitations ? 'Yes' : 'No' },
    { label: 'Exercise Limitations', value: application.exercise_limitations ? 'Yes' : 'No' },
    { label: 'Recreational Limitations', value: application.recreational_limitations ? 'Yes' : 'No' },
    { label: 'Allergies', value: application.allergies },
    { label: 'Mental Health Diagnosis', value: application.mental_health_diagnosis },
    { label: 'Current Medications', value: application.current_medications },
    { label: 'Possibly Pregnant', value: application.possibly_pregnant ? 'Yes' : 'No' },
    { label: 'Eating Disorder', value: application.eating_disorder ? 'Yes' : 'No' },
    { label: 'Previous Treatment Programs', value: application.previous_treatment_programs },
    { label: 'Dependancy Details', value: application.dependancy_details }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-navy dark:text-gold">Full Application</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleSyncToDrive} variant="outline" size="sm" disabled={syncing}>
              <Upload className="w-4 h-4 mr-2" />
              {syncing ? 'Syncing...' : 'Sync to Drive'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto space-y-4">
          {fields.map((field, idx) => (
            field.value && (
              <div key={idx} className="border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{field.label}</div>
                <div className="text-slate-900 dark:text-white">{field.value}</div>
              </div>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
}