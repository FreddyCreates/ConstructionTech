# ConstructionTech AI Integration Guide

## Overview

ConstructionTech is built to be **AI-native**. All tools, APIs, and data endpoints are designed to be easily integrated with third-party AI agents, LLMs, and autonomous systems.

---

## 🎯 Integration Patterns

### 1. **REST API Pattern** (Most Common)

All ConstructionTech tools are available via HTTPS REST endpoints:

```bash
# Generic pattern
POST https://api.constructiontech.ai/v1/tools/{tool-id}
Authorization: ******
Content-Type: application/json

# Example: Cost Estimator
curl -X POST https://api.constructiontech.ai/v1/tools/cost-estimator \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj-abc-123",
    "scope": "kitchen renovation + bathroom remodel",
    "locationZip": "94102",
    "squareFootage": 2500,
    "complexity": "high",
    "timeline": "6 months"
  }'
```

### 2. **Native ICP Canister Pattern** (Lowest Latency)

For high-performance integrations, call ICP smart contracts directly:

```typescript
// JavaScript/TypeScript
import { createActor } from "declarations/cost_estimator";
import { HttpAgent } from "@icp-sdk/agent";

const agent = new HttpAgent({ host: "https://ic0.app" });
const actor = createActor("canister_id_here", { agent });

const estimate = await actor.estimateCost({
  projectId: "proj-abc-123",
  scope: "kitchen renovation",
  zip: "94102",
  sqft: 2500,
  complexity: "high"
});

console.log(`Estimated cost: $${estimate.cost / 100}`);
```

### 3. **Python SDK Pattern** (Recommended for AI Agents)

```python
from constructiontech_sdk import ConstructionTechClient, AuthProvider
import os

# Initialize client
auth = AuthProvider(
    api_key=os.getenv("CONSTRUCTIONTECH_API_KEY"),
    endpoint="https://api.constructiontech.ai"
)

client = ConstructionTechClient(auth=auth)

# Call any tool
response = client.tools.cost_estimator.estimate(
    project_id="proj-abc-123",
    scope="kitchen renovation",
    zip_code="94102",
    square_footage=2500,
    complexity="high"
)

# Access results
print(f"Cost estimate: ${response.estimated_cost}")
print(f"Confidence: {response.confidence:.1%}")
print(f"Breakdown:")
for category, amount in response.breakdown.items():
    print(f"  {category}: ${amount}")
```

### 4. **GraphQL Pattern** (For Complex Queries)

```graphql
query GetProjectInsights {
  project(id: "proj-abc-123") {
    name
    budget
    schedule {
      startDate
      endDate
    }
    toolResults {
      costEstimate {
        estimated_cost
        confidence
      }
      scheduleCalculation {
        critical_path_days
        float_days
      }
    }
  }
}
```

### 5. **Event Stream / Webhook Pattern** (Real-Time Integration)

Subscribe to tool execution results via WebSocket or webhooks:

```python
import asyncio
from constructiontech_sdk import ConstructionTechClient

client = ConstructionTechClient(auth=auth)

# Subscribe to tool results
async def handle_tool_result(event):
    print(f"Tool {event.tool_id} completed")
    print(f"Result: {event.result}")

async def main():
    async with client.subscribe_events() as stream:
        async for event in stream:
            if event.type == "tool.completed":
                await handle_tool_result(event)

asyncio.run(main())
```

---

## 🔐 Authentication

### Method 1: API Token
```bash
# Get short-lived token
curl -X POST https://api.constructiontech.ai/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "sk_live_...",
    "expires_in": 3600
  }'

# Response
{
  "access_token": "jwt_...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Method 2: Internet Identity (Decentralized)
```typescript
import { InternetIdentityAuth } from "@caffeineai/core-infrastructure";

const auth = new InternetIdentityAuth();
const principal = await auth.login();
// Principal is now authenticated for canister calls
```

### Method 3: Service Account
```bash
# For AI agents running as services
curl -X POST https://api.constructiontech.ai/v1/auth/service-account \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "sa_...",
    "client_secret": "secret_...",
    "grant_type": "client_credentials"
  }'
```

---

## 📋 Tool Categories & Endpoints

### Planning & Estimation

#### Cost Estimator
```
POST /v1/tools/cost-estimator

Input:
  - projectId (string): Project identifier
  - scope (string): Description of work scope
  - locationZip (string): Project location ZIP code
  - squareFootage (number): Total square footage
  - complexity (enum): low | medium | high
  - timeline (string): Project timeline

Output:
  - estimatedCost (number): Total cost in dollars
  - confidence (number): 0-1 confidence level
  - breakdown (object): Labor, Materials, Equipment breakdown
  - factors (array): Applied cost adjustment factors
  - regionalVariance (number): Regional cost multiplier
```

#### Material Takeoff
```
POST /v1/tools/material-takeoff

Input:
  - projectId (string)
  - ifcModel (blob): IFC BIM file
  - specItems (array): Specification items to quantify
  - format (enum): list | summary | detailed

Output:
  - materials (array): Quantified material list
  - quantities (object): Material quantities by type
  - csiCodes (array): CSI format codes
  - vendorRecommendations (array): Suggested vendors
```

#### Labor Hours Calculator
```
POST /v1/tools/labor-hours

Input:
  - projectId (string)
  - scope (string)
  - crewSize (number)
  - skillLevel (enum): apprentice | journeyman | master
  - workType (string): Type of work

Output:
  - estimatedHours (number)
  - crewComposition (object)
  - productivityFactors (array)
  - scheduledWeeks (number)
```

### Scheduling & Timeline

#### Schedule Calculator
```
POST /v1/tools/schedule-calculator

Input:
  - projectId (string)
  - activities (array): Task list with durations
  - constraints (array): Sequence dependencies
  - resources (array): Available resources
  - startDate (date): Project start

Output:
  - criticalPath (array): Critical path activities
  - projectDuration (number): Total days
  - float (object): Total and free float per activity
  - riskFactors (array): Schedule risks identified
```

### Risk & Quality

#### Change Order Impact
```
POST /v1/tools/change-order

Input:
  - projectId (string)
  - changeItems (array): Items being changed
  - originalScope (object): Original contract scope
  - newScope (object): Revised scope

Output:
  - costImpact (number): Change in cost
  - scheduleImpact (number): Days added/removed
  - riskFlags (array): Identified risks
  - recommendation (string): AI recommendation
```

#### Variance Tracker
```
POST /v1/tools/variance-tracker

Input:
  - projectId (string)
  - periodEnd (date)
  - actualCosts (object)
  - budgetedCosts (object)
  - schedule (object): Actual vs planned

Output:
  - varianceAnalysis (object)
  - costVariance (number): $ and %
  - scheduleVariance (number): Days and %
  - trends (array): Historical variance trends
  - forecast (object): Projected final cost/schedule
```

### Safety

#### Safety Score
```
POST /v1/tools/safety-score

Input:
  - projectId (string)
  - periodStart (date)
  - periodEnd (date)
  - incidents (array): Incident reports
  - nearMisses (array): Near miss reports

Output:
  - safetyScore (number): 0-100
  - trendline (array): Historical scores
  - riskLevel (enum): low | medium | high | critical
  - recommendations (array): Safety improvements
```

#### Hazard Assessment
```
POST /v1/tools/hazard-assessment

Input:
  - projectId (string)
  - taskDescription (string)
  - location (string)
  - workerCount (number)
  - equipment (array): Equipment involved

Output:
  - hazards (array): Identified hazards
  - riskRating (number): 1-100 risk score
  - controls (array): Recommended controls
  - jsaTemplate (string): Generated JSA
```

### Execution & Delivery

#### Crew Dispatch
```
POST /v1/tools/crew-dispatch

Input:
  - projectId (string)
  - tasks (array): Tasks needing crew assignment
  - availableCrews (array): Available crews
  - constraints (object): Time/skill constraints

Output:
  - assignments (array): Optimal crew assignments
  - efficiency (number): Utilization percentage
  - notes (array): Assignment notes
```

---

## 📊 Tool Result Format

All tool responses follow a consistent schema:

```typescript
interface ToolResult {
  // Identification
  toolId: string;
  projectId: string;
  executionId: string; // Unique execution ID
  
  // Status
  status: "success" | "partial" | "error";
  code?: string; // Error code if status != success
  message?: string;
  
  // Result data
  result: Record<string, unknown>;
  
  // Metadata
  metadata: {
    executionTime: number; // milliseconds
    model: string; // AI model used
    version: string; // Tool version
    dataPoints: number; // Input data points processed
    confidence?: number; // 0-1
  };
  
  // Audit
  cplAudit: string; // CPL governance audit hash
  timestamp: number; // Unix timestamp
  principal: string; // Caller principal
}
```

### Error Response Format

```json
{
  "status": "error",
  "code": "INVALID_PROJECT",
  "message": "Project proj-123 not found or access denied",
  "details": {
    "projectId": "proj-123",
    "suggestion": "Verify project ID and that you have access",
    "supportUrl": "https://docs.constructiontech.ai/errors/invalid_project"
  },
  "timestamp": 1718390000
}
```

---

## 🔄 Batch Operations

Process multiple tools in parallel:

```python
from constructiontech_sdk import ConstructionTechClient
import asyncio

client = ConstructionTechClient(auth=auth)

async def run_project_analysis(project_id):
    """Run multiple tools on a project simultaneously"""
    
    results = await asyncio.gather(
        client.tools.cost_estimator.estimate(
            project_id=project_id,
            scope="full renovation"
        ),
        client.tools.schedule_calculator.calculate(
            project_id=project_id
        ),
        client.tools.safety_score.calculate(
            project_id=project_id
        ),
        client.tools.variance_tracker.analyze(
            project_id=project_id
        )
    )
    
    return {
        "cost": results[0],
        "schedule": results[1],
        "safety": results[2],
        "variance": results[3]
    }

# Execute
results = asyncio.run(run_project_analysis("proj-123"))
```

---

## 🤖 AI Agent Framework Integration

### LangChain Integration

```python
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools import tool
from langchain_openai import ChatOpenAI
from constructiontech_sdk import ConstructionTechClient

# Initialize ConstructionTech client
ct_client = ConstructionTechClient(auth=auth)

# Define tools for LangChain
@tool
def estimate_project_cost(project_id: str, scope: str) -> str:
    """Estimate project cost based on scope"""
    result = ct_client.tools.cost_estimator.estimate(
        project_id=project_id,
        scope=scope
    )
    return f"Estimated cost: ${result.estimated_cost}"

@tool
def get_safety_score(project_id: str) -> str:
    """Get current safety score for project"""
    result = ct_client.tools.safety_score.calculate(
        project_id=project_id
    )
    return f"Safety score: {result.safety_score}/100"

# Create agent
tools = [estimate_project_cost, get_safety_score]
llm = ChatOpenAI(model="gpt-4")
agent = create_openai_tools_agent(llm, tools)
executor = AgentExecutor(agent=agent, tools=tools)

# Use agent
response = executor.invoke({
    "input": "What's the cost estimate and safety status for project proj-123?"
})
```

### Custom AI Agent Framework

```python
from constructiontech_sdk import ConstructionTechClient
from typing import Any

class ConstructionAIAgent:
    def __init__(self, api_key: str):
        self.client = ConstructionTechClient(
            auth=AuthProvider(api_key=api_key)
        )
    
    def analyze_project(self, project_id: str) -> dict:
        """Run comprehensive project analysis"""
        
        # Gather data
        cost = self.client.tools.cost_estimator.estimate(
            project_id=project_id
        )
        schedule = self.client.tools.schedule_calculator.calculate(
            project_id=project_id
        )
        safety = self.client.tools.safety_score.calculate(
            project_id=project_id
        )
        
        # Analyze and synthesize
        insights = self._synthesize_insights(cost, schedule, safety)
        
        return {
            "project_id": project_id,
            "cost": cost,
            "schedule": schedule,
            "safety": safety,
            "insights": insights
        }
    
    def _synthesize_insights(self, cost, schedule, safety) -> list:
        """AI-powered insight synthesis"""
        insights = []
        
        if safety.safety_score < 70:
            insights.append({
                "type": "warning",
                "category": "safety",
                "message": f"Safety score {safety.safety_score} below target"
            })
        
        if cost.confidence < 0.8:
            insights.append({
                "type": "info",
                "category": "cost",
                "message": "Consider additional cost analysis due to low confidence"
            })
        
        return insights
```

---

## 📡 Webhook Integration

Register webhooks to receive real-time tool result notifications:

```bash
# Register webhook
curl -X POST https://api.constructiontech.ai/v1/webhooks \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-ai-system.example.com/webhooks/ct",
    "events": ["tool.completed", "tool.error"],
    "filters": {
      "toolIds": ["cost-estimator", "safety-score"]
    }
  }'

# Response
{
  "id": "wh_123...",
  "url": "https://your-ai-system.example.com/webhooks/ct",
  "events": ["tool.completed", "tool.error"],
  "active": true,
  "createdAt": 1718390000
}
```

Incoming webhook payload:

```json
{
  "id": "evt_123...",
  "type": "tool.completed",
  "timestamp": 1718390000,
  "data": {
    "toolId": "cost-estimator",
    "projectId": "proj-123",
    "executionId": "exec_456...",
    "result": {
      "estimatedCost": 125000,
      "confidence": 0.92
    }
  }
}
```

---

## 🔍 Data Access Patterns

### Query Project Data

```python
# Get project details
project = client.projects.get("proj-123")

# Get all RFIs for project
rfis = client.projects.rfis.list(project_id="proj-123")

# Get change orders
change_orders = client.projects.change_orders.list(
    project_id="proj-123",
    status="open"
)

# Get punch list
punch_items = client.projects.punch_items.list(
    project_id="proj-123",
    severity="high"
)
```

### Analyze Safety Data

```python
# Get safety incidents
incidents = client.safety.incidents.list(
    project_id="proj-123",
    start_date="2024-01-01"
)

# Get hazard assessments
hazards = client.safety.hazards.list(
    project_id="proj-123"
)

# Get near-miss reports
near_misses = client.safety.near_misses.list(
    project_id="proj-123"
)
```

---

## ⚙️ Rate Limiting & Quotas

API usage is governed by rate limits and quotas:

```
- Requests: 1000 per minute
- Batch operations: 100 concurrent
- Tool execution: 500 per hour (resets hourly)
- Data queries: Unlimited
```

Rate limit headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1718390000
X-RateLimit-RetryAfter: 45
```

Handle rate limiting:

```python
import time
from requests.exceptions import HTTPError

for attempt in range(3):
    try:
        result = client.tools.cost_estimator.estimate(...)
        break
    except HTTPError as e:
        if e.response.status_code == 429:
            retry_after = int(e.response.headers.get("X-RateLimit-RetryAfter", 60))
            print(f"Rate limited. Retrying in {retry_after}s...")
            time.sleep(retry_after)
        else:
            raise
```

---

## 🛠️ Troubleshooting

### Common Issues

**Issue: "Invalid project ID"**
```
Solution: Verify you have the correct project ID and tenant access
Debug: client.projects.list() to see accessible projects
```

**Issue: "Insufficient permissions"**
```
Solution: Check API key scope and project role
Debug: client.auth.get_permissions(project_id="...")
```

**Issue: "Tool timeout"**
```
Solution: Increase timeout or use async execution
Debug: Check tool complexity and data size
```

### Logging & Debug Mode

```python
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("constructiontech_sdk")

client = ConstructionTechClient(
    auth=auth,
    debug=True  # Verbose logging
)
```

---

## 📖 Additional Resources

- [API Reference](./docs/api-reference.md)
- [Python SDK GitHub](https://github.com/constructiontech/sdk-python)
- [REST API Examples](./docs/api-examples.md)
- [Webhook Events](./docs/webhooks.md)

---

## 🤝 Support

- **Documentation**: https://docs.constructiontech.ai
- **API Status**: https://status.constructiontech.ai
- **Issues**: https://github.com/FreddyCreates/ConstructionTech/issues
- **Email**: ai-integration@constructiontech.ai

