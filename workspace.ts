// Safety Templates — full type system for the OIS Safety Intelligence Suite

export enum TemplateType {
  JSA = "JSA",
  INSPECTION_FORM = "INSPECTION_FORM",
  INCIDENT_REPORT = "INCIDENT_REPORT",
  PRE_TASK_PLAN = "PRE_TASK_PLAN",
  TOOLBOX_TALK = "TOOLBOX_TALK",
  SAFETY_BRIEFING = "SAFETY_BRIEFING",
  EMERGENCY_RESPONSE = "EMERGENCY_RESPONSE",
  SAFETY_AUDIT = "SAFETY_AUDIT",
  HAZARD_ASSESSMENT = "HAZARD_ASSESSMENT",
}

export interface CompanyProfile {
  tenantId: string;
  principalId: string;
  companyName: string;
  companyAddress: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  licenseNumber: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  safetyOfficerName: string;
  safetyOfficerPhone: string;
  safetyOfficerEmail: string;
  superintendentName: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface ReportRecipient {
  contactName: string;
  contactEmail: string;
  role: string;
  sentAt: bigint;
}

export interface SafetyReportRecord {
  reportId: string;
  tenantId: string;
  generatedBy: string; // Principal as string
  projectName: string;
  projectAddress: string;
  reportTitle: string;
  templatesIncluded: string[];
  companyName: string;
  companyAddress: string;
  safetyOfficerName: string;
  generatedAt: bigint;
  sentTo: ReportRecipient[];
}

export interface OshaHazard {
  subpart: string;
  title: string;
  description: string;
  controls: string[];
  ppe: string[];
  regulation: string;
}

export interface PPERequirement {
  item: string;
  standard: string;
  required: boolean;
}

export interface TemplateSectionDef {
  sectionName: string;
  fields: string[];
  oshaRef: string;
}

export interface ProtocolTemplate {
  templateType: string;
  title: string;
  sections: TemplateSectionDef[];
}

export interface SafetyReportConfig {
  title: string;
  projectName: string;
  projectAddress: string;
  projectNumber: string;
  reportDate: string;
  selectedTemplates: TemplateType[];
  companyProfile: CompanyProfile;
}

export interface SafetyTemplateSection {
  templateType: TemplateType;
  title: string;
  content: Record<string, string | string[]>;
  hazards?: OshaHazard[];
  ppeRequired?: PPERequirement[];
}

export type TemplateConfig = Record<
  TemplateType,
  {
    label: string;
    description: string;
    icon: string;
    color: string;
    route: string;
  }
>;

export const TEMPLATE_CONFIG: TemplateConfig = {
  [TemplateType.JSA]: {
    label: "Job Safety Analysis",
    description:
      "Task-by-task hazard identification, controls, and PPE requirements per OSHA 1926.",
    icon: "🔍",
    color: "from-blue-600 to-blue-800",
    route: "/ai-tools/jsa-generator",
  },
  [TemplateType.INSPECTION_FORM]: {
    label: "Site Inspection Form",
    description:
      "Structured inspection checklist covering all active work areas and trades on site.",
    icon: "📋",
    color: "from-emerald-600 to-emerald-800",
    route: "/safety/inspection-form",
  },
  [TemplateType.INCIDENT_REPORT]: {
    label: "Incident Report",
    description:
      "OSHA-compliant incident documentation for injuries, near-misses, and property damage.",
    icon: "⚠️",
    color: "from-red-600 to-red-800",
    route: "/safety/incident-report",
  },
  [TemplateType.PRE_TASK_PLAN]: {
    label: "Pre-Task Plan",
    description:
      "Daily activity planning form completed by crew leads before work begins.",
    icon: "📝",
    color: "from-violet-600 to-violet-800",
    route: "/safety/pre-task-plan",
  },
  [TemplateType.TOOLBOX_TALK]: {
    label: "Toolbox Talk",
    description:
      "Structured safety briefing script tailored to active trade and project phase.",
    icon: "🔧",
    color: "from-orange-600 to-orange-800",
    route: "/ai-tools/toolbox-talk",
  },
  [TemplateType.SAFETY_BRIEFING]: {
    label: "Safety Briefing",
    description:
      "Comprehensive orientation briefing for new personnel and critical path parties.",
    icon: "📢",
    color: "from-cyan-600 to-cyan-800",
    route: "/safety/briefing",
  },
  [TemplateType.EMERGENCY_RESPONSE]: {
    label: "Emergency Response Plan",
    description:
      "Site-specific emergency protocols, contact chains, and evacuation procedures.",
    icon: "🚨",
    color: "from-rose-600 to-rose-800",
    route: "/safety/emergency-response",
  },
  [TemplateType.SAFETY_AUDIT]: {
    label: "Safety Audit",
    description:
      "Full compliance audit across all active CSI divisions and subcontractor scopes.",
    icon: "✅",
    color: "from-teal-600 to-teal-800",
    route: "/safety/audit",
  },
  [TemplateType.HAZARD_ASSESSMENT]: {
    label: "Hazard Assessment",
    description:
      "Systematic site hazard inventory with risk ratings and mitigation assignments.",
    icon: "🛡️",
    color: "from-amber-600 to-amber-800",
    route: "/safety/hazard-assessment",
  },
};
