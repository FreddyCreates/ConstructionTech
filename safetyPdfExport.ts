import * as XLSX from "xlsx";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ExcelSheet {
  name: string;
  headers: string[];
  rows: (string | number | boolean)[][];
}

export interface ExcelExportOptions {
  filename: string;
  sheets: ExcelSheet[];
  author?: string;
  title?: string;
}

// ─── Core export function ─────────────────────────────────────────────────────

/**
 * Generate and trigger download of an Excel (.xlsx) workbook.
 * Each ExcelSheet becomes one worksheet tab.
 */
export function generateExcel(opts: ExcelExportOptions): void {
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: opts.title ?? opts.filename,
    Author: opts.author ?? "OIS Construction Intelligence Platform",
    CreatedDate: new Date(),
  };

  for (const sheet of opts.sheets) {
    const wsData: (string | number | boolean)[][] = [
      sheet.headers,
      ...sheet.rows,
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Style header row (bold, blue background via column widths)
    const colWidths = sheet.headers.map((h, colIdx) => {
      const maxDataLen = sheet.rows.reduce((max, row) => {
        const cell = row[colIdx];
        return Math.max(max, cell == null ? 0 : String(cell).length);
      }, 0);
      return { wch: Math.max(h.length + 2, maxDataLen + 2, 10) };
    });
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31));
  }

  XLSX.writeFile(wb, `${opts.filename}.xlsx`);
}

// ─── Convenience builders ─────────────────────────────────────────────────────

/** Build Excel from a flat key-value result object */
export function exportResultToExcel(
  toolName: string,
  inputs: Record<string, unknown>,
  result: Record<string, unknown>,
  extras?: ExcelSheet[],
): void {
  const inputRows: (string | number | boolean)[][] = Object.entries(inputs).map(
    ([k, v]) => [
      humanKey(k),
      Array.isArray(v) ? v.join(", ") : String(v ?? ""),
    ],
  );

  const resultRows: (string | number | boolean)[][] = Object.entries(
    result,
  ).map(([k, v]) => [
    humanKey(k),
    Array.isArray(v) ? v.join(", ") : String(v ?? ""),
  ]);

  const sheets: ExcelSheet[] = [
    { name: "Inputs", headers: ["Field", "Value"], rows: inputRows },
    { name: "Results", headers: ["Field", "Value"], rows: resultRows },
    ...(extras ?? []),
  ];

  generateExcel({
    filename: `${toolName.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}`,
    title: toolName,
    sheets,
  });
}

/** Export JSA data to Excel */
export function exportJSAToExcel(params: {
  projectCode: string;
  projectName: string;
  workActivity: string;
  locationType: string;
  crewSize: number;
  supervisorName: string;
  tradeComposition: string[];
  hazards: string[];
  controlMeasures: string[];
  ppe: string[];
  emergencyProcedures: string[];
  riskScore: number;
  taskSteps?: Array<{
    step: string;
    hazard: string;
    riskLevel: string;
    control: string;
    ppe: string;
  }>;
}): void {
  const date = new Date().toLocaleDateString();

  const summarySheet: ExcelSheet = {
    name: "JSA Summary",
    headers: ["Field", "Value"],
    rows: [
      [
        "JSA Number",
        `JSA-${params.projectCode.toUpperCase()}-${new Date().toISOString().slice(0, 10)}-001`,
      ],
      ["Project Code", params.projectCode],
      ["Project Name", params.projectName],
      ["Work Activity", params.workActivity],
      ["Location Type", params.locationType],
      ["Crew Size", params.crewSize],
      ["Supervisor", params.supervisorName],
      ["Trades on Site", params.tradeComposition.join(", ") || "Not specified"],
      ["Risk Score", `${params.riskScore}/100`],
      ["Generated Date", date],
      ["OSHA Standard", "OSHA 29 CFR 1926"],
    ],
  };

  const hazardSheet: ExcelSheet = {
    name: "Hazards & Controls",
    headers: ["#", "Hazard", "Control Measure", "PPE Required"],
    rows: params.hazards.map((h, i) => [
      i + 1,
      h,
      params.controlMeasures[i] ?? "",
      params.ppe[i] ?? params.ppe[0] ?? "",
    ]),
  };

  const ppeSheet: ExcelSheet = {
    name: "PPE Requirements",
    headers: ["#", "PPE Item", "Standard", "Required"],
    rows: params.ppe.map((p, i) => [i + 1, p, "OSHA 1926", "Required"]),
  };

  const emergencySheet: ExcelSheet = {
    name: "Emergency Procedures",
    headers: ["#", "Procedure"],
    rows: params.emergencyProcedures.map((ep, i) => [i + 1, ep]),
  };

  const sheets: ExcelSheet[] = [
    summarySheet,
    hazardSheet,
    ppeSheet,
    emergencySheet,
  ];

  if (params.taskSteps && params.taskSteps.length > 0) {
    sheets.push({
      name: "Task Risk Matrix",
      headers: [
        "Step #",
        "Task Step",
        "Hazard",
        "Risk Level",
        "Control Measure",
        "PPE",
      ],
      rows: params.taskSteps.map((s, i) => [
        i + 1,
        s.step,
        s.hazard,
        s.riskLevel,
        s.control,
        s.ppe,
      ]),
    });
  }

  generateExcel({
    filename: `JSA-${params.projectCode || "Project"}-${new Date().toISOString().slice(0, 10)}`,
    title: `Job Safety Analysis — ${params.workActivity}`,
    sheets,
  });
}

/** Export safety report sections to Excel */
export function exportSafetyReportToExcel(params: {
  reportTitle: string;
  projects: string[];
  dateStart: string;
  dateEnd: string;
  outputFormat: string;
  sections: Array<{ id: string; name: string; desc: string }>;
  recipients: Array<{ name: string; email: string; role: string }>;
}): void {
  const date = new Date().toLocaleDateString();

  const summarySheet: ExcelSheet = {
    name: "Report Summary",
    headers: ["Field", "Value"],
    rows: [
      ["Report Title", params.reportTitle],
      ["Generated Date", date],
      ["Output Format", params.outputFormat.toUpperCase()],
      [
        "Date Range",
        params.dateStart && params.dateEnd
          ? `${params.dateStart} — ${params.dateEnd}`
          : "Not specified",
      ],
      ["Projects", params.projects.join(", ") || "Not specified"],
      ["Total Sections", params.sections.length],
      ["Total Recipients", params.recipients.length],
    ],
  };

  const sectionsSheet: ExcelSheet = {
    name: "Sections",
    headers: ["#", "Section ID", "Section Name", "Description"],
    rows: params.sections.map((s, i) => [
      i + 1,
      s.id.toUpperCase(),
      s.name,
      s.desc,
    ]),
  };

  const recipientsSheet: ExcelSheet = {
    name: "Distribution List",
    headers: ["#", "Name", "Email", "Role"],
    rows: params.recipients.map((r, i) => [i + 1, r.name, r.email, r.role]),
  };

  generateExcel({
    filename: `${params.reportTitle.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}`,
    title: params.reportTitle,
    sheets: [summarySheet, sectionsSheet, recipientsSheet],
  });
}

/** Export pay app / financial data to Excel */
export function exportFinancialToExcel(params: {
  toolName: string;
  projectName?: string;
  periodFrom?: string;
  periodTo?: string;
  lineItems: Array<Record<string, unknown>>;
  summary: Record<string, unknown>;
}): void {
  const headers =
    params.lineItems.length > 0
      ? Object.keys(params.lineItems[0]).map(humanKey)
      : ["Field", "Value"];

  const itemRows = params.lineItems.map((item) =>
    Object.values(item).map((v) =>
      typeof v === "bigint"
        ? Number(v)
        : Array.isArray(v)
          ? v.join(", ")
          : ((v as string | number | boolean) ?? ""),
    ),
  );

  const summaryRows: (string | number | boolean)[][] = Object.entries(
    params.summary,
  ).map(([k, v]) => [
    humanKey(k),
    typeof v === "bigint"
      ? Number(v)
      : Array.isArray(v)
        ? (v as unknown[]).join(", ")
        : String(v ?? ""),
  ]);

  generateExcel({
    filename: `${params.toolName.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}`,
    title: params.toolName,
    sheets: [
      { name: "Summary", headers: ["Field", "Value"], rows: summaryRows },
      {
        name: "Line Items",
        headers: headers.length > 0 ? headers : ["Item"],
        rows: itemRows,
      },
    ],
  });
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function humanKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
