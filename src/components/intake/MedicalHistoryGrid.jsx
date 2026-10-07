import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const MEDICAL_CONDITIONS = [
  { value: 'asthma', label: 'Asthma' },
  { value: 'back_problems', label: 'Back Problems' },
  { value: 'celiac_disease', label: 'Celiac Disease' },
  { value: 'colitis', label: 'Colitis' },
  { value: 'crohns_disease', label: "Crohn's Disease" },
  { value: 'diabetes_type1', label: 'Diabetes Type 1' },
  { value: 'diabetes_type2', label: 'Diabetes Type 2' },
  { value: 'fetal_alcohol_syndrome', label: 'Fetal Alcohol Syndrome' },
  { value: 'gastric_bypass_surgery', label: 'Gastric Bypass Surgery' },
  { value: 'head_trauma_tbi', label: 'Head Trauma/TBI' },
  { value: 'heart_attack_stroke', label: 'Heart attack/Stroke' },
  { value: 'hepatitis', label: 'Hepatitis' },
  { value: 'high_blood_pressure', label: 'High Blood Pressure' },
  { value: 'hiv_aids', label: 'HIV/AIDS' },
  { value: 'pancreatitis', label: 'Pancreatitis' },
  { value: 'respiratory_problems', label: 'Respiratory Problems' },
  { value: 'seizure_disorder', label: 'Seizure Disorder/Withdrawal' },
  { value: 'sti_std', label: 'STI/STD' },
  { value: 'tuberculosis', label: 'Tuberculosis' },
];

export const MENTAL_HEALTH_CONDITIONS = [
  { value: 'add_adhd', label: 'ADD/ADHD' },
  { value: 'anorexia', label: 'Anorexia' },
  { value: 'anti_social_personality', label: 'Anti-Social Personality Disorder' },
  { value: 'anxiety_panic', label: 'Anxiety Disorder/Panic Attacks' },
  { value: 'autism_aspergers', label: 'Autism/Asperger\u2019s' },
  { value: 'bipolar', label: 'Bipolar Disorder' },
  { value: 'borderline_personality', label: 'Borderline Personality Disorder' },
  { value: 'bulimia', label: 'Bulimia' },
  { value: 'depression', label: 'Depression' },
  { value: 'dissociative_identity', label: 'Dissociative Identity Disorder' },
  { value: 'narcissistic_personality', label: 'Narcissistic Personality Disorder' },
  { value: 'personality_disorder', label: 'Personality Disorder' },
  { value: 'ptsd_trauma', label: 'PTSD/Trauma' },
  { value: 'rape', label: 'Rape' },
  { value: 'schizoaffective', label: 'Schizoaffective Disorder' },
  { value: 'schizophrenia', label: 'Schizophrenia' },
  { value: 'sexual_abuse', label: 'Sexual Abuse' },
  { value: 'suicide_thoughts', label: 'Suicide Thoughts/Attempts' },
  { value: 'hallucinations', label: 'Hallucinations' },
];

export default function MedicalHistoryGrid({ medicalSelected, mentalSelected, onToggleMedical, onToggleMental, anorexiaActive, bulimiaActive, onUpdate }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
          Medical History <span className="text-slate-400 text-xs font-normal">(mark all you have been diagnosed with)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MEDICAL_CONDITIONS.map(c => (
            <div key={c.value} className="flex items-center space-x-2">
              <Checkbox
                id={`med_${c.value}`}
                checked={medicalSelected.includes(c.value)}
                onCheckedChange={() => onToggleMedical(c.value)}
              />
              <Label htmlFor={`med_${c.value}`} className="text-sm cursor-pointer">{c.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
          Mental Health History <span className="text-slate-400 text-xs font-normal">(mark all you have been diagnosed with)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MENTAL_HEALTH_CONDITIONS.map(c => (
            <div key={c.value} className="flex items-center space-x-2">
              <Checkbox
                id={`mh_${c.value}`}
                checked={mentalSelected.includes(c.value)}
                onCheckedChange={() => onToggleMental(c.value)}
              />
              <Label htmlFor={`mh_${c.value}`} className="text-sm cursor-pointer">
                {c.label}
                {c.value === 'anorexia' && mentalSelected.includes('anorexia') && (
                  <span className="ml-2 text-xs text-slate-500">(active?
                    <label className="ml-1">
                      <input type="checkbox" checked={!!anorexiaActive} onChange={e => onUpdate('anorexia_active', e.target.checked)} className="ml-1" /> Yes
                    </label>
                  </span>
                )}
                {c.value === 'bulimia' && mentalSelected.includes('bulimia') && (
                  <span className="ml-2 text-xs text-slate-500">(active?
                    <label className="ml-1">
                      <input type="checkbox" checked={!!bulimiaActive} onChange={e => onUpdate('bulimia_active', e.target.checked)} className="ml-1" /> Yes
                    </label>
                  </span>
                )}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}