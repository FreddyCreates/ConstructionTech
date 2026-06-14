# ConstructionTech Platform

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/version-0.0.0-brightgreen.svg?style=flat-square)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF.svg?style=for-the-badge&logo=vite)
![ICP](https://img.shields.io/badge/ICP-Internet%20Computer-191970.svg?style=for-the-badge&logo=internetcomputer)
![Motoko](https://img.shields.io/badge/Motoko-Smart%20Contracts-purple.svg?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC.svg?style=for-the-badge&logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Component%20Library-black.svg?style=for-the-badge)

**Enterprise-Grade Construction Management & AI Platform**  
*Blockchain-Secured Project Intelligence, Safety, and Financial Management*

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [AI Integration](#ai-integration) • [API Reference](#api-reference) • [Contributing](#contributing)

</div>

---

## 🚀 Overview

**ConstructionTech** is a comprehensive, decentralized construction management platform built on the **Internet Computer Protocol (ICP)** blockchain. It delivers intelligent project orchestration, real-time safety intelligence, financial tracking, and AI-powered construction tools to transform how teams build.

### Key Capabilities

- 🏗️ **Project Intelligence** — RFIs, change orders, punch lists, submittals, daily logs
- 🛡️ **Enterprise Safety** — Hazard prediction, incident tracking, JSA automation, toolbox talks
- 💰 **Financial Intelligence** — AIA pay apps, lien waivers, procurement, contract risk
- 🎨 **Design Intelligence** — 3D rendering, virtual staging, furniture design, material libraries
- 🤖 **AI Tools** — 30+ construction-specific AI tools (cost estimation, scheduling, crew dispatch, etc.)
- 🔗 **Blockchain Smart Contracts** — Token-based project workflows (Bid → Award → PayApp → Completion)
- 📱 **Mobile-Ready** — On-site evidence capture, real-time collaboration
- 🔐 **Decentralized Auth** — Internet Identity (ICP's passwordless authentication)

---

## 🏛️ Architecture

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, TypeScript 5, Vite, TanStack Router, TanStack Query |
| **UI/Styling** | Tailwind CSS, shadcn/ui (Radix primitives), Motion.js |
| **3D/Visualization** | Three.js, React Three Fiber, Recharts, html2canvas |
| **State Management** | Zustand, React Context, TanStack Query |
| **Blockchain** | Internet Computer Protocol (ICP) |
| **Backend Services** | Motoko smart contracts (65+ canisters) |
| **Auth** | Internet Identity (decentralized, passwordless) |
| **Build/Deployment** | Vite, Caffeine platform, pnpm |

### Microservices Architecture (Motoko Canisters)

The backend comprises **65+ Motoko canisters** organized into functional domains:

#### 🏢 Core Project Management
- **project / project-api** — Project records, RFIs, change orders, punch items, daily logs, submittals
- **tenant / tenant-api** — Multi-tenant organization management, workspace isolation
- **command-center / command-center-api** — Centralized command hub and orchestration
- **handoff / handoff-api** — Project delivery and handoff workflows

#### 💼 Financial & Procurement
- **fie / fie-api** — Financial Intelligence Engine (AIA G702/G703, lien waivers, cash flow, EAC)
- **procurement / procurement-api** — Material procurement, quote variance, supplier scoring
- **smart-contracts / smart-contracts-api** — Bid/Award/PayApp/Completion token lifecycle with CPL governance

#### 🛡️ Safety & Compliance (8+ canisters)
- **safety-tools / safety-tools-api** — Safety incident management and hazard tracking
- **safety-tags / safety-tags-api** — Safety tag management and tracking
- **safety-receipts / safety-receipts-api** — Safety checklist receipts
- **safety-protocols / safety-protocols-api** — OSHA protocols and compliance frameworks
- **safety-perception / safety-perception-api** — AI-powered safety perception and anomaly detection
- **safety-media / safety-media-api** — Safety event media capture and annotation
- **jsa-daily-tracker / jsa-daily-tracker-api** — Job Safety Analysis daily tracking
- **session-tokens / session-tokens-api** — Session token management

#### 🎨 Design & Rendering
- **design-intelligence / design-intelligence-api** — 3D rendering, furniture design, material libraries
- **documents / documents-api** — Document management and fusion
- **evidence / evidence-api** — Compliance evidence and media collection

#### 🤖 AI & Integration
- **pro1 / pro1-chat-api / pro1-engine-api** — Primary AI engine (chat, reasoning)
- **groq-ai / groq-ai-api** — Groq AI inference engine integration
- **ollama-api** — Ollama local AI model support
- **scribe-engine / scribe-engine-api** — AI-powered report generation
- **aiadoc-sdk / aiadoc-sdk-api** — AI document processing SDK
- **oshadoc-sdk / oshadoc-sdk-api** — OSHA documentation AI processor

#### 📊 Intelligence & Data
- **psie / psie-api** — Perception Stream Intelligence Engine (real-time analytics)
- **dge / dge-api** — Data Governance Engine
- **integrations / integrations-api** — Third-party integrations (APIs, webhooks)
- **workspace-library** — Shared resource library

#### 📋 Data & References
- **protocols / protocols-api** — Protocol definitions and standards
- **contact-directory** — Contact management and directory
- **osha-library / osha-library-api** — OSHA regulation library
- **report-builder / report-builder-api** — Custom report generation
- **bidconnect / bidconnect-api** — Bid management and subcontractor connections

---

## 🛠️ Frontend Features

### Pages & Tools (80+ Routes)

#### Core Platform
- **Workspace** — Project dashboard, command center, project details
- **AI Platform** — AI agents, AI engines, AI operating system, AI streams
- **AI Tools Suite** (30+ tools):
  - Planning & Estimation: Cost Estimator, Material Takeoff, Labor Hours, FFE Budget
  - Scheduling: Schedule Calculator, Permit Timeline, Mobilization Cost
  - Risk Management: Bid Leveling, Change Order, Variance Tracker, Scope Gap
  - Safety: Safety Assistant, Safety Score, OSHA Incident Rate, Pre-Task Plan
  - Execution: Crew Dispatch, Crew Productivity, Room Turnover, Closeout Checklist
  - Quality: Punch Organizer, RFI Impact, Renovation Phases, Renovation ROI

#### Safety Suite
- Safety Director Portal, Audits, Briefings, Hazard Assessments
- Incident Prediction, JSA Daily Tracker
- Culture Scores, Tag Management, Toolbox Sessions
- Emergency Response, Company Profile

#### Design Intelligence
- AI Render Engine, Virtual Staging
- Furniture Designer, Model Library
- Collaboration Workspace

#### Financial & Documents
- Financial Dashboard, Procurement Hub
- Document Fusion, Report Builder
- Shared Reports

#### Administrative
- Account Dashboard, Admin Settings
- Tenant Administration, Builder Dashboard

---

## 🤖 AI Integration

### Making Tools Callable by Third-Party AI

ConstructionTech tools are designed to be **AI-friendly and callable by external AI agents**. Third-party AI systems can invoke tools via multiple patterns:

#### 1. **HTTP REST API Pattern**
```bash
# Example: Call Cost Estimator tool
curl -X POST https://api.constructiontech.ai/tools/cost-estimator \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj-123",
    "scope": "kitchen renovation",
    "locationZip": "94102",
    "complexity": "medium"
  }'
```

#### 2. **Canister Query/Update Pattern (ICP Native)**
```typescript
// Call smart contract directly
const result = await actor.estimateCost({
  projectId: "proj-123",
  scope: "kitchen renovation",
  locationZip: "94102",
  complexity: "medium"
});
```

#### 3. **AI Agent SDK**
```python
# Python AI Agent example
from constructiontech_sdk import ConstructionTechClient

client = ConstructionTechClient(
    api_key="your_ai_agent_key",
    principal="your_principal"
)

# Call any tool
result = client.tools.cost_estimator(
    project_id="proj-123",
    scope="kitchen renovation",
    zip_code="94102",
    complexity="medium"
)

# Process result in AI workflow
print(f"Estimated cost: ${result.estimate_cents / 100}")
```

#### 4. **Webhook & Event Stream Pattern**
Subscribe to tool results in real-time:
```json
{
  "event": "tool.result",
  "tool_id": "cost-estimator",
  "project_id": "proj-123",
  "result": { ... },
  "timestamp": 1718390000
}
```

---

## 🧠 Available Tools for AI Integration

### Planning & Estimation Tools
| Tool | Endpoint | Purpose |
|------|----------|---------|
| Cost Estimator | `POST /tools/cost-estimator` | ML-based cost estimation with regional variance |
| Material Takeoff | `POST /tools/material-takeoff` | BIM-integrated material quantification |
| Labor Hours Calculator | `POST /tools/labor-hours` | Crew productivity and labor forecasting |
| FFE Budget | `POST /tools/ffe-budget` | Furniture, Fixtures & Equipment budgeting |
| Scope Estimator | `POST /tools/scope-estimator` | Scope validation and estimation |

### Scheduling & Timeline Tools
| Tool | Endpoint | Purpose |
|------|----------|---------|
| Schedule Calculator | `POST /tools/schedule-calculator` | CPM scheduling with constraint analysis |
| Permit Timeline | `POST /tools/permit-timeline` | Permit approval timeline prediction |
| Mobilization Cost | `POST /tools/mobilization-cost` | Mobilization cost estimation |
| Room Turnover | `POST /tools/room-turnover` | Hospitality room turnover scheduling |

### Risk & Quality Tools
| Tool | Endpoint | Purpose |
|------|----------|---------|
| Bid Leveling | `POST /tools/bid-leveling` | Comparative bid analysis |
| Change Order Impact | `POST /tools/change-order` | Change order cost/schedule impact |
| Variance Tracker | `POST /tools/variance-tracker` | Cost and schedule variance analysis |
| Scope Gap Analyzer | `POST /tools/scope-gap` | Detect scope gaps and ambiguities |
| Pre-Task Planner | `POST /tools/pre-task-plan` | AI-generated task plans |

### Safety Tools
| Tool | Endpoint | Purpose |
|------|----------|---------|
| Safety Assistant | `POST /tools/safety-assistant` | OSHA compliance guidance |
| Safety Score | `POST /tools/safety-score` | Real-time safety KPI scoring |
| OSHA Incident Rate | `POST /tools/osha-incident-rate` | Incident rate calculation & benchmarking |
| Hazard Assessment | `POST /tools/hazard-assessment` | AI-powered hazard identification |
| Incident Predictor | `POST /tools/incident-predictor` | Predictive incident risk scoring |
| JSA Generator | `POST /tools/jsa-generator` | Automated Job Safety Analysis |
| Toolbox Talk | `POST /tools/toolbox-talk` | AI-generated toolbox talk content |

### Execution & Delivery Tools
| Tool | Endpoint | Purpose |
|------|----------|---------|
| Crew Dispatch | `POST /tools/crew-dispatch` | Optimal crew assignment |
| Crew Productivity | `POST /tools/crew-productivity` | Productivity analytics and forecasting |
| Punch Organizer | `POST /tools/punch-organizer` | Punch list prioritization |
| Closeout Checklist | `POST /tools/closeout-checklist` | Project closeout automation |
| RFI Impact Analyzer | `POST /tools/rfi-impact` | RFI approval delay impact |
| Renovation Phases | `POST /tools/renovation-phases` | Phased renovation sequencing |
| Renovation ROI | `POST /tools/renovation-roi` | Renovation ROI analysis |

---

## 🔌 API Reference

### Authentication
All API calls require authentication via **Internet Identity** or **API Token**:

```bash
# Get authentication token
curl -X POST https://api.constructiontech.ai/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "principal": "YOUR_PRINCIPAL",
    "timestamp": 1718390000
  }'
```

### Tool Result Format
All tool results follow a standardized format:

```json
{
  "toolId": "cost-estimator",
  "projectId": "proj-123",
  "status": "success",
  "result": {
    "estimatedCost": 125000,
    "estimatedCents": 12500000,
    "confidence": 0.92,
    "breakdown": {
      "labor": 45000,
      "materials": 65000,
      "equipment": 15000
    },
    "factors": [
      "location_adjustment: +5%",
      "complexity_premium: +8%"
    ]
  },
  "metadata": {
    "executionTime": 2345,
    "model": "cost-estimator-v2",
    "dataPoints": 1250
  },
  "timestamp": 1718390000,
  "cplAudit": "audit-hash-123"
}
```

### Error Handling
```json
{
  "status": "error",
  "code": "INVALID_PROJECT",
  "message": "Project proj-123 not found",
  "details": {
    "projectId": "proj-123",
    "suggestion": "Verify project ID and permissions"
  }
}
```

---

## ✨ Advanced Features

### 1. **Smart Contract Token Lifecycle**
Blockchain-secured construction tokens with multi-party approval:
- **BidToken** → **AwardToken** → **PayAppToken** → **CompletionToken**
- CPL governance with immutable audit logs
- Lien waiver integration

### 2. **Real-Time Perception Stream**
- AI-powered safety anomaly detection
- Worker status monitoring (BHX system)
- Real-time media feeds with AI analysis

### 3. **Design Intelligence Engine**
- 66+ material library with CSI codes and sustainability ratings
- 3D model viewer with furniture catalog
- Virtual staging and rendering

### 4. **Collaborative Workspaces**
- Real-time media comments and threads
- Activity feeds with AI-generated insights
- Document fusion and version control

### 5. **Multi-Format Export**
- PDF export (jsPDF) with custom formatting
- Excel export (XLSX) for analysis
- HTML5 canvas screenshots for documentation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Internet Computer SDK (dfx) for local development

### Installation

```bash
# Clone repository
git clone https://github.com/FreddyCreates/ConstructionTech.git
cd ConstructionTech/FreddyCreates/ConstructionTech

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm check
pnpm fix  # Auto-fix lint issues
```

### Environment Variables

```bash
# ICP Network
DFX_NETWORK=local                    # local | ic (mainnet)

# Authentication
II_URL=http://uqzsh-gqaaa-aaaaq-qaada-cai.localhost:8081/authorize
STORAGE_GATEWAY_URL=https://blob.caffeine.ai

# API Configuration
CANISTER_PROJECT_API=xxx
CANISTER_TENANT_API=xxx
CANISTER_SAFETY_TOOLS_API=xxx
# ... (add all canister IDs)

# AI Integration
GROQ_API_KEY=your_groq_key
OLLAMA_API_URL=http://localhost:11434
PRO1_ENGINE_URL=https://engine.pro1.ai
```

---

## 🔧 Development

### Project Structure

```
.
├── src/
│   ├── components/          # React UI components
│   │   ├── ui/             # shadcn/ui primitives
│   │   └── layout/         # Page layouts
│   ├── pages/              # Route pages (80+)
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks (data layer)
│   ├── lib/                # Utilities and helpers
│   ├── types/              # TypeScript type definitions
│   └── index.css           # Global styles
├── backend.d.ts            # Type definitions for ICP canisters
├── *.mo                    # Motoko smart contracts (65+)
├── App.tsx                 # Router configuration
├── main.tsx                # Entry point
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── biome.json              # Biome linter config
└── caffeine.toml           # Caffeine platform config
```

### Available Scripts

```bash
pnpm dev          # Start Vite dev server (hot reload)
pnpm build        # Production build
pnpm typecheck    # TypeScript type checking
pnpm check        # Biome linting
pnpm fix          # Auto-fix linting issues
pnpm copy:env     # Copy env.json to dist
```

### Code Quality

This project uses **Biome** for linting and formatting:

```bash
# Check code
pnpm check

# Auto-fix issues
pnpm fix

# TypeScript compilation
pnpm typecheck
```

---

## 📚 Documentation

### Core Concepts

- **[ICP Smart Contracts](./docs/smart-contracts.md)** — Token lifecycle, governance, audit logs
- **[AI Tool Integration](./docs/ai-integration.md)** — Calling tools from third-party AI
- **[API Endpoints](./docs/api-reference.md)** — Complete REST/Canister API reference
- **[Safety Framework](./docs/safety-framework.md)** — OSHA compliance, hazard management
- **[Financial Intelligence](./docs/financial-intelligence.md)** — Pay apps, lien waivers, risk
- **[Design System](./docs/design-system.md)** — UI components, Tailwind theming

### Deployment

- **[Local Development](./docs/development.md)** — Setting up local ICP network
- **[Production Deployment](./docs/deployment.md)** — Mainnet canister deployment
- **[Environment Configuration](./docs/environment.md)** — Configuration for different environments

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md).

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test thoroughly
3. Run linting: `pnpm check` and `pnpm typecheck`
4. Commit with clear messages: `git commit -m "feat: add new tool"`
5. Push and create a Pull Request

### Reporting Issues

- Use [GitHub Issues](https://github.com/FreddyCreates/ConstructionTech/issues) for bug reports
- Include reproduction steps and error messages
- Attach screenshots for UI issues

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 🔐 Security

ConstructionTech uses blockchain-secured smart contracts and decentralized authentication. See [SECURITY.md](./SECURITY.md) for security policies.

- 🛡️ Internet Identity (passwordless, decentralized)
- ⛓️ ICP canister isolation and resource limits
- 📋 CPL governance with immutable audit logs
- 🔏 Lien waiver cryptographic verification

---

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/FreddyCreates/ConstructionTech/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FreddyCreates/ConstructionTech/discussions)
- **Email**: support@ois.construction

---

## 🙋 Acknowledgments

- Built on [Internet Computer Protocol (ICP)](https://internetcomputer.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- 3D rendering with [Three.js](https://threejs.org/)
- AI integration with [Groq](https://groq.com/), [Ollama](https://ollama.ai/), and Pro1 Engine

---

<div align="center">

**[⬆ back to top](#constructiontech-platform)**

Made with ❤️ by the ConstructionTech team

</div>
