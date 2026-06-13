module {

  public type JSADailyRecord = {
    crewId      : Text;
    crewName    : Text;
    tenantId    : Text;
    projectId   : Text;
    date        : Text;   // YYYY-MM-DD
    jsaCompleted : Bool;
    jsaId       : ?Text;
    completedAt : ?Int;
    completedBy : ?Text;
    taskTypes   : [Text];
    riskLevel   : Text;   // LOW|MEDIUM|HIGH|CRITICAL
    perceptionScore : Nat;
  };

  public type JSADailyInput = {
    crewId    : Text;
    crewName  : Text;
    tenantId  : Text;
    projectId : Text;
    date      : Text;
    taskTypes : [Text];
    riskLevel : Text;
    perceptionScore : Nat;
  };

  public type DayTrend = {
    date            : Text;
    compliantCrews  : Nat;
    totalCrews      : Nat;
    compliancePct   : Nat;
  };

  public type ComplianceSummary = {
    totalCrews       : Nat;
    compliantCrews   : Nat;
    overdueCrews     : Nat;
    compliancePercent : Nat;
    criticalRiskCount : Nat;
    trendByDay       : [DayTrend];
  };

};
