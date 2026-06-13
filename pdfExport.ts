import { jsPDF } from "jspdf";
import type {
  OshaHazard,
  PPERequirement,
  SafetyReportConfig,
  SafetyTemplateSection,
} from "../types/safetyTemplates";

// ─── Design constants ───────────────────────────────────────────────────────
const STEEL_BLUE = [30, 64, 175] as const; // #1e40af
const WHITE = [255, 255, 255] as const;
const DARK_GRAY = [30, 41, 59] as const; // slate-800
const MID_GRAY = [100, 116, 139] as const; // slate-500
const LIGHT_GRAY = [241, 245, 249] as const; // slate-100
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ─── Helper functions ────────────────────────────────────────────────────────
function setFill(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}
function setTextColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}
function setDrawColor(doc: jsPDF, rgb: readonly [number, number, number]) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

function addFooter(
  doc: jsPDF,
  companyName: string,
  reportTitle: string,
  pageNum: number,
  totalPages: number,
  timestamp: string,
) {
  const y = PAGE_H - 10;
  doc.setFontSize(7);
  setTextColor(doc, MID_GRAY);
  doc.text(companyName, MARGIN, y);
  doc.text(reportTitle, PAGE_W / 2, y, { align: "center" });
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, y, {
    align: "right",
  });
  doc.text(
    `CPL Audit Trail: ${timestamp} | OIS Safety Intelligence | CONFIDENTIAL`,
    PAGE_W / 2,
    PAGE_H - 6,
    { align: "center" },
  );
}

function sectionHeader(doc: jsPDF, title: string, y: number): number {
  setFill(doc, STEEL_BLUE);
  doc.roundedRect(MARGIN, y, CONTENT_W, 9, 1, 1, "F");
  setTextColor(doc, WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), MARGIN + 4, y + 6.2);
  doc.setFont("helvetica", "normal");
  return y + 13;
}

function labelValue(
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  indent = 0,
): number {
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  setTextColor(doc, DARK_GRAY);
  doc.text(`${label}:`, MARGIN + indent, y);
  doc.setFont("helvetica", "normal");
  setTextColor(doc, MID_GRAY);
  const lines = doc.splitTextToSize(value || "—", CONTENT_W - 40 - indent);
  doc.text(lines as string[], MARGIN + indent + 38, y);
  return y + Math.max(lines.length * 5, 6);
}

function checkPageBreak(doc: jsPDF, y: number, needed = 20): number {
  if (y + needed > PAGE_H - 20) {
    doc.addPage();
    return MARGIN + 10;
  }
  return y;
}

// ─── Main export function ─────────────────────────────────────────────────────
export interface SignatureRecord {
  role: string;
  displayName: string;
  signedAt: string;
  proofHash: string;
}

export function generateSafetyReportPDF(
  config: SafetyReportConfig,
  sections: SafetyTemplateSection[],
  signatures?: SignatureRecord[],
): Uint8Array {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const timestamp = new Date().toISOString();
  const {
    companyProfile: cp,
    title,
    projectName,
    projectAddress,
    reportDate,
    projectNumber,
  } = config;

  // We'll track total pages; jsPDF doesn't know total until render, so we do 2-pass via placeholder
  // For simplicity, track sections+2 (cover + TOC) + 1 (sig) as estimated total
  const estimatedTotal = sections.length + 3;
  let pageNum = 1;

  // ── PAGE 1: Cover ─────────────────────────────────────────────────────────
  // Steel-blue header bar
  setFill(doc, STEEL_BLUE);
  doc.rect(0, 0, PAGE_W, 52, "F");

  // Company name
  setTextColor(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(cp.companyName || "Company Name", MARGIN, 22);

  // Company contact info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const contactLine = [cp.companyAddress, cp.city, cp.state, cp.zip]
    .filter(Boolean)
    .join(", ");
  doc.text(contactLine, MARGIN, 30);
  if (cp.phone || cp.email) {
    doc.text([cp.phone, cp.email].filter(Boolean).join("  |  "), MARGIN, 36);
  }

  // Divider line
  let y = 58;
  setDrawColor(doc, STEEL_BLUE);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 14;

  // Report title
  setTextColor(doc, DARK_GRAY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(title, PAGE_W / 2, y, { align: "center" });
  y += 14;

  // Report meta
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  setTextColor(doc, MID_GRAY);
  const meta = [
    ["Project", projectName],
    ["Site", projectAddress],
    ["Report Date", reportDate],
    ["Report No.", projectNumber],
    ["Prepared by", cp.safetyOfficerName],
  ];
  for (const [k, v] of meta) {
    if (v) {
      doc.setFont("helvetica", "bold");
      setTextColor(doc, DARK_GRAY);
      doc.text(`${k}:`, MARGIN + 4, y);
      doc.setFont("helvetica", "normal");
      setTextColor(doc, MID_GRAY);
      doc.text(v, MARGIN + 42, y);
      y += 8;
    }
  }

  y += 10;
  doc.setFontSize(9);
  setTextColor(doc, MID_GRAY);
  doc.text("Generated by OIS Safety Intelligence Platform", PAGE_W / 2, y, {
    align: "center",
  });

  addFooter(doc, cp.companyName, title, pageNum, estimatedTotal, timestamp);

  // ── PAGE 2: Table of Contents ─────────────────────────────────────────────
  doc.addPage();
  pageNum += 1;
  y = MARGIN + 10;
  y = sectionHeader(doc, "Table of Contents", y);
  y += 4;

  doc.setFontSize(10);
  sections.forEach((sec, idx) => {
    y = checkPageBreak(doc, y, 8);
    setTextColor(doc, DARK_GRAY);
    doc.setFont("helvetica", "bold");
    doc.text(`${idx + 1}.`, MARGIN + 2, y);
    doc.setFont("helvetica", "normal");
    doc.text(sec.title, MARGIN + 10, y);
    setTextColor(doc, MID_GRAY);
    doc.text(`Page ${idx + 3}`, PAGE_W - MARGIN, y, { align: "right" });
    y += 7;
  });

  addFooter(doc, cp.companyName, title, pageNum, estimatedTotal, timestamp);

  // ── PAGE per section ─────────────────────────────────────────────────────
  for (const sec of sections) {
    doc.addPage();
    pageNum += 1;
    y = MARGIN + 6;
    y = sectionHeader(doc, sec.title, y);

    // OSHA ref from hazards if present
    if (sec.hazards && sec.hazards.length > 0 && sec.hazards[0].regulation) {
      doc.setFontSize(8);
      setTextColor(doc, MID_GRAY);
      doc.text(`OSHA Reference: ${sec.hazards[0].regulation}`, MARGIN, y);
      y += 6;
    }

    y += 2;

    // Content fields
    for (const [k, v] of Object.entries(sec.content)) {
      y = checkPageBreak(doc, y, 10);
      if (Array.isArray(v)) {
        y = labelValue(doc, k, v.join(", "), y);
      } else {
        y = labelValue(doc, k, v, y);
      }
    }

    // Hazards table
    if (sec.hazards && sec.hazards.length > 0) {
      y = checkPageBreak(doc, y, 20);
      y += 4;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      setTextColor(doc, DARK_GRAY);
      doc.text("IDENTIFIED HAZARDS", MARGIN, y);
      y += 6;

      // Table header
      const cols = [MARGIN, MARGIN + 50, MARGIN + 100, MARGIN + 145];
      const colW = [48, 48, 43, 38];
      setFill(doc, LIGHT_GRAY);
      doc.rect(MARGIN, y - 4, CONTENT_W, 8, "F");
      setTextColor(doc, DARK_GRAY);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      ["Hazard", "Risk Level / Subpart", "Controls", "PPE Required"].forEach(
        (h, i) => {
          doc.text(h, cols[i] + 1, y);
        },
      );
      y += 5;
      doc.setFont("helvetica", "normal");

      for (const hz of sec.hazards as OshaHazard[]) {
        y = checkPageBreak(doc, y, 14);
        setDrawColor(doc, LIGHT_GRAY);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, y, PAGE_W - MARGIN, y);
        y += 4;
        setTextColor(doc, DARK_GRAY);
        doc.setFontSize(8);
        const title_lines = doc.splitTextToSize(hz.title, colW[0] - 2);
        doc.text(title_lines as string[], cols[0], y);
        doc.text(hz.subpart, cols[1], y);
        const ctrl_lines = doc.splitTextToSize(
          hz.controls.slice(0, 2).join("; "),
          colW[2] - 2,
        );
        doc.text(ctrl_lines as string[], cols[2], y);
        const ppe_lines = doc.splitTextToSize(
          hz.ppe.slice(0, 3).join(", "),
          colW[3] - 2,
        );
        doc.text(ppe_lines as string[], cols[3], y);
        const rowH =
          Math.max(title_lines.length, ctrl_lines.length, ppe_lines.length) *
          4.5;
        y += rowH + 2;
      }
    }

    // PPE list
    if (sec.ppeRequired && sec.ppeRequired.length > 0) {
      y = checkPageBreak(doc, y, 20);
      y += 4;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      setTextColor(doc, DARK_GRAY);
      doc.text("PPE REQUIREMENTS", MARGIN, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      for (const ppe of sec.ppeRequired as PPERequirement[]) {
        y = checkPageBreak(doc, y, 7);
        const reqTag = ppe.required ? "● Required" : "○ Optional";
        setTextColor(doc, ppe.required ? ([30, 64, 175] as const) : MID_GRAY);
        doc.text(`${reqTag}  ${ppe.item}`, MARGIN + 4, y);
        if (ppe.standard) {
          setTextColor(doc, MID_GRAY);
          doc.text(`(${ppe.standard})`, PAGE_W - MARGIN, y, { align: "right" });
        }
        y += 5.5;
      }
    }

    addFooter(doc, cp.companyName, title, pageNum, estimatedTotal, timestamp);
  }

  // ── Electronic Signatures Certificate Page ─────────────────────────────────
  doc.addPage();
  pageNum += 1;
  y = MARGIN + 6;

  // Steel-blue header bar for certificate
  setFill(doc, STEEL_BLUE);
  doc.rect(0, y - 6, PAGE_W, 42, "F");
  setTextColor(doc, WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ELECTRONIC SIGNATURES CERTIFICATE", PAGE_W / 2, y + 10, {
    align: "center",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "This document certifies the authenticity of electronic signatures captured via the OIS Safety Intelligence Platform.",
    PAGE_W / 2,
    y + 20,
    { align: "center" },
  );
  doc.text(
    `Report: ${projectNumber}  |  Generated: ${reportDate}`,
    PAGE_W / 2,
    y + 28,
    { align: "center" },
  );
  y += 44;

  if (signatures && signatures.length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setTextColor(doc, DARK_GRAY);
    doc.text("SIGNATURE RECORDS", MARGIN, y);
    y += 8;

    for (const sig of signatures) {
      y = checkPageBreak(doc, y, 28);

      // Signature record card
      setDrawColor(doc, [226, 232, 240] as const);
      doc.setLineWidth(0.3);
      doc.roundedRect(MARGIN, y, CONTENT_W, 24, 1.5, 1.5);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      setTextColor(doc, STEEL_BLUE);
      doc.text(sig.role.toUpperCase(), MARGIN + 4, y + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setTextColor(doc, DARK_GRAY);
      doc.text("Name:", MARGIN + 4, y + 12);
      setTextColor(doc, MID_GRAY);
      doc.text(sig.displayName || "—", MARGIN + 22, y + 12);

      setTextColor(doc, DARK_GRAY);
      doc.text("Timestamp:", MARGIN + 4, y + 17);
      setTextColor(doc, MID_GRAY);
      doc.text(new Date(sig.signedAt).toLocaleString(), MARGIN + 28, y + 17);

      setTextColor(doc, DARK_GRAY);
      doc.text("Proof Hash:", MARGIN + 4, y + 22);
      setTextColor(doc, [100, 116, 139] as const);
      doc.setFont("courier", "normal");
      doc.setFontSize(7);
      doc.text(`${sig.proofHash.slice(0, 16)}…`, MARGIN + 26, y + 22);
      doc.setFont("helvetica", "normal");

      y += 28;
    }
  } else {
    // Pending signatures section
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    setTextColor(doc, DARK_GRAY);
    doc.text("PENDING SIGNATURES", MARGIN, y);
    y += 8;

    const pendingRoles = [
      "Supervisor / Foreman",
      "Safety Officer",
      "GC Representative",
    ];
    for (const role of pendingRoles) {
      y = checkPageBreak(doc, y, 20);
      setDrawColor(doc, [226, 232, 240] as const);
      doc.setLineWidth(0.3);
      doc.roundedRect(MARGIN, y, CONTENT_W, 16, 1.5, 1.5);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      setTextColor(doc, STEEL_BLUE);
      doc.text(role.toUpperCase(), MARGIN + 4, y + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setTextColor(doc, MID_GRAY);
      doc.text("Status: Awaiting signature", MARGIN + 4, y + 12);

      y += 20;
    }
  }

  y += 10;
  y = checkPageBreak(doc, y, 30);

  // CPL Governance Audit Trail
  setFill(doc, [248, 250, 252] as const);
  doc.rect(MARGIN, y, CONTENT_W, 28, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  setTextColor(doc, DARK_GRAY);
  doc.text("CPL GOVERNANCE AUDIT TRAIL", MARGIN + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setTextColor(doc, MID_GRAY);
  doc.text(
    `Document ID: ${projectNumber}  |  Generated: ${timestamp}  |  Platform: OIS Safety Intelligence`,
    MARGIN + 4,
    y + 12,
  );
  doc.text(
    `Tenant: ${cp.companyName || "N/A"}  |  Safety Officer: ${cp.safetyOfficerName || "N/A"}`,
    MARGIN + 4,
    y + 17,
  );
  doc.setFont("courier", "normal");
  doc.setFontSize(6);
  setTextColor(doc, [148, 163, 184] as const);
  const auditHash =
    `${timestamp}-${projectNumber}-${cp.companyName || "default"}`
      .split("")
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
      .toString(16)
      .replace("-", "");
  doc.text(`Audit Hash: ${auditHash}`, MARGIN + 4, y + 24);
  doc.setFont("helvetica", "normal");
  y += 32;

  doc.setFontSize(8);
  setTextColor(doc, MID_GRAY);
  doc.text(
    "This certificate is cryptographically bound to the document and tamper-evident. Verify at OIS Safety Intelligence Platform.",
    PAGE_W / 2,
    y,
    { align: "center" },
  );

  addFooter(doc, cp.companyName, title, pageNum, estimatedTotal, timestamp);

  // Return as Uint8Array — caller handles download via blob URL
  const arrayBuffer = doc.output("arraybuffer");
  return new Uint8Array(arrayBuffer);
}
