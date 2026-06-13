import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ScheduleOfValues__1 {
    createdAt: bigint;
    tenantId: bigint;
    updatedAt: bigint;
    projectId: string;
    contractAmount: bigint;
    items: Array<SovLineItem>;
}
export interface FIEWorkResult {
    result: FIEResult;
    perception: FIEPerceptionOutput;
    cplAudit: string;
    createdAt: bigint;
    tenantId: bigint;
    resultId: string;
    projectId: string;
}
export interface RFI__1 {
    id: RFIId;
    status: RFIStatus__1;
    assignedTo: string;
    subject: string;
    scheduleImpact: boolean;
    createdAt: bigint;
    submittedBy: string;
    description: string;
    questionDate: bigint;
    tenantId: TenantId;
    responseRequired: bigint;
    impactDescription: string;
    updatedAt: bigint;
    linkedCOs: Array<ChangeOrderId>;
    linkedActivities: Array<ActivityId>;
    projectId: ProjectId;
    costImpact: boolean;
    rfiNumber: bigint;
    response: string;
    priority: string;
    responseDate?: bigint;
}
export type DesignRenderId = bigint;
export interface SubRiskEntry {
    subName: string;
    incidentCount: bigint;
    openHazards: bigint;
    trainingCompliance: bigint;
}
export interface QuoteVariance {
    leadDays: bigint;
    supplierName: string;
    totalAmount: bigint;
    variancePct: bigint;
    recommendation: string;
    supplierId: string;
    scoreBonus: bigint;
}
export interface ChatMessage__1 {
    content: string;
    source: string;
    role: string;
    timestamp: bigint;
}
export interface ChangeOrderResult {
    additionalDays: bigint;
    crewAdjustment: string;
    scheduleImpact: string;
    additionalCostMax: bigint;
    additionalCostMin: bigint;
}
export interface CostEstimate {
    id: string;
    totalMaterialCost: number;
    lineItems: Array<CsiLineItem>;
    projectType: string;
    overheadProfitPct: number;
    createdAt: bigint;
    contingencyPct: number;
    tenantId: TenantId;
    updatedAt: bigint;
    state: string;
    estimatedTotal: number;
    projectId: ProjectId;
    totalLaborCost: number;
    escalationIndex: number;
    generalConditionsPct: number;
}
export interface PhaseTransitionTimestamp {
    timestamp: bigint;
    phase: LifecyclePhase;
}
export interface GoNoGoResult {
    flaggedFactors: Array<string>;
    reasoning: string;
    calculatedAt: bigint;
    totalScore: number;
    recommendation: GoNoGoRecommendation;
}
export interface OSHADocResponse {
    bhxTaskId: string;
    deliverables: Array<string>;
    documentContent: string;
    cplAuditHash: string;
    record: OSHADocRecord;
}
export interface SessionMediaSummary {
    lastUploadAt: bigint;
    mediaCount: bigint;
    videoCount: bigint;
    tenantId: string;
    hazardFlagCount: bigint;
    totalSizeBytes: bigint;
    photoCount: bigint;
    sessionId: string;
}
export interface PDFTemplate {
    headerImageUrl: string;
    pageSize: string;
    toolName: string;
    brandingColors: Array<string>;
    footerText: string;
    orientation: string;
}
export type TenantId = bigint;
export interface TagInvite {
    accessLevel: string;
    tagId: bigint;
    token: string;
    expiresAt: bigint;
    createdAt: bigint;
    createdBy: Principal;
    usedCount: bigint;
    tenantId: string;
    maxUses: bigint;
}
export type OllamaAlignmentResult = {
    __kind__: "ok";
    ok: {
        model: string;
        notes: string;
        aligned: boolean;
    };
} | {
    __kind__: "err";
    err: string;
} | {
    __kind__: "unavailable";
    unavailable: null;
};
export interface SendTarget {
    requiresSignature: boolean;
    recipientName: string;
    recipientRole: string;
    recipientEmail: string;
}
export interface IFCElement {
    id: string;
    area: number;
    name: string;
    description: string;
    volume: number;
    level: string;
    length: number;
    elementType: string;
    material: string;
}
export interface ProjectRecord {
    id: bigint;
    lifecyclePhase: LifecyclePhase;
    name: string;
    createdAt: bigint;
    subPrincipals: Array<Principal>;
    phaseTransitionTimestamps: Array<PhaseTransitionTimestamp>;
    scheduleDays: bigint;
    budgetUSD: number;
    location: string;
    gcPrincipal: Principal;
    startDate: bigint;
}
export interface GreenPremium {
    softCostPct: number;
    source: string;
    hardCostPct: number;
    costPremiumPct: number;
    level: string;
    typicalAddCost: number;
    certification: string;
    notes: string;
    buildingType: string;
}
export interface KpiCard {
    trend: KpiTrend;
    value: string;
    source: string;
    unit?: string;
    trendPct: bigint;
    displayLabel: string;
    rawValue: bigint;
    timestamp: bigint;
}
export interface SubPrequalification {
    emr: bigint;
    status: SubPrequalStatus;
    experienceScore: bigint;
    bondingCapacity: bigint;
    relevantProjectCount: bigint;
    expiresAt: bigint;
    overallScore: bigint;
    currentBacklogPct: bigint;
    safetyProgramScore: bigint;
    dart: bigint;
    singleJobLimit: bigint;
    trir: bigint;
    approvedTrades: Array<string>;
    aggregateLimit: bigint;
    submittedAt: bigint;
    reviewedAt?: bigint;
    tenantId: bigint;
    subId: string;
    licenseNo: string;
    projectTypes: Array<string>;
    notes: string;
    bondingScore: bigint;
    companyName: string;
    yearsInBusiness: bigint;
    licenseExpiry: bigint;
    financialScore: bigint;
    annualRevenue: bigint;
    licenseState: string;
    prequalId: string;
}
export interface AnomalyAlert {
    title: string;
    actionUrl?: string;
    resourceId?: string;
    description: string;
    alertId: string;
    tenantId: bigint;
    acknowledged: boolean;
    projectId?: string;
    timestamp: bigint;
    severity: AlertSeverity;
    engine: string;
}
export interface TRIRResult {
    totalHours: bigint;
    recordables: bigint;
    trir: number;
    vsIndustryAvg: string;
    rating: string;
    vsWorldClass: string;
}
export interface TenantContext {
    memberCount: bigint;
    membership: MemberPublic;
    tenant: TenantPublic;
}
export interface RFQ {
    responses: bigint;
    dueDate: bigint;
    lowestQuote?: number;
    sentAt: bigint;
    sentTo: Array<string>;
    scope: string;
    rfqId: string;
}
export interface Project {
    gc: string;
    id: bigint;
    scopeType: string;
    title: string;
    contact: string;
    completionDate: string;
    scopes: Array<string>;
    state: string;
    photo: Image;
    isNewConstruction: boolean;
    amount: string;
    location: string;
}
export interface POLineItem {
    leadDays: bigint;
    unit: string;
    description: string;
    quantity: bigint;
    csiCode: string;
    unitPrice: bigint;
    totalPrice: bigint;
    lineNo: bigint;
}
export interface GoNoGoFactor {
    weight: number;
    dimensionId: DimensionId;
    dimensionName: string;
    score: number;
    notes: string;
    autoCalculated: boolean;
}
export interface CategorySummary {
    variance: bigint;
    committed: bigint;
    projectedFinal: bigint;
    budgeted: bigint;
    actualCost: bigint;
    category: CostCategory;
}
export interface ExcelColumn {
    key: string;
    width: bigint;
    formula?: string;
    header: string;
}
export interface ScheduleActivity {
    id: ActivityId;
    learningCurveAdj: number;
    durationDays: bigint;
    plannedEndDate: bigint;
    status: ActivityStatus;
    trade: string;
    actualEndDate?: bigint;
    unit: string;
    productivityRate: number;
    description: string;
    tenantId: TenantId;
    plannedStartDate: bigint;
    projectId: ProjectId;
    quantity: number;
    csiCode: string;
    crewSize: bigint;
    percentComplete: bigint;
    successors: Array<ActivityId>;
    isCriticalPath: boolean;
    actualStartDate?: bigint;
    floatDays: bigint;
    predecessors: Array<ActivityId>;
}
export interface ProposalSection {
    title: string;
    content: string;
    order: bigint;
}
export interface EscalationAlert {
    region: string;
    currentPrice: bigint;
    trend: string;
    changePct: bigint;
    alertId: string;
    tenantId: bigint;
    category: MaterialCategory;
    severity: string;
    issuedAt: bigint;
    recommendation: string;
    materialName: string;
    previousPrice: bigint;
}
export type TriggerActionResult = {
    __kind__: "ok";
    ok: ActionTrigger;
} | {
    __kind__: "err";
    err: string;
};
export interface Handoff {
    id: HandoffId;
    designerPrincipal: Principal;
    status: string;
    completedAt?: bigint;
    projectName: string;
    createdAt: bigint;
    recipientGroups: Array<RecipientGroup>;
    sentAt?: bigint;
    projectId: string;
    scopeItems: Array<ScopeItem>;
}
export interface CreateTenantRequest {
    name: string;
    slug: string;
    industry: string;
}
export type SMResult_1 = {
    __kind__: "ok";
    ok: VHDEAnalysisResult;
} | {
    __kind__: "err";
    err: string;
};
export interface PreMobChecklistItem {
    completedAt?: bigint;
    completedBy: string;
    itemId: string;
    completed: boolean;
    description: string;
    notes: string;
    category: string;
    required: boolean;
}
export interface GCRelationshipScore {
    relationshipHealthScore: number;
    totalContractValue: number;
    gcName: string;
    avgQualityScore: number;
    engagementCount: bigint;
    lastProjectDate: bigint;
    nextActionRecommendation: string;
}
export type RFIId = string;
export interface CashFlowProjection {
    breakEvenDay?: bigint;
    generatedAt: bigint;
    projectionDays: bigint;
    tenantId: bigint;
    entries: Array<CashFlowEntry>;
    projectId: string;
    nexusInsight: string;
    peakNegative: bigint;
    riskLevel: string;
}
export interface CashFlowPoint {
    net: bigint;
    inflow: bigint;
    periodLabel: string;
    outflow: bigint;
}
export interface LeadDimension {
    weight: number;
    score: bigint;
    dimension: string;
    notes: string;
}
export interface BidSubmission {
    scopeGaps: Array<string>;
    lineItems: Array<BidLineItem>;
    subName: string;
    scheduledStart?: bigint;
    alternates: Array<[string, number]>;
    submittedAt: bigint;
    qualifications: Array<string>;
    notes: string;
    baseAmount: number;
    submissionId: string;
    bondable: boolean;
}
export interface SubstitutionOption {
    overallScore: bigint;
    alternateName: string;
    qualityScore: bigint;
    notes: string;
    category: MaterialCategory;
    csiCode: string;
    costDelta: bigint;
    leadDeltaDays: bigint;
    availabilityScore: bigint;
}
export interface SiteWalkReport {
    id: string;
    inspectorName: string;
    walkDate: bigint;
    generatedNarrative: string;
    leadId: string;
    hazardsObserved: Array<string>;
    existingConditions: string;
    scopeObservations: string;
}
export type SendMessageResult = {
    __kind__: "ok";
    ok: ChatMessage;
} | {
    __kind__: "err";
    err: string;
};
export interface SafetyCertRecord {
    id: bigint;
    certType: string;
    flaggedForRenewal: boolean;
    isExpired: boolean;
    holderName: string;
    principalOwner: Principal;
    issuedDate: bigint;
    expirationDate: bigint;
    projectId?: bigint;
    certNumber: string;
}
export interface ScopeGapLegacyResult {
    missingScopes: Array<string>;
    recommendations: Array<string>;
    bundleOpportunities: Array<string>;
    riskLevel: string;
}
export interface ControlOption {
    title: string;
    effectiveness: bigint;
    costRelative: string;
    description: string;
    level: ControlLevel__1;
    examples: Array<string>;
}
export interface SafetyToolResponse {
    toolOutput: string;
    deliverables: Array<string>;
    record: SafetyToolRecord;
}
export interface OshaViolation {
    title: string;
    code: string;
    category: string;
    defaultSeverity: TagSeverity;
}
export interface HazardEntry {
    controls: Array<string>;
    osha1926Ref: string;
    description: string;
    stopWorkRequired: boolean;
    severity: string;
    hazardId: string;
}
export interface ScheduleResult {
    float: bigint;
    totalDays: bigint;
    mobilizationDays: bigint;
    phases: Array<string>;
    criticalPath: Array<string>;
}
export interface RFI {
    id: bigint;
    status: RFIStatus;
    question: string;
    submittedAt: bigint;
    projectId: bigint;
    priority: RFIPriority;
    subPrincipal: Principal;
    attachmentHash: string;
    responseText: string;
    resolvedAt?: bigint;
}
export interface ChecklistItem {
    id: bigint;
    oshaRef?: string;
    isCritical: boolean;
    text: string;
}
export interface BackCharge {
    status: Variant_settled_disputed_open_acknowledged_written_off;
    backChargeId: string;
    supportingPhotos: Array<string>;
    description: string;
    tenantId: bigint;
    subId: string;
    projectId: string;
    issuedAt: bigint;
    amount: bigint;
    nexusNote: string;
    incidentDate: bigint;
    csiDivision: string;
    resolvedAt?: bigint;
}
export interface AlignmentReport {
    overallScore: bigint;
    gaps: Array<string>;
    generatedAt: bigint;
    documentId: string;
    citations: Array<EvidenceCitation>;
}
export interface ProtectedRoute {
    requiredLevel: bigint;
    path: string;
    description: string;
}
export interface PerceptionInput {
    inputData: Array<[string, string]>;
    toolId: string;
    projectId?: string;
    timestamp: bigint;
    callerPrincipal: Principal;
}
export interface PayAppOutputShared {
    retainagePercent: number;
    totalEarnedLessRetainage: number;
    contractSumToDate: number;
    applicationNo: bigint;
    generatedAt: bigint;
    totalCompletedStored: number;
    contractSum: number;
    netChangeOrders: number;
    tenantId: string;
    retainageAmount: number;
    lineItemCount: bigint;
    projectId: string;
    balanceToFinish: number;
    currentPaymentDue: number;
    aiaForm: string;
    payAppId: string;
    previousPayments: number;
}
export interface FIESummary {
    openLienWaivers: bigint;
    cashFlow90Day: bigint;
    eacAlerts: bigint;
    pendingPayApps: bigint;
    totalPayApps: bigint;
    retainageHeld: bigint;
    totalLienWaivers: bigint;
}
export interface ChangeOrder__2 {
    id: ChangeOrderId;
    status: ChangeOrderStatus;
    title: string;
    approvedAt?: bigint;
    approvedBy?: string;
    createdAt: bigint;
    submittedAt: bigint;
    submittedBy: string;
    totalCost: number;
    description: string;
    tenantId: TenantId;
    updatedAt: bigint;
    scheduleDays: bigint;
    projectId: ProjectId;
    scopeDelta: string;
    items: Array<ChangeOrderItem>;
    linkedRFIs: Array<RFIId>;
    riskScore: bigint;
    coNumber: bigint;
    reason: string;
}
export interface AIADocResponse {
    bhxTaskId: string;
    deliverables: Array<string>;
    documentContent: string;
    cplAuditHash: string;
    record: AIADocRecord;
}
export type ChangeOrderId = string;
export interface PerceptionHistoryEntry {
    synthesisResult: SynthesisResult;
    toolId: string;
    timestamp: bigint;
}
export interface ProjectIntelligence {
    budgetDriftPct: number;
    lastUpdatedAt: bigint;
    closeoutReadinessScore: number;
    projectId: bigint;
    subPerformanceScores: Array<SubScore>;
    laborAnomalyFlags: Array<string>;
    scheduleCompressionScore: number;
}
export interface TmEntry {
    equipment: bigint;
    date: bigint;
    hoursWorked: bigint;
    description: string;
    craftType: string;
    ratePerHour: bigint;
    materials: bigint;
    workers: bigint;
}
export interface SignatureRecord__1 {
    signerName: string;
    status: SignatureStatus;
    certificate: string;
    signerEmail: string;
    signerPrincipal: string;
    signedAt: bigint;
    signerTitle: string;
    ipAddress: string;
}
export interface PercentileResult {
    value: number;
    toolType: string;
    percentileLabel: string;
    percentile: bigint;
    benchmark: BenchmarkResult;
}
export interface CSIFormResponse {
    bhxTaskId: string;
    deliverables: Array<string>;
    documentContent: string;
    cplAuditHash: string;
    record: CSIFormRecord;
}
export interface LienWaiverCheckItem {
    tier: LienWaiverTier;
    waiverId?: string;
    required: LienWaiverType__2;
    party: string;
    blocksPrime: boolean;
    amount: bigint;
    received: boolean;
}
export interface SafetyTag {
    id: bigint;
    assignedToName?: string;
    status: TagStatus;
    inviteToken?: string;
    title: string;
    photoUrls: Array<string>;
    tagCode: string;
    assignedTo?: Principal;
    projectPhase: string;
    createdBy: Principal;
    correctiveActionTemplate?: string;
    dueDate?: bigint;
    tenantId: string;
    tradeGroup: string;
    oshaDescription?: string;
    commentCount: bigint;
    category: string;
    severity: TagSeverity;
    oshaViolationCode?: string;
    correctiveAction?: string;
    location: string;
    resolvedAt?: bigint;
}
export interface DocumentSendRecord {
    messageEs: string;
    sendId: string;
    sentAt: bigint;
    sentBy: string;
    tenantId: string;
    targets: Array<SendTarget>;
    message: string;
    envelopeId?: string;
    documentId: string;
}
export interface HazardHeatCell {
    subpart: string;
    displayLabel: string;
    openCount: bigint;
    riskScore: bigint;
}
export interface SMSBridgeRecord {
    lastMessageAt: bigint;
    agentId: string;
    isActive: boolean;
    messageCount: bigint;
    activationCode: string;
    registeredAt: bigint;
}
export interface JSADailyInput {
    date: string;
    taskTypes: Array<string>;
    tenantId: string;
    crewId: string;
    perceptionScore: bigint;
    projectId: string;
    crewName: string;
    riskLevel: string;
}
export interface StopWorkRecord {
    status: string;
    oshaRefs: Array<string>;
    immediateActions: Array<string>;
    resumeConditions: Array<string>;
    hazardDescription: string;
    recordId: string;
    issuedAt: bigint;
    issuedBy: string;
    location: string;
}
export interface LeadTimeData {
    longLeadDays: bigint;
    csiDiv: string;
    expeditedDays: bigint;
    notes: string;
    standardDays: bigint;
    materialType: string;
}
export interface HazardDetection {
    description: string;
    hazardType: string;
    oshaSubpart: string;
    recommendation: string;
    oshaSection: string;
    confidence: bigint;
    location: string;
}
export interface ITBRecord {
    id: bigint;
    status: BidStatus__2;
    projectName: string;
    invitedSubs: Array<Principal>;
    publishedAt: bigint;
    tradeScope: string;
    requiredOSHA: boolean;
    requiredInsurance: number;
    requiredBonding: number;
    bidDeadline: bigint;
    location: string;
    gcPrincipal: Principal;
}
export interface BidLevelingEntry {
    scopeGaps: Array<BidScopeGap>;
    subName: string;
    baseBid: bigint;
    alternates: Array<[string, bigint]>;
    qualifications: Array<string>;
    subId: string;
    leveledTotal: bigint;
    recommendation: string;
    csiDivision: string;
}
export type STResult_3 = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "err";
    err: string;
};
export interface GoNoGoDimension {
    weight: number;
    name: string;
    score: bigint;
    rationale: string;
}
export interface GoNoGoResult__1 {
    decision: GoNoGoDecision;
    projectName: string;
    projectType: string;
    recommendations: Array<string>;
    generatedAt: bigint;
    tenantId: bigint;
    riskFlags: Array<string>;
    resultId: string;
    projectId: string;
    nexusInsight: string;
    estimatedValue: bigint;
    compositeScore: bigint;
    dimensions: Array<GoNoGoScoreDimension>;
}
export interface DesignRender {
    id: DesignRenderId;
    versionId: DesignVersionId;
    stylePreset: string;
    materialPalette: string;
    createdAt: Time;
    qualityScore: number;
    projectId: DesignProjectId;
    renderUrl: string;
    renderMode: RenderMode;
}
export interface EngineGovernanceReport {
    overallCompliant: boolean;
    engineId: string;
    engineName: string;
    activeLaws: Array<CPLLawStatus>;
    reportTimestamp: bigint;
}
export interface ContractIntelligenceResult {
    bhxWorkerId: string;
    riskFlags: Array<ContractRiskFlag>;
    recommendation: string;
    riskScore: bigint;
    cplAuditId: string;
}
export interface ProductivityResult {
    bottleneckScopes: Array<string>;
    recommendations: Array<string>;
    performanceGrade: string;
    variance: bigint;
    projectedCompletion: bigint;
    efficiencyPct: number;
}
export interface DesignProject {
    id: DesignProjectId;
    status: DesignProjectStatus;
    ownerPrincipal: Principal;
    name: string;
    createdAt: Time;
    updatedAt: Time;
    style: DesignStyle;
    budgetUSD: number;
    roomType: RoomType;
    dimensions: Dimensions;
}
export interface ActivityLogEntry {
    action: string;
    actorName: string;
    source: ActivitySource;
    resourceId?: string;
    tenantId: bigint;
    entryId: string;
    projectId?: string;
    resourceLabel?: string;
    timestamp: bigint;
    nexusScore?: bigint;
}
export interface DayTrend {
    date: string;
    totalCrews: bigint;
    compliantCrews: bigint;
    compliancePct: bigint;
}
export interface ResearchEntrySnapshot {
    field?: string;
    title: string;
    source: string;
    entryId: bigint;
    summary: string;
    topics?: Array<string>;
    annotation?: string;
}
export type EngineExecutionResultShared = {
    __kind__: "err";
    err: string;
} | {
    __kind__: "jsa";
    jsa: JSAOutputShared;
} | {
    __kind__: "safetyAnalysis";
    safetyAnalysis: SafetyAnalysisOutputShared;
} | {
    __kind__: "costEstimate";
    costEstimate: CostEstimateOutputShared;
} | {
    __kind__: "textResponse";
    textResponse: string;
} | {
    __kind__: "payApp";
    payApp: PayAppOutputShared;
} | {
    __kind__: "bidScore";
    bidScore: BidScoreOutputShared;
};
export interface Dimensions {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
    sqFt: number;
}
export interface UserProfile {
    name: string;
    email: string;
    company: string;
}
export interface FurnitureModel {
    id: FurnitureModelId;
    manufacturer: string;
    previewUrl: string;
    name: string;
    style: DesignStyle;
    priceRangeHigh: number;
    finishes: Array<string>;
    materials: Array<string>;
    category: FurnitureCategory;
    brand: string;
    dimensions: Dimensions;
    priceRangeLow: number;
    downloadFormats: Array<string>;
}
export interface PPERequirement {
    item: string;
    required: boolean;
    standard: string;
}
export interface ComplianceCert {
    certId: string;
    topicsCovered: Array<string>;
    score: bigint;
    missingTopics: Array<string>;
    sessionId: string;
    issuedAt: bigint;
}
export interface LeveledBid {
    levelingId: string;
    lowestResponsible: number;
    createdAt: bigint;
    leveledItems: Array<LeveledLineItem>;
    totalSavings: number;
    submissions: Array<string>;
    lowestBase: number;
    notes: string;
    recommendedAward: string;
    excelData: string;
}
export interface PreBidMeeting {
    minutesSummary: string;
    createdAt: bigint;
    agendaItems: Array<string>;
    meetingDate: bigint;
    tenantId: bigint;
    questionsAnswers: Array<[string, string]>;
    projectId: string;
    attendees: Array<string>;
    location: string;
    meetingId: string;
}
export interface SubPayApplication {
    status: PayAppStatus;
    netPaymentDue: bigint;
    subName: string;
    lienWaiverType?: LienWaiverType__2;
    subPayAppId: string;
    createdAt: bigint;
    csiDivisions: Array<string>;
    invoiceNo: string;
    tenantId: bigint;
    invoiceDate: bigint;
    lienWaiverReceived: boolean;
    projectId: string;
    subContract: string;
    retainageHeld: bigint;
    periodThrough: bigint;
    completedToDate: bigint;
    subAmount: bigint;
}
export interface ChargerConfig {
    defaultCreditsPerPrincipal: bigint;
    creditCostPerSMS: bigint;
    maxMessagesPerHour: bigint;
    creditCostPerChatMessage: bigint;
}
export interface ProjectReport {
    id: bigint;
    title: string;
    projectName: string;
    ownerId: Principal;
    createdAt: bigint;
    shareToken: string;
    researchEntrySnapshots?: Array<ResearchEntrySnapshot>;
    gcName: string;
    isActive: boolean;
    resultIds: Array<bigint>;
    location: string;
}
export interface CompletionTokenRecord {
    cplChecks: Array<CPLCheckResult>;
    tokenId: string;
    allPunchClear: boolean;
    allFinalWaivers: boolean;
    metadata: string;
    kind: TokenKind;
    createdAt: bigint;
    createdBy: string;
    finalWaivers: Array<LienWaiverRef>;
    retentionAmount: bigint;
    tenantId: string;
    updatedAt: bigint;
    state: TokenState;
    projectId: string;
    punchListItems: Array<PunchListItem>;
    awardTokenId: string;
    finalPayAppTokenId: string;
    approvals: Array<ApprovalRecord>;
}
export interface LienWaiver__2 {
    customerName: string;
    waiverType: LienWaiverType__2;
    jobLocation: string;
    claimantName: string;
    createdAt: bigint;
    tier: LienWaiverTier;
    conditionText?: string;
    tenantId: bigint;
    throughDate: bigint;
    state: string;
    signedAt?: bigint;
    signedBy?: string;
    waiverId: string;
    projectId: string;
    paymentAmount: bigint;
}
export interface ActionTrigger {
    parameters: Array<[string, string]>;
    actionType: ActionType;
    description: string;
    targetEngine: ActiveEngine;
}
export interface CPLCheckResult {
    lawName: string;
    action: string;
    lawId: bigint;
    checkedAt: bigint;
    passed: boolean;
    reason: string;
}
export interface DocumentField {
    helpText?: string;
    required: boolean;
    placeholder: string;
    choices?: Array<string>;
    fieldName: string;
    fieldType: FieldType;
    defaultValue?: string;
    autoFillKey?: string;
    fieldId: string;
}
export interface ProjectRecord__1 {
    id: ProjectId;
    currentPhase: ProjectPhase;
    architectName: string;
    ownerName: string;
    projectType: string;
    city: string;
    name: string;
    createdAt: bigint;
    gcCompany: string;
    targetEndDate: bigint;
    tenantId: TenantId;
    updatedAt: bigint;
    state: string;
    contractValue: number;
    startDate: bigint;
}
export interface FocusFourHazard {
    cfr: string;
    title: string;
    detectionRules: Array<DetectionRule>;
    preventionProtocols: Array<string>;
    description: string;
    annualFatalities: bigint;
    percentOfConstructionFatalities: bigint;
    category: FocusFourCategory;
    requiredTraining: Array<string>;
    penaltyPerViolation: bigint;
}
export interface AgentResponse {
    source: string;
    agentId: string;
    message: string;
    timestamp: bigint;
    confidence: number;
}
export interface DetectionRule {
    id: bigint;
    cfr: string;
    ruleText: string;
    triggerKeywords: Array<string>;
    severity: HazardSeverity;
}
export interface EvidenceCitation {
    alignScore: bigint;
    source: string;
    compliant: boolean;
    excerpt: string;
}
export interface WageLineCheck {
    region: string;
    status: WageComplianceStatus;
    trade: string;
    postedRate: bigint;
    blsRate: bigint;
    notes: string;
    delta: bigint;
}
export interface BidLead {
    id: string;
    status: BidLeadStatus;
    architectContact: string;
    projectName: string;
    goNoGoScore: number;
    createdAt: bigint;
    goNoGoReasoning: string;
    rfqDeadline: bigint;
    ownerContact: string;
    estimatedValue: number;
    buildingType: string;
    location: string;
    gcPrincipal: Principal;
}
export interface BidResponse {
    id: bigint;
    scopeCoverageScore: number;
    completenessScore: number;
    pricingFlag: PricingFlag;
    pricingUSD: number;
    nexusConfidence: number;
    submittedAt: bigint;
    scheduleDays: bigint;
    subPrincipal: Principal;
    itbId: bigint;
    nexusBidScore: number;
}
export interface SupplierQuote {
    lineItems: Array<QuoteLineItem>;
    validThrough: bigint;
    quoteId: string;
    tenantId: bigint;
    receivedAt: bigint;
    totalAmount: bigint;
    rfqId: string;
    supplierId: string;
}
export interface LongLeadItem {
    itemId: string;
    leadDays: bigint;
    stagingLocation: string;
    supplierName: string;
    createdAt: bigint;
    poId?: string;
    description: string;
    orderDate?: bigint;
    tenantId: bigint;
    loiId?: string;
    updatedAt: bigint;
    projectId: string;
    notes: string;
    csiCode: string;
    riskLevel: string;
    requiredOnSite: bigint;
    supplierId: string;
    currentStatus: LongLeadStatus;
    storageRequirements: string;
    milestones: Array<[string, bigint, boolean]>;
}
export interface LaborHoursResult {
    totalHours: bigint;
    crewRecommendMax: bigint;
    crewRecommendMin: bigint;
    overtimeRisk: string;
    daysMax: bigint;
    daysMin: bigint;
}
export interface Image {
    alt: string;
    file: ExternalBlob;
    filename: string;
    caption: string;
}
export interface BondRecord {
    verified: boolean;
    bondNo: string;
    expirationDate: bigint;
    surety: string;
    bondType: string;
    amount: bigint;
}
export interface TagNotification {
    id: bigint;
    tagId: bigint;
    notificationType: string;
    createdAt: bigint;
    isRead: boolean;
    tenantId: string;
    message: string;
    recipientPrincipal: Principal;
}
export interface VisualHazardDetection {
    detections: Array<HazardDetection>;
    imageRef: string;
    analysisTimestamp: bigint;
    overallRiskScore: bigint;
}
export interface ChangeOrderImpact {
    costImpact: bigint;
    affectedCsiDiv: string;
    scheduledValue: bigint;
    daysImpact: bigint;
}
export interface SubCloseoutDoc {
    description: string;
    tenantId: bigint;
    subId: string;
    receivedAt?: bigint;
    projectId: string;
    notes: string;
    docType: string;
    docId: string;
    received: boolean;
    fileKey?: string;
}
export interface CorrectiveTemplate {
    id: bigint;
    urgency: string;
    name: string;
    steps: Array<string>;
}
export interface BLSRefreshResult {
    tradesUpdated: bigint;
    errors: Array<string>;
    recordsAdded: bigint;
    timestamp: bigint;
}
export interface FlowDownProvision {
    clause: string;
    contractReference: string;
    included: boolean;
    required: boolean;
}
export interface EMRRecord {
    emr: number;
    ratingYear: bigint;
    subName: string;
    prequal: string;
    prequelNote: string;
    tenantId: string;
}
export interface FurnitureQuery {
    maxPriceUSD?: number;
    style?: DesignStyle;
    category?: FurnitureCategory;
    brand?: string;
}
export interface CostCode {
    code: string;
    division: string;
    description: string;
    category: CostCategory;
}
export interface Citation {
    title: string;
    section: string;
    relevanceScore: number;
    corpus: SourceCorpus;
    fullRef: string;
}
export interface SubmittalPackage {
    id: bigint;
    submittedDate: bigint;
    transmissionDate?: bigint;
    documentHash: string;
    submittalType: string;
    reviewedBy?: Principal;
    approvalStatus: SubmittalApprovalStatus;
    projectId: bigint;
    subPrincipal: Principal;
}
export interface PreMobChecklist {
    completedAt?: bigint;
    createdAt: bigint;
    checklistId: string;
    bidId: string;
    items: Array<PreMobChecklistItem>;
    percentComplete: number;
    readyToMobilize: boolean;
}
export interface CashFlowResult {
    bhxWorkerId: string;
    breakEvenWeek: bigint;
    projectionDays: bigint;
    peakNegativeFlow: number;
    projectValue: number;
    weeklyProjection: Array<WeeklyCashFlow>;
}
export type HandoffId = bigint;
export interface PSIEAnomalyFlag {
    flagId: string;
    description: string;
    recommendedAction: string;
    severity: bigint;
    perceptionType: string;
}
export interface SOVLineItem {
    completedCurrentPct: number;
    description: string;
    lineNumber: bigint;
    csiCode: string;
    completedPreviousPct: number;
    scheduledValue: number;
    retainagePct: number;
    storedMaterials: number;
}
export type TenantChatResult = {
    __kind__: "ok";
    ok: Array<TenantChatMessage>;
} | {
    __kind__: "err";
    err: string;
};
export interface LeadScoringResult {
    overallScore: bigint;
    bhxWorkerId: string;
    pheroSignalId: string;
    rationale: string;
    recommendation: string;
    confidence: number;
    dimensions: Array<LeadDimension>;
}
export interface ExcelPackage {
    sheets: Array<ExcelSheet>;
    generatedAt: bigint;
    tenantId: string;
    filename: string;
    documentId: string;
    packageId: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface MediaCorrectiveAction {
    id: bigint;
    assignedToName?: string;
    status: CorrectiveActionStatus;
    assignedTo?: Principal;
    createdAt: bigint;
    createdBy: Principal;
    dueDate?: bigint;
    description: string;
    tenantId: string;
    createdByName: string;
    linkedTagId?: bigint;
    oshaSection: string;
    mediaId: string;
    resolvedAt?: bigint;
}
export interface UsageStat {
    tokenCount: bigint;
    lastUsed: bigint;
    requestCount: bigint;
    modelId: string;
}
export interface VarianceResult {
    status: string;
    materialVariance: bigint;
    laborVariance: bigint;
    totalVariance: bigint;
    variancePct: number;
    correctionRecommendations: Array<string>;
    analysis: Array<string>;
}
export interface SavedToolResult {
    id: bigint;
    projectName: string;
    userId: Principal;
    toolCategory: string;
    inputs: string;
    timestamp: bigint;
    toolName: string;
    nexusInsights: string;
    outputs: string;
}
export interface TagActivity {
    tagId: bigint;
    activityType: string;
    tagCode: string;
    actorText: string;
    summary: string;
    timestamp: bigint;
}
export interface DailyLog {
    id: bigint;
    bhxTaskId: bigint;
    crewNotes: string;
    date: bigint;
    weatherNotes: string;
    hoursWorked: number;
    laborCount: bigint;
    projectId: bigint;
    subPrincipal: Principal;
    workArea: string;
}
export interface IntakeResult {
    subName: string;
    scoreBreakdown: Array<[string, bigint]>;
    reviewedAt: bigint;
    score: bigint;
    approved: boolean;
    disqualifiers: Array<string>;
    conditions: Array<string>;
    rating: string;
}
export type RetainageReleaseTrigger = {
    __kind__: "substantialCompletion";
    substantialCompletion: null;
} | {
    __kind__: "finalCompletion";
    finalCompletion: null;
} | {
    __kind__: "customMilestone";
    customMilestone: string;
} | {
    __kind__: "percentComplete";
    percentComplete: bigint;
};
export interface HazardRisk {
    control: string;
    name: string;
    severity: string;
}
export interface CashFlowEntry {
    periodEnd: bigint;
    retainageExpected: bigint;
    cumulativeCash: bigint;
    netCashFlow: bigint;
    projectedInflow: bigint;
    periodStart: bigint;
    projectedOutflow: bigint;
}
export type Time = bigint;
export interface OSHADataStatus {
    source: string;
    lastRefresh: bigint;
    recordCount: bigint;
}
export interface LeadTimeRecord {
    region: string;
    historicalAvgDays: bigint;
    trend: string;
    tenantId: bigint;
    updatedAt: bigint;
    leadTimeId: string;
    category: MaterialCategory;
    materialName: string;
    currentLeadDays: bigint;
    supplierId: string;
}
export interface ResearchEntry {
    id: bigint;
    field?: string;
    title: string;
    topic: string;
    source: string;
    tags: Array<string>;
    summary: string;
    topics?: Array<string>;
    category: string;
}
export interface DARTResult {
    totalHours: bigint;
    dart: number;
    severityRating: string;
    interpretation: string;
    dartCases: bigint;
}
export interface NativeMessageResult {
    messageId: string;
    bhxWorkerId: string;
    recipient: string;
    deliveryStatus: DeliveryStatus;
    cplAuthResult: boolean;
}
export interface EvidenceItem {
    itemId: string;
    verified: boolean;
    description: string;
    sourceRef: string;
    category: string;
    verifiedAt?: bigint;
    verifiedBy?: string;
    alignedTo: string;
}
export type DesignCommentId = bigint;
export interface ControlLevel {
    name: string;
    rank: bigint;
    description: string;
    score: bigint;
    examples: Array<string>;
}
export interface BidLineItem {
    unit: string;
    description: string;
    inclusions: Array<string>;
    notes: string;
    quantity: number;
    exclusions: Array<string>;
    csiCode: string;
    unitPrice: number;
    totalPrice: number;
}
export interface TokenAuditEntry {
    action: string;
    tokenId: string;
    fromState: string;
    cplPassed: boolean;
    toState: string;
    auditId: string;
    tenantId: string;
    cplLawId: bigint;
    timestamp: bigint;
    details: string;
    tokenKind: string;
    actorPrincipal: string;
}
export interface ChatMessageResult {
    messageId: string;
    bhxWorkerId: string;
    deliveryStatus: DeliveryStatus;
    cplAuthResult: boolean;
    response: string;
    confidence: number;
}
export interface RfqLineItem {
    unit: string;
    description: string;
    quantity: bigint;
    csiCode: string;
    lineNo: bigint;
    specNotes: string;
}
export interface GoNoGoScore {
    overallScore: bigint;
    recommendation: string;
    confidence: number;
    dimensions: Array<GoNoGoDimension>;
}
export interface DesignApproval {
    id: DesignApprovalId;
    status: DesignVersionStatus;
    versionId: DesignVersionId;
    createdAt: Time;
    approverPrincipal: Principal;
    projectId: DesignProjectId;
    notes: string;
}
export interface BidLevelingSheet {
    title: string;
    bestValue: string;
    generatedAt: bigint;
    lowestLeveled: bigint;
    tenantId: bigint;
    entries: Array<BidLevelingEntry>;
    lowestBase: bigint;
    projectId: string;
    nexusInsight: string;
    sheetId: string;
    csiDivision: string;
}
export interface ScopeItem__1 {
    id: bigint;
    status: ScopeItemStatus;
    completionPct: number;
    originalCost: number;
    tradeCode: string;
    originalQuantity: number;
    dueDate: bigint;
    description: string;
    assignedSub: Principal;
    projectId: bigint;
}
export interface SubcontractRecord {
    status: SubcontractStatus;
    insuranceVerified: boolean;
    subName: string;
    endDate: bigint;
    executedAt?: bigint;
    createdAt: bigint;
    csiDivisions: Array<string>;
    bondingVerified: boolean;
    tenantId: bigint;
    insurance: Array<InsuranceCoverage>;
    updatedAt: bigint;
    subId: string;
    flowDownProvisions: Array<FlowDownProvision>;
    projectId: string;
    subcontractId: string;
    bonds: Array<BondRecord>;
    contractValue: bigint;
    retainagePct: bigint;
    scopeSummary: string;
    startDate: bigint;
}
export interface VHDEAnalysisResult {
    analysisStatus: AnalysisStatus;
    tenantId: string;
    hazardFlags: Array<VHDEHazardFlag>;
    sessionId: string;
    analysisTimestamp: bigint;
    overallRiskScore: bigint;
    mediaId: string;
    engineVersion: string;
}
export interface AwardRecord__1 {
    awardedSubName: string;
    signedContract: boolean;
    contractType: string;
    preMobStatus: string;
    noticeToProceed?: bigint;
    awardId: string;
    notes: string;
    workspaceId: string;
    awardedAt: bigint;
    bidId: string;
    insuranceStatus: string;
    contractValue: number;
}
export interface SynthesisResult {
    prioritizedActions: Array<string>;
    crossPerceptionInsights: Array<string>;
    perceptionMap: Array<[string, PerceptionOutput]>;
    confidenceScore: bigint;
    dominantPerception: string;
    overallRiskScore: bigint;
}
export interface RFIImpactResult {
    costImpactMax: bigint;
    costImpactMin: bigint;
    mitigation: Array<string>;
    riskLevel: string;
    totalDelayDays: bigint;
    criticalRFIs: bigint;
}
export interface BidLifecycleResponse {
    id: string;
    exceptions: string;
    nexusReasoning: string;
    submittedAt: bigint;
    bidAmount: number;
    assumptions: string;
    nexusScore: number;
    subPrincipal: Principal;
    benchmarkDeltaPct: number;
    packageId: string;
}
export type AlignmentStatus = {
    __kind__: "NonCompliant";
    NonCompliant: {
        violations: Array<AlignmentViolation>;
    };
} | {
    __kind__: "Warning";
    Warning: {
        message: string;
        citations: Array<Citation>;
    };
} | {
    __kind__: "Compliant";
    Compliant: null;
};
export interface ScopeClarification {
    status: Variant_pending_answered_withdrawn;
    subName: string;
    question: string;
    tenantId: bigint;
    clarificationId: string;
    subId: string;
    projectId: string;
    response: string;
    issuedAt: bigint;
    answeredAt?: bigint;
}
export type TranscribeResult = {
    __kind__: "ok";
    ok: {
        duration?: number;
        text: string;
        language: string;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface NexusBrainState {
    globalMean: number;
    globalVariance: number;
    categoryStats: Array<[string, bigint, number, number]>;
}
export interface OSHARefreshResult {
    violationsAdded: bigint;
    errors: Array<string>;
    inspectionsAdded: bigint;
    timestamp: bigint;
}
export interface JSAOutputShared {
    trade: string;
    hierarchyOfControls: Array<string>;
    projectType: string;
    hazards: Array<string>;
    controls: Array<string>;
    generatedAt: bigint;
    generatedBy: string;
    ppeRequired: Array<string>;
    oshaReferences: Array<string>;
    jsaId: string;
    taskDescription: string;
    emergencyProcedures: Array<string>;
    tenantId: string;
    stopWorkRequired: boolean;
    stepCount: bigint;
}
export interface ESignatureEnvelope {
    expiresAt: bigint;
    signers: Array<SignatureRecord__1>;
    createdAt: bigint;
    tenantId: string;
    finalHash: string;
    envelopeId: string;
    auditTrail: Array<string>;
    documentId: string;
    isComplete: boolean;
}
export interface ContractRiskFlag {
    description: string;
    clauseType: string;
    severity: string;
    plainEnglish: string;
    location: string;
}
export interface BidInviteRecord {
    id: string;
    status: Variant_Accepted_Expired_Pending;
    projectName: string;
    invitedSubEmail?: string;
    createdAt: bigint;
    tradeScope: string;
    inviteCode: string;
    acceptedByPrincipal?: Principal;
    acceptedAt?: bigint;
    gcPrincipal: Principal;
}
export interface ScopeItem {
    unit: string;
    description: string;
    tradeGroup: string;
    notes: string;
    quantity: number;
    estimatedCost: number;
    csiDivision: string;
}
export type HistoryResult = {
    __kind__: "ok";
    ok: Array<ChatMessage>;
} | {
    __kind__: "err";
    err: string;
};
export interface FurnitureModel3D {
    id: string;
    thumbnailUrl: string;
    cost: number;
    geometryUrl: string;
    name: string;
    materialIds: Array<string>;
    finishOptions: Array<string>;
    category: string;
    brand: string;
    dimensions: Dimensions3D;
    csiDivision: string;
}
export interface CertAlert {
    certId: string;
    certType: string;
    expiryDate: bigint;
    alertLevel: AlertLevel;
    daysUntilExpiry: bigint;
    workerName: string;
}
export interface JobCostLedger {
    totalProjectedFinal: bigint;
    ledgerId: string;
    projectName: string;
    totalCommitted: bigint;
    byCostCode: Array<CostCodeSummary>;
    generatedAt: bigint;
    tenantId: bigint;
    entries: Array<JobCostEntry>;
    projectId: string;
    totalBudget: bigint;
    totalVariance: bigint;
    nexusInsight: string;
    percentSpent: bigint;
    byCategory: Array<CategorySummary>;
    totalActual: bigint;
}
export interface ProgramSection {
    title: string;
    sectionNumber: string;
    sampleLanguage: string;
    requiredContent: Array<string>;
}
export interface AgentActionLog {
    id: string;
    bhxWorkerId: string;
    actionType: Variant_auditProject_chat_smsMessage_sendInvoice_sendAlert_sendPaymentLink_deployEstimate;
    agentId: string;
    cplAuthResult: boolean;
    nexusGuardPassed: boolean;
    timestamp: bigint;
    agentPrincipal: Principal;
    resultSummary: string;
}
export interface SafetyReportRecord {
    templatesIncluded: Array<string>;
    projectName: string;
    generatedAt: bigint;
    generatedBy: Principal;
    safetyOfficerName: string;
    sentTo: Array<ReportRecipient>;
    tenantId: string;
    companyName: string;
    companyAddress: string;
    reportId: string;
    projectAddress: string;
    reportTitle: string;
}
export interface ChatMessage {
    id: string;
    model?: string;
    content: string;
    role: MessageRole;
    tokens?: bigint;
    timestamp: bigint;
}
export interface LOIRecord {
    expiresAt: bigint;
    supplierName: string;
    tenantId: bigint;
    loiId: string;
    acknowledged: boolean;
    projectId: string;
    materialDescription: string;
    estimatedValue: bigint;
    csiCode: string;
    issuedAt: bigint;
    requiredOnSite: bigint;
    supplierId: string;
}
export interface AnomalyReport {
    flags: Array<string>;
    droneReports: Array<string>;
    projectId: bigint;
    nexusScore: number;
}
export interface ResearchAnnotation {
    annotationId: bigint;
    owner: Principal;
    note: string;
    createdAt: bigint;
    tags: Array<string>;
    entryId: bigint;
}
export interface IFCMetadata {
    principal: Principal;
    totalVolume: number;
    totalArea: number;
    fileName: string;
    uploadTimestamp: bigint;
    elementTypes: Array<string>;
    projectId: string;
    elementCount: bigint;
}
export interface SubpartSection {
    cfr: string;
    title: string;
    summary: string;
    keyRequirements: Array<string>;
}
export interface Dimensions3D {
    widthIn: number;
    heightIn: number;
    depthIn: number;
}
export interface CRMPipelineItem {
    id: bigint;
    projectType: string;
    expectedStartDate: bigint;
    gcName: string;
    probabilityScore: number;
    stage: CRMPipelineStage;
    estimatedValueUSD: number;
    nexusNotes: string;
}
export interface SafetyMetrics {
    overdueTagsPct: bigint;
    focusFourExposure: Array<string>;
    incidentsYtd: bigint;
    overallScore: bigint;
    dart: bigint;
    nextJsaDueAt?: bigint;
    generatedAt: bigint;
    toolboxCompliance: bigint;
    trir: bigint;
    nearMissesYtd: bigint;
    heatmap: Array<HazardHeatCell>;
    tenantId: bigint;
    jsaCompliance: bigint;
    topCorrectiveActions: Array<string>;
    openOsha300Entries: bigint;
    openTags: bigint;
    criticalTags: bigint;
}
export interface WageComplianceReport {
    generatedAt: bigint;
    tenantId: bigint;
    projectId: string;
    deficiencyCount: bigint;
    nexusInsight: string;
    checks: Array<WageLineCheck>;
    overallStatus: WageComplianceStatus;
    reportId: string;
}
export interface ComplianceMetrics {
    contractReviewStatus: Array<string>;
    generatedAt: bigint;
    openPunchItems: bigint;
    pendingChangeOrders: bigint;
    recentAuditEntries: Array<CplAuditEntry>;
    approvedChangeOrders: bigint;
    tenantId: bigint;
    cplScore: bigint;
    overdueRfis: bigint;
    overdueSubmittals: bigint;
    openSubmittals: bigint;
    activeCertifications: bigint;
    expiredCertifications: bigint;
    openRfis: bigint;
    closedPunchItems: bigint;
}
export interface PayAppInput {
    periodFrom: bigint;
    retainagePercent: number;
    payAppNumber: bigint;
    workCompletedThisPeriod: number;
    materialsStoredPrevious: number;
    workCompletedPrevious: number;
    periodTo: bigint;
    scheduledValue: number;
    previousPayments: number;
    materialsStoredThisPeriod: number;
}
export interface SubInvite {
    emr: number;
    status: SubInviteStatus;
    trade: string;
    subName: string;
    inviteId: string;
    dueDate: bigint;
    itbPackage: string;
    sentAt: bigint;
    subContact: string;
}
export interface FinancialMetrics {
    totalContractValue: bigint;
    totalReceived: bigint;
    approvedPayApps: bigint;
    openLienWaivers: bigint;
    openChangeOrderValue: bigint;
    contractRiskFlags: Array<string>;
    cashFlow90Day: Array<CashFlowPoint>;
    generatedAt: bigint;
    pendingPayApps: bigint;
    tenantId: bigint;
    overduePayApps: bigint;
    totalBilled: bigint;
    retainageBalance: bigint;
    pendingPayAppValue: bigint;
    avgCpi: bigint;
    avgSpi: bigint;
}
export interface NexusStats {
    anomalyRate: number;
    totalCalls: bigint;
    healthStatus: string;
    benchmarkHits: bigint;
    lastHeartbeat: bigint;
    anomalyCount: bigint;
}
export interface ScopeSection {
    divisionName: string;
    percentOfTotal: number;
    items: Array<CsiLineItem>;
    csiDivision: bigint;
    subtotal: number;
}
export interface TokenMessage {
    fromModule: string;
    tokenId: string;
    deliveredAt?: bigint;
    messageId: string;
    sentAt: bigint;
    tokenKind: string;
    delivered: boolean;
    toModule: string;
    payload: string;
    eventType: string;
}
export interface TemplateSectionDef {
    oshaRef: string;
    sectionName: string;
    fields: Array<string>;
}
export interface DocumentMetadata {
    documentType: string;
    projectName: string;
    tags: Array<string>;
    author: string;
    companyName: string;
    category: DocumentCategory;
    projectRef?: string;
    revision: string;
    confidentiality: ConfidentialityLevel;
    industry: IndustryCategory;
}
export interface DocumentDraft {
    id: string;
    status: DraftStatus;
    templateId: string;
    name: string;
    createdAt: bigint;
    fieldValues: Array<[string, string]>;
    tenantId: string;
    updatedAt: bigint;
}
export interface BLSDataStatus {
    source: string;
    tradeCount: bigint;
    lastRefresh: bigint;
}
export interface Osha301Record {
    supervisor: string;
    oshaNotificationSent: boolean;
    employeeName: string;
    escalationHours: bigint;
    correctiveActions: Array<CorrectiveAction>;
    escalationRequired: boolean;
    escalationTimestamp?: bigint;
    description: string;
    environmentFactors: string;
    recordedAt: bigint;
    tenantId: string;
    equipmentFactors: string;
    jobTitle: string;
    taskAtTimeOfIncident: string;
    fiveWhyAnalysis: Array<string>;
    severity: Osha301Severity;
    caseNo: string;
    managementFactors: string;
    location: string;
    incidentDate: bigint;
    employeeFactors: string;
    rootCause: string;
}
export interface SubPortalMessage {
    messageId: string;
    subject: string;
    body: string;
    fromSub: string;
    sentAt: bigint;
    toParty: string;
    bidId: string;
    attachments: Array<string>;
    readAt?: bigint;
}
export interface ChargerAuditEntry {
    principal: string;
    cplTrace: string;
    actionType: ChargerAuditActionType;
    entryId: bigint;
    timestamp: bigint;
    amount: bigint;
}
export interface BenchmarkResult {
    avg: number;
    max: number;
    min: number;
    stdDev: number;
}
export interface JobCostEntry {
    costCode: CostCode;
    invoiceRef?: string;
    description: string;
    variance: bigint;
    committed: bigint;
    projectedFinal: bigint;
    tenantId: bigint;
    budgeted: bigint;
    entryId: string;
    actualCost: bigint;
    updatedAt: bigint;
    projectId: string;
    vendor?: string;
    percentSpent: bigint;
    poRef?: string;
    enteredAt: bigint;
}
export interface VHDEHazardFlag {
    description: string;
    hazardType: string;
    boundingBox?: BoundingBox;
    oshaSubpart: string;
    recommendation: string;
    oshaSection: string;
    confidence: bigint;
}
export interface AIADocRecord {
    id: string;
    status: AIADocStatus;
    pdfPayload: string;
    generatedBy: Principal;
    formData: string;
    formType: AIAFormType;
    tenantId: string;
    projectId: string;
    deliverables: Array<string>;
    timestamp: bigint;
}
export interface TagComment {
    id: bigint;
    tagId: bigint;
    photoUrls: Array<string>;
    content: string;
    isExternalCollaborator: boolean;
    createdAt: bigint;
    authorName: string;
    tenantId: string;
    author: Principal;
}
export interface EacModel__1 {
    id: string;
    cpi: number;
    eac: number;
    etc: number;
    spi: number;
    lineItems: Array<BudgetLineItem>;
    trend: string;
    approvedCOs: number;
    variance: number;
    tenantId: TenantId;
    riskFlags: Array<string>;
    actualCostToDate: number;
    calculatedAt: bigint;
    revisedContract: number;
    projectId: ProjectId;
    contractValue: number;
}
export interface SafetyCultureScoreResult {
    componentScores: Array<[string, bigint]>;
    overallScore: bigint;
    strengths: Array<string>;
    bhxWorkerId: string;
    improvements: Array<string>;
    grade: string;
}
export interface InsuranceCert {
    status: InsuranceCertStatus;
    certId: string;
    subName: string;
    expiresAt: bigint;
    policyType: string;
    receivedAt: bigint;
    notes: string;
    coverageAmount: number;
    carrier: string;
    policyNumber: string;
}
export interface ScheduleOfValues {
    id: string;
    lineItems: Array<SOVLineItem>;
    totalContractValue: number;
    lastUpdatedAt: bigint;
    projectId: string;
    totalRetainageHeld: number;
}
export interface ReportRecipient {
    contactName: string;
    role: string;
    sentAt: bigint;
    contactEmail: string;
}
export interface RentalRate {
    region: string;
    dailyRate: number;
    source: string;
    equipment: string;
    fuelCostPerDay: number;
    operatorRequired: boolean;
    weeklyRate: number;
    monthlyRate: number;
}
export interface Contact {
    id: bigint;
    primaryRole: string;
    name: string;
    createdAt: bigint;
    secondaryRoles: Array<string>;
    email: string;
    updatedAt: bigint;
    notes: string;
    phone: string;
}
export interface AIPlatformStats {
    totalTools: bigint;
    totalAgents: bigint;
    totalEngines: bigint;
    totalResearchEntries: bigint;
}
export interface EvidenceTaggedResponse {
    content: string;
    generatedAt: bigint;
    auditId: string;
    confidenceScore: number;
    modelUsed: string;
    citations: Array<Citation>;
    alignmentStatus: AlignmentStatus;
}
export interface EacModel {
    cpi: bigint;
    spi: bigint;
    originalBudget: bigint;
    generatedAt: bigint;
    varianceAtCompletion: bigint;
    plannedValue: bigint;
    earnedValue: bigint;
    tenantId: bigint;
    actualCostToDate: bigint;
    costVariance: bigint;
    eacAtCompletion: bigint;
    projectId: string;
    toCompletePI: bigint;
    nexusInsight: string;
    percentComplete: bigint;
    scheduleVariance: bigint;
}
export interface ExecutiveSummary {
    totalContractValue: bigint;
    generatedAt: bigint;
    openChangeOrders: bigint;
    role: ViewRole;
    activeProjects: bigint;
    pendingPayApps: bigint;
    tenantId: bigint;
    safetyScore: bigint;
    openSubmittals: bigint;
    retainageBalance: bigint;
    documentsGenerated: bigint;
    complianceScore: bigint;
    financialHealth: bigint;
    openHazards: bigint;
    bidPipelineValue: bigint;
    kpiCards: Array<KpiCard>;
    openRfis: bigint;
    bidPipelineCount: bigint;
}
export type ProcurementResult = {
    __kind__: "itb";
    itb: ITBRecord__1;
} | {
    __kind__: "rfp";
    rfp: RFPRecord;
} | {
    __kind__: "longLeadItem";
    longLeadItem: LongLeadItem;
} | {
    __kind__: "goNoGo";
    goNoGo: GoNoGoResult__1;
} | {
    __kind__: "veProposal";
    veProposal: VEProposal;
} | {
    __kind__: "subPayment";
    subPayment: SubPaymentRecord;
} | {
    __kind__: "purchaseOrder";
    purchaseOrder: PurchaseOrder;
} | {
    __kind__: "bidLeveling";
    bidLeveling: BidLevelingSheet;
} | {
    __kind__: "subPrequal";
    subPrequal: SubPrequalification;
} | {
    __kind__: "subcontract";
    subcontract: SubcontractRecord;
} | {
    __kind__: "backCharge";
    backCharge: BackCharge;
} | {
    __kind__: "subPerformance";
    subPerformance: SubPerformanceRecord;
};
export interface CostEstimateOutputShared {
    projectType: string;
    source: string;
    laborTotal: number;
    generatedAt: bigint;
    sqFt: number;
    estimateId: string;
    totalCost: number;
    contingency: number;
    tenantId: string;
    grandTotal: number;
    lineItemCount: bigint;
    benchmarkRsf: number;
    materialTotal: number;
}
export interface PSIEWorkResult {
    result: PSIEResult;
    perception: PSIEPerceptionOutput;
    cplAudit: string;
    createdAt: bigint;
    tenantId: bigint;
    resultId: string;
    projectId: string;
}
export interface InspectionChecklist {
    id: bigint;
    name: string;
    tradeGroup: string;
    items: Array<ChecklistItem>;
}
export interface ChangeOrder {
    id: bigint;
    status: ChangeOrderStatus__1;
    nexusConfidence: number;
    approvedAt?: bigint;
    approvedBy?: Principal;
    description: string;
    projectId: bigint;
    costDelta: number;
    scheduleDelta: bigint;
    requestedBy: Principal;
}
export interface DesignComment {
    id: DesignCommentId;
    versionId: DesignVersionId;
    resolved: boolean;
    content: string;
    createdAt: Time;
    projectId: DesignProjectId;
    authorPrincipal: Principal;
}
export interface AssignRoleRequest {
    tenantId: TenantId;
    target: Principal;
    roles: Array<Role>;
}
export interface SessionAnnotation {
    text: string;
    annotatorId: string;
    timestamp: bigint;
    hazardRef?: string;
}
export interface SubPortalEntry {
    subName: string;
    messages: Array<SubPortalMessage>;
    lastActivity: bigint;
    tenantId: string;
    submittedPayApps: Array<string>;
    insuranceCerts: Array<InsuranceCert>;
    lienWaivers: Array<LienWaiver>;
    activeBids: Array<string>;
}
export interface GroqModelConfig {
    displayName: string;
    tokensPerMinute: bigint;
    recommended: boolean;
    maxContextTokens: bigint;
    requestsPerDay: bigint;
    modelId: string;
}
export interface FIEAnomalyFlag {
    flagId: string;
    description: string;
    recommendedAction: string;
    severity: bigint;
    perceptionType: string;
}
export interface WorkerCert {
    id: string;
    status: CertStatus;
    certType: string;
    expiryDate: bigint;
    renewalRequired: boolean;
    issuedDate: bigint;
    projectId?: string;
    issuingBody: string;
    certNumber: string;
    workerName: string;
}
export interface BudgetLineItem {
    originalBudget: number;
    approvedCOs: number;
    eacCost: number;
    description: string;
    actualCostToDate: number;
    committedCost: number;
    variancePct: number;
    csiCode: string;
    revisedBudget: number;
    percentComplete: bigint;
    etcCost: number;
}
export type SMResult_5 = {
    __kind__: "ok";
    ok: Annotation;
} | {
    __kind__: "err";
    err: string;
};
export interface FIEPerceptionFinding {
    findingId: string;
    description: string;
    sourceData: string;
    category: string;
    severity: bigint;
    confidence: bigint;
}
export interface SSSPRecord {
    status: string;
    subName: string;
    trainingRequirements: string;
    submittedAt: bigint;
    competentPersonName: string;
    emergencyProcedures: string;
    tenantId: string;
    ssspId: string;
    inspectionSchedule: string;
    hazardCommunication: string;
    projectId: string;
    jsaForScope: string;
}
export interface ActivityRecord {
    principal: Principal;
    action: string;
    resourceId?: string;
    cplPassed: boolean;
    tenantId: TenantId;
    timestamp: bigint;
    roles: Array<Role>;
}
export interface BoundingBox {
    x: number;
    y: number;
    height: number;
    width: number;
}
export type SMResult = {
    __kind__: "ok";
    ok: MediaAsset;
} | {
    __kind__: "err";
    err: string;
};
export interface AutoReportSchedule {
    scheduleId: string;
    lastRunAt?: bigint;
    createdAt: bigint;
    tenantId: string;
    recipients: Array<string>;
    schedule: string;
}
export interface SovLineItem {
    itemNo: string;
    description: string;
    workCompleted: bigint;
    retainageRate: bigint;
    scheduledValue: bigint;
    storedMaterials: bigint;
}
export interface OSHA300Entry__1 {
    daysRestricted: bigint;
    employeeName: string;
    descriptionOfInjury: string;
    jobTitle: string;
    privacy: boolean;
    recordableInjury: boolean;
    injuryType: InjuryType;
    caseNo: bigint;
    bodyPart: BodyPart;
    daysAway: bigint;
    dateOfInjury: bigint;
    location: string;
}
export interface TagCategory {
    id: bigint;
    icon: string;
    name: string;
    tradeGroup: string;
    phase: string;
}
export interface ITBRecord__1 {
    status: BidOpportunityStatus;
    insuranceReqs: Array<string>;
    contactName: string;
    projectName: string;
    projectType: string;
    invitedSubs: Array<string>;
    owner: string;
    createdAt: bigint;
    tenantId: bigint;
    updatedAt: bigint;
    projectId: string;
    bondRequired: boolean;
    prevailingWage: boolean;
    bidDate: bigint;
    contactEmail: string;
    estimatedValue: bigint;
    itbId: string;
    location: string;
    scopeSummary: string;
    bondAmount: bigint;
}
export interface DesignVersion {
    id: DesignVersionId;
    status: DesignVersionStatus;
    reviewerNotes: string;
    submittedAt: Time;
    submittedBy: Principal;
    projectId: DesignProjectId;
    designData: string;
    versionNumber: bigint;
}
export interface CloseoutReadiness {
    pendingSubmittals: bigint;
    readinessLevel: string;
    closeoutReadinessScore: number;
    projectId: bigint;
    openPunchCount: bigint;
    unresolvedChangeOrders: bigint;
}
export interface BidRecord {
    subName: string;
    inclusions: Array<string>;
    totalBid: bigint;
    exclusions: Array<string>;
    schedule: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface ProposalDocument {
    status: string;
    createdAt: bigint;
    bidId: string;
    sections: Array<ProposalSection>;
    totalPages: bigint;
    proposalId: string;
}
export interface FocusFourHazard__1 {
    id: string;
    fatalityPct: bigint;
    controlLevels: Array<string>;
    name: string;
    description: string;
    citation: string;
}
export type FIEResult = {
    __kind__: "eac";
    eac: EacModel;
} | {
    __kind__: "retainageSchedule";
    retainageSchedule: RetainageReleaseSchedule;
} | {
    __kind__: "evidenceScore";
    evidenceScore: EvidenceAlignmentScore;
} | {
    __kind__: "contractRisk";
    contractRisk: ContractRiskReport;
} | {
    __kind__: "changeOrder";
    changeOrder: ChangeOrder__1;
} | {
    __kind__: "jobCostLedger";
    jobCostLedger: JobCostLedger;
} | {
    __kind__: "cashFlow";
    cashFlow: CashFlowProjection;
} | {
    __kind__: "consolidatedApp";
    consolidatedApp: ConsolidatedPrimeApplication;
} | {
    __kind__: "payApp";
    payApp: PayApplication;
} | {
    __kind__: "lienWaiver";
    lienWaiver: LienWaiver__2;
};
export interface Finding {
    findingId: string;
    description: string;
    sourceData: string;
    category: string;
    severity: bigint;
    confidence: bigint;
}
export interface PayApp {
    periodFrom: bigint;
    status: string;
    retainagePercent: number;
    totalEarnedLessRetainage: number;
    payAppNumber: bigint;
    totalCompleted: number;
    workCompletedThisPeriod: number;
    createdAt: bigint;
    retainageAmount: number;
    materialsStoredPrevious: number;
    balanceToFinish: number;
    currentPaymentDue: number;
    workCompletedPrevious: number;
    periodTo: bigint;
    scheduledValue: number;
    payAppId: string;
    previousPayments: number;
    materialsStoredThisPeriod: number;
}
export interface AwardTokenRecord {
    cplChecks: Array<CPLCheckResult>;
    tokenId: string;
    ownerName: string;
    metadata: string;
    kind: TokenKind;
    createdAt: bigint;
    createdBy: string;
    bidTokenId: string;
    gcName: string;
    tenantId: string;
    updatedAt: bigint;
    state: TokenState;
    projectId: string;
    contractDocumentId?: string;
    workspaceId?: string;
    paymentTerms: PaymentTerms;
    workspaceCreated: boolean;
    contractValue: bigint;
    contractorName: string;
    approvals: Array<ApprovalRecord>;
}
export interface GoNoGoScoreDimension {
    weight: bigint;
    score: bigint;
    dimension: string;
    rationale: string;
}
export interface MemberPublic {
    principal: Principal;
    joinedAt: bigint;
    invitedBy?: Principal;
    tenantId: TenantId;
    roles: Array<Role>;
}
export interface SafetyDocument {
    id: bigint;
    title: string;
    documentType: string;
    file: ExternalBlob;
    description: string;
    filename: string;
    category: string;
    uploader: Principal;
    isCurated: boolean;
    uploadDate: Time;
    altText: string;
}
export interface TrendDataPoint {
    inspectionScore: bigint;
    period: string;
    trainingCompletion: bigint;
    incidentCount: bigint;
}
export interface PunchItem {
    id: bigint;
    status: PunchStatus;
    trade: string;
    bhxTaskId: bigint;
    area: string;
    createdBy: Principal;
    description: string;
    projectId: bigint;
    severity: PunchSeverity;
    closedDate?: bigint;
}
export type AnalysisStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "error";
    error: string;
} | {
    __kind__: "complete";
    complete: null;
} | {
    __kind__: "running";
    running: null;
};
export interface ChargerState {
    chargerConfig: ChargerConfig;
    hourlyRateLimits: Array<[string, bigint]>;
    principalCredits: Array<[string, bigint]>;
    queuedMessages: Array<string>;
}
export interface QuoteLineItem {
    leadDays: bigint;
    notes: string;
    unitPrice: bigint;
    totalPrice: bigint;
    lineNo: bigint;
}
export interface SafetyCultureScore {
    overallScore: bigint;
    correctiveActionClosure: bigint;
    recommendations: Array<string>;
    tenantId: string;
    calculatedAt: bigint;
    nearMissRate: number;
    trainingCompletion: bigint;
    projectId: string;
    toolboxAttendance: bigint;
    inspectionScoreAvg: bigint;
    predictedIncidentProb30: number;
    predictedIncidentProb60: number;
    predictedIncidentProb90: number;
    riskLevel: string;
}
export interface RoomTurnoverResult {
    phaseBreakdown: Array<string>;
    efficiencyScore: bigint;
    bottleneckScope: string;
    peakCrewDays: bigint;
    totalDays: bigint;
    dailyRoomsTarget: bigint;
}
export interface PRO1Response {
    model: string;
    think: ThinkOutput;
    content: string;
    messageId: string;
    language: string;
    workItems: Array<EngineWorkItem>;
    tokens?: bigint;
    timestamp: bigint;
    verifyScore: bigint;
    checkPassed: boolean;
    engineResults: Array<string>;
}
export interface EnterpriseRiskReport {
    id: string;
    riskHeatMap: Array<ProjectRiskEntry>;
    oshaNationalRate: number;
    generatedAt: bigint;
    crossProjectTrends: Array<TrendDataPoint>;
    tenantId: string;
    fieldDetail: string;
    executiveSummary: string;
    companyAvgRate: number;
    correctiveActionsOpen: bigint;
    dateRange: {
        end: bigint;
        start: bigint;
    };
    projectIds: Array<string>;
    totalIncidents: bigint;
    subBreakdown: Array<SubRiskEntry>;
    incidentRate: number;
}
export type PSIEResult = {
    __kind__: "rfq";
    rfq: RfqRecord;
} | {
    __kind__: "escalationAlert";
    escalationAlert: EscalationAlert;
} | {
    __kind__: "leadTime";
    leadTime: LeadTimeRecord;
} | {
    __kind__: "supplierScore";
    supplierScore: SupplierRecord;
} | {
    __kind__: "wageCompliance";
    wageCompliance: WageComplianceReport;
} | {
    __kind__: "quoteComparison";
    quoteComparison: QuoteComparison;
} | {
    __kind__: "substitution";
    substitution: SubstitutionReport;
};
export interface QuoteComparison {
    bestValue: string;
    generatedAt: bigint;
    lowestQuote: string;
    tenantId: bigint;
    projectId: string;
    nexusInsight: string;
    quotes: Array<QuoteVariance>;
    rfqId: string;
}
export interface HazardMitigationResult {
    cfr: string;
    recommendedControls: Array<ControlOption>;
    minimumAcceptableLevel: ControlLevel__1;
    hazardDescription: string;
    residualRisk: HazardSeverity;
}
export interface SubPaymentRecord {
    status: Variant_disputed_pending_paid_approved;
    lienWaiverType: string;
    currentBilling: bigint;
    tenantId: bigint;
    netPayment: bigint;
    subId: string;
    periodEnd: bigint;
    lienWaiverReceived: boolean;
    projectId: string;
    retainageHeld: bigint;
    paymentId: string;
    contractValue: bigint;
    previousBilled: bigint;
    payAppNo: bigint;
    paidAt?: bigint;
}
export interface BLSWageRecord {
    trade: string;
    meanWage: number;
    source: string;
    year: bigint;
    percentile10: number;
    percentile90: number;
    state: string;
    medianWage: number;
}
export type SMResult_4 = {
    __kind__: "ok";
    ok: Comment;
} | {
    __kind__: "err";
    err: string;
};
export interface Osha300ARecord {
    totalOtherIllnesses: bigint;
    totalTransfer: bigint;
    totalDaysAway: bigint;
    calendarYear: bigint;
    certifiedAt: bigint;
    certifiedBy: string;
    totalPoisoning: bigint;
    totalDeaths: bigint;
    dart: number;
    totalHearingLoss: bigint;
    annualAverageEmployees: bigint;
    trir: number;
    totalHoursWorked: bigint;
    tenantId: string;
    totalRestricted: bigint;
    totalInjuries: bigint;
    totalOtherRecordable: bigint;
    totalRespiratory: bigint;
    totalSkinDisorders: bigint;
}
export interface Osha300Record {
    daysRestricted: bigint;
    employeeName: string;
    description: string;
    recordedAt: bigint;
    tenantId: string;
    jobTitle: string;
    injuryType: string;
    caseNo: string;
    bodyPart: string;
    daysAway: bigint;
    location: string;
    incidentType: IncidentType;
    dateOfIncident: bigint;
}
export interface ProcurementWorkResult {
    result: ProcurementResult;
    cplAudit: string;
    createdAt: bigint;
    tenantId: bigint;
    resultId: string;
    projectId: string;
}
export interface JSAControlRanking {
    proposedControls: Array<string>;
    recommendations: Array<string>;
    effectivenessScore: bigint;
    highestLevelAchieved: string;
}
export interface PayApplication {
    sov: ScheduleOfValues__1;
    status: PayAppStatus;
    contractSumToDate: bigint;
    totalCompleted: bigint;
    owner: string;
    createdAt: bigint;
    contractDate: bigint;
    totalEarned: bigint;
    originalContractSum: bigint;
    tenantId: bigint;
    riskFlags: Array<string>;
    projectId: string;
    balanceToFinish: bigint;
    retainageHeld: bigint;
    currentPaymentDue: bigint;
    netChangeByChangeOrders: bigint;
    periodThrough: bigint;
    nexusScore: bigint;
    lessPreviousCertifications: bigint;
    architect: string;
    payAppNo: bigint;
    applicationDate: bigint;
    contractNo: string;
    contractor: string;
    lessRetainagePrevious: bigint;
}
export interface RecipientGroup {
    deliveredAt?: bigint;
    packageStatus: string;
    csiDivisions: Array<string>;
    contactIds: Array<bigint>;
    roleTag: string;
    sentAt?: bigint;
    emailAddresses: Array<string>;
    groupName: string;
}
export interface SessionToken {
    id: string;
    title: string;
    clientId: string;
    topicsCovered: Array<string>;
    signaturesRequired: Array<string>;
    attendeeCount: bigint;
    sessionDate: string;
    sessionType: string;
    tokenNumber: bigint;
    signaturesCollected: Array<string>;
    tenantId: string;
    mintedAt: bigint;
    mintedBy: string;
    projectId: string;
    receiptId: string;
    complianceStatus: string;
}
export interface SafetyReceipt {
    id: string;
    completedAt: bigint;
    completedBy: string;
    activityType: string;
    auditHash: string;
    signaturesCollected: Array<string>;
    activityId: string;
    tenantId: string;
    correctiveActionsAssigned: Array<string>;
    projectId: string;
    attendees: Array<string>;
    encryptedPayload: string;
    hazardsIdentified: Array<string>;
    receiptNumber: bigint;
}
export interface SmartContract {
    currentPhase: string;
    active: boolean;
    projectName: string;
    completionTokenId?: string;
    createdAt: bigint;
    createdBy: string;
    csiDivisions: Array<string>;
    contractType: string;
    bidTokenId?: string;
    tenantId: string;
    updatedAt: bigint;
    projectId: string;
    payAppTokenIds: Array<string>;
    awardTokenId?: string;
    contractId: string;
    industry: string;
}
export interface BidScoreOutputShared {
    dimensionScores: Array<[string, bigint]>;
    overallScore: bigint;
    strengths: Array<string>;
    generatedAt: bigint;
    tenantId: string;
    scoreId: string;
    conditions: Array<string>;
    recommendation: string;
    risks: Array<string>;
}
export interface PayApplication__1 {
    id: string;
    totalEarnedLessRetainage: number;
    contractSumToDate: number;
    applicationNumber: bigint;
    lessPreviousCertificates: number;
    generatedAt: bigint;
    originalContractSum: number;
    sovId: string;
    periodEnd: bigint;
    balanceToFinish: number;
    currentPaymentDue: number;
    retainageBalance: number;
    periodStart: bigint;
    totalCompletedAndStored: number;
}
export interface SafetyDocVault {
    id: bigint;
    documentHash: string;
    principalOwner: Principal;
    nexusSafetyScore: number;
    projectId: bigint;
    docType: string;
    uploadedAt: bigint;
}
export interface AgentRecord {
    id: string;
    smsActivationCode: string;
    ownerPrincipal: Principal;
    memoryChunks: Array<{
        content: string;
        role: string;
    }>;
    name: string;
    createdAt: bigint;
    description: string;
    assignedSkills: Array<string>;
    isActive: boolean;
    workspaceScope: Array<string>;
    lastActivityAt: bigint;
}
export interface NexusBidScore {
    pricingFlag: Variant_Premium_BelowMarket_None_Scrutiny;
    pricingUSD: number;
    recommendationRank: bigint;
    benchmarkDelta: number;
    scheduleDays: bigint;
    scheduleRisk: Variant_Low_High_Medium;
    anomalyFlags: Array<string>;
    nexusScore: number;
    bidResponseId: string;
    subPrincipal: Principal;
    confidence: number;
}
export interface InsuranceCoverage {
    verified: boolean;
    perOccurrence: bigint;
    expirationDate: bigint;
    aggregate: bigint;
    carrier: string;
    policyNumber: string;
    coverageType: string;
}
export interface DeepJSAResult {
    completenessScore: number;
    hazards: Array<JSAHazard>;
    nexusFlags: Array<string>;
}
export interface CaseStudy {
    id: string;
    title: string;
    challengeStatement: string;
    scheduleVariancePct: number;
    generatedAt: bigint;
    testimonialTemplate: string;
    qualityScore: number;
    budgetVariancePct: number;
    projectId: string;
    solutionDescription: string;
    buildingType: string;
    scopeSummary: string;
    gcPrincipal: Principal;
}
export interface BidToken {
    status: BidStatus;
    projectName: string;
    projectType: string;
    goNoGoScore: number;
    createdAt: bigint;
    dueDate: bigint;
    gcName: string;
    tenantId: string;
    updatedAt: bigint;
    goNoGoResult?: GoNoGoResult;
    projectWorkspaceId?: string;
    notes: string;
    bidsReceived: Array<BidSubmission>;
    rfqsSent: Array<RFQ>;
    estimatedValue: number;
    scopeOfWork: string;
    awardedTo?: string;
    proposal?: ProposalDocument;
    bidId: string;
    leveledBid?: LeveledBid;
    subInvites: Array<SubInvite>;
    payApps: Array<PayApp>;
    contractValue?: number;
    projectAddress: string;
    goNoGoFactors: Array<GoNoGoFactor>;
}
export interface RecordkeepingStats {
    totalDaysAway: bigint;
    totalDeaths: bigint;
    totalRecordable: bigint;
    trir: bigint;
    totalDaysRestricted: bigint;
    dartRate: bigint;
}
export interface SubstitutionReport {
    generatedAt: bigint;
    recommended: string;
    primaryMaterial: string;
    tenantId: bigint;
    nexusInsight: string;
    category: MaterialCategory;
    reportId: string;
    options: Array<SubstitutionOption>;
    reason: string;
}
export interface AssistantContext {
    userRole?: string;
    activeEngine: ActiveEngine;
    tenantId?: string;
    currentPage: AppPage;
    currentProjectId?: string;
    sessionId: string;
}
export interface ContractRiskClause {
    title: string;
    csiRef?: string;
    clauseId: string;
    oshaRef?: string;
    description: string;
    aiaRef?: string;
    category: string;
    severity: RiskSeverity;
    recommendation: string;
}
export interface LeveledLineItem {
    recommendedSub: string;
    averagePrice: number;
    description: string;
    highestPrice: number;
    scopeGapSubs: Array<string>;
    notes: string;
    csiCode: string;
    lowestPrice: number;
    normalizedPrice: number;
}
export interface OSHA300AEntry {
    signatureTitle: string;
    totalDaysAway: bigint;
    totalHearing: bigint;
    totalPoisoning: bigint;
    totalDeaths: bigint;
    city: string;
    year: bigint;
    totalJobTransfer: bigint;
    naicsCode: string;
    annualAvgEmployees: bigint;
    totalHoursWorked: bigint;
    state: string;
    establishmentName: string;
    totalSkinDisorder: bigint;
    signatureDate: bigint;
    totalInjuries: bigint;
    totalOtherRecordable: bigint;
    totalRespiratory: bigint;
    totalAllOtherIllness: bigint;
}
export interface SupplierRecord {
    region: string;
    categories: Array<MaterialCategory>;
    lastEvaluated: bigint;
    overallScore: bigint;
    responsivenessScore: bigint;
    name: string;
    createdAt: bigint;
    tenantId: bigint;
    contactEmail: string;
    onTimeRate: bigint;
    priceVariancePct: bigint;
    qualityDefectRate: bigint;
    supplierId: string;
    contactPhone: string;
}
export interface BundleConfig {
    id: bigint;
    projectType: string;
    principalOwner: Principal;
    unitCount: bigint;
    createdAt: bigint;
    selectedTrades: Array<string>;
}
export interface CorrectiveAction {
    status: string;
    controlLevel: ControlLevelRef;
    owner: string;
    verifiedDate?: bigint;
    dueDate: bigint;
    description: string;
}
export interface PaymentTerms {
    retainagePercent: bigint;
    scheduledPayments: Array<ScheduledPayment>;
    finalRetentionDays: bigint;
    liquidatedDamagesPerDay: bigint;
    prevailingWage: boolean;
    paymentDays: bigint;
    conditionalRelease: boolean;
    contractValue: bigint;
}
export interface SignatureRecord {
    documentHash: string;
    displayName: string;
    role: string;
    timestamp: bigint;
    signatureProof: string;
    principalId: string;
}
export interface PerceptionOutput {
    recommendations: Array<string>;
    engineId: string;
    confidenceScore: bigint;
    anomalyFlags: Array<AnomalyFlag>;
    findings: Array<Finding>;
    perceptionType: string;
    riskScore: bigint;
}
export interface OSHADocRecord {
    id: string;
    status: OSHADocStatus;
    generatedBy: Principal;
    formData: string;
    tenantId: string;
    projectId: string;
    deliverables: Array<string>;
    timestamp: bigint;
    cplAuditHash: string;
    docType: OSHADocType;
}
export type ActionType = {
    __kind__: "generateDocument";
    generateDocument: null;
} | {
    __kind__: "runNexusSynthesis";
    runNexusSynthesis: null;
} | {
    __kind__: "createSafetyTag";
    createSafetyTag: null;
} | {
    __kind__: "openToolboxSession";
    openToolboxSession: null;
} | {
    __kind__: "lookupOsha";
    lookupOsha: null;
} | {
    __kind__: "custom";
    custom: string;
} | {
    __kind__: "lookupAia";
    lookupAia: null;
} | {
    __kind__: "lookupCsi";
    lookupCsi: null;
} | {
    __kind__: "generateRfi";
    generateRfi: null;
} | {
    __kind__: "createJsa";
    createJsa: null;
} | {
    __kind__: "navigateTo";
    navigateTo: null;
} | {
    __kind__: "runGoNoGo";
    runGoNoGo: null;
} | {
    __kind__: "calculatePayApp";
    calculatePayApp: null;
} | {
    __kind__: "createChangeOrder";
    createChangeOrder: null;
} | {
    __kind__: "analyzeHazard";
    analyzeHazard: null;
};
export interface WeeklyCashFlow {
    payables: number;
    weekNumber: bigint;
    netPosition: number;
    cumulativeNet: number;
    receivables: number;
    weekStart: string;
}
export interface SMSResult {
    messageId: string;
    bhxWorkerId: string;
    deliveryStatus: DeliveryStatus;
    cplAuthResult: boolean;
    httpStatusCode?: bigint;
    toNumber: string;
}
export interface TenantChatMessage {
    id: string;
    model?: string;
    userRole: string;
    content: string;
    userId: string;
    role: string;
    tokens?: bigint;
    pageContext: string;
    userPrincipal: string;
    timestamp: bigint;
    sessionId: string;
}
export interface PSIEPerceptionFinding {
    findingId: string;
    description: string;
    sourceData: string;
    category: string;
    severity: bigint;
    confidence: bigint;
}
export interface EvidenceAlignment {
    reputationScore: number;
    alignmentScore: number;
    capacityScore: number;
    riskFlags: Array<string>;
    calculatedAt: bigint;
    safetyScore: number;
    bidId: string;
    financialScore: number;
    evidenceSources: Array<string>;
}
export interface ScheduledPayment {
    dueDate?: bigint;
    description: string;
    milestoneId: string;
    amount: bigint;
    percentComplete: bigint;
}
export interface RfqRecord {
    status: RfqStatus;
    lineItems: Array<RfqLineItem>;
    title: string;
    createdAt: bigint;
    dueDate: bigint;
    tenantId: bigint;
    updatedAt: bigint;
    projectId: string;
    notes: string;
    invitedSuppliers: Array<string>;
    rfqId: string;
}
export interface PSIEPerceptionOutput {
    recommendations: Array<string>;
    engineId: string;
    confidenceScore: bigint;
    anomalyFlags: Array<PSIEAnomalyFlag>;
    findings: Array<PSIEPerceptionFinding>;
    perceptionType: string;
    riskScore: bigint;
}
export interface MessageRecord {
    id: string;
    protocol: MessageProtocol;
    content: string;
    bhxWorkerId: string;
    readReceiptAt?: bigint;
    deliveryStatus: DeliveryStatus;
    cplAuthResult: boolean;
    timestamp: bigint;
    recipientId: string;
    senderId: string;
}
export interface ProtocolEntry {
    id: bigint;
    title: string;
    tags: Array<string>;
    lastUpdated: string;
    description: string;
    downloadUrl: string;
    keyRequirements: Array<string>;
    category: string;
    sections: Array<string>;
}
export interface SafetyAnalysisOutputShared {
    cultureScore: bigint;
    predictedIncidentProb30d: number;
    recommendations: Array<string>;
    enterpriseSummary: string;
    tenantId: string;
    stopWorkRequired: boolean;
    analysedAt: bigint;
    projectId: string;
    analysisId: string;
    hazardCount: bigint;
    overallRiskScore: bigint;
    riskLevel: string;
    engines: Array<string>;
}
export interface PayAppTokenRecord {
    materialsStored: bigint;
    periodFrom: bigint;
    cplChecks: Array<CPLCheckResult>;
    allLienWaiversSigned: boolean;
    payAppNumber: bigint;
    tokenId: string;
    metadata: string;
    kind: TokenKind;
    createdAt: bigint;
    createdBy: string;
    tenantId: string;
    updatedAt: bigint;
    state: TokenState;
    projectId: string;
    retainageHeld: bigint;
    workCompleted: bigint;
    currentPaymentDue: bigint;
    lienWaivers: Array<LienWaiverRef>;
    periodTo: bigint;
    scheduledValue: bigint;
    approvalChainComplete: boolean;
    awardTokenId: string;
    approvals: Array<ApprovalRecord>;
}
export interface DeliveryLog {
    status: DeliveryStatus;
    messageId: string;
    attempt: bigint;
    httpStatusCode?: bigint;
    timestamp: bigint;
}
export interface PunchListResult {
    closeoutDocs: Array<string>;
    inspectionCheckpoints: Array<string>;
    totalItems: bigint;
    itemsByScope: Array<string>;
    priorityItems: Array<string>;
}
export interface MaterialQuery {
    brand?: string;
    maxCost?: number;
    minSustainabilityRating?: bigint;
    materialType?: MaterialType;
}
export interface ApprovalRecord {
    signature: string;
    tokenId: string;
    approvalId: string;
    signedAt?: bigint;
    approverName: string;
    approverRole: string;
    approved: boolean;
    comments: string;
}
export interface CRMProjectRecord {
    id: bigint;
    completedAt: bigint;
    nexusRelationshipImpact: number;
    projectType: string;
    scheduledDays: bigint;
    gcName: string;
    scopesPerformed: Array<string>;
    qualityScore: number;
    actualDays: bigint;
    occupiedRenovation: boolean;
    contractValueUSD: number;
    repeatBusiness: boolean;
}
export interface JSADailyRecord {
    completedAt?: bigint;
    completedBy?: string;
    date: string;
    jsaId?: string;
    taskTypes: Array<string>;
    tenantId: string;
    crewId: string;
    perceptionScore: bigint;
    projectId: string;
    crewName: string;
    riskLevel: string;
    jsaCompleted: boolean;
}
export interface OshaHazard {
    ppe: Array<string>;
    title: string;
    subpart: string;
    regulation: string;
    controls: Array<string>;
    description: string;
}
export interface FFEBudgetResult {
    laborMax: bigint;
    laborMin: bigint;
    totalMax: bigint;
    totalMin: bigint;
    materialMax: bigint;
    materialMin: bigint;
    perRoomMax: bigint;
    perRoomMin: bigint;
}
export interface ExcelSheet {
    pivotHint?: string;
    rows: Array<Array<string>>;
    sheetName: string;
    hasTotals: boolean;
    columns: Array<ExcelColumn>;
}
export interface CplAuditEntry {
    principal: string;
    action: string;
    timestamp: bigint;
    passed: boolean;
}
export interface OSHA300Entry {
    daysRestricted: bigint;
    employeeName: string;
    descriptionOfInjury: string;
    jobTitle: string;
    injuryType: OSHA300InjuryType;
    caseNo: string;
    whereOccurred: string;
    daysAway: bigint;
    dateOfInjury: string;
    classify: OSHA300Classification;
}
export interface ComplianceSummary {
    criticalRiskCount: bigint;
    overdueCrews: bigint;
    totalCrews: bigint;
    compliantCrews: bigint;
    trendByDay: Array<DayTrend>;
    compliancePercent: bigint;
}
export interface ActivityFeedItem {
    id: string;
    title: string;
    description: string;
    tenantId: bigint;
    projectId: string;
    timestamp: bigint;
    itemType: string;
    route: string;
}
export interface LienWaiverRef {
    waiverType: string;
    claimant: string;
    tier: string;
    throughDate: bigint;
    state: string;
    signedAt?: bigint;
    waiverId: string;
}
export interface VirtualDocument {
    id: string;
    originalFileName: string;
    ownerPrincipal: Principal;
    createdAt: bigint;
    templateVersion: string;
    agentGrantedPrincipals: Array<Principal>;
    updatedAt: bigint;
    parsedSections: Array<{
        sectionName: string;
        sectionContent: string;
    }>;
    docType: Variant_rfi_closeoutPackage_submittal_contract_invoice_estimate_punchList_scopeLetter;
}
export interface GenerateInviteRequest {
    expiresAt: bigint;
    tenantId: TenantId;
    maxUses: bigint;
    roles: Array<Role>;
}
export interface OSHAInspection {
    closeDate: string;
    naicsCode: string;
    state: string;
    establishmentName: string;
    severity: string;
    inspectionId: string;
    openDate: string;
    violationCount: bigint;
}
export type STResult_2 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface ContractRiskReport {
    riskClauses: Array<ContractRiskClause>;
    overallScore: bigint;
    generatedAt: bigint;
    contractType: string;
    tenantId: bigint;
    overallRisk: RiskSeverity;
    projectId: string;
    nexusInsight: string;
    reportId: string;
}
export interface BidTokenRecord {
    cplChecks: Array<CPLCheckResult>;
    tokenId: string;
    metadata: string;
    kind: TokenKind;
    createdAt: bigint;
    createdBy: string;
    tenantId: string;
    updatedAt: bigint;
    state: TokenState;
    projectId: string;
    bidId: string;
    approvals: Array<ApprovalRecord>;
}
export interface BundleResult {
    sequenceOrder: Array<string>;
    crewSizeRecommendation: bigint;
    nexusConfidence: number;
    estimatedCostUSD: number;
    recommendedTrades: Array<string>;
    estimatedDays: bigint;
    conflictFlags: Array<string>;
}
export interface SubWorkspaceView {
    sub: Principal;
    punchItems: Array<PunchItem>;
    dailyLogs: Array<DailyLog>;
    rfis: Array<RFI>;
    submittals: Array<SubmittalPackage>;
    projectId: bigint;
    performance?: SubScore;
    scopeItems: Array<ScopeItem__1>;
}
export interface OSHAViolation {
    penaltyAmount: number;
    description: string;
    gravity: string;
    abatementDate: string;
    violationId: string;
    inspectionId: string;
    standard: string;
}
export interface SSSPResult {
    approvedAt?: bigint;
    ssspId: string;
    approved: boolean;
    rejectedAt?: bigint;
    notes: string;
    deficiencies: Array<string>;
}
export interface RetainageReleaseSchedule {
    reducedRate?: bigint;
    netHeld: bigint;
    createdAt: bigint;
    heldToDate: bigint;
    tenantId: bigint;
    releases: Array<RetainageReleaseEvent>;
    updatedAt: bigint;
    projectId: string;
    retainageRate: bigint;
    contractAmount: bigint;
    releasedToDate: bigint;
    triggers: Array<RetainageReleaseTrigger>;
}
export interface ScopeEstimateResult {
    crewMax: bigint;
    crewMin: bigint;
    complexityScore: bigint;
    durationMax: bigint;
    durationMin: bigint;
    costMax: bigint;
    costMin: bigint;
}
export interface Comment {
    id: bigint;
    text: string;
    authorName: string;
    authorRole: string;
    tenantId: string;
    author: Principal;
    timestamp: bigint;
    replyToId?: bigint;
    editedAt?: bigint;
    mediaId: string;
}
export type PRO1Result = {
    __kind__: "ok";
    ok: PRO1Response;
} | {
    __kind__: "err";
    err: string;
};
export interface Annotation {
    id: bigint;
    oshaRef?: string;
    color: string;
    authorName: string;
    tenantId: string;
    author: Principal;
    timestamp: bigint;
    annotationType: AnnotationType;
    annotationLabel?: string;
    mediaId: string;
    coordinates: Array<number>;
}
export interface PhaseRecommendation {
    currentPhase: LifecyclePhase;
    nexusConfidence: number;
    thresholdMet: boolean;
    recommendedPhase?: LifecyclePhase;
    rationale: string;
}
export interface ConsolidatedPrimeApplication {
    gcSelfPerformAmount: bigint;
    lienWaiverChecklist: Array<LienWaiverCheckItem>;
    subApplications: Array<SubPayApplication>;
    generatedAt: bigint;
    primeAppId: string;
    tenantId: bigint;
    primePayAppNo: bigint;
    totalApplicationAmount: bigint;
    blockedSubCount: bigint;
    projectId: string;
    allLienWaiversReceived: boolean;
    currentPaymentDue: bigint;
    nexusInsight: string;
    periodThrough: bigint;
    totalSubAmount: bigint;
    gcRetainage: bigint;
    totalSubRetainage: bigint;
    totalRetainageHeld: bigint;
}
export interface ChangeOrder__1 {
    status: ChangeOrderStatus__2;
    impact: ChangeOrderImpact;
    totalTmCost: bigint;
    tmEntries: Array<TmEntry>;
    owner: string;
    approvedAt?: bigint;
    createdAt: bigint;
    submittedAt?: bigint;
    description: string;
    tenantId: bigint;
    riskFlags: Array<string>;
    aiaRef: string;
    projectId: string;
    nexusScore: bigint;
    coType: ChangeOrderType;
    initiatedBy: string;
    architect: string;
    changeOrderId: string;
    contractNo: string;
    contractor: string;
    coNumber: bigint;
    reason: string;
}
export interface IncidentPrediction {
    nexusConfidence: number;
    bhxWorkerId: string;
    incidentProbabilityPct: number;
    likelyIncidentTypes: Array<string>;
    preventionActions: Array<{
        action: string;
        impactReduction: number;
    }>;
}
export interface ToolboxSession {
    id: string;
    status: string;
    trade: string;
    topicsCovered: Array<string>;
    sessionDate: bigint;
    sieScore: bigint;
    audioRef?: string;
    tenantId: string;
    projectId: string;
    annotations: Array<SessionAnnotation>;
    attendees: Array<string>;
    complianceCertificate?: ComplianceCert;
    videoRef?: string;
    conductor: string;
}
export interface EvidenceAlignmentScore {
    scoredAt: bigint;
    subject: string;
    alignmentScore: bigint;
    evidenceItems: Array<EvidenceItem>;
    tenantId: bigint;
    scoreId: string;
    discrepancies: Array<string>;
    projectId: string;
    auditTrail: string;
}
export interface SubScore {
    avgRFIResolutionDays: number;
    overallScore: number;
    openPunchItems: bigint;
    onTimeSubmittalRate: number;
    subPrincipal: Principal;
    costPredictabilityScore: number;
}
export type SMResult_3 = {
    __kind__: "ok";
    ok: MediaCorrectiveAction;
} | {
    __kind__: "err";
    err: string;
};
export interface SharedReportResponse {
    report: ProjectReport;
    results: Array<SavedToolResult>;
}
export type ModelsResult = {
    __kind__: "ok";
    ok: Array<GroqModelConfig>;
} | {
    __kind__: "err";
    err: string;
};
export interface Material3D {
    id: string;
    roughness: number;
    costPerUnit: number;
    name: string;
    metalness: number;
    colorHex: string;
    category: string;
    textureUrl: string;
}
export interface SubPerformanceRecord {
    period: string;
    rfiAvgResponseDays: bigint;
    evaluatedAt: bigint;
    evaluatedBy: Principal;
    tenantId: bigint;
    scheduleScore: bigint;
    qualityScore: bigint;
    subId: string;
    projectId: string;
    deficiencyCount: bigint;
    notes: string;
    safetyScore: bigint;
    incidentCount: bigint;
    recordId: string;
    compositeScore: bigint;
    communicationScore: bigint;
    rfiCount: bigint;
    submittalReturnCount: bigint;
    cleanupScore: bigint;
}
export interface ExtendedTemplateMeta {
    regulatoryRefs: Array<string>;
    nameEs: string;
    industryNotesEs: string;
    descriptionEs: string;
    templateId: string;
    maxPages: bigint;
    vertical: IndustryVertical;
    hasExcelExport: boolean;
    minPages: bigint;
    requiredForms: Array<string>;
    industryNotes: string;
    signaturesNeeded: bigint;
}
export interface SchedulePrediction {
    criticalPathActivities: Array<ActivityId>;
    baselineDays: bigint;
    resourceConflicts: Array<string>;
    createdAt: bigint;
    predictedDays: bigint;
    tenantId: TenantId;
    confidenceScore: bigint;
    productivityDelta: number;
    projectId: ProjectId;
    slackAlerts: Array<string>;
}
export interface EngineWorkItem {
    data: string;
    outputType: string;
    success: boolean;
    durationMs: bigint;
    engineName: string;
}
export interface CultureLeadingIndicator {
    trend: string;
    value: number;
    type: string;
    benchmarkComparison: string;
}
export interface RetainageReleaseEvent {
    trigger: RetainageReleaseTrigger;
    approvedBy?: string;
    amountReleased: bigint;
    releaseId: string;
    releasedAt: bigint;
    payAppNo?: bigint;
    percentCompleteAtRelease: bigint;
}
export interface ProjectPipelineRow {
    completionPct: bigint;
    projectName: string;
    scheduleVarianceDays: bigint;
    clientName: string;
    budgetCents: bigint;
    lastActivity: bigint;
    openChangeOrders: bigint;
    spentCents: bigint;
    cpiScore: bigint;
    budgetVariancePct: bigint;
    phaseLabel: string;
    projectId: string;
    safetyScore: bigint;
    phase: ProjectPhase__1;
    openHazards: bigint;
    riskLevel: string;
    spiScore: bigint;
    openRfis: bigint;
}
export interface CostCodeSummary {
    costCode: CostCode;
    variance: bigint;
    committed: bigint;
    projectedFinal: bigint;
    budgeted: bigint;
    actualCost: bigint;
    percentSpent: bigint;
}
export interface SafetyToolRecord {
    id: string;
    status: SafetyToolStatus;
    principal: Principal;
    formData: string;
    tenantId: string;
    perceptionResult: string;
    projectId: string;
    timestamp: bigint;
    toolType: SafetyToolType;
}
export interface ToolResultRecord {
    result: string;
    principal: Principal;
    projectId: string;
    timestamp: bigint;
    toolName: string;
}
export interface PurchaseOrder {
    status: LongLeadStatus;
    lineItems: Array<POLineItem>;
    deliveryAddress: string;
    supplierName: string;
    poId: string;
    tenantId: bigint;
    loiId?: string;
    updatedAt: bigint;
    requiredDate: bigint;
    projectId: string;
    totalAmount: bigint;
    issuedAt: bigint;
    poNumber: string;
    supplierId: string;
}
export interface JSAHazard {
    ppe: Array<string>;
    probability: string;
    controls: Array<string>;
    osha1926Reference: string;
    hazardName: string;
    severity: string;
}
export interface MintTokenInput {
    title: string;
    clientId: string;
    topicsCovered: Array<string>;
    signaturesRequired: Array<string>;
    attendeeCount: bigint;
    sessionDate: string;
    sessionType: string;
    tenantId: string;
    mintedBy: string;
    projectId: string;
    receiptId: string;
}
export interface DavisBaconRecord {
    trade: string;
    fringeBenefits: number;
    state: string;
    determinationId: string;
    county: string;
    wageRate: number;
    effectiveDate: string;
}
export interface DocumentResult {
    id: string;
    status: DocumentStatus;
    templateId: string;
    metadata: DocumentMetadata;
    generatedAt: bigint;
    generationHash: string;
    templateName: string;
    tenantId: string;
    fieldsTotal: bigint;
    fieldsFilled: bigint;
    sections: Array<DocumentSection>;
    pageCount: bigint;
}
export interface OSHA301Entry {
    dob: string;
    zip: string;
    dateHired: string;
    completedBy: string;
    daysRestricted: bigint;
    completionDate: bigint;
    employeeName: string;
    namePhysician: string;
    injuryIllnessDescription: string;
    city: string;
    timeOfEvent: string;
    objectSubstance: string;
    whatEmployeeDoing: string;
    state: string;
    facilityTreated: string;
    gender: string;
    injuryType: InjuryType;
    caseNo: bigint;
    howInjuryOccurred: string;
    emergencyRoom: boolean;
    hospitalized: boolean;
    daysAway: bigint;
    dateOfInjury: bigint;
    streetAddress: string;
}
export interface MaterialLibraryEntry {
    id: MaterialLibraryId;
    costPerUnit: number;
    name: string;
    color: string;
    unit: string;
    finish: string;
    brand: string;
    sustainabilityRating: bigint;
    materialType: MaterialType;
}
export interface CloseoutRecord {
    id: bigint;
    finalInvoicesReviewed: boolean;
    allSubmittalsApproved: boolean;
    allPunchesResolved: boolean;
    finalScheduleDays: bigint;
    finalCost: number;
    finalizedBy: Principal;
    projectId: bigint;
    signOffDate: bigint;
}
export type AppPage = {
    __kind__: "rfi";
    rfi: null;
} | {
    __kind__: "documents";
    documents: null;
} | {
    __kind__: "safety";
    safety: null;
} | {
    __kind__: "jsaGenerator";
    jsaGenerator: null;
} | {
    __kind__: "commandCenter";
    commandCenter: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "home";
    home: null;
} | {
    __kind__: "changeOrder";
    changeOrder: null;
} | {
    __kind__: "toolbox";
    toolbox: null;
} | {
    __kind__: "design";
    design: null;
} | {
    __kind__: "bidconnect";
    bidconnect: null;
} | {
    __kind__: "documents_dge";
    documents_dge: null;
} | {
    __kind__: "workspace";
    workspace: null;
} | {
    __kind__: "financials";
    financials: null;
} | {
    __kind__: "safetyTags";
    safetyTags: null;
} | {
    __kind__: "payApp";
    payApp: null;
};
export interface ThinkOutput {
    ollamaAligned: boolean;
    originalMessage: string;
    planSummary: string;
    requiresEngine: boolean;
    alignmentNotes: string;
    language: string;
    engineSequence: Array<string>;
    intentClass: IntentClass;
    confidence: Confidence;
}
export type STResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface VEProposal {
    subName: string;
    qualityImpact: string;
    veId: string;
    submittedAt: bigint;
    costSavings: bigint;
    description: string;
    reviewedAt?: bigint;
    tenantId: bigint;
    scheduleSavingsDays: bigint;
    approvalStatus: Variant_approved_rejected_proposed;
    subId: string;
    projectId: string;
    nexusInsight: string;
    csiDivision: string;
}
export type ProjectId = string;
export interface FIEPerceptionOutput {
    recommendations: Array<string>;
    engineId: string;
    confidenceScore: bigint;
    anomalyFlags: Array<FIEAnomalyFlag>;
    findings: Array<FIEPerceptionFinding>;
    perceptionType: string;
    riskScore: bigint;
}
export interface CreateReceiptInput {
    completedBy: string;
    activityType: string;
    signaturesCollected: Array<string>;
    activityId: string;
    tenantId: string;
    correctiveActionsAssigned: Array<string>;
    projectId: string;
    attendees: Array<string>;
    hazardsIdentified: Array<string>;
}
export interface CSIFormRecord {
    id: string;
    status: CSIFormStatus;
    generatedBy: Principal;
    formData: string;
    formType: CSIFormType;
    tenantId: string;
    projectId: string;
    deliverables: Array<string>;
    timestamp: bigint;
}
export interface AwardRecord {
    id: string;
    awardedSub: Principal;
    leadId: string;
    awardedAt: bigint;
    awardedAmount: number;
    subcontractRef: string;
    packageId: string;
}
export interface VHDEStats {
    totalAnalyses: bigint;
    lastAnalysisAt: bigint;
    totalDetections: bigint;
    avgRiskScore: bigint;
}
export interface AlignmentViolation {
    remediation: string;
    riskCategory: RiskCategory;
    description: string;
    regulationRef: string;
    citations: Array<Citation>;
    severity: PunchSeverity;
}
export interface MediaAsset {
    id: string;
    analysisStatus: AnalysisStatus;
    principal: Principal;
    uploaderName: string;
    uploaderRole: string;
    vhdeResult?: VHDEAnalysisResult;
    mimeType: string;
    fileSize: bigint;
    uploadTimestamp: bigint;
    tenantId: string;
    commentCount: bigint;
    mediaType: MediaType;
    sessionId: string;
    annotationCount: bigint;
    linkedTagId?: bigint;
    objectStorageUrl: string;
    correctiveActionId?: bigint;
}
export interface CostEstimateResult {
    laborMax: bigint;
    laborMin: bigint;
    contingency: bigint;
    totalMax: bigint;
    totalMin: bigint;
    materialMax: bigint;
    materialMin: bigint;
    marginPercent: bigint;
}
export interface AuditEntry {
    id: string;
    decision: string;
    inputSummary: string;
    reasoning: string;
    confidenceScore: number;
    timestamp: bigint;
    modelUsed: string;
    caller: Principal;
    alignmentStatus: AlignmentStatus;
    evidenceChain: Array<Citation>;
    engine: string;
}
export interface WrittenSafetyProgram {
    trainingRequired: Array<string>;
    oshaCfr: string;
    name: string;
    responsibleParty: string;
    scope: string;
    shortCode: string;
    sections: Array<ProgramSection>;
    programId: bigint;
    reviewFrequency: string;
    purpose: string;
}
export interface SubSafetyIntakeRecord {
    emr: number;
    subName: string;
    tradeType: string;
    osha300LogYears: Array<bigint>;
    trirTrend: Array<number>;
    submittedAt: bigint;
    tenantId: string;
    writtenSafetyProgram: boolean;
    dartTrend: Array<number>;
    ssspSubmitted: boolean;
    citations: Array<string>;
}
export interface AnomalyFlag {
    flagId: string;
    description: string;
    recommendedAction: string;
    severity: bigint;
    perceptionType: string;
}
export interface SafetyScoreResult {
    strengths: Array<string>;
    improvements: Array<string>;
    trendDirection: string;
    score: bigint;
    grade: string;
}
export interface TagDashboardSummary {
    recentActivityCount: bigint;
    overdueCorrectiveActions: bigint;
    flaggedTags: bigint;
    totalTags: bigint;
    resolvedToday: bigint;
    openTags: bigint;
    criticalTags: bigint;
}
export interface CompanyProfile {
    zip: string;
    safetyOfficerEmail: string;
    insuranceProvider: string;
    superintendentName: string;
    city: string;
    createdAt: bigint;
    emergencyContact: string;
    insurancePolicyNumber: string;
    safetyOfficerName: string;
    safetyOfficerPhone: string;
    email: string;
    website: string;
    tenantId: string;
    updatedAt: bigint;
    state: string;
    companyName: string;
    licenseNumber: string;
    phone: string;
    emergencyPhone: string;
    companyAddress: string;
    principalId: Principal;
}
export interface DocumentTemplate {
    estimatedPages: bigint;
    templateId: string;
    isPackage: boolean;
    name: string;
    tags: Array<string>;
    officialForm?: string;
    lastUpdated: string;
    description: string;
    version: string;
    requiredRole?: string;
    category: DocumentCategory;
    sections: Array<DocumentSection>;
    subTemplates: Array<string>;
    industry: IndustryCategory;
}
export interface PunchListItem {
    itemId: string;
    trade: string;
    assignedTo: string;
    description: string;
    cleared: boolean;
    clearedAt?: bigint;
}
export interface ChangeOrderItem {
    equipmentCost: number;
    totalCost: number;
    description: string;
    scheduleDays: bigint;
    csiCode: string;
    markup: number;
    laborCost: number;
    materialCost: number;
}
export interface GCRelationship {
    contactName: string;
    avgMarginPct: number;
    city: string;
    onTimeDeliveryRate: number;
    healthTrend: HealthTrend;
    email: string;
    disputeCount: bigint;
    relationshipScore: number;
    state: string;
    avgQualityScore: number;
    companyName: string;
    lastProjectDate: bigint;
    phone: string;
    totalRevenue: number;
    projectsCompleted: bigint;
    gcPrincipal: Principal;
}
export type IntentClass = {
    __kind__: "jsa";
    jsa: {
        trade: string;
        task: string;
    };
} | {
    __kind__: "conversation";
    conversation: null;
} | {
    __kind__: "safetyAnalysis";
    safetyAnalysis: null;
} | {
    __kind__: "costEstimate";
    costEstimate: {
        projectType: string;
        sqFt: number;
    };
} | {
    __kind__: "nexus";
    nexus: null;
} | {
    __kind__: "document";
    document: {
        templateType: string;
    };
} | {
    __kind__: "teamChatHistory";
    teamChatHistory: null;
} | {
    __kind__: "projectStatus";
    projectStatus: null;
} | {
    __kind__: "oshaLookup";
    oshaLookup: {
        searchText: string;
    };
} | {
    __kind__: "aiaLookup";
    aiaLookup: {
        formNumber: string;
    };
} | {
    __kind__: "csiLookup";
    csiLookup: {
        division: string;
    };
} | {
    __kind__: "payApp";
    payApp: {
        projectId: string;
    };
} | {
    __kind__: "bidScore";
    bidScore: null;
};
export interface CsiLineItem {
    tradeType: string;
    laborHours: number;
    unit: string;
    division: bigint;
    totalCost: number;
    description: string;
    unitLaborCost: number;
    unitMaterial: number;
    quantity: number;
    csiCode: string;
    regionalFactor: number;
}
export interface RFPRecord {
    status: BidOpportunityStatus;
    projectName: string;
    owner: string;
    createdAt: bigint;
    dueDate: bigint;
    awardCriteria: string;
    scopeNarrative: string;
    tenantId: bigint;
    updatedAt: bigint;
    evaluationCriteria: Array<string>;
    projectId: string;
    submissionRequirements: Array<string>;
    rfpId: string;
}
export interface GroqKeyStatus {
    lastUpdated: bigint;
    configured: boolean;
    keyPreview: string;
}
export interface EscalationFlag {
    windowHours: bigint;
    oshaPhone: string;
    immediateActions: Array<string>;
    required: boolean;
    guidance: string;
}
export type SMResult_2 = {
    __kind__: "ok";
    ok: VHDEAnalysisResult | null;
} | {
    __kind__: "err";
    err: string;
};
export type GroqKeyValidation = {
    __kind__: "ok";
    ok: {
        model: string;
        response: string;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface CommandCenterData {
    safety: SafetyMetrics;
    alerts: Array<AnomalyAlert>;
    compliance: ComplianceMetrics;
    generatedAt: bigint;
    pipeline: Array<ProjectPipelineRow>;
    role: ViewRole;
    tenantId: bigint;
    summary: ExecutiveSummary;
    financial: FinancialMetrics;
    activity: Array<ActivityLogEntry>;
}
export interface AIAgentRecord {
    id: bigint;
    bio: string;
    field: string;
    useCases: Array<string>;
    name: string;
    specialty: string;
}
export interface InviteLinkPublic {
    id: InviteId;
    useCount: bigint;
    active: boolean;
    expiresAt: bigint;
    createdAt: bigint;
    tenantId: TenantId;
    maxUses: bigint;
    roles: Array<Role>;
}
export type UsageStatsResult = {
    __kind__: "ok";
    ok: Array<UsageStat>;
} | {
    __kind__: "err";
    err: string;
};
export type STResult_1 = {
    __kind__: "ok";
    ok: TagInvite;
} | {
    __kind__: "err";
    err: string;
};
export interface ProjectSubmissions {
    punchItems: Array<PunchItem>;
    dailyLogs: Array<DailyLog>;
    changeOrders: Array<ChangeOrder>;
    rfis: Array<RFI>;
    submittals: Array<SubmittalPackage>;
    closeout?: CloseoutRecord;
    scopeItems: Array<ScopeItem__1>;
}
export interface ProjectRiskEntry {
    region: string;
    trade: string;
    projectName: string;
    projectId: string;
    riskLevel: string;
    incidentRate: number;
}
export type DesignVersionId = bigint;
export type FurnitureModelId = bigint;
export type DesignApprovalId = bigint;
export interface OSHASubpart {
    title: string;
    hazardCategories: Array<FocusFourCategory>;
    subpart: string;
    description: string;
    ppeRequirements: Array<string>;
    controlMeasures: Array<string>;
    citationReference: string;
    cfrRange: string;
    sections: Array<SubpartSection>;
    penaltyPerViolation: bigint;
}
export interface LienWaiver {
    status: LienWaiverStatus;
    signedByTitle: string;
    subName: string;
    payAppNumber: bigint;
    waiverType: LienWaiverType;
    signedByName: string;
    throughDate: bigint;
    waiverId: string;
    receivedAt?: bigint;
    notes: string;
    bidId: string;
    amount: number;
}
export interface ScopeGapResult {
    bhxWorkerId: string;
    riskFlags: Array<string>;
    submittedItems: Array<string>;
    templateItems: Array<string>;
    recommendation: string;
    missingItems: Array<string>;
    coveragePct: number;
}
export interface SiteVisitLog {
    createdAt: bigint;
    visitDate: bigint;
    siteConditions: string;
    tenantId: bigint;
    projectId: string;
    notes: string;
    visitId: string;
    attendees: Array<string>;
    accessRequirements: string;
    photos: Array<string>;
}
export interface PipelineDeal {
    id: string;
    probability: number;
    projectName: string;
    createdAt: bigint;
    stage: PipelineStage;
    estimatedValue: number;
    nextAction: string;
    gcPrincipal: Principal;
}
export type DesignProjectId = bigint;
export interface CPLLawStatus {
    lawName: string;
    threshold: number;
    compliant: boolean;
    verdict: string;
    lastValue: number;
}
export interface CrewDispatchResult {
    logistics: Array<string>;
    estimatedTravelCostMax: bigint;
    estimatedTravelCostMin: bigint;
    lodgingNightsPerPerson: bigint;
    travelHours: bigint;
    recommendedMobilizationDays: bigint;
}
export interface BidScopeGap {
    description: string;
    severity: string;
    estimatedCost: bigint;
    csiDivision: string;
}
export type InviteId = string;
export type MaterialLibraryId = bigint;
export interface NextBestAction {
    actionType: string;
    reasoning: string;
    priority: bigint;
    recommendation: string;
    confidence: number;
    gcPrincipal: Principal;
}
export interface PlatformContext {
    userRole: string;
    userId: string;
    tenantId: string;
    language: string;
    currentPage: string;
    cashFlowStatus?: string;
    projectId?: string;
    safetyScore?: bigint;
    sessionId: string;
    activeHazards: bigint;
    activeBids: bigint;
}
export interface NearMissHealthResult {
    status: string;
    recordables: bigint;
    nearMisses: bigint;
    recommendation: string;
    interpretation: string;
    ratio: number;
}
export interface ScopeAnalysis {
    id: string;
    projectType: string;
    recommendations: Array<string>;
    createdAt: bigint;
    alignmentScore: bigint;
    tenantId: TenantId;
    totalEstimate: number;
    projectId: ProjectId;
    sections: Array<ScopeSection>;
    gapItems: Array<string>;
}
export interface BidLevelingResult {
    lowestBid: bigint;
    recommendedBid: string;
    highestBid: bigint;
    warnings: Array<string>;
    comparisonMatrix: Array<string>;
    spread: bigint;
    completestBid: string;
}
export interface PrincipalAuthStatus {
    lastActivity: bigint;
    authorityLevel: bigint;
    authenticated: boolean;
}
export interface DocumentSection {
    order: bigint;
    sectionName: string;
    isPageBreak: boolean;
    description?: string;
    fields: Array<DocumentField>;
    sectionId: string;
}
export type ActivityId = string;
export interface TenantPublic {
    id: TenantId;
    active: boolean;
    name: string;
    createdAt: bigint;
    plan: TenantPlan;
    slug: string;
    industry: string;
}
export interface ProtocolTemplate {
    title: string;
    templateType: string;
    sections: Array<TemplateSectionDef>;
}
export type ContextResult = {
    __kind__: "ok";
    ok: AssistantContext;
} | {
    __kind__: "err";
    err: string;
};
export interface RenovationPhaseResult {
    phaseSchedule: Array<string>;
    recommendedBuffer: bigint;
    daysPerPhase: bigint;
    totalDays: bigint;
    criticalConstraints: Array<string>;
    totalPhases: bigint;
}
export enum AIADocStatus {
    Distributed = "Distributed",
    Generated = "Generated",
    Draft = "Draft",
    Archived = "Archived",
    Signed = "Signed"
}
export enum AIAFormType {
    A101 = "A101",
    A305 = "A305",
    A310 = "A310",
    A401 = "A401",
    G701 = "G701",
    G702 = "G702",
    G703 = "G703",
    G704 = "G704",
    G714 = "G714",
    G716 = "G716",
    G901 = "G901",
    G902 = "G902",
    G903 = "G903",
    G904 = "G904"
}
export enum ActiveEngine {
    dge = "dge",
    fie = "fie",
    sie = "sie",
    erae = "erae",
    none = "none",
    psie = "psie",
    scie = "scie",
    vhde = "vhde",
    nexus = "nexus"
}
export enum ActivitySource {
    documents = "documents",
    safety = "safety",
    compliance = "compliance",
    bidConnect = "bidConnect",
    platform = "platform",
    design = "design",
    workspace = "workspace",
    financials = "financials",
    tenant = "tenant"
}
export enum ActivityStatus {
    notStarted = "notStarted",
    delayed = "delayed",
    blocked = "blocked",
    complete = "complete",
    inProgress = "inProgress"
}
export enum AlertLevel {
    Info = "Info",
    Critical = "Critical",
    Warning = "Warning"
}
export enum AlertSeverity {
    warning = "warning",
    info = "info",
    critical = "critical",
    emergencyAction = "emergencyAction"
}
export enum AnnotationType {
    draw = "draw",
    mark = "mark",
    highlight = "highlight"
}
export enum BidLeadStatus {
    Lost = "Lost",
    NoGo = "NoGo",
    Awarded = "Awarded",
    Active = "Active"
}
export enum BidOpportunityStatus {
    closed = "closed",
    cancelled = "cancelled",
    noGo = "noGo",
    open = "open",
    awarded = "awarded",
    preBid = "preBid"
}
export enum BidStatus {
    ITB = "ITB",
    Leveling = "Leveling",
    Lead = "Lead",
    Awarded = "Awarded",
    SiteWalk = "SiteWalk",
    Closeout = "Closeout",
    GoNoGo = "GoNoGo",
    Bidding = "Bidding",
    Contracted = "Contracted",
    Construction = "Construction"
}
export enum BidStatus__2 {
    Closed = "Closed",
    Draft = "Draft",
    Published = "Published"
}
export enum BodyPart {
    Arm = "Arm",
    Eye = "Eye",
    Leg = "Leg",
    Toe = "Toe",
    Back = "Back",
    Foot = "Foot",
    Hand = "Hand",
    Head = "Head",
    Knee = "Knee",
    Neck = "Neck",
    MultipleBodyParts = "MultipleBodyParts",
    Finger = "Finger",
    Other = "Other",
    Chest = "Chest"
}
export enum CRMPipelineStage {
    Won = "Won",
    Lost = "Lost",
    Prospect = "Prospect",
    Qualified = "Qualified",
    Proposal = "Proposal",
    Negotiation = "Negotiation"
}
export enum CSIFormStatus {
    Closed = "Closed",
    Active = "Active",
    Draft = "Draft",
    Archived = "Archived"
}
export enum CSIFormType {
    LeadTimeTracker = "LeadTimeTracker",
    SubstitutionRequest = "SubstitutionRequest",
    MeetingMinutes = "MeetingMinutes",
    ContingencyLog = "ContingencyLog",
    FinalInspectionReport = "FinalInspectionReport",
    TestReport = "TestReport",
    BondStatusLog = "BondStatusLog",
    StoredMaterialSummary = "StoredMaterialSummary",
    InspectionReport = "InspectionReport",
    CloseoutDocumentChecklist = "CloseoutDocumentChecklist",
    BudgetReconciliation = "BudgetReconciliation",
    MockupRequest = "MockupRequest",
    StartupChecklistLog = "StartupChecklistLog",
    OperationMaintenanceLog = "OperationMaintenanceLog",
    RFILog = "RFILog",
    CommissioningReport = "CommissioningReport",
    ProcurementLog = "ProcurementLog",
    AtticStockLog = "AtticStockLog",
    BudgetTracking = "BudgetTracking",
    LiensReleasedLog = "LiensReleasedLog",
    Transmittal = "Transmittal",
    AsBuiltDrawingLog = "AsBuiltDrawingLog",
    SubmittalLog = "SubmittalLog",
    NonconformanceReport = "NonconformanceReport",
    SampleSubmittal = "SampleSubmittal",
    PunchList = "PunchList",
    RequestForProposal = "RequestForProposal",
    SubcontractorPrequalLog = "SubcontractorPrequalLog",
    ProposalRequest = "ProposalRequest",
    DailyFieldReport = "DailyFieldReport",
    WorkDirective = "WorkDirective",
    MaterialCertification = "MaterialCertification",
    ProjectPhotoLog = "ProjectPhotoLog",
    InsuranceCertificateLog = "InsuranceCertificateLog",
    EquipmentLog = "EquipmentLog",
    SafetyObservationReport = "SafetyObservationReport",
    ChangeOrderLog = "ChangeOrderLog",
    PaymentRequestLog = "PaymentRequestLog",
    NoticeToProceed = "NoticeToProceed",
    ProjectCloseoutSummary = "ProjectCloseoutSummary",
    SubstantialCompletionChecklist = "SubstantialCompletionChecklist",
    WarrantyLog = "WarrantyLog",
    ShopDrawingLog = "ShopDrawingLog",
    FieldOrder = "FieldOrder"
}
export enum CertStatus {
    Active = "Active",
    ExpiringSoon = "ExpiringSoon",
    Expired = "Expired"
}
export enum ChangeOrderStatus {
    submitted = "submitted",
    void_ = "void",
    approved = "approved",
    rejected = "rejected",
    draft = "draft",
    pendingOwner = "pendingOwner"
}
export enum ChangeOrderStatus__1 {
    UnderReview = "UnderReview",
    Approved = "Approved",
    Rejected = "Rejected",
    Pending = "Pending"
}
export enum ChangeOrderStatus__2 {
    submitted = "submitted",
    underReview = "underReview",
    void_ = "void",
    approved = "approved",
    rejected = "rejected",
    draft = "draft"
}
export enum ChangeOrderType {
    tm = "tm",
    cop = "cop",
    cor = "cor",
    g701 = "g701",
    g714 = "g714"
}
export enum ChargerAuditActionType {
    queueReorder = "queueReorder",
    debit = "debit",
    refill = "refill"
}
export enum Confidence {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum ConfidentialityLevel {
    internal = "internal",
    public_ = "public",
    restricted = "restricted",
    confidential = "confidential"
}
export enum ControlLevelRef {
    PPE = "PPE",
    Engineering = "Engineering",
    Substitution = "Substitution",
    Elimination = "Elimination",
    Administrative = "Administrative"
}
export enum CorrectiveActionStatus {
    resolved = "resolved",
    closed = "closed",
    open = "open",
    inProgress = "inProgress"
}
export enum CostCategory {
    generalConditions = "generalConditions",
    equipment = "equipment",
    overhead = "overhead",
    contingency = "contingency",
    labor = "labor",
    subcontract = "subcontract",
    material = "material"
}
export enum DeliveryStatus {
    pending = "pending",
    sent = "sent",
    delivered = "delivered",
    failed = "failed"
}
export enum DesignProjectStatus {
    UnderReview = "UnderReview",
    Active = "Active",
    Approved = "Approved",
    Draft = "Draft",
    Archived = "Archived"
}
export enum DesignStyle {
    Luxury = "Luxury",
    Scandinavian = "Scandinavian",
    Transitional = "Transitional",
    Traditional = "Traditional",
    Coastal = "Coastal",
    Contemporary = "Contemporary",
    Minimalist = "Minimalist",
    Bohemian = "Bohemian",
    Industrial = "Industrial",
    Modern = "Modern"
}
export enum DesignVersionStatus {
    Approved = "Approved",
    Draft = "Draft",
    Rejected = "Rejected",
    Submitted = "Submitted"
}
export enum DimensionId {
    ProjectType = "ProjectType",
    EstimatedValue = "EstimatedValue",
    SubMarketConditions = "SubMarketConditions",
    StrategicValue = "StrategicValue",
    MarginExpectation = "MarginExpectation",
    IncidentRate = "IncidentRate",
    DesignRisk = "DesignRisk",
    PaymentHistory = "PaymentHistory",
    TeamAvailability = "TeamAvailability",
    ScheduleAlignment = "ScheduleAlignment",
    BondRequirement = "BondRequirement",
    ActiveProjects = "ActiveProjects"
}
export enum DocumentCategory {
    safetyPrograms = "safetyPrograms",
    aiaGSeries = "aiaGSeries",
    aiaASeries = "aiaASeries",
    packageTemplates = "packageTemplates",
    csiForms = "csiForms",
    oshaForms = "oshaForms",
    subForms = "subForms",
    healthcareForms = "healthcareForms",
    businessDocuments = "businessDocuments",
    presentationPackets = "presentationPackets",
    projectReports = "projectReports"
}
export enum DocumentStatus {
    distributed = "distributed",
    generated = "generated",
    signed = "signed",
    archived = "archived"
}
export enum DocumentType {
    reference = "reference",
    template = "template",
    standard = "standard"
}
export enum DraftStatus {
    complete = "complete",
    inProgress = "inProgress",
    archived = "archived"
}
export enum FieldType {
    signature = "signature",
    multiselect = "multiselect",
    date = "date",
    text = "text",
    textarea = "textarea",
    select = "select",
    email = "email",
    currency = "currency",
    address = "address",
    number_ = "number",
    checkbox = "checkbox",
    phone = "phone"
}
export enum FocusFourCategory {
    Electrocution = "Electrocution",
    CaughtIn = "CaughtIn",
    Falls = "Falls",
    StruckBy = "StruckBy"
}
export enum FurnitureCategory {
    Bed = "Bed",
    Storage = "Storage",
    Stool = "Stool",
    Desk = "Desk",
    Sofa = "Sofa",
    Shelving = "Shelving",
    Lighting = "Lighting",
    Decor = "Decor",
    Table = "Table",
    Chair = "Chair"
}
export enum GoNoGoDecision {
    go = "go",
    noGo = "noGo",
    conditional = "conditional"
}
export enum GoNoGoRecommendation {
    Go = "Go",
    NoGo = "NoGo",
    Proceed_With_Caution = "Proceed_With_Caution"
}
export enum HazardSeverity {
    Critical = "Critical",
    Minor = "Minor",
    Moderate = "Moderate",
    Serious = "Serious"
}
export enum HealthTrend {
    Stable = "Stable",
    Improving = "Improving",
    Declining = "Declining"
}
export enum IncidentType {
    OtherRecordable = "OtherRecordable",
    Death = "Death",
    Restricted = "Restricted",
    Transfer = "Transfer",
    DaysAway = "DaysAway"
}
export enum IndustryCategory {
    healthcare = "healthcare",
    finance = "finance",
    construction = "construction",
    education = "education",
    legal = "legal",
    business = "business",
    government = "government"
}
export enum IndustryVertical {
    financial_aia = "financial_aia",
    construction_stadium = "construction_stadium",
    construction_civil = "construction_civil",
    construction_environmental = "construction_environmental",
    closeout = "closeout",
    safety_osha = "safety_osha",
    procurement = "procurement",
    construction_healthcare = "construction_healthcare",
    safety_general = "safety_general",
    construction_commercial = "construction_commercial"
}
export enum InjuryType {
    JobTransfer = "JobTransfer",
    OtherRecordable = "OtherRecordable",
    Death = "Death",
    FirstAidOnly = "FirstAidOnly",
    DaysAway = "DaysAway"
}
export enum InsuranceCertStatus {
    Rejected = "Rejected",
    Received = "Received",
    Verified = "Verified",
    Expired = "Expired",
    Pending = "Pending"
}
export enum KpiTrend {
    up = "up",
    down = "down",
    flat = "flat"
}
export enum LienWaiverStatus {
    Rejected = "Rejected",
    Requested = "Requested",
    Received = "Received",
    Pending = "Pending"
}
export enum LienWaiverTier {
    gc = "gc",
    sub = "sub",
    supplier = "supplier"
}
export enum LienWaiverType {
    Unconditional_Progress = "Unconditional_Progress",
    Conditional_Progress = "Conditional_Progress",
    Unconditional_Final = "Unconditional_Final",
    Conditional_Final = "Conditional_Final"
}
export enum LienWaiverType__2 {
    conditionalFinal = "conditionalFinal",
    unconditionalPartial = "unconditionalPartial",
    conditionalPartial = "conditionalPartial",
    unconditionalFinal = "unconditionalFinal"
}
export enum LifecyclePhase {
    Closeout = "Closeout",
    PunchList = "PunchList",
    PreConstruction = "PreConstruction",
    Mobilization = "Mobilization",
    ActiveBuild = "ActiveBuild"
}
export enum LongLeadStatus {
    shipped = "shipped",
    installed = "installed",
    inProduction = "inProduction",
    loiIssued = "loiIssued",
    delivered = "delivered",
    poIssued = "poIssued",
    confirmed = "confirmed",
    identified = "identified"
}
export enum MaterialCategory {
    mep = "mep",
    roofing = "roofing",
    glazing = "glazing",
    other = "other",
    specialConstruction = "specialConstruction",
    plumbing = "plumbing",
    concrete = "concrete",
    mechanical = "mechanical",
    steel = "steel",
    finishes = "finishes",
    electrical = "electrical",
    lumber = "lumber",
    earthwork = "earthwork"
}
export enum MaterialType {
    Laminate = "Laminate",
    Stone = "Stone",
    Fabric = "Fabric",
    Ceramic = "Ceramic",
    Glass = "Glass",
    Wood = "Wood",
    Concrete = "Concrete",
    Plastic = "Plastic",
    Metal = "Metal",
    Leather = "Leather"
}
export enum MediaType {
    video = "video",
    photo = "photo"
}
export enum MessageProtocol {
    native_ = "native",
    chat = "chat"
}
export enum MessageRole {
    user = "user",
    sysRole = "sysRole",
    assistant = "assistant"
}
export enum OSHA300Classification {
    SkinDisorder = "SkinDisorder",
    RespiratoryCondition = "RespiratoryCondition",
    PoisoningHearingLoss = "PoisoningHearingLoss",
    AllOtherIllness = "AllOtherIllness",
    Injury = "Injury"
}
export enum OSHA300InjuryType {
    OtherRecordable = "OtherRecordable",
    JobTransferOrRestriction = "JobTransferOrRestriction",
    DaysAwayFromWork = "DaysAwayFromWork",
    Fatality = "Fatality"
}
export enum OSHADocStatus {
    Distributed = "Distributed",
    Active = "Active",
    Draft = "Draft",
    Filed = "Filed",
    Archived = "Archived"
}
export enum OSHADocType {
    JSA = "JSA",
    LOTOProgram = "LOTOProgram",
    ConfinedSpaceProgram = "ConfinedSpaceProgram",
    OSHA300A = "OSHA300A",
    SiteSpecificSafetyPlan = "SiteSpecificSafetyPlan",
    OSHA300 = "OSHA300",
    OSHA301 = "OSHA301",
    FallProtectionPlan = "FallProtectionPlan",
    EmergencyActionPlan = "EmergencyActionPlan",
    CraneSafetyPlan = "CraneSafetyPlan"
}
export enum Osha301Severity {
    DART = "DART",
    Amputation = "Amputation",
    Hospitalization = "Hospitalization",
    NearMiss = "NearMiss",
    Fatal = "Fatal",
    FirstAid = "FirstAid",
    EyeLoss = "EyeLoss"
}
export enum PayAppStatus {
    submitted = "submitted",
    paid = "paid",
    approved = "approved",
    rejected = "rejected",
    draft = "draft"
}
export enum PipelineStage {
    Won = "Won",
    Lead = "Lead",
    Lost = "Lost",
    Estimate = "Estimate",
    Awarded = "Awarded",
    Active = "Active",
    Closeout = "Closeout",
    Proposal = "Proposal",
    Negotiation = "Negotiation"
}
export enum PricingFlag {
    Premium = "Premium",
    None = "None",
    Scrutiny = "Scrutiny"
}
export enum ProjectPhase {
    construction = "construction",
    closeout = "closeout",
    preconstruction = "preconstruction",
    bidding = "bidding",
    warranty = "warranty"
}
export enum ProjectPhase__1 {
    constructionDocuments = "constructionDocuments",
    commissioning = "commissioning",
    constructionAdmin = "constructionAdmin",
    designDevelopment = "designDevelopment",
    closeout = "closeout",
    procurement = "procurement",
    programming = "programming",
    schematicDesign = "schematicDesign"
}
export enum PunchSeverity {
    Critical = "Critical",
    Major = "Major",
    Minor = "Minor"
}
export enum PunchStatus {
    Open = "Open",
    InProgress = "InProgress",
    Resolved = "Resolved",
    Verified = "Verified"
}
export enum RFIPriority {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Critical = "Critical"
}
export enum RFIStatus {
    UnderReview = "UnderReview",
    Open = "Open",
    Closed = "Closed",
    Resolved = "Resolved"
}
export enum RFIStatus__1 {
    closed = "closed",
    submitted = "submitted",
    open = "open",
    answered = "answered",
    void_ = "void"
}
export enum RenderMode {
    Creative = "Creative",
    Furnish = "Furnish",
    Remove = "Remove",
    Accurate = "Accurate"
}
export enum RfqStatus {
    cancelled = "cancelled",
    sent = "sent",
    awarded = "awarded",
    quoteReceived = "quoteReceived",
    draft = "draft"
}
export enum RiskCategory {
    PPE = "PPE",
    WeldingCutting = "WeldingCutting",
    Electrocution = "Electrocution",
    EnvironmentalHazards = "EnvironmentalHazards",
    HeatStress = "HeatStress",
    Explosives = "Explosives",
    HazardousMaterials = "HazardousMaterials",
    Scaffolding = "Scaffolding",
    PoweredIndustrialTrucks = "PoweredIndustrialTrucks",
    CofferdamWork = "CofferdamWork",
    RoofingWork = "RoofingWork",
    CaughtInBetween = "CaughtInBetween",
    AsbestosExposure = "AsbestosExposure",
    SilicaExposure = "SilicaExposure",
    LeadExposure = "LeadExposure",
    MasonryWork = "MasonryWork",
    Falls = "Falls",
    DemolitionWork = "DemolitionWork",
    Cranes = "Cranes",
    StrikeBy = "StrikeBy",
    SteelErection = "SteelErection",
    TunnelWork = "TunnelWork",
    FirePrevention = "FirePrevention",
    ConfidedSpaces = "ConfidedSpaces",
    ContractCompliance = "ContractCompliance",
    Excavation = "Excavation",
    NoiseSIP = "NoiseSIP",
    ConcreteWork = "ConcreteWork"
}
export enum RiskSeverity {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum RoomType {
    Lobby = "Lobby",
    Bathroom = "Bathroom",
    HotelSuite = "HotelSuite",
    Kitchen = "Kitchen",
    Reception = "Reception",
    PrivateOffice = "PrivateOffice",
    LivingRoom = "LivingRoom",
    OpenOffice = "OpenOffice",
    DiningRoom = "DiningRoom",
    HotelRoom = "HotelRoom",
    Other = "Other",
    HomeOffice = "HomeOffice",
    Breakroom = "Breakroom",
    ConferenceRoom = "ConferenceRoom",
    Bedroom = "Bedroom"
}
export enum SafetyDocumentCategory {
    jsa = "jsa",
    oshaLogs = "oshaLogs",
    misc = "misc",
    inspections = "inspections",
    toolboxTalks = "toolboxTalks",
    meetingReports = "meetingReports"
}
export enum SafetyToolStatus {
    Distributed = "Distributed",
    Complete = "Complete",
    Draft = "Draft",
    Archived = "Archived"
}
export enum SafetyToolType {
    JSA = "JSA",
    Inspection = "Inspection",
    Incident = "Incident",
    Briefing = "Briefing",
    Audit = "Audit",
    Emergency = "Emergency",
    ToolboxTalk = "ToolboxTalk",
    PreTask = "PreTask"
}
export enum ScopeItemStatus {
    Disputed = "Disputed",
    Complete = "Complete",
    InProgress = "InProgress",
    NotStarted = "NotStarted"
}
export enum SignatureStatus {
    expired = "expired",
    pending = "pending",
    signed = "signed",
    declined = "declined"
}
export enum SourceCorpus {
    ADA = "ADA",
    JOINT_COMMISSION = "JOINT_COMMISSION",
    OSHA_1910 = "OSHA_1910",
    OSHA_1926 = "OSHA_1926",
    AIA_G701 = "AIA_G701",
    AIA_G702 = "AIA_G702",
    AIA_G703 = "AIA_G703",
    AIA_G704 = "AIA_G704",
    AIA_G714 = "AIA_G714",
    EPA_NPDES = "EPA_NPDES",
    ANSI_A10 = "ANSI_A10",
    LEED_V4 = "LEED_V4",
    NFPA_70 = "NFPA_70",
    CSI_DIV01 = "CSI_DIV01",
    CSI_DIV02 = "CSI_DIV02",
    CSI_DIV03 = "CSI_DIV03",
    CSI_DIV04 = "CSI_DIV04",
    CSI_DIV05 = "CSI_DIV05",
    CSI_DIV06 = "CSI_DIV06",
    CSI_DIV07 = "CSI_DIV07",
    CSI_DIV08 = "CSI_DIV08",
    CSI_DIV09 = "CSI_DIV09",
    CSI_DIV10 = "CSI_DIV10",
    CSI_DIV11 = "CSI_DIV11",
    CSI_DIV12 = "CSI_DIV12",
    CSI_DIV13 = "CSI_DIV13",
    CSI_DIV14 = "CSI_DIV14",
    CSI_DIV21 = "CSI_DIV21",
    CSI_DIV22 = "CSI_DIV22",
    CSI_DIV23 = "CSI_DIV23",
    CSI_DIV25 = "CSI_DIV25",
    CSI_DIV26 = "CSI_DIV26",
    CSI_DIV27 = "CSI_DIV27",
    CSI_DIV28 = "CSI_DIV28",
    CSI_DIV31 = "CSI_DIV31",
    CSI_DIV32 = "CSI_DIV32",
    CSI_DIV33 = "CSI_DIV33",
    CSI_DIV34 = "CSI_DIV34",
    CSI_DIV35 = "CSI_DIV35",
    CSI_DIV40 = "CSI_DIV40",
    CSI_DIV41 = "CSI_DIV41",
    CSI_DIV42 = "CSI_DIV42",
    CSI_DIV43 = "CSI_DIV43",
    CSI_DIV44 = "CSI_DIV44",
    CSI_DIV48 = "CSI_DIV48"
}
export enum SubInviteStatus {
    NotInvited = "NotInvited",
    Viewed = "Viewed",
    Sent = "Sent",
    Bidding = "Bidding",
    Declined = "Declined",
    Submitted = "Submitted"
}
export enum SubPrequalStatus {
    expired = "expired",
    pending = "pending",
    conditional = "conditional",
    approved = "approved",
    rejected = "rejected"
}
export enum SubcontractStatus {
    terminated = "terminated",
    scopeReview = "scopeReview",
    executed = "executed",
    pendingExecution = "pendingExecution",
    negotiation = "negotiation"
}
export enum SubmittalApprovalStatus {
    Revise = "Revise",
    Rejected = "Rejected",
    ApprovedAsNoted = "ApprovedAsNoted",
    ApprovedAsSubmitted = "ApprovedAsSubmitted",
    Pending = "Pending"
}
export enum TagSeverity {
    low = "low",
    high = "high",
    immediateDanger = "immediateDanger",
    critical = "critical",
    medium = "medium"
}
export enum TagStatus {
    resolved = "resolved",
    closed = "closed",
    open = "open",
    flagged = "flagged",
    inProgress = "inProgress"
}
export enum TenantPlan {
    Pro = "Pro",
    Enterprise = "Enterprise",
    Free = "Free"
}
export enum TokenKind {
    BidToken = "BidToken",
    AwardToken = "AwardToken",
    CompletionToken = "CompletionToken",
    PayAppToken = "PayAppToken"
}
export enum TokenState {
    BidRejected = "BidRejected",
    PayAppPaid = "PayAppPaid",
    CompletionReleased = "CompletionReleased",
    BidDraft = "BidDraft",
    PayAppSubmitted = "PayAppSubmitted",
    CompletionReady = "CompletionReady",
    AwardSigned = "AwardSigned",
    AwardPending = "AwardPending",
    BidSubmitted = "BidSubmitted",
    BidAwarded = "BidAwarded",
    AwardExecuted = "AwardExecuted",
    PayAppDraft = "PayAppDraft",
    CompletionPending = "CompletionPending",
    PayAppApproved = "PayAppApproved",
    PayAppRejected = "PayAppRejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_Accepted_Expired_Pending {
    Accepted = "Accepted",
    Expired = "Expired",
    Pending = "Pending"
}
export enum Variant_EthylOleate_Recruitment_Alarm_Inhibition {
    EthylOleate = "EthylOleate",
    Recruitment = "Recruitment",
    Alarm = "Alarm",
    Inhibition = "Inhibition"
}
export enum Variant_Low_High_Medium {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export enum Variant_Nurse_HouseBee_Forager {
    Nurse = "Nurse",
    HouseBee = "HouseBee",
    Forager = "Forager"
}
export enum Variant_Premium_BelowMarket_None_Scrutiny {
    Premium = "Premium",
    BelowMarket = "BelowMarket",
    None = "None",
    Scrutiny = "Scrutiny"
}
export enum Variant_approved_rejected_proposed {
    approved = "approved",
    rejected = "rejected",
    proposed = "proposed"
}
export enum Variant_auditProject_chat_smsMessage_sendInvoice_sendAlert_sendPaymentLink_deployEstimate {
    auditProject = "auditProject",
    chat = "chat",
    smsMessage = "smsMessage",
    sendInvoice = "sendInvoice",
    sendAlert = "sendAlert",
    sendPaymentLink = "sendPaymentLink",
    deployEstimate = "deployEstimate"
}
export enum Variant_disputed_pending_paid_approved {
    disputed = "disputed",
    pending = "pending",
    paid = "paid",
    approved = "approved"
}
export enum Variant_pending_answered_withdrawn {
    pending = "pending",
    answered = "answered",
    withdrawn = "withdrawn"
}
export enum Variant_rfi_closeoutPackage_submittal_contract_invoice_estimate_punchList_scopeLetter {
    rfi = "rfi",
    closeoutPackage = "closeoutPackage",
    submittal = "submittal",
    contract = "contract",
    invoice = "invoice",
    estimate = "estimate",
    punchList = "punchList",
    scopeLetter = "scopeLetter"
}
export enum Variant_settled_disputed_open_acknowledged_written_off {
    settled = "settled",
    disputed = "disputed",
    open = "open",
    acknowledged = "acknowledged",
    written_off = "written_off"
}
export enum Variant_settled_disputed_written_off {
    settled = "settled",
    disputed = "disputed",
    written_off = "written_off"
}
export enum ViewRole {
    GC = "GC",
    PM = "PM",
    Reseller = "Reseller",
    Client = "Client",
    DesignerArchitect = "DesignerArchitect",
    SubTradeContractor = "SubTradeContractor",
    OwnerAdmin = "OwnerAdmin",
    SafetyOfficer = "SafetyOfficer"
}
export enum WageComplianceStatus {
    compliant = "compliant",
    unverified = "unverified",
    deficient = "deficient"
}
export interface backendInterface {
    acceptBidInvite(inviteCode: string): Promise<void>;
    acceptInvite(token: InviteId): Promise<TenantContext>;
    acknowledgeAlert(tenantId: bigint, alertId: string): Promise<boolean>;
    activateAgent(agentId: string): Promise<void>;
    addAnnotation(mediaId: string, tenantId: string, authorName: string, annotationType: AnnotationType, coordinates: Array<number>, color: string, annotationLabel: string | null, oshaRef: string | null): Promise<SMResult_5>;
    addCRMPipelineItem(gcName: string, projectType: string, estimatedValueUSD: number, expectedStartDate: bigint): Promise<bigint>;
    addCRMProject(gcName: string, projectType: string, scopesPerformed: Array<string>, contractValueUSD: number, scheduledDays: bigint, actualDays: bigint, qualityScore: number, repeatBusiness: boolean, occupiedRenovation: boolean): Promise<bigint>;
    addComment(tagId: bigint, content: string, photoUrls: Array<string>, authorName: string, isExternal: boolean): Promise<STResult_3>;
    addDesignComment(projectId: DesignProjectId, versionId: DesignVersionId, content: string): Promise<DesignComment>;
    addMediaComment(mediaId: string, tenantId: string, authorName: string, authorRole: string, text: string, replyToId: bigint | null): Promise<SMResult_4>;
    addOSHA300AEntry(entry: OSHA300AEntry): Promise<void>;
    addOSHA300Entry(entry: OSHA300Entry__1): Promise<OSHA300Entry__1>;
    addOSHA301Entry(entry: OSHA301Entry): Promise<OSHA301Entry>;
    addOsha300Entry(tenantId: string, employeeName: string, jobTitle: string, dateOfIncident: bigint, location: string, description: string, incidentType: IncidentType, daysAway: bigint, daysRestricted: bigint, injuryType: string, bodyPart: string): Promise<Osha300Record>;
    addPayAppLienWaiver(tokenId: string, waiver: LienWaiverRef): Promise<PayAppTokenRecord | null>;
    addPhotoToTag(tagId: bigint, photoUrl: string): Promise<STResult>;
    addProject(title: string, location: string, gc: string, contact: string, amount: string, completionDate: string, scopes: Array<string>, isNewConstruction: boolean, state: string, scopeType: string, photo: Image): Promise<void>;
    addReportRecipient(reportId: string, recipient: ReportRecipient): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addResearchAnnotation(entryId: bigint, note: string, tags: Array<string>): Promise<bigint>;
    addScheduleActivity(tenantId: bigint, projectId: string, csiCode: string, description: string, trade: string, durationDays: bigint, crewSize: bigint, quantity: number, unit: string, predecessors: Array<string>): Promise<ScheduleActivity>;
    addSessionAnnotation(sessionId: string, annotatorId: string, text: string, hazardRef: string | null): Promise<boolean>;
    addSubToProject(projectId: bigint, subPrincipal: Principal): Promise<void>;
    addWorkerCert(workerName: string, projectId: string | null, certType: string, certNumber: string, issuingBody: string, issuedDate: bigint, expiryDate: bigint): Promise<WorkerCert>;
    analyzeContractRisk(tenantId: bigint, projectId: string, contractType: string, contractText: string): Promise<ContractRiskReport>;
    analyzeCrewProductivity(targetRoomsPerDay: bigint, actualRoomsPerDay: bigint, scopeTypes: Array<string>, crewSize: bigint, projectDays: bigint): Promise<ProductivityResult>;
    analyzeDetailedScopeChange(originalScopes: Array<string>, addedScope: string, currentContractUSD: number, currentDays: bigint): Promise<{
        costDeltaUSD: number;
        scheduleDeltaDays: bigint;
        recommendation: string;
        nexusRiskScore: number;
        approvalLevel: string;
    }>;
    analyzeRFIImpact(rfiCount: bigint, avgResolutionDays: bigint, scopeTypes: Array<string>, projectDays: bigint): Promise<RFIImpactResult>;
    analyzeScopeCompleteness(tenantId: bigint, projectId: string, projectType: string, lineItems: Array<CsiLineItem>): Promise<ScopeAnalysis>;
    analyzeScopeGap(selectedScopes: Array<string>, projectType: string): Promise<ScopeGapLegacyResult>;
    analyzeToolboxSession(sessionId: string): Promise<ComplianceCert | null>;
    answerRFI(tenantId: bigint, rfiId: string, response: string, linkedCOs: Array<string>): Promise<boolean>;
    answerScopeClarification(tenantId: bigint, clarificationId: string, response: string): Promise<ScopeClarification>;
    approveChangeOrder(changeOrderId: bigint, approved: boolean): Promise<void>;
    approveDesignVersion(versionId: DesignVersionId, notes: string): Promise<DesignApproval>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignRole(req: AssignRoleRequest): Promise<void>;
    assignTag(tagId: bigint, assignee: Principal, assigneeName: string, dueDate: bigint | null): Promise<STResult>;
    attachCorrectiveAction(tagId: bigint, template: string, notes: string): Promise<STResult>;
    autoDetectTradeGroupsForScope(scopeItems: Array<ScopeItem>): Promise<Array<RecipientGroup>>;
    awardBid(bidId: string, awardedSub: string, contractValue: number, contractType: string): Promise<AwardRecord__1 | null>;
    bhxGetColonyState(): Promise<{
        totalWorkers: bigint;
        queenActive: boolean;
        quorumThreshold: number;
        pheromoneCount: bigint;
        droneCount: bigint;
    } | null>;
    bhxGetConfig(): Promise<{
        quorumMin: number;
        maxQueueDepth: bigint;
        homeostasisK: number;
        workerCycleInterval: bigint;
        droneCount: bigint;
    } | null>;
    bhxGetDroneReports(): Promise<Array<{
        id: bigint;
        anomalyScore: number;
        scanTarget: string;
        lastScanTimestamp: bigint;
    }> | null>;
    bhxGetHomeostasisMetrics(): Promise<{
        hotEngines: Array<string>;
        ambientThreshold: number;
        redistributionActive: boolean;
        loadTemperature: number;
        utilizationRate: number;
    } | null>;
    bhxGetLiveSummary(): Promise<{
        pendingWaggles: bigint;
        colonyOnline: boolean;
        activePheromones: bigint;
        loadTemperature: number;
        lastCycle: bigint;
        quorumReached: boolean;
        droneCount: bigint;
        workerCount: bigint;
    } | null>;
    bhxGetPheromoneBroadcast(): Promise<Array<{
        timestamp: bigint;
        sourceEngine: string;
        intensity: number;
        signalType: Variant_EthylOleate_Recruitment_Alarm_Inhibition;
    }> | null>;
    bhxGetQuorumStatus(): Promise<{
        reached: boolean;
        threshold: number;
        totalEngines: bigint;
        confirmedEngines: bigint;
    } | null>;
    bhxGetWaggleQueue(): Promise<Array<{
        direction: string;
        quality: number;
        distance: number;
        payload: string;
    }> | null>;
    bhxGetWorkerRoster(): Promise<Array<{
        id: bigint;
        stage: Variant_Nurse_HouseBee_Forager;
        iterationCount: bigint;
        loadFactor: number;
        assignedDomain: string;
    }> | null>;
    bidLeadScoring12D(projectName: string, estimatedValueUSD: number, timelineWeeks: bigint, locationState: string, clientRelHistory: string, scopeComplexity: string, competitorCount: bigint, decisionMakerAccess: string, paymentHistoryFlag: string, riskProfile: string, strategicValue: string): Promise<LeadScoringResult>;
    buildPunchListByScope(scopeTypes: Array<string>, roomCount: bigint, projectType: string): Promise<PunchListResult>;
    calculateChangeOrderImpact(scopeAdded: string, currentRoomCount: bigint, currentCrewSize: bigint, currentDurationDays: bigint): Promise<ChangeOrderResult>;
    calculateCultureScore(projectId: string, tenantId: string): Promise<SafetyCultureScore>;
    calculateDART(dartCases: bigint, totalHours: bigint): Promise<DARTResult>;
    calculateEAC(tenantId: bigint, projectId: string, contractValue: number, actualCostToDate: number, percentComplete: number, approvedCOs: number): Promise<EacModel__1>;
    calculateEvidenceAlignment(bidId: string, trir: number, emr: number, oshaViolations: bigint, bondingCapacity: number, paymentScore: number, backlogRatio: number, yearsExperience: bigint, pastProjectsOnTime: number): Promise<EvidenceAlignment | null>;
    calculateFFEBudget(roomCount: bigint, projectType: string, includesAppliances: boolean, includesElectronics: boolean): Promise<FFEBudgetResult>;
    calculateFreeCostEstimate(scopeItems: Array<string>, trade: string, laborHours: number): Promise<{
        totalCost: number;
        laborCost: number;
        materialCost: number;
    }>;
    calculateFreeSafetyRisk(tasks: Array<string>, trade: string): Promise<{
        hazards: Array<HazardRisk>;
        recommendations: Array<string>;
        stopWorkRequired: boolean;
        overallRisk: string;
    }>;
    calculateGoNoGo(factors: Array<GoNoGoFactor>): Promise<GoNoGoResult>;
    calculateLaborHours(scopeTypes: Array<string>, roomCount: bigint, crewSize: bigint): Promise<LaborHoursResult>;
    calculateProjectCost(scopeTypes: Array<string>, roomCount: bigint, location: string, laborType: string): Promise<CostEstimateResult>;
    calculateProjectSchedule(scopeTypes: Array<string>, roomCount: bigint, crewAvailability: string, hasOverlap: boolean): Promise<ScheduleResult>;
    calculateRoomTurnover(roomCount: bigint, scopeTypes: Array<string>, crewSize: bigint, hotelStars: string): Promise<RoomTurnoverResult>;
    calculateSafetyCultureScore(toolboxTalkFreqPerMonth: bigint, nearMissReportingRate: number, inspectionCompletionPct: number, trainingHrsPerWorker: number, correctiveActionClosePct: number, safetyObservationCount: bigint): Promise<SafetyCultureScoreResult>;
    calculateSafetyScore(incidentCount: bigint, nearMissCount: bigint, inspectionsPassed: bigint, totalInspections: bigint, trainingCompliance: bigint): Promise<SafetyScoreResult>;
    calculateScewScore(weeklyObservations: bigint, correctiveActions: bigint, nearMisses: bigint): Promise<{
        trend: string;
        risk: string;
        score: number;
    }>;
    calculateScopeEstimate(projectType: string, roomCount: bigint, scopes: Array<string>, includeDemo: boolean): Promise<ScopeEstimateResult>;
    calculateSuluScore(siteVisits: bigint, toolboxTalks: bigint, hazardConversations: bigint): Promise<{
        trend: string;
        score: number;
        leadership: string;
    }>;
    calculateTRIR(recordables: bigint, totalHours: bigint): Promise<TRIRResult>;
    cashFlowProjection90Day(projectValue: number, paymentTerms: bigint, mobilizationPct: number, weeklyBurnRate: number): Promise<CashFlowResult>;
    chat(message: string, sessionId: string, tenantId: string): Promise<{
        __kind__: "ok";
        ok: ChatMessage;
    } | {
        __kind__: "err";
        err: string;
    }>;
    chatPRO1(message: string, sessionId: string, ctx: PlatformContext): Promise<PRO1Result>;
    chatWithContext(message: string, sessionId: string, ctx: AssistantContext): Promise<{
        __kind__: "ok";
        ok: ChatMessage;
    } | {
        __kind__: "err";
        err: string;
    }>;
    checkAnyRole(tenantId: TenantId, roles: Array<Role>): Promise<boolean>;
    checkEscalation(tenantId: bigint, category: MaterialCategory, materialName: string, region: string, currentPrice: bigint, previousPrice: bigint): Promise<EscalationAlert | null>;
    checkEscalationRequired(severity: Osha301Severity): Promise<EscalationFlag>;
    checkNearMissRatio(nearMisses: bigint, recordables: bigint): Promise<NearMissHealthResult>;
    checkRole(tenantId: TenantId, role: Role): Promise<boolean>;
    checkWageCompliance(tenantId: bigint, projectId: string, trades: Array<[string, string, bigint]>): Promise<WageComplianceReport>;
    clearHistory(sessionId: string): Promise<boolean>;
    clearPunchListItem(tokenId: string, itemId: string): Promise<CompletionTokenRecord | null>;
    compareBundleConfigurations(configACost: number, configADays: bigint, configAConflicts: bigint, configBCost: number, configBDays: bigint, configBConflicts: bigint): Promise<{
        nexusRecommendation: string;
        scheduleDifferenceDays: bigint;
        riskScoreDelta: number;
        costDifferenceUSD: number;
    }>;
    compareQuotes(tenantId: bigint, rfqId: string): Promise<QuoteComparison>;
    computeDetailedProjectTimeline(projectType: string, scopeCount: bigint, crewSize: bigint, unitCount: bigint): Promise<{
        nexusConfidence: number;
        compressionFlags: Array<string>;
        totalDays: bigint;
        phases: Array<{
            durationDays: bigint;
            name: string;
            parallelWork: Array<string>;
            laborRate: number;
            criticalPath: boolean;
        }>;
    }>;
    computeGCRelationshipScore(gcName: string): Promise<GCRelationshipScore>;
    computeGoNoGoScore(leadId: string): Promise<[number, string]>;
    computeMobilizationTimeline(projectStartDate: bigint, crewSize: bigint, distanceMiles: number, scopeTypes: Array<string>): Promise<{
        logisticsSequence: Array<{
            durationDays: bigint;
            step: string;
        }>;
        totalMobDays: bigint;
        mobilizationReadyDate: bigint;
        recommendation: string;
    }>;
    computeNexusBidScore(bidResponseId: string): Promise<NexusBidScore>;
    computeOSHA300ASummary(year: bigint, establishmentName: string, city: string, stateCode: string, naicsCode: string, avgEmployees: bigint, totalHours: bigint, sigTitle: string): Promise<OSHA300AEntry>;
    computeProjectEac(tenantId: bigint, projectId: string, originalBudget: bigint, actualCostToDate: bigint, percentComplete: bigint, plannedValue: bigint): Promise<EacModel>;
    computePunchQualityTrend(projectId: bigint): Promise<{
        punchDensityByTrade: Array<{
            trade: string;
            density: number;
            closedCount: bigint;
            openCount: bigint;
        }>;
        nexusRecommendation: string;
        trendScore: number;
        anomalyFlags: Array<string>;
    }>;
    computeSafetyTrend(projectId: bigint): Promise<{
        incidentDocCount: bigint;
        nexusRecommendation: string;
        openJSACount: bigint;
        certExpiryAlerts: bigint;
        overallSafetyScore: number;
    }>;
    configureBundleIntelligence(projectType: string, unitCount: bigint): Promise<BundleResult>;
    confirmPhaseTransition(projectId: bigint, targetPhase: LifecyclePhase): Promise<void>;
    contractIntelligence(contractText: string): Promise<ContractIntelligenceResult>;
    coordinateLogistics(scopeList: Array<string>, crewManifest: bigint): Promise<{
        wasteRemovalPlan: Array<string>;
        nexusLogisticsScore: number;
        siteAccessProtocol: Array<string>;
        equipmentManifest: Array<string>;
        stagingRequirements: Array<string>;
    }>;
    createAgent(name: string, description: string, assignedSkills: Array<string>, workspaceScope: Array<string>): Promise<string>;
    createAwardToken(tenantId: string, projectId: string, bidTokenId: string, contractorName: string, gcName: string, ownerName: string, contractValue: bigint, paymentTerms: PaymentTerms): Promise<AwardTokenRecord | null>;
    createBidInvite(projectName: string, tradeScope: string, invitedSubEmail: string | null): Promise<string>;
    createBidLead(projectName: string, location: string, buildingType: string, estimatedValue: number, ownerContact: string, architectContact: string): Promise<BidLead>;
    createBidToken(tenantId: string, projectName: string, gcName: string, scopeOfWork: string, projectType: string, projectAddress: string, estimatedValue: number, dueDate: bigint, notes: string): Promise<BidToken>;
    createChangeOrder(tenantId: bigint, projectId: string, title: string, description: string, reason: string, items: Array<ChangeOrderItem>, submittedBy: string, linkedRFIs: Array<string>): Promise<ChangeOrder__2>;
    createCompletionToken(tenantId: string, projectId: string, awardTokenId: string, finalPayAppTokenId: string, punchListItems: Array<PunchListItem>, retentionAmount: bigint): Promise<CompletionTokenRecord | null>;
    createContact(name: string, email: string, phone: string, primaryRole: string, secondaryRoles: Array<string>, notes: string): Promise<{
        __kind__: "ok";
        ok: Contact;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createCorrectiveAction(mediaId: string, tenantId: string, createdByName: string, description: string, oshaSection: string, assignedTo: Principal | null, assignedToName: string | null, dueDate: bigint | null, linkedTagId: bigint | null): Promise<SMResult_3>;
    createDesignProject(name: string, roomType: RoomType, dimensions: Dimensions, style: DesignStyle, budgetUSD: number): Promise<DesignProject>;
    createDesignRender(projectId: DesignProjectId, versionId: DesignVersionId, renderMode: RenderMode, stylePreset: string, materialPalette: string): Promise<DesignRender>;
    createExcelPackage(documentId: string, tenantId: string, filename: string, sheets: Array<ExcelSheet>): Promise<ExcelPackage>;
    createITB(tenantId: bigint, projectId: string, projectName: string, owner: string, projectType: string, location: string, estimatedValue: bigint, scopeSummary: string, bidDate: bigint, bondRequired: boolean, bondAmount: bigint, prevailingWage: boolean, insuranceReqs: Array<string>, contactName: string, contactEmail: string, invitedSubs: Array<string>): Promise<ITBRecord__1>;
    createIncidentReport(tenantId: string, projectId: string, formData: string): Promise<SafetyToolResponse>;
    createLienWaiver(bidId: string, subName: string, waiverType: LienWaiverType, payAppNumber: bigint, amount: number, throughDate: bigint): Promise<LienWaiver>;
    createPayAppToken(tenantId: string, projectId: string, awardTokenId: string, payAppNumber: bigint, periodFrom: bigint, periodTo: bigint, scheduledValue: bigint, workCompleted: bigint, materialsStored: bigint, retainageHeld: bigint, currentPaymentDue: bigint): Promise<PayAppTokenRecord | null>;
    createPipelineDeal(gcPrincipal: Principal, projectName: string, estimatedValue: number, stage: PipelineStage): Promise<PipelineDeal>;
    createProject(name: string, location: string, startDate: bigint, budgetUSD: number, scheduleDays: bigint): Promise<bigint>;
    createProjectRecord(tenantId: bigint, projectId: string, name: string, projectType: string, state: string, city: string, contractValue: number, startDate: bigint, targetEndDate: bigint, gcCompany: string, ownerName: string, architectName: string): Promise<ProjectRecord__1>;
    createProjectReport(title: string, projectName: string, location: string, gcName: string, resultIds: Array<bigint>, researchEntryIds: Array<bigint>): Promise<bigint>;
    createRFI(tenantId: bigint, projectId: string, subject: string, description: string, submittedBy: string, assignedTo: string, priority: string, responseRequired: bigint, linkedActivities: Array<string>, scheduleImpact: boolean, costImpact: boolean, impactDescription: string): Promise<RFI__1>;
    createRFP(tenantId: bigint, projectId: string, projectName: string, owner: string, scopeNarrative: string, evaluationCriteria: Array<string>, submissionRequirements: Array<string>, dueDate: bigint, awardCriteria: string): Promise<RFPRecord>;
    createSCBidToken(tenantId: string, projectId: string, bidId: string): Promise<BidTokenRecord | null>;
    createSOV(projectId: string, lineItems: Array<SOVLineItem>): Promise<ScheduleOfValues>;
    createSafetyReceipt(input: CreateReceiptInput): Promise<SafetyReceipt>;
    createSafetyReport(report: SafetyReportRecord): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createScopeClarification(tenantId: bigint, projectId: string, subId: string, subName: string, question: string): Promise<ScopeClarification>;
    createSignatureEnvelope(documentId: string, tenantId: string, signers: Array<[string, string, string, string]>, expiresAt: bigint): Promise<ESignatureEnvelope>;
    createSiteWalkReport(leadId: string, inspectorName: string, existingConditions: string, hazardsObserved: Array<string>, scopeObservations: string): Promise<SiteWalkReport>;
    createSmartContract(tenantId: string, projectId: string, projectName: string, contractType: string, industry: string, csiDivisions: Array<string>): Promise<SmartContract>;
    createSubcontract(tenantId: bigint, projectId: string, subId: string, subName: string, csiDivisions: Array<string>, scopeSummary: string, contractValue: bigint, retainagePct: bigint, startDate: bigint, endDate: bigint, flowDownProvisions: Array<FlowDownProvision>): Promise<SubcontractRecord>;
    createTag(tenantId: string, title: string, category: string, location: string, severity: TagSeverity, oshaCode: string | null, photoUrls: Array<string>): Promise<STResult_3>;
    createTenant(req: CreateTenantRequest): Promise<TenantPublic>;
    createToolboxSession(projectId: string, tenantId: string, conductor: string, trade: string): Promise<string>;
    customizeBundle(baseProjectType: string, unitCount: bigint, addTrades: Array<string>, removeTrades: Array<string>): Promise<BundleResult>;
    deactivateAgent(agentId: string): Promise<void>;
    deactivateSMSBridge(): Promise<void>;
    deepenJSAWithHazardLib(scopeType: string, workLocation: string, crewSize: bigint): Promise<DeepJSAResult>;
    deleteAgent(agentId: string): Promise<void>;
    deleteAnnotation(annotationId: bigint): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteContact(id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteProjectReport(id: bigint): Promise<boolean>;
    deleteSafetyDocument(id: bigint): Promise<void>;
    deleteToolResult(id: bigint): Promise<boolean>;
    detectFocusFourHazards(activities: Array<string>): Promise<Array<[FocusFourCategory, DetectionRule]>>;
    ensureDefaultTenant(): Promise<TenantId>;
    evidenceChunkIds(): Promise<Array<string>>;
    evidenceCorpusSize(): Promise<bigint>;
    executeEngineFromChat(userMessage: string, tenantId: string, projectId: string, params: Array<[string, string]>): Promise<EngineExecutionResultShared>;
    executeSubcontract(tenantId: bigint, subcontractId: string): Promise<SubcontractRecord>;
    exportBidLevelingToExcel(bidId: string): Promise<string | null>;
    exportOsha300A(tenantId: string, calendarYear: bigint, totalHoursWorked: bigint, annualAvgEmployees: bigint, certifiedBy: string): Promise<Osha300ARecord>;
    formatCitation(corpus: SourceCorpus, section: string, title: string): Promise<string>;
    generateAIAA101(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIAA305(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIAA310(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIAA401(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIADoc(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIAG701(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIAG702(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIAG703(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIAG704(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIAG714(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIAG716(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAIALienWaiver(tenantId: string, projectId: string, formData: string): Promise<AIADocResponse>;
    generateAlignmentReport(documentId: string, templateId: string, fieldValues: Array<[string, string]>): Promise<AlignmentReport>;
    generateBidPayApp(bidId: string, input: PayAppInput): Promise<PayApp | null>;
    generateBidProposal(bidId: string, companyName: string, teamMembers: Array<string>): Promise<ProposalDocument | null>;
    generateCSIChangeOrderLog(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSIDailyFieldReport(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSIForm(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSIMeetingMinutes(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSINoticeToProceed(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSIPaymentRequestLog(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSIPunchList(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSIRFILog(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSIStoredMaterialSummary(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSISubmittalLog(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCSISubstitutionRequest(tenantId: string, projectId: string, formData: string): Promise<CSIFormResponse>;
    generateCashFlowProjection(tenantId: bigint, projectId: string, projectionDays: bigint): Promise<CashFlowProjection>;
    generateCostEstimate(tenantId: bigint, projectId: string, projectType: string, state: string, sqft: number): Promise<CostEstimate>;
    generateDocument(templateId: string, tenantId: string, projectId: string | null, companyName: string, projectName: string, fieldOverrides: Array<[string, string]>, companyProfile: Array<[string, string]>, projectData: Array<[string, string]>): Promise<DocumentResult>;
    generateEmergencyResponsePlan(tenantId: string, projectId: string, formData: string): Promise<SafetyToolResponse>;
    generateFreeJSA(task: string, trade: string, additionalHazards: Array<string>): Promise<{
        ppe: Array<string>;
        content: string;
        hazards: Array<string>;
        controls: Array<string>;
    }>;
    generateHandoffPackage(projectId: string, projectName: string, scopeItems: Array<ScopeItem>): Promise<{
        __kind__: "ok";
        ok: Handoff;
    } | {
        __kind__: "err";
        err: string;
    }>;
    generateInspectionForm(tenantId: string, projectId: string, formData: string): Promise<SafetyToolResponse>;
    generateInviteLink(req: GenerateInviteRequest): Promise<InviteLinkPublic>;
    generateInviteToken(tagId: bigint, maxUses: bigint, expiresHours: bigint, token: string): Promise<STResult_2>;
    generateJSA(tenantId: string, projectId: string, formData: string): Promise<SafetyToolResponse>;
    generateLienWaiver(tenantId: bigint, projectId: string, waiverType: LienWaiverType__2, tier: LienWaiverTier, claimantName: string, customerName: string, jobLocation: string, throughDate: bigint, paymentAmount: bigint, state: string): Promise<LienWaiver__2>;
    generateOSHA300(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHA300A(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHA301(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHAConfinedSpaceProgram(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHACraneSafetyPlan(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHADoc(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHAEmergencyActionPlan(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHAFallProtectionPlan(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHAJSA(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHALOTOProgram(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generateOSHASiteSpecificSafetyPlan(tenantId: string, projectId: string, formData: string): Promise<OSHADocResponse>;
    generatePayApp(projectId: string, payAppNo: bigint, periodThrough: bigint, contractNo: string, contractDate: bigint, architect: string, owner: string, contractor: string, sovJson: string): Promise<PayApplication>;
    generatePreMobChecklist(bidId: string): Promise<PreMobChecklist | null>;
    generatePreTaskPlan(tenantId: string, projectId: string, formData: string): Promise<SafetyToolResponse>;
    generateRfq(tenantId: bigint, projectId: string, title: string, csiCodes: Array<string>, dueDate: bigint): Promise<RfqRecord>;
    generateSafetyAudit(tenantId: string, projectId: string, formData: string): Promise<SafetyToolResponse>;
    generateSafetyBriefing(tenantId: string, projectId: string, formData: string): Promise<SafetyToolResponse>;
    generateSignatureCertificate(documentId: string): Promise<string>;
    generateStopWorkAuthority(hazardDescription: string, location: string): Promise<StopWorkRecord>;
    generateSubPayApp(tenantId: bigint, projectId: string, subName: string, payAppNo: bigint, periodThrough: bigint, sovJson: string): Promise<PayApplication>;
    generateTagQRCode(tagId: bigint): Promise<STResult_2>;
    generateToolboxTalk(tenantId: string, projectId: string, formData: string): Promise<SafetyToolResponse>;
    getAIADocById(tenantId: string, docId: string): Promise<AIADocRecord | null>;
    getAIADocsByProject(tenantId: string, projectId: string): Promise<Array<AIADocRecord>>;
    getAIPlatformStats(): Promise<AIPlatformStats>;
    getActiveAlerts(tenantId: bigint): Promise<Array<EscalationAlert>>;
    getActivityFeed(tenantId: bigint, role: ViewRole, limit: bigint): Promise<Array<ActivityLogEntry>>;
    getAgentConversation(agentId: string, conversationId: string): Promise<Array<ChatMessage__1>>;
    getAlignmentReport(documentId: string): Promise<AlignmentReport | null>;
    getAllAIAgents(): Promise<Array<AIAgentRecord>>;
    getAllActiveTags(tenantId: string): Promise<Array<SafetyTag>>;
    getAllDocumentMeta(): Promise<Array<ExtendedTemplateMeta>>;
    getAllEMRRecords(tenantId: string): Promise<Array<EMRRecord>>;
    getAllFocusFour(): Promise<Array<FocusFourHazard__1>>;
    getAllProjects(): Promise<Array<Project>>;
    getAllProtocols(): Promise<Array<ProtocolEntry>>;
    getAllResearchEntries(): Promise<Array<ResearchEntry>>;
    getAllRiskCategories(): Promise<Array<string>>;
    getAllSafetyDocuments(): Promise<Array<SafetyDocument>>;
    getAllSubIntakeResults(tenantId: string): Promise<Array<IntakeResult>>;
    getAnnotations(mediaId: string, tenantId: string): Promise<Array<Annotation>>;
    getAnomalyAlerts(tenantId: bigint, role: ViewRole): Promise<Array<AnomalyAlert>>;
    getAssistantContext(sessionId: string): Promise<ContextResult>;
    getAuditEntry(auditId: string): Promise<AuditEntry | null>;
    getAuditLog(): Promise<Array<AuditEntry>>;
    getAutoReportSchedules(tenantId: string): Promise<Array<AutoReportSchedule>>;
    getAvailableModels(): Promise<ModelsResult>;
    getAwardRecord(bidId: string): Promise<AwardRecord__1 | null>;
    getAwardToken(tokenId: string): Promise<AwardTokenRecord | null>;
    /**
     * / Returns current lifecycle stage of a BHX Worker task and its intermediate result.
     * / CPL authority: PublicAccess (query only — no authority restriction).
     */
    getBHXWorkerStatus(workerId: string): Promise<{
        result?: Array<[string, string]>;
        stage: string;
        isComplete: boolean;
    }>;
    getBLSWageByTrade(trade: string, state: string, year: bigint): Promise<BLSWageRecord | null>;
    getBLSWageStatus(): Promise<BLSDataStatus>;
    getBackCharges(tenantId: bigint, projectId: string): Promise<Array<BackCharge>>;
    getBidLeads(gcPrincipal: Principal): Promise<Array<BidLead>>;
    getBidLevelingSheets(tenantId: bigint, projectId: string): Promise<Array<BidLevelingSheet>>;
    getBidToken(bidId: string): Promise<BidToken | null>;
    getCSIFormById(tenantId: string, formId: string): Promise<CSIFormRecord | null>;
    getCSIFormsByProject(tenantId: string, projectId: string): Promise<Array<CSIFormRecord>>;
    getCSIFormsByType(tenantId: string, projectId: string, formType: string): Promise<Array<CSIFormRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCaseStudyLibrary(): Promise<Array<CaseStudy>>;
    getCertCompliance(projectId: string): Promise<{
        compliant: boolean;
        missingCerts: Array<string>;
        complianceScore: number;
    }>;
    getCertsByProject(projectId: string): Promise<Array<WorkerCert>>;
    getChangeOrders(tenantId: bigint, projectId: string): Promise<Array<ChangeOrder__2>>;
    getChatHistory(sessionId: string): Promise<HistoryResult>;
    getCommandCenterData(tenantId: bigint, role: ViewRole): Promise<CommandCenterData>;
    getComments(mediaId: string, tenantId: string): Promise<Array<Comment>>;
    getCompanyProfile(tenantId: string): Promise<CompanyProfile | null>;
    getCompletionToken(tokenId: string): Promise<CompletionTokenRecord | null>;
    getComplianceByProject(projectId: string, date: string): Promise<Array<JSADailyRecord>>;
    getComplianceCert(certId: string): Promise<ComplianceCert | null>;
    getComplianceMetrics(tenantId: bigint, role: ViewRole): Promise<ComplianceMetrics>;
    getComplianceSummary(tenantId: string, startDate: string, endDate: string): Promise<ComplianceSummary>;
    getConsolidatedPayApps(tenantId: bigint, projectId: string): Promise<{
        count: bigint;
        netDue: bigint;
        totalRetained: bigint;
        totalBilled: bigint;
    }>;
    getContact(id: bigint): Promise<Contact | null>;
    getContractRiskLibrary(): Promise<Array<ContractRiskClause>>;
    getControlByLevel(level: ControlLevel__1): Promise<ControlOption | null>;
    getControlsForFocusFour(cat: FocusFourCategory): Promise<Array<ControlOption>>;
    getCorrectiveTemplates(): Promise<Array<CorrectiveTemplate>>;
    getCostEstimates(tenantId: bigint, projectId: string): Promise<Array<CostEstimate>>;
    getCultureScores(tenantId: string): Promise<Array<SafetyCultureScore>>;
    getDashboardSummary(tenantId: string): Promise<TagDashboardSummary>;
    getDavisBaconWage(county: string, state: string, trade: string): Promise<DavisBaconRecord | null>;
    getDefaultGoNoGoFactors(projectType: string, estimatedValue: number): Promise<Array<GoNoGoFactor>>;
    getDefaultPaymentTerms(contractValue: bigint): Promise<PaymentTerms>;
    getDesignProject(id: DesignProjectId): Promise<DesignProject | null>;
    getDocumentCount(tenantId: string): Promise<bigint>;
    getDocumentDraft(draftId: string, tenantId: string): Promise<DocumentDraft | null>;
    getDocumentMeta(templateId: string): Promise<ExtendedTemplateMeta | null>;
    getDocumentMetaByVertical(vertical: string): Promise<Array<ExtendedTemplateMeta>>;
    getDocumentSendHistory(documentId: string, tenantId: string): Promise<Array<DocumentSendRecord>>;
    getEMRRecord(tenantId: string, subName: string): Promise<EMRRecord | null>;
    getERAESummary(tenantId: Principal): Promise<{
        openCorrectiveActions: bigint;
        totalProjects: bigint;
        incidentRateVsIndustry: number;
        topHazardCategories: Array<{
            count: bigint;
            category: string;
        }>;
        riskScore: number;
        criticalHazards: bigint;
    }>;
    getEngineAuditLog(engine: string, limit: bigint): Promise<Array<AuditEntry>>;
    /**
     * / Returns CPL law report for the specified engine domain.
     * / engineId must be one of: "scope", "safety", "scheduling", "logistics"
     */
    getEngineGovernanceReport(engineId: string): Promise<EngineGovernanceReport>;
    getEnterpriseReport(reportId: string): Promise<EnterpriseRiskReport | null>;
    getEnterpriseReports(tenantId: string): Promise<Array<EnterpriseRiskReport>>;
    getEquipmentRentalRate(equipment: string, region: string, duration: string): Promise<RentalRate | null>;
    getExcelPackage(packageId: string): Promise<ExcelPackage | null>;
    getExecutiveSummary(tenantId: bigint, role: ViewRole): Promise<ExecutiveSummary>;
    getExpiringCerts(withinDays: bigint): Promise<Array<CertAlert>>;
    getFIEHistory(tenantId: bigint, projectId: string): Promise<Array<FIEWorkResult>>;
    getFIESummary(tenantId: bigint): Promise<FIESummary>;
    getFinancialEvidenceScores(tenantId: bigint, projectId: string): Promise<Array<{
        engineId: string;
        resultId: string;
        confidence: bigint;
    }>>;
    getFinancialMetrics(tenantId: bigint, role: ViewRole): Promise<FinancialMetrics>;
    getFocusFourCategories(): Promise<Array<string>>;
    getFocusFourHazard(cat: FocusFourCategory): Promise<FocusFourHazard | null>;
    getFreeHazardLibrary(keyword: string): Promise<Array<HazardEntry>>;
    getFurnitureModelFor3D(modelId: string): Promise<FurnitureModel3D | null>;
    getGoNoGoResult(tenantId: bigint, projectId: string): Promise<GoNoGoResult__1 | null>;
    getGoNoGoResults(tenantId: bigint): Promise<Array<GoNoGoResult__1>>;
    getGoNoGoScore(bidId: string, tenantId: bigint): Promise<GoNoGoScore>;
    getGreenBuildingPremium(certification: string, buildingType: string): Promise<GreenPremium | null>;
    getGroqKeyStatus(): Promise<GroqKeyStatus>;
    /**
     * / Returns "configured:gsk_vncC...t4Ys" to confirm key presence without exposing it.
     * / Frontend uses this to show LIVE badge on PRO-1 chat drawer.
     */
    getGroqKeyStatusConfirmed(): Promise<string>;
    getGroqUsageStats(dateFilter: string | null): Promise<UsageStatsResult>;
    getHandoff(handoffId: bigint): Promise<Handoff | null>;
    getHandoffDeliveryStatus(handoffId: bigint): Promise<{
        recipientGroups: Array<RecipientGroup>;
        overallStatus: string;
    }>;
    getHierarchyOfControls(): Promise<Array<ControlLevel>>;
    /**
     * / Get hospitality brand standards for a brand.
     */
    getHospitalityBrandStandards(brand: string): Promise<{
        complianceItems: Array<string>;
        oisNotes: string;
        ffeReplacementYrs: bigint;
        requiresMockup: boolean;
        budgetHigh: number;
        brand: string;
        finishGrade: string;
        budgetLow: number;
    } | null>;
    getIFCElementsByType(projectId: string, elementType: string): Promise<Array<IFCElement>>;
    getIFCMetadata(projectId: string): Promise<IFCMetadata | null>;
    getITB(tenantId: bigint, itbId: string): Promise<ITBRecord__1 | null>;
    getITBs(tenantId: bigint): Promise<Array<ITBRecord__1>>;
    getIndustryPercentile(toolType: string, value: number): Promise<PercentileResult | null>;
    getInspectionChecklists(): Promise<Array<InspectionChecklist>>;
    getJSAProQuestions(activityName: string): Promise<{
        q1: string;
        q2: string;
        q3: string;
    } | null>;
    getJobCostReport(tenantId: bigint, projectId: string): Promise<{
        actual: bigint;
        variance: bigint;
        committed: bigint;
        budgeted: bigint;
    }>;
    getLeadTimesByCategory(tenantId: bigint, category: MaterialCategory, region: string): Promise<Array<LeadTimeRecord>>;
    getLeadingIndicators(projectId: string, tenantId: string): Promise<Array<CultureLeadingIndicator>>;
    getLienWaivers(tenantId: bigint, projectId: string): Promise<Array<LienWaiver__2>>;
    getLongLeadItems(tenantId: bigint, projectId: string): Promise<Array<LongLeadItem>>;
    /**
     * / Get material escalation data for current market conditions.
     */
    getMaterialEscalationData(): Promise<Array<{
        trend: string;
        source: string;
        yoyPct: number;
        material: string;
    }>>;
    getMaterialFor3D(materialId: string): Promise<Material3D | null>;
    getMaterialLeadTime(materialType: string, csiDiv: string): Promise<LeadTimeData | null>;
    getMediaById(mediaId: string, tenantId: string): Promise<SMResult>;
    getMediaBySession(sessionId: string, tenantId: string): Promise<Array<MediaAsset>>;
    getMitigationPlan(hazardDescription: string, feasibleLevels: Array<ControlLevel__1>, cfr: string): Promise<HazardMitigationResult>;
    getMyAllAnnotations(): Promise<Array<ResearchAnnotation>>;
    getMyAnnotations(entryId: bigint): Promise<Array<ResearchAnnotation>>;
    getMyCompanyProfile(): Promise<CompanyProfile | null>;
    getMyProjectReports(): Promise<Array<ProjectReport>>;
    getMySafetyReports(): Promise<Array<SafetyReportRecord>>;
    getMyToolResults(): Promise<Array<SavedToolResult>>;
    getNextBestActions(gcPrincipal: Principal): Promise<Array<NextBestAction>>;
    getNextSessionTokenNumber(clientId: string, tenantId: string): Promise<bigint>;
    getNexusBrainState(): Promise<NexusBrainState | null>;
    getNexusStats(): Promise<NexusStats | null>;
    getOSHA300ASummaries(): Promise<Array<OSHA300AEntry>>;
    getOSHA300ByYear(year: bigint): Promise<Array<OSHA300Entry__1>>;
    getOSHA300Log(): Promise<Array<OSHA300Entry__1>>;
    getOSHA300LogByYear(tenantId: string, year: string): Promise<Array<OSHA300Entry>>;
    getOSHA301ByCaseNo(caseNo: bigint): Promise<OSHA301Entry | null>;
    getOSHA301Log(): Promise<Array<OSHA301Entry>>;
    getOSHADataStatus(): Promise<OSHADataStatus>;
    getOSHADocById(tenantId: string, docId: string): Promise<OSHADocRecord | null>;
    getOSHADocsByProject(tenantId: string, projectId: string): Promise<Array<OSHADocRecord>>;
    getOSHAInspections(naicsCode: string, state: string, limit: bigint): Promise<Array<OSHAInspection>>;
    getOSHASubpart(subpart: string): Promise<OSHASubpart | null>;
    getOSHAViolations(naicsCode: string, limit: bigint): Promise<Array<OSHAViolation>>;
    getOllamaDefaultModel(): Promise<string>;
    /**
     * / Get OSHA 1926 subpart listing — all subparts with titles.
     */
    getOsha1926Subparts(): Promise<Array<{
        title: string;
        subpart: string;
        severity: string;
    }>>;
    getOsha300Log(tenantId: string): Promise<Array<Osha300Record>>;
    getOsha301Log(tenantId: string): Promise<Array<Osha301Record>>;
    getOsha301Record(caseNo: string): Promise<Osha301Record | null>;
    getOshaHazardsByTrade(trade: string): Promise<Array<OshaHazard>>;
    getOshaViolations(): Promise<Array<OshaViolation>>;
    getOverdueCrews(tenantId: string): Promise<Array<JSADailyRecord>>;
    getPDFTemplate(toolName: string): Promise<PDFTemplate | null>;
    getPSIEHistory(tenantId: bigint, projectId: string): Promise<Array<PSIEWorkResult>>;
    getPayAppToken(tokenId: string): Promise<PayAppTokenRecord | null>;
    getPayApplications(sovId: string): Promise<Array<PayApplication__1>>;
    getPayApps(tenantId: bigint, projectId: string): Promise<Array<PayApplication>>;
    getPendingMessages(toModule: string | null): Promise<Array<TokenMessage>>;
    /**
     * / Return a lightweight status summary for the perception engine layer.
     */
    getPerceptionEngineStatus(): Promise<{
        totalAnalyses: bigint;
        lastAnalysisTime: bigint;
        engines: Array<string>;
    }>;
    /**
     * / Return the perception analysis history for the authenticated caller.
     */
    getPerceptionHistoryForCaller(): Promise<Array<PerceptionHistoryEntry>>;
    getPipelineDeals(gcPrincipal: Principal): Promise<Array<PipelineDeal>>;
    getPipelineIntelligence(): Promise<{
        activeDeals: bigint;
        totalPipelineValue: number;
        atRiskDealIds: Array<string>;
        nexusInsights: Array<string>;
    }>;
    getPlatformPrincipals(): Promise<{
        messaging?: Principal;
        workspaceLib?: Principal;
        nexus?: Principal;
        workspace?: Principal;
    }>;
    getPrincipalAuthStatus(principal: Principal): Promise<PrincipalAuthStatus>;
    getPrincipalToolResults(principal: Principal, limit: bigint): Promise<Array<ToolResultRecord>>;
    getProcurementHistory(tenantId: bigint, projectId: string): Promise<Array<ProcurementWorkResult>>;
    getProject(id: bigint): Promise<Project>;
    getProjectIntelligenceScore(tenantId: bigint, projectId: string): Promise<bigint>;
    getProjectPipeline(tenantId: bigint, role: ViewRole): Promise<Array<ProjectPipelineRow>>;
    getProjectReportById(id: bigint): Promise<ProjectReport | null>;
    getProjectSafetyDashboard(projectId: string): Promise<{
        lastInspectionDate: string;
        sessionCompliancePercent: number;
        incidentCount: bigint;
        activeHazards: bigint;
        openTags: bigint;
    }>;
    /**
     * / Generate a full multi-step Job Safety Analysis for a given trade and task.
     * / Hazard library drawn from OSHA 1926 subparts — no external calls.
     * / Compute a real-time project safety score drawing from certification records.
     */
    getProjectSafetyScore(projectId: string): Promise<{
        trend: string;
        overallScore: number;
        openHazardCount: bigint;
        nexusFlags: Array<string>;
        certificationCompliance: number;
        incidentRate: number;
    }>;
    getProjectSummary(tenantId: bigint, projectId: string): Promise<{
        changeOrderCount: bigint;
        highRiskCOs: bigint;
        openRFICount: bigint;
        intelligenceScore: bigint;
        estimateCount: bigint;
        activityCount: bigint;
    }>;
    getProjectTokenState(tenantId: string, projectId: string): Promise<{
        payAppTokens: Array<string>;
        bidTokens: Array<string>;
        awardTokens: Array<string>;
        completionTokens: Array<string>;
    }>;
    getProtocolsByCategory(category: string): Promise<Array<ProtocolEntry>>;
    getPurchaseOrders(tenantId: bigint, projectId: string): Promise<Array<PurchaseOrder>>;
    getRFIs(tenantId: bigint, projectId: string): Promise<Array<RFI__1>>;
    getReceiptById(id: string): Promise<SafetyReceipt | null>;
    getReceiptsByTenant(tenantId: string): Promise<Array<SafetyReceipt>>;
    getRecentActivity(tenantId: string, limit: bigint): Promise<Array<TagActivity>>;
    getRecentDocuments(tenantId: string): Promise<Array<DocumentResult>>;
    getRecordkeepingStats(year: bigint, hoursWorked: bigint): Promise<RecordkeepingStats>;
    /**
     * / Get regional cost index multipliers for a region.
     */
    getRegionalCostIndex(region: string): Promise<{
        region: string;
        trades: Array<{
            multiplier: number;
            trade: string;
        }>;
        note: string;
        generalMultiplier: number;
    }>;
    getRelationshipScorecards(): Promise<Array<GCRelationship>>;
    getResearchEntriesByCategory(category: string): Promise<Array<ResearchEntry>>;
    getRetainageSummary(tenantId: bigint, projectId: string): Promise<{
        held: bigint;
        rate: bigint;
        released: bigint;
    }>;
    getRfqs(tenantId: bigint, projectId: string): Promise<Array<RfqRecord>>;
    getSCBidToken(tokenId: string): Promise<BidTokenRecord | null>;
    getSCIEScore(tenantId: Principal): Promise<{
        overallScore: number;
        correctiveActionClosure: number;
        prediction90Day: number;
        nearMissRate: number;
        trainingCompletion: number;
        prediction60Day: number;
        leadingIndicatorScore: number;
        prediction30Day: number;
    }>;
    getSOV(sovId: string): Promise<ScheduleOfValues | null>;
    getSSSP(ssspId: string): Promise<SSSPRecord | null>;
    getSSSPResult(ssspId: string): Promise<SSSPResult | null>;
    getSafetyDocument(id: bigint): Promise<SafetyDocument>;
    /**
     * / Get OSHA hazard library for a trade type.
     */
    getSafetyHazardLibrary(tradeType: string): Promise<Array<{
        ppe: Array<string>;
        title: string;
        hazards: Array<string>;
        subpart: string;
        controls: Array<string>;
        severity: string;
    }>>;
    getSafetyMetrics(tenantId: bigint, role: ViewRole): Promise<SafetyMetrics>;
    getSafetyPPEByTrade(trade: string): Promise<Array<PPERequirement>>;
    getSafetyProtocolTemplates(): Promise<Array<ProtocolTemplate>>;
    getSafetyRecordById(id: string): Promise<SafetyToolRecord | null>;
    getSafetyRecordsByProject(projectId: string): Promise<Array<SafetyToolRecord>>;
    getSafetyRecordsByTenant(tenantId: string): Promise<Array<SafetyToolRecord>>;
    getSafetyRecordsByToolType(tenantId: string, toolType: SafetyToolType): Promise<Array<SafetyToolRecord>>;
    getSafetyReportsByTenant(tenantId: string): Promise<Array<SafetyReportRecord>>;
    getScheduleActivities(tenantId: bigint, projectId: string): Promise<Array<ScheduleActivity>>;
    getSessionMediaSummary(sessionId: string, tenantId: string): Promise<SessionMediaSummary>;
    getSharedReport(shareToken: string): Promise<SharedReportResponse | null>;
    getSignatureEnvelope(envelopeId: string): Promise<ESignatureEnvelope | null>;
    getSignaturesForDocument(documentId: string): Promise<Array<SignatureRecord>>;
    getSmartContract(contractId: string): Promise<SmartContract | null>;
    getStandardFlowDownProvisions(): Promise<Array<FlowDownProvision>>;
    getSubCloseoutChecklist(tenantId: bigint, projectId: string): Promise<Array<SubCloseoutDoc>>;
    getSubIntakeResult(tenantId: string, subName: string): Promise<IntakeResult | null>;
    getSubPaymentHistory(tenantId: bigint, subId: string, projectId: string): Promise<Array<SubPaymentRecord>>;
    getSubPerformanceHistory(tenantId: bigint, subId: string): Promise<Array<SubPerformanceRecord>>;
    getSubPortal(subName: string, tenantId: string): Promise<SubPortalEntry | null>;
    getSubPrequals(tenantId: bigint): Promise<Array<SubPrequalification>>;
    getSubcontracts(tenantId: bigint, projectId: string): Promise<Array<SubcontractRecord>>;
    getSubpartsForFocusFour(cat: FocusFourCategory): Promise<Array<OSHASubpart>>;
    getSupplier(tenantId: bigint, supplierId: string): Promise<SupplierRecord | null>;
    getSuppliers(tenantId: bigint, category: MaterialCategory | null): Promise<Array<SupplierRecord>>;
    getTag(id: bigint): Promise<SafetyTag | null>;
    getTagCategories(): Promise<Array<TagCategory>>;
    getTagComments(tagId: bigint): Promise<Array<TagComment>>;
    getTagInvite(token: string): Promise<TagInvite | null>;
    getTagNotifications(principal: Principal): Promise<Array<TagNotification>>;
    getTagsByProject(tenantId: string, projectId: string): Promise<Array<SafetyTag>>;
    getTeamChat(tenantId: string, sessionId: string): Promise<TenantChatResult>;
    getTemplateById(templateId: string): Promise<DocumentTemplate | null>;
    getTemplateLibrary(): Promise<Array<DocumentTemplate>>;
    getTemplatesByCategory(category: string): Promise<Array<DocumentTemplate>>;
    getTemplatesByIndustry(industry: string): Promise<Array<DocumentTemplate>>;
    getTenant(tenantId: TenantId): Promise<TenantPublic | null>;
    getTenantActivityFeed(tenantId: bigint): Promise<Array<ActivityFeedItem>>;
    getTenantActivityLog(tenantId: TenantId, limit: bigint): Promise<Array<ActivityRecord>>;
    getTenantChatHistory(tenantId: string, sessionId: string): Promise<TenantChatResult>;
    getTenantChatSessions(tenantId: string): Promise<Array<string>>;
    getTenantContext(tenantId: TenantId): Promise<TenantContext>;
    getTenantEnvelopes(tenantId: string): Promise<Array<ESignatureEnvelope>>;
    getTenantMembers(tenantId: TenantId): Promise<Array<MemberPublic>>;
    getTenantTags(tenantId: string, limit: bigint, offset: bigint): Promise<Array<SafetyTag>>;
    getTokenAuditLog(tenantId: string, tokenId: string | null, limit: bigint): Promise<Array<TokenAuditEntry>>;
    getTokenById(id: string): Promise<SessionToken | null>;
    getTokensByClient(clientId: string, tenantId: string): Promise<Array<SessionToken>>;
    getTokensByProject(projectId: string): Promise<Array<SessionToken>>;
    /**
     * / Get benchmark comparison for a specific tool result from the Workspace Library.
     */
    getToolBenchmarkComparison(toolId: string, result: string): Promise<{
        result: string;
        anomalyFlag: boolean;
        dataSource: string;
        benchmarkMedian: string;
        toolId: string;
        regionNote: string;
    }>;
    /**
     * / Get all CSI divisions covered by the Workspace Library.
     */
    getToolCsiDivisions(): Promise<Array<{
        title: string;
        division: bigint;
        scopeItems: Array<string>;
    }>>;
    getToolResultById(id: bigint): Promise<SavedToolResult | null>;
    getToolboxSession(sessionId: string): Promise<ToolboxSession | null>;
    getToolboxSessionsByTenant(tenantId: string): Promise<Array<ToolboxSession>>;
    getUnreadNotificationCount(principal: Principal): Promise<bigint>;
    getUserTenants(): Promise<Array<TenantPublic>>;
    getVEProposals(tenantId: bigint, projectId: string): Promise<Array<VEProposal>>;
    getVHDEAnalysisResult(imageRef: string): Promise<VisualHazardDetection | null>;
    getVHDEResult(mediaId: string, tenantId: string): Promise<SMResult_2>;
    getVHDEStats(): Promise<VHDEStats>;
    getWLBenchmarkSummary(): Promise<{
        totalMaterials: bigint;
        totalScopeTemplates: bigint;
        totalSafetyProtocols: bigint;
        totalLaborRates: bigint;
        totalBenchmarks: bigint;
    }>;
    getWLResultLog(limit: bigint): Promise<Array<[string, number, bigint]>>;
    /**
     * / Returns all benchmarks for a tool category and region for benchmark comparison charts.
     * / Sources data exclusively from workspaceLibrary.mo — no hardcoded values.
     * / CPL authority: PublicAccess level.
     */
    getWorkspaceLibraryBenchmarks(toolCategory: string, region: string): Promise<Array<{
        metricLabel: string;
        industryRangeHigh: bigint;
        industryRangeLow: bigint;
        gcHistoricalAvg: bigint;
        libraryMedian: bigint;
    }>>;
    getWrittenSafetyProgram(shortCode: string): Promise<WrittenSafetyProgram | null>;
    getWrittenSafetyProgramById(id: bigint): Promise<WrittenSafetyProgram | null>;
    goNoGoScore(input: {
        teamSize: bigint;
        projectType: string;
        estimatedValue: number;
        activeProjectCount: bigint;
        scheduleWeeks: bigint;
        location: string;
        safetyIncidentRate: number;
    }): Promise<{
        compositeScore: number;
        recommendation: string;
        dimensions: Array<{
            weight: number;
            name: string;
            score: number;
        }>;
    }>;
    grantAgentDocumentAccess(docId: string, agentPrincipal: Principal): Promise<void>;
    inviteMember(tenantId: TenantId, invitee: Principal, roles: Array<Role>): Promise<void>;
    inviteSubs(bidId: string, scopes: Array<string>): Promise<Array<SubInvite> | null>;
    inviteSuppliers(tenantId: bigint, rfqId: string, supplierIds: Array<string>): Promise<RfqRecord>;
    /**
     * / Unified tool invocation entry point that routes through the BHX colony pipeline.
     * / Colony Unification Theorem: T ⊆ W — every tool invocation IS a Worker task.
     * / Assigns a BHX Worker task (Nurse→HouseBee→Forager) in stable memory.
     * / Emits pheromone (Recruitment or Alarm) based on result deviation.
     * / If result deviates >20% from WL benchmark → escalates Drone anomaly.
     * / CPL authority: GCUser level minimum.
     */
    invokeToolThroughBHX(toolId: string, params: {
        region: string;
        csidivision: string;
        trade: string;
        inputs: Array<[string, string]>;
    }): Promise<{
        pheromoneSignalId: string;
        result: Array<[string, string]>;
        nexusInsightIds: Array<string>;
        workerId: string;
    }>;
    invokeToolThroughColony(toolId: string, paramsJson: string): Promise<{
        result: string;
        workerId: string;
        workerStage: string;
        anomalyDetected: boolean;
        pheroSignalId: string;
        confidence: number;
    }>;
    isCallerAdmin(): Promise<boolean>;
    isOllamaAvailable(): Promise<boolean>;
    issueBackCharge(tenantId: bigint, subId: string, projectId: string, description: string, amount: bigint, csiDivision: string, incidentDate: bigint): Promise<BackCharge>;
    issueLOI(tenantId: bigint, projectId: string, supplierId: string, supplierName: string, materialDescription: string, csiCode: string, estimatedValue: bigint, requiredOnSite: bigint): Promise<LOIRecord>;
    issuePurchaseOrder(tenantId: bigint, projectId: string, supplierId: string, supplierName: string, poNumber: string, lineItems: Array<POLineItem>, deliveryAddress: string, requiredDate: bigint, loiId: string | null): Promise<PurchaseOrder>;
    levelBidConnect(bidId: string): Promise<LeveledBid | null>;
    levelBids(tenantId: bigint, projectId: string, title: string, csiDivision: string, entries: Array<BidLevelingEntry>): Promise<BidLevelingSheet>;
    levelSubBids(bids: Array<BidRecord>): Promise<BidLevelingResult>;
    linkMediaToSafetyTag(mediaId: string, tagId: bigint, tenantId: string): Promise<SMResult>;
    listAIATenantDocs(tenantId: string): Promise<Array<AIADocRecord>>;
    listBidTokens(tenantId: string): Promise<Array<BidToken>>;
    listCSITenantForms(tenantId: string): Promise<Array<CSIFormRecord>>;
    listContacts(): Promise<Array<Contact>>;
    listContactsByRole(role: string): Promise<Array<Contact>>;
    listDesignComments(projectId: DesignProjectId, versionId: DesignVersionId | null): Promise<Array<DesignComment>>;
    listDesignProjects(): Promise<Array<DesignProject>>;
    listDesignRenders(projectId: DesignProjectId): Promise<Array<DesignRender>>;
    listFocusFourHazards(): Promise<Array<FocusFourHazard>>;
    listHandoffs(): Promise<Array<Handoff>>;
    listHandoffsByProject(projectId: string): Promise<Array<Handoff>>;
    listHierarchyOfControls(): Promise<Array<ControlOption>>;
    listLienWaivers(bidId: string, tenantId: string): Promise<Array<LienWaiver>>;
    listModelsByCategory3D(category: string, limit: bigint): Promise<Array<FurnitureModel3D>>;
    listOSHASubparts(): Promise<Array<OSHASubpart>>;
    listOSHATenantDocs(tenantId: string): Promise<Array<OSHADocRecord>>;
    listPayAppTokens(tenantId: string, projectId: string | null): Promise<Array<PayAppTokenRecord>>;
    listProjects(tenantId: bigint): Promise<Array<ProjectRecord__1>>;
    listProtectedRoutes(): Promise<Array<ProtectedRoute>>;
    listSmartContracts(tenantId: string): Promise<Array<SmartContract>>;
    listWrittenSafetyPrograms(): Promise<Array<WrittenSafetyProgram>>;
    logAgentAction(agentId: string, actionType: Variant_auditProject_chat_smsMessage_sendInvoice_sendAlert_sendPaymentLink_deployEstimate, resultSummary: string): Promise<string>;
    logEngineDecision(engine: string, inputSummary: string, decision: string, reasoning: string, citations: Array<Citation>, modelUsed: string, confidence: number): Promise<string>;
    logPreBidMeeting(tenantId: bigint, projectId: string, meetingDate: bigint, location: string, attendees: Array<string>, agendaItems: Array<string>, minutesSummary: string, questionsAnswers: Array<[string, string]>): Promise<PreBidMeeting>;
    logSiteVisit(tenantId: bigint, projectId: string, visitDate: bigint, attendees: Array<string>, siteConditions: string, accessRequirements: string, notes: string): Promise<SiteVisitLog>;
    markAllNotificationsRead(): Promise<STResult>;
    markCloseoutDocReceived(tenantId: bigint, docId: string): Promise<SubCloseoutDoc>;
    markMessageDelivered(messageId: string): Promise<void>;
    markNotificationRead(notifId: bigint): Promise<STResult>;
    markSubPaymentPaid(tenantId: bigint, paymentId: string): Promise<SubPaymentRecord>;
    matchReferenceProject(projectType: string, scopeTypes: Array<string>): Promise<CRMProjectRecord | null>;
    meGetChargerAuditLog(): Promise<Array<ChargerAuditEntry>>;
    meGetChargerState(): Promise<ChargerState>;
    meGetDeliveryLog(messageId: string): Promise<DeliveryLog | null>;
    meGetMessageHistory(agentId: string): Promise<Array<MessageRecord>>;
    /**
     * / Get the native outbound message queue.
     */
    meGetNativeMessageQueue(): Promise<Array<MessageRecord>>;
    meReceiveSMSInbound(activationCode: string, fromNumber: string, content: string): Promise<void>;
    /**
     * / Register an activation code for native agent bridging.
     */
    meRegisterActivationCode(activationCode: string, agentId: string): Promise<void>;
    /**
     * / Route a message through the native agent layer.
     */
    meRouteAgentMessage(agentId: string, content: string): Promise<NativeMessageResult>;
    meSendChatMessage(agentId: string, content: string): Promise<ChatMessageResult>;
    /**
     * / Send a native ICP-routed message; fires a BHX Worker task fire-and-forget.
     */
    meSendNativeMessage(recipient: Principal, content: string, priority: bigint): Promise<NativeMessageResult>;
    meSendSMSMessage(agentId: string, toNumber: string, content: string): Promise<SMSResult>;
    meSetTwilioConfig(accountSid: string, authToken: string, fromNumber: string): Promise<void>;
    mintSessionToken(input: MintTokenInput): Promise<SessionToken>;
    ollamaChat(message: string, model: string, sessionId: string): Promise<OllamaAlignmentResult>;
    ollamaEvidenceQuery(prompt: string, model: string): Promise<string>;
    ollamaHealthCheck(): Promise<boolean>;
    ollamaListModels(): Promise<{
        __kind__: "ok";
        ok: Array<string>;
    } | {
        __kind__: "err";
        err: string;
    } | {
        __kind__: "unavailable";
        unavailable: null;
    }>;
    optimizeCrewAvailability(activeProjectCount: bigint, scopeTypes: Array<string>, geographicSpreadMiles: number): Promise<{
        totalCrewNeeded: bigint;
        recommendation: string;
        crewAllocations: Array<{
            canRunConcurrent: boolean;
            scope: string;
            recommendedCrew: bigint;
            bottleneckRisk: number;
        }>;
    }>;
    optimizeDemoInstallSequence(projectType: string, scopeList: Array<string>, floorCount: bigint): Promise<{
        totalDurationDays: bigint;
        sequencedPhases: Array<{
            durationDays: bigint;
            trades: Array<string>;
            phase: bigint;
            parallelWorkWindows: Array<string>;
        }>;
        criticalPath: Array<string>;
    }>;
    performVHDEAnalysis(imageRef: string, projectType: string, tradeContext: string): Promise<VisualHazardDetection>;
    persistTeamChat(tenantId: string, sessionId: string, userId: string, userRole: string, content: string, pageContext: string, _language: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    planCrewDispatch(projectLocation: string, crewCount: bigint, projectDurationDays: bigint): Promise<CrewDispatchResult>;
    planRenovationPhases(totalRooms: bigint, phasedRooms: bigint, occupancyConstraintPct: bigint, scopeTypes: Array<string>, startMonth: string): Promise<RenovationPhaseResult>;
    predictSchedule(tenantId: bigint, projectId: string): Promise<SchedulePrediction>;
    predictiveIncidentModeling(workforceSize: bigint, projectType: string, durationWeeks: bigint, recordableRate: number, nearMissLastMonth: bigint, weatherCondition: string): Promise<IncidentPrediction>;
    pro1GenerateJSA(tenantId: string, projectType: string, trade: string, taskDescription: string): Promise<JSAOutputShared>;
    pro1GeneratePayApp(tenantId: string, projectId: string, applicationNo: bigint, periodStart: bigint, periodEnd: bigint, contractSum: number, netChangeOrders: number, retainagePercent: number, previousPayments: number, sovItems: Array<[string, number, number, number]>): Promise<PayAppOutputShared>;
    publishITB(itbId: bigint, invitedSubs: Array<Principal>): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    queryAgentActionLog(): Promise<Array<AgentActionLog>>;
    queryAgentActionLogForAgent(agentId: string): Promise<Array<AgentActionLog>>;
    queryAgentById(agentId: string): Promise<AgentRecord | null>;
    queryAgentsForPrincipal(): Promise<Array<AgentRecord>>;
    queryAnomaliesForProject(projectId: bigint): Promise<AnomalyReport>;
    /**
     * / analyzeRFIImpactDetailed — per-RFI schedule and cost impact with priority scoring
     * / generatePreTaskPlanDetailed — rich pre-task plan with crew assignment and production calc
     * / generatePDF — base64-encoded HTML document formatted for browser print-to-PDF
     * / Delegate to WorkspaceLibrary.queryBenchmark — sovereign benchmark data query.
     * / industry: e.g. "Hospitality", "Multifamily", "Healthcare", "Construction"
     * / csiDivision: e.g. "09", "Division 9", "Finishes"
     * / metric: "labor_rate" | "material_cost" | "productivity" | <custom>
     */
    queryBenchmark(industry: string, csiDivision: string, metric: string): Promise<{
        avg: number;
        max: number;
        min: number;
        stdDev: number;
    }>;
    queryBidInviteByCode(code: string): Promise<BidInviteRecord | null>;
    queryBidInvitesForGC(): Promise<Array<BidInviteRecord>>;
    queryBidResponsesForITB(itbId: bigint): Promise<Array<BidResponse>>;
    queryCRMPipeline(): Promise<Array<CRMPipelineItem>>;
    queryCRMProjects(): Promise<Array<CRMProjectRecord>>;
    queryChangeOrderQueue(projectId: bigint): Promise<Array<ChangeOrder>>;
    queryCloseoutReadiness(projectId: bigint): Promise<CloseoutReadiness>;
    queryExpiringCertifications(): Promise<Array<SafetyCertRecord>>;
    queryFurnitureModels(filter: FurnitureQuery): Promise<Array<FurnitureModel>>;
    queryGCRelationshipScores(): Promise<Array<GCRelationshipScore>>;
    queryITBsForGC(): Promise<Array<ITBRecord>>;
    queryITBsForSub(): Promise<Array<ITBRecord>>;
    queryMaterialLibrary(filter: MaterialQuery): Promise<Array<MaterialLibraryEntry>>;
    queryMyBidResponses(): Promise<Array<BidResponse>>;
    queryMyBundleConfigs(): Promise<Array<BundleConfig>>;
    queryNexusBidScoreForResponse(bidResponseId: string): Promise<NexusBidScore | null>;
    queryNexusBidScores(itbId: string): Promise<Array<NexusBidScore>>;
    queryPhaseTransitionRecommendation(projectId: bigint): Promise<PhaseRecommendation>;
    queryProjectDetail(projectId: bigint): Promise<[ProjectRecord, ProjectIntelligence | null] | null>;
    queryProjectsForGC(): Promise<Array<ProjectRecord>>;
    queryProjectsForSub(): Promise<Array<ProjectRecord>>;
    querySMSBridge(): Promise<SMSBridgeRecord | null>;
    querySafetyVault(projectId: bigint): Promise<Array<SafetyDocVault>>;
    querySubWorkspace(projectId: bigint): Promise<SubWorkspaceView>;
    querySubmissionsForProject(projectId: bigint): Promise<ProjectSubmissions>;
    queryVirtualDocumentById(docId: string): Promise<VirtualDocument | null>;
    queryVirtualDocuments(): Promise<Array<VirtualDocument>>;
    /**
     * / Returns sovereign benchmark rates for a given trade, region, and CSI division.
     * / Pulls exclusively from workspaceLibrary.mo — no hardcoded numbers.
     * / CPL authority: PublicAccess level (any caller).
     */
    queryWorkspaceLibraryRates(trade: string, region: string, csidivision: string): Promise<{
        productivityRate: bigint;
        benchmarkMedian: bigint;
        industryRangeHigh: bigint;
        industryRangeLow: bigint;
        laborRate: bigint;
        materialCostMax: bigint;
        materialCostMin: bigint;
    }>;
    rankControlForHazard(hazardDescription: string, existingControlLevel: bigint): Promise<ControlLevel>;
    rankJSAControls(proposedControls: Array<string>): Promise<JSAControlRanking>;
    recommendSubstitutions(tenantId: bigint, primaryMaterial: string, category: MaterialCategory, reason: string): Promise<SubstitutionReport>;
    recordAward(leadId: string, packageId: string, awardedSub: Principal, awardedAmount: number): Promise<AwardRecord>;
    recordDailyJSA(input: JSADailyInput): Promise<JSADailyRecord>;
    recordEMR(tenantId: string, subName: string, emr: number, ratingYear: bigint): Promise<EMRRecord>;
    recordJSACompletion(crewId: string, jsaId: string, date: string): Promise<JSADailyRecord>;
    recordLeadingIndicator(projectId: string, tenantId: string, indicatorType: string, value: number): Promise<boolean>;
    recordPDFGeneration(toolName: string, principal: Principal, timestamp: bigint): Promise<void>;
    recordProjectOutcome(gcPrincipal: Principal, projectName: string, buildingType: string, contractValue: number, actualCost: number, plannedDays: bigint, actualDays: bigint, qualityScore: number): Promise<GCRelationship>;
    recordQRAttendance(sessionId: string, workerId: string, qrCode: string): Promise<boolean>;
    recordSafetyDocument(projectId: bigint, docType: string, documentHash: string): Promise<bigint>;
    recordSubPayment(tenantId: bigint, subId: string, projectId: string, payAppNo: bigint, periodEnd: bigint, contractValue: bigint, previousBilled: bigint, currentBilling: bigint, retainagePct: bigint, lienWaiverType: string): Promise<SubPaymentRecord>;
    recordTokenApproval(tokenId: string, tokenKind: TokenKind, approverRole: string, approverName: string, approved: boolean, comments: string): Promise<ApprovalRecord | null>;
    /**
     * / Feeds a tool result back into the Workspace Library as a learning data point.
     * / Updates rolling averages for matching trade/region/csidivision combination.
     * / Colony Unification: R ⊆ P — every result is a pheromone signal (Recruitment).
     * / CPL authority: GCUser level minimum.
     */
    recordToolResultToLibrary(toolId: string, result: Array<[string, string]>, principal: Principal): Promise<boolean>;
    recordWLToolResult(toolId: string, confidence: number): Promise<void>;
    redeemInviteToken(token: string): Promise<STResult_1>;
    refreshBLSWageData(): Promise<{
        __kind__: "ok";
        ok: BLSRefreshResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    refreshOSHAData(): Promise<{
        __kind__: "ok";
        ok: OSHARefreshResult;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerLongLeadItem(tenantId: bigint, projectId: string, description: string, csiCode: string, supplierId: string, supplierName: string, leadDays: bigint, requiredOnSite: bigint, stagingLocation: string, storageRequirements: string): Promise<LongLeadItem>;
    registerSMSBridge(agentId: string): Promise<string>;
    registerSubCloseoutDoc(tenantId: bigint, subId: string, projectId: string, docType: string, description: string): Promise<SubCloseoutDoc>;
    rejectDesignVersion(versionId: DesignVersionId, notes: string): Promise<DesignApproval>;
    releaseFinalRetention(tokenId: string): Promise<CompletionTokenRecord | null>;
    removeMember(tenantId: TenantId, target: Principal): Promise<void>;
    renewWorkerCert(certId: string, newExpiryDate: bigint): Promise<WorkerCert>;
    requireAuthForAction(action: string, principal: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resendHandoffPackage(handoffId: bigint, groupIndex: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resolveBackCharge(tenantId: bigint, backChargeId: string, resolution: Variant_settled_disputed_written_off): Promise<BackCharge>;
    resolvePunchItem(punchItemId: bigint, closedDate: bigint): Promise<void>;
    revokeAgentDocumentAccess(docId: string, agentPrincipal: Principal): Promise<void>;
    revokeProjectReport(id: bigint): Promise<boolean>;
    /**
     * / Run the full multi-perception analysis for a tool invocation.
     * / Dispatches a BHX Recruitment pheromone on completion.
     * / CPL authority check guards every caller.
     */
    runPerceptionAnalysis(input: PerceptionInput): Promise<SynthesisResult>;
    runVHDEAnalysis(mediaId: string, tenantId: string, contextHints: Array<string>): Promise<SMResult_1>;
    saveBundleConfig(projectType: string, unitCount: bigint, selectedTrades: Array<string>): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveDocumentDraft(draftId: string, templateId: string, tenantId: string, name: string, fieldValues: Array<[string, string]>): Promise<string>;
    saveToolResult(toolName: string, toolCategory: string, projectName: string, inputsJson: string, outputsJson: string, nexusInsightsJson: string): Promise<bigint>;
    scheduleAutoReport(tenantId: string, schedule: string, recipients: Array<string>): Promise<string>;
    scopeGapDetection(projectType: string, submittedScope: Array<string>): Promise<ScopeGapResult>;
    scoreBidGoNoGo(tenantId: bigint, projectId: string, projectName: string, projectType: string, estimatedValue: bigint, scoreInputs: Array<bigint>): Promise<GoNoGoResult__1>;
    scoreFocusFourRisk(activities: Array<string>): Promise<bigint>;
    scoreRegionalCoverage(region: string): Promise<{
        profitabilityScore: number;
        recommendedAction: string;
        historicalProjectCount: bigint;
        regionName: string;
        avgContractValueUSD: number;
    }>;
    scoreSubPerformance(tenantId: bigint, subId: string, projectId: string, period: string, scheduleScore: bigint, qualityScore: bigint, safetyScore: bigint, communicationScore: bigint, cleanupScore: bigint, rfiCount: bigint, rfiAvgResponseDays: bigint, submittalReturnCount: bigint, deficiencyCount: bigint, incidentCount: bigint, notes: string): Promise<SubPerformanceRecord>;
    searchContacts(searchQuery: string): Promise<Array<Contact>>;
    searchEvidenceByKeywords(keywords: Array<string>, topK: bigint, corpus: SourceCorpus | null): Promise<Array<Citation>>;
    searchEvidenceByVector(queryEmbed: Array<number>, topK: bigint, corpus: SourceCorpus | null): Promise<Array<Citation>>;
    searchOSHASubparts(keyword: string): Promise<Array<OSHASubpart>>;
    searchProtocols(searchText: string): Promise<Array<ProtocolEntry>>;
    searchResearchEntries(searchText: string): Promise<Array<ResearchEntry>>;
    searchTemplates(searchTerm: string): Promise<Array<DocumentTemplate>>;
    searchToolboxSessions(trade: string | null, hazardType: string | null, projectId: string | null, tenantId: string | null): Promise<Array<ToolboxSession>>;
    /**
     * / Re-seed the furniture model library (Herman Miller, Knoll, Steelcase,
     * / and hospitality vendors). Requires CPL Level 5 authority.
     */
    seedFurnitureLibrary(): Promise<void>;
    /**
     * / Re-seed the material library (wood, metal, fabric, stone, glass, etc.)
     * / with real cost data from the Workspace Library. Requires CPL Level 5.
     */
    seedMaterialLibrary(): Promise<void>;
    sendAgentMessage(agentId: string, message: string, conversationId: string): Promise<{
        __kind__: "ok";
        ok: AgentResponse;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendDocument(documentId: string, tenantId: string, targets: Array<SendTarget>, message: string, messageEs: string, envelopeId: string | null): Promise<DocumentSendRecord>;
    sendHandoff(handoffId: bigint): Promise<{
        __kind__: "ok";
        ok: Handoff;
    } | {
        __kind__: "err";
        err: string;
    }>;
    sendMessage(sessionId: string, userText: string, ctx: AssistantContext, modelId: string | null): Promise<SendMessageResult>;
    sendSubPortalMessage(bidId: string, fromSub: string, toParty: string, tenantId: string, subject: string, body: string): Promise<SubPortalMessage>;
    setBHXPrincipal(p: string): Promise<void>;
    setCompanyProfile(profile: CompanyProfile): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setGroqApiKey(newKey: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setHandoffRecipients(handoffId: bigint, recipientGroups: Array<RecipientGroup>): Promise<{
        __kind__: "ok";
        ok: Handoff;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setOllamaAvailable(available: boolean): Promise<void>;
    /**
     * / Set the BHX canister principal so native message sends fire a Worker task.
     */
    setPlatformMEBHXPrincipal(p: Principal): Promise<void>;
    setPlatformMessagingPrincipal(p: Principal): Promise<void>;
    setPlatformNexusPrincipal(p: Principal): Promise<void>;
    setPlatformWorkspaceLibPrincipal(p: Principal): Promise<void>;
    setPlatformWorkspacePrincipal(p: Principal): Promise<void>;
    signDocument(documentId: string, documentContent: string, role: string, displayName: string): Promise<SignatureRecord>;
    signDocumentAdvanced(envelopeId: string, ipAddress: string): Promise<ESignatureEnvelope | null>;
    stopWorkAuthorityCheck(hazards: Array<string>): Promise<boolean>;
    storeVirtualDocument(docType: Variant_rfi_closeoutPackage_submittal_contract_invoice_estimate_punchList_scopeLetter, originalFileName: string, parsedSections: Array<{
        sectionName: string;
        sectionContent: string;
    }>, templateVersion: string): Promise<string>;
    submitBid(bidId: string, submission: BidSubmission): Promise<BidToken | null>;
    submitBidLifecycleResponse(packageId: string, bidAmount: number, assumptions: string, exceptions: string): Promise<BidLifecycleResponse>;
    submitBidResponse(itbId: bigint, pricingUSD: number, scheduleDays: bigint): Promise<bigint>;
    submitChangeOrder(projectId: bigint, description: string, costDelta: number, scheduleDelta: bigint): Promise<bigint>;
    submitDailyLog(projectId: bigint, date: bigint, hoursWorked: number, laborCount: bigint, workArea: string, weatherNotes: string, crewNotes: string): Promise<bigint>;
    submitDesignVersion(projectId: DesignProjectId, designData: string): Promise<DesignVersion>;
    submitLienWaiver(bidId: string, subName: string, tenantId: string, waiverType: LienWaiverType, payAppNumber: bigint, amount: number, throughDate: bigint, signedByName: string, signedByTitle: string): Promise<LienWaiver>;
    submitOsha301(record: Osha301Record): Promise<Osha301Record>;
    submitPayApp(tenantId: bigint, payAppId: string): Promise<boolean>;
    submitPrequal(itbId: bigint, insuranceCoverage: number, oshaIncidentRate: number, bondingCapacity: number, yearsExperience: bigint, relevantProjectCount: bigint, crewSize: bigint): Promise<bigint>;
    submitPunchItem(projectId: bigint, area: string, trade: string, description: string, severity: PunchSeverity): Promise<bigint>;
    submitQuote(tenantId: bigint, rfqId: string, supplierId: string, lineItems: Array<QuoteLineItem>, totalAmount: bigint, validThrough: bigint): Promise<SupplierQuote>;
    submitRFI(projectId: bigint, question: string, attachmentHash: string, priority: RFIPriority): Promise<bigint>;
    submitSSSP(sssp: SSSPRecord): Promise<SSSPResult>;
    submitSubPayApp(bidId: string, subName: string, tenantId: string, input: PayAppInput): Promise<PayApp | null>;
    submitSubPrequal(tenantId: bigint, subId: string, companyName: string, licenseNo: string, licenseState: string, licenseExpiry: bigint, annualRevenue: bigint, bondingCapacity: bigint, currentBacklogPct: bigint, emr: bigint, trir: bigint, dart: bigint, yearsInBusiness: bigint, relevantProjectCount: bigint, projectTypes: Array<string>, singleJobLimit: bigint, aggregateLimit: bigint, approvedTrades: Array<string>, estimatedContractValue: bigint): Promise<SubPrequalification>;
    submitSubSafetyIntake(intake: SubSafetyIntakeRecord): Promise<IntakeResult>;
    submitSubmittalPackage(projectId: bigint, documentHash: string, submittalType: string, transmissionDate: bigint | null): Promise<bigint>;
    submitVEProposal(tenantId: bigint, projectId: string, subId: string, subName: string, csiDivision: string, description: string, costSavings: bigint, scheduleSavingsDays: bigint, qualityImpact: string): Promise<VEProposal>;
    tagAIResponse(content: string, keywords: Array<string>, riskCategories: Array<RiskCategory>, engineName: string, modelUsed: string, confidence: number): Promise<EvidenceTaggedResponse>;
    tagAIResponseAuthenticated(content: string, keywords: Array<string>, riskCategories: Array<RiskCategory>, engineName: string, modelUsed: string, confidence: number): Promise<EvidenceTaggedResponse>;
    trackMaterialLaborVariance(budgetMaterial: bigint, actualMaterial: bigint, budgetLabor: bigint, actualLabor: bigint, scopeTypes: Array<string>): Promise<VarianceResult>;
    trackSafetyCertification(projectId: bigint | null, certType: string, holderName: string, issuedDate: bigint, expirationDate: bigint, certNumber: string): Promise<bigint>;
    transcribeAudio(audioBase64: string, language: string): Promise<TranscribeResult>;
    transitionAwardToken(tokenId: string, newState: TokenState, reason: string): Promise<AwardTokenRecord | null>;
    transitionPayAppToken(tokenId: string, newState: TokenState, reason: string): Promise<PayAppTokenRecord | null>;
    transitionSCBidToken(tokenId: string, newState: TokenState, reason: string): Promise<BidTokenRecord | null>;
    triggerAction(sessionId: string, actionType: ActionType, parameters: Array<[string, string]>, ctx: AssistantContext): Promise<TriggerActionResult>;
    updateAgent(agentId: string, name: string, description: string, assignedSkills: Array<string>, workspaceScope: Array<string>): Promise<void>;
    updateBidStatus(bidId: string, newStatus: BidStatus, notes: string): Promise<BidToken | null>;
    updateCRMPipelineStage(itemId: bigint, stage: CRMPipelineStage): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateChangeOrderStatus(tenantId: bigint, coId: string, newStatus: ChangeOrderStatus, approvedBy: string | null): Promise<boolean>;
    updateChunkEmbedding(chunkId: string, fullEmbed768: Array<number>): Promise<boolean>;
    updateContact(id: bigint, name: string, email: string, phone: string, primaryRole: string, secondaryRoles: Array<string>, notes: string): Promise<{
        __kind__: "ok";
        ok: Contact;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateContext(sessionId: string, ctx: AssistantContext): Promise<boolean>;
    updateGoNoGoFactors(bidId: string, factors: Array<GoNoGoFactor>): Promise<BidToken | null>;
    updateLongLeadStatus(tenantId: bigint, itemId: string, newStatus: LongLeadStatus, notes: string): Promise<LongLeadItem>;
    updatePipelineStage(dealId: string, stage: PipelineStage, probability: number, nextAction: string): Promise<PipelineDeal>;
    updateSOVProgress(sovId: string, lineNumber: bigint, completedCurrentPct: number, storedMaterials: number): Promise<ScheduleOfValues>;
    updateSafetyDocument(id: bigint, title: string, category: SafetyDocumentCategory, description: string, file: ExternalBlob, documentType: DocumentType, isCurated: boolean, altText: string, filename: string): Promise<void>;
    updateTagStatus(tagId: bigint, status: TagStatus): Promise<STResult>;
    updateTokenCompliance(id: string, status: string): Promise<SessionToken | null>;
    updateToolboxSessionMedia(sessionId: string, videoRef: string | null, audioRef: string | null): Promise<boolean>;
    updateToolboxSessionTopics(sessionId: string, topics: Array<string>): Promise<boolean>;
    updateVirtualDocument(docId: string, parsedSections: Array<{
        sectionName: string;
        sectionContent: string;
    }>, templateVersion: string): Promise<void>;
    uploadIFCMetadata(projectId: string, fileName: string, elementCount: bigint, elementTypes: Array<string>, totalArea: number, totalVolume: number): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    uploadMedia(sessionId: string, tenantId: string, mediaId: string, uploaderName: string, uploaderRole: string, mediaType: MediaType, objectStorageUrl: string, fileSize: bigint, mimeType: string): Promise<SMResult>;
    uploadSafetyDocument(title: string, category: SafetyDocumentCategory, description: string, file: ExternalBlob, documentType: DocumentType, isCurated: boolean, altText: string, filename: string): Promise<bigint>;
    upsertGCRelationship(gcPrincipal: Principal, companyName: string, contactName: string, phone: string, email: string, city: string, state: string): Promise<GCRelationship>;
    upsertLeadTime(tenantId: bigint, supplierId: string, category: MaterialCategory, materialName: string, currentLeadDays: bigint, region: string): Promise<LeadTimeRecord>;
    upsertSupplier(tenantId: bigint, supplierId: string, name: string, contactEmail: string, contactPhone: string, region: string, categories: Array<MaterialCategory>, onTimeRate: bigint, qualityDefectRate: bigint, priceVariancePct: bigint, responsivenessScore: bigint): Promise<SupplierRecord>;
    validateGroqKey(): Promise<GroqKeyValidation>;
    validateInviteLink(token: InviteId): Promise<InviteLinkPublic | null>;
    validateOutputAlignment(engineName: string, outputText: string, riskCategories: Array<RiskCategory>): Promise<AlignmentStatus>;
    validateStartTraining(tradeType: string, certifications: Array<string>): Promise<{
        valid: boolean;
        missing: Array<string>;
    }>;
    verifyInsurance(cert: InsuranceCert): Promise<InsuranceCert>;
    verifyReceiptIntegrity(id: string): Promise<boolean>;
    verifySignature(sig: SignatureRecord, documentContent: string): Promise<boolean>;
    verifySubBonding(tenantId: bigint, subcontractId: string, bonds: Array<BondRecord>): Promise<SubcontractRecord>;
    verifySubInsurance(tenantId: bigint, subcontractId: string, coverages: Array<InsuranceCoverage>): Promise<SubcontractRecord>;
    wireColony(): Promise<string>;
}
