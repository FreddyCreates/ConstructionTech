import ReportBuilderLib "../lib/report-builder";

/// Report Builder API Mixin
/// Exposes public actor functions for the Report Builder domain.
/// CPL governance and BHX Worker dispatch are enforced on every mutation.
/// OSHADOC-SDK generates the official documents assembled into each report.
mixin (
  rbState : ReportBuilderLib.RBState
) {

  // ─── Template Management ─────────────────────────────────────────────────

  public shared ({ caller }) func createReportTemplate(
    tenantId    : Text,
    name        : Text,
    description : Text,
    sections    : [ReportBuilderLib.ReportSection],
    layer       : ReportBuilderLib.LayerType,
    tags        : [Text]
  ) : async ReportBuilderLib.ReportTemplate {
    ReportBuilderLib.createTemplate(rbState, tenantId, caller, name, description, sections, layer, tags)
  };

  public shared ({ caller }) func updateReportTemplate(
    templateId  : Text,
    tenantId    : Text,
    name        : Text,
    description : Text,
    sections    : [ReportBuilderLib.ReportSection],
    layer       : ReportBuilderLib.LayerType,
    tags        : [Text]
  ) : async ReportBuilderLib.RBResult<ReportBuilderLib.ReportTemplate> {
    ReportBuilderLib.updateTemplate(rbState, templateId, tenantId, caller, name, description, sections, layer, tags)
  };

  public query func getReportTemplate(
    templateId : Text,
    tenantId   : Text
  ) : async ?ReportBuilderLib.ReportTemplate {
    ReportBuilderLib.getTemplate(rbState, templateId, tenantId)
  };

  public query func listReportTemplates(
    tenantId : Text
  ) : async [ReportBuilderLib.ReportTemplate] {
    ReportBuilderLib.listTemplates(rbState, tenantId)
  };

  public shared ({ caller }) func archiveReportTemplate(
    templateId : Text,
    tenantId   : Text
  ) : async ReportBuilderLib.RBResult<Text> {
    ReportBuilderLib.archiveTemplate(rbState, templateId, tenantId, caller)
  };

  // ─── Report Assembly ──────────────────────────────────────────────────

  public shared ({ caller }) func createReportAssembly(
    tenantId         : Text,
    name             : Text,
    templateId       : ?Text,
    coverPage        : ReportBuilderLib.CoverPageConfig,
    sections         : [ReportBuilderLib.ReportSection],
    layer            : ReportBuilderLib.LayerType,
    sourceProjectIds : [Text],
    sourceTagIds     : [Nat],
    sourceSessionIds : [Text],
    includePerception : Bool,
    includeCplAudit  : Bool
  ) : async ReportBuilderLib.ReportAssembly {
    ReportBuilderLib.createAssembly(
      rbState, tenantId, caller, name, templateId, coverPage,
      sections, layer, sourceProjectIds, sourceTagIds, sourceSessionIds,
      includePerception, includeCplAudit
    )
  };

  public shared ({ caller }) func reorderReportSections(
    assemblyId : Text,
    tenantId   : Text,
    sections   : [ReportBuilderLib.ReportSection]
  ) : async ReportBuilderLib.RBResult<ReportBuilderLib.ReportAssembly> {
    ReportBuilderLib.reorderSections(rbState, assemblyId, tenantId, caller, sections)
  };

  public shared ({ caller }) func generateReportPdf(
    assemblyId : Text,
    tenantId   : Text
  ) : async ReportBuilderLib.RBResult<Text> {
    ReportBuilderLib.generateAssemblyPdf(rbState, assemblyId, tenantId, caller)
  };

  public query func getReportAssembly(
    assemblyId : Text,
    tenantId   : Text
  ) : async ?ReportBuilderLib.ReportAssembly {
    ReportBuilderLib.getAssembly(rbState, assemblyId, tenantId)
  };

  public query func listReportAssemblies(
    tenantId  : Text,
    projectId : ?Text
  ) : async [ReportBuilderLib.ReportAssembly] {
    ReportBuilderLib.listAssemblies(rbState, tenantId, projectId)
  };

  // ─── Distribution ─────────────────────────────────────────────────────

  public shared ({ caller }) func createReportDistribution(
    assemblyId  : Text,
    tenantId    : Text,
    recipients  : [ReportBuilderLib.ReportRecipientEntry],
    subject     : Text,
    bodyPreview : Text
  ) : async ReportBuilderLib.ReportDistribution {
    ReportBuilderLib.createDistribution(rbState, assemblyId, tenantId, caller, recipients, subject, bodyPreview)
  };

  public shared ({ caller }) func sendReportDistribution(
    distributionId : Text,
    tenantId       : Text
  ) : async ReportBuilderLib.RBResult<Text> {
    ReportBuilderLib.sendDistribution(rbState, distributionId, tenantId, caller)
  };

  public query func getReportDistribution(
    distributionId : Text,
    tenantId       : Text
  ) : async ?ReportBuilderLib.ReportDistribution {
    ReportBuilderLib.getDistribution(rbState, distributionId, tenantId)
  };

  public query func listReportDistributions(
    assemblyId : Text,
    tenantId   : Text
  ) : async [ReportBuilderLib.ReportDistribution] {
    ReportBuilderLib.listDistributions(rbState, assemblyId, tenantId)
  };

  // ─── Schedules ────────────────────────────────────────────────────────

  public shared ({ caller }) func createReportSchedule(
    tenantId           : Text,
    name               : Text,
    templateId         : Text,
    sourceProjectIds   : [Text],
    recipients         : [ReportBuilderLib.ReportRecipientEntry],
    cadence            : ReportBuilderLib.Cadence,
    customIntervalDays : ?Nat,
    dayOfWeek          : ?Nat,
    dayOfMonth         : ?Nat,
    timeOfDayUtcHour   : Nat,
    layer              : ReportBuilderLib.LayerType,
    includePerception  : Bool,
    includeCplAudit    : Bool
  ) : async ReportBuilderLib.ReportSchedule {
    ReportBuilderLib.createSchedule(
      rbState, tenantId, caller, name, templateId, sourceProjectIds,
      recipients, cadence, customIntervalDays, dayOfWeek, dayOfMonth,
      timeOfDayUtcHour, layer, includePerception, includeCplAudit
    )
  };

  public shared ({ caller }) func updateReportSchedule(
    scheduleId       : Text,
    tenantId         : Text,
    isActive         : Bool,
    recipients       : [ReportBuilderLib.ReportRecipientEntry],
    cadence          : ReportBuilderLib.Cadence,
    timeOfDayUtcHour : Nat
  ) : async ReportBuilderLib.RBResult<ReportBuilderLib.ReportSchedule> {
    ReportBuilderLib.updateSchedule(rbState, scheduleId, tenantId, caller, isActive, recipients, cadence, timeOfDayUtcHour)
  };

  public query func getReportSchedule(
    scheduleId : Text,
    tenantId   : Text
  ) : async ?ReportBuilderLib.ReportSchedule {
    ReportBuilderLib.getSchedule(rbState, scheduleId, tenantId)
  };

  public query func listReportSchedules(
    tenantId : Text
  ) : async [ReportBuilderLib.ReportSchedule] {
    ReportBuilderLib.listSchedules(rbState, tenantId)
  };

  public shared ({ caller }) func deactivateReportSchedule(
    scheduleId : Text,
    tenantId   : Text
  ) : async ReportBuilderLib.RBResult<Text> {
    ReportBuilderLib.deactivateSchedule(rbState, scheduleId, tenantId, caller)
  };
}
