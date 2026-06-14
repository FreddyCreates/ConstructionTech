# ConstructionTech API Quick Reference

Fast lookup guide for all API endpoints and tool integration patterns.

---

## 🔐 Authentication

```bash
# Get ******
curl -X POST https://api.constructiontech.ai/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk_live_..."}'

# Use token in all requests
-H "Authorization: ******"
```

---

## 📊 Tool Endpoints Quick List

### Planning Tools
| Tool | Endpoint | Method | Latency |
|------|----------|--------|---------|
| Cost Estimator | `/tools/cost-estimator` | POST | 2-5s |
| Material Takeoff | `/tools/material-takeoff` | POST | 5-30s |
| Labor Hours | `/tools/labor-hours` | POST | 1-3s |
| FFE Budget | `/tools/ffe-budget` | POST | 2s |
| Scope Estimator | `/tools/scope-estimator` | POST | 3-8s |

### Scheduling Tools
| Tool | Endpoint | Method | Latency |
|------|----------|--------|---------|
| Schedule Calculator | `/tools/schedule-calculator` | POST | 5-15s |
| Permit Timeline | `/tools/permit-timeline` | POST | 2s |
| Mobilization Cost | `/tools/mobilization-cost` | POST | 1-2s |
| Room Turnover | `/tools/room-turnover` | POST | 2-5s |

### Risk & Quality Tools
| Tool | Endpoint | Method | Latency |
|------|----------|--------|---------|
| Bid Leveling | `/tools/bid-leveling` | POST | 3-5s |
| Change Order | `/tools/change-order` | POST | 4-10s |
| Variance Tracker | `/tools/variance-tracker` | POST | 2-5s |
| Scope Gap | `/tools/scope-gap` | POST | 5-15s |
| Pre-Task Plan | `/tools/pre-task-plan` | POST | 3-8s |

### Safety Tools
| Tool | Endpoint | Method | Latency |
|------|----------|--------|---------|
| Safety Assistant | `/tools/safety-assistant` | POST | 2-5s |
| Safety Score | `/tools/safety-score` | POST | 1-3s |
| OSHA Incident Rate | `/tools/osha-incident-rate` | POST | 1s |
| Hazard Assessment | `/tools/hazard-assessment` | POST | 2-5s |
| Incident Predictor | `/tools/incident-predictor` | POST | 3-5s |
| JSA Generator | `/tools/jsa-generator` | POST | 2-5s |
| Toolbox Talk | `/tools/toolbox-talk` | POST | 2-3s |

### Execution Tools
| Tool | Endpoint | Method | Latency |
|------|----------|--------|---------|
| Crew Dispatch | `/tools/crew-dispatch` | POST | 5-20s |
| Crew Productivity | `/tools/crew-productivity` | POST | 3-8s |

### Quality & Completion Tools
| Tool | Endpoint | Method | Latency |
|------|----------|--------|---------|
| Punch Organizer | `/tools/punch-organizer` | POST | 2-5s |
| Closeout Checklist | `/tools/closeout-checklist` | POST | 2-4s |
| RFI Impact | `/tools/rfi-impact` | POST | 3-8s |
| Renovation Phases | `/tools/renovation-phases` | POST | 4-10s |
| Renovation ROI | `/tools/renovation-roi` | POST | 2-5s |

### Advanced Analytics Tools
| Tool | Endpoint | Method | Latency |
|------|----------|--------|---------|
| Benchmark Comparison | `/tools/benchmark-comparison` | POST | 2-4s |
| Project Intelligence | `/tools/project-intelligence` | POST | 5-15s |
| Claim Impact | `/tools/claim-impact` | POST | 5-10s |
| Supply Chain Risk | `/tools/supply-chain-risk` | POST | 4-8s |
| Sustainability Score | `/tools/sustainability-score` | POST | 3-6s |
| Workforce Planning | `/tools/workforce-planning` | POST | 5-15s |
| Equipment Tracking | `/tools/equipment-tracking` | POST | 2-5s |

---

## 🎯 Common Integration Patterns

### Pattern 1: Simple Tool Call
```bash
curl -X POST https://api.constructiontech.ai/v1/tools/cost-estimator \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj-123",
    "scope": "kitchen renovation",
    "locationZip": "94102",
    "complexity": "medium"
  }'
```

### Pattern 2: Batch Tool Calls
```bash
# Call multiple tools in parallel
{
  "batch": [
    {
      "tool": "cost-estimator",
      "params": { ... }
    },
    {
      "tool": "schedule-calculator",
      "params": { ... }
    }
  ]
}
```

### Pattern 3: Tool Chain (Sequential)
```
Cost Estimator → Change Order → Variance Tracker → Final Budget
```

### Pattern 4: AI Agent Loop
```
Get Project → Cost Estimate → Safety Check → Risk Assessment → Recommendation
```

---

## 📥 Standard Input Schema

All tools accept a JSON object with:

```json
{
  "projectId": "string (required)",
  "projectName": "string (optional)",
  "tenantId": "string (optional)",
  "context": {
    "workType": "string",
    "location": "string",
    "startDate": "ISO 8601 date",
    "endDate": "ISO 8601 date"
  },
  "toolSpecificParams": {}
}
```

---

## 📤 Standard Output Schema

All tools return:

```json
{
  "toolId": "string",
  "projectId": "string",
  "status": "success|partial|error",
  "result": {},
  "metadata": {
    "executionTime": "number (ms)",
    "model": "string",
    "version": "string",
    "confidence": "number (0-1)"
  },
  "cplAudit": "string",
  "timestamp": "number (unix)"
}
```

---

## 🔄 Response Handling

### Success (200)
```json
{
  "status": "success",
  "result": { ... }
}
```

### Partial (206)
```json
{
  "status": "partial",
  "result": { ... },
  "warnings": ["Tool X returned incomplete data"]
}
```

### Error (400/500)
```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "details": { ... }
}
```

---

## 📊 Project Data Endpoints

### Get Project
```bash
GET /v1/projects/{projectId}
```

### List Projects
```bash
GET /v1/projects?status=active&limit=20&offset=0
```

### Get Project RFIs
```bash
GET /v1/projects/{projectId}/rfis?status=open
```

### Get Change Orders
```bash
GET /v1/projects/{projectId}/change-orders?status=pending
```

### Get Punch Items
```bash
GET /v1/projects/{projectId}/punch-items?severity=high
```

---

## 💾 Project Creation

```bash
POST /v1/projects

{
  "name": "Kitchen Renovation",
  "owner": "John Doe",
  "contractAmount": 125000,
  "startDate": "2024-07-01",
  "location": {
    "address": "123 Main St",
    "zip": "94102"
  },
  "team": [...]
}
```

---

## 🛡️ Safety Data Endpoints

### Get Safety Score
```bash
GET /v1/projects/{projectId}/safety/score
```

### Get Incidents
```bash
GET /v1/projects/{projectId}/safety/incidents?period=month
```

### Get Hazards
```bash
GET /v1/projects/{projectId}/safety/hazards
```

### Create Incident Report
```bash
POST /v1/projects/{projectId}/safety/incidents

{
  "type": "injury|near-miss|hazard",
  "description": "...",
  "severity": "low|medium|high|critical",
  "date": "ISO 8601"
}
```

---

## 💰 Financial Data Endpoints

### Get Budget Summary
```bash
GET /v1/projects/{projectId}/financials/budget-summary
```

### Get Actuals vs Budget
```bash
GET /v1/projects/{projectId}/financials/variance?period=month
```

### Get Pay Applications
```bash
GET /v1/projects/{projectId}/financials/pay-apps
```

### Submit Pay Application
```bash
POST /v1/projects/{projectId}/financials/pay-apps

{
  "period": "2024-06",
  "items": [...],
  "totalAmount": 15000
}
```

---

## 🎨 Design Data Endpoints

### Get Design Models
```bash
GET /v1/projects/{projectId}/design/models
```

### Upload IFC Model
```bash
POST /v1/projects/{projectId}/design/models

multipart/form-data:
  file: IFC 2x3 or 4.0 model
```

### Get Material Library
```bash
GET /v1/design/materials?category=flooring&sustainability=FSC
```

---

## 🔧 Webhook Management

### Register Webhook
```bash
POST /v1/webhooks

{
  "url": "https://your-system.com/webhooks/ct",
  "events": ["tool.completed", "project.updated"],
  "filters": { "toolIds": ["cost-estimator"] }
}
```

### List Webhooks
```bash
GET /v1/webhooks
```

### Delete Webhook
```bash
DELETE /v1/webhooks/{webhookId}
```

---

## 📊 Analytics Endpoints

### Get Project KPIs
```bash
GET /v1/projects/{projectId}/analytics/kpis
```

### Get Cost Analysis
```bash
GET /v1/projects/{projectId}/analytics/cost-analysis
```

### Get Schedule Variance
```bash
GET /v1/projects/{projectId}/analytics/schedule-variance
```

### Get Safety Metrics
```bash
GET /v1/projects/{projectId}/analytics/safety-metrics
```

---

## ⚙️ Configuration Endpoints

### Get API Usage
```bash
GET /v1/account/usage
```

### Get Rate Limits
```bash
GET /v1/account/rate-limits
```

### Update API Key
```bash
POST /v1/account/api-keys/rotate
```

---

## 📚 Implementation Examples

### Python (Requests)
```python
import requests

API_KEY = "sk_live_..."
BASE_URL = "https://api.constructiontech.ai/v1"

headers = {
    "Authorization": f"******",
    "Content-Type": "application/json"
}

# Call cost estimator
response = requests.post(
    f"{BASE_URL}/tools/cost-estimator",
    headers=headers,
    json={
        "projectId": "proj-123",
        "scope": "kitchen renovation",
        "locationZip": "94102"
    }
)

result = response.json()
print(f"Estimate: ${result['result']['estimatedCost']}")
```

### JavaScript (Fetch)
```javascript
const API_KEY = "sk_live_...";
const BASE_URL = "https://api.constructiontech.ai/v1";

const response = await fetch(`${BASE_URL}/tools/cost-estimator`, {
  method: "POST",
  headers: {
    "Authorization": `******
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    projectId: "proj-123",
    scope: "kitchen renovation",
    locationZip: "94102"
  })
});

const result = await response.json();
console.log(`Estimate: $${result.result.estimatedCost}`);
```

### cURL
```bash
API_KEY="sk_live_..."

curl -X POST https://api.constructiontech.ai/v1/tools/cost-estimator \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj-123",
    "scope": "kitchen renovation",
    "locationZip": "94102"
  }'
```

---

## ✅ Health Check

```bash
GET /v1/health

Response (200):
{
  "status": "operational",
  "version": "1.0.0",
  "timestamp": 1718390000
}
```

---

## 📞 Support

- **Docs**: https://docs.constructiontech.ai
- **Status Page**: https://status.constructiontech.ai
- **Email**: support@constructiontech.ai
- **Slack**: #api-support in our workspace

