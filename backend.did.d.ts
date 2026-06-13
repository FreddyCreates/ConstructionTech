export type ResearchField =
  | "Hospitality"
  | "Multifamily"
  | "Office"
  | "Facilities"
  | "Cross-Industry";

export type ResearchTopic =
  | "Safety & Compliance"
  | "Cost & Estimation"
  | "Scheduling"
  | "Logistics & FF&E"
  | "Workforce"
  | "Sustainability"
  | "Quality & Punch"
  | "Regulations & Codes";

export interface ResearchEntry {
  id: string;
  title: string;
  category: string;
  field: ResearchField;
  topic: ResearchTopic;
  summary: string;
  source: string;
  date: string;
  tags: string[];
  readTime: number; // minutes
}

export const RESEARCH_ENTRIES: ResearchEntry[] = [
  {
    id: "rl-001",
    title:
      "OSHA 29 CFR 1926.502 — Fall Protection Requirements for Interior Work",
    category: "Federal Standard",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "Mandates guardrail systems, safety net systems, and personal fall arrest systems for workers at elevations of 6 feet or more in construction environments. Covers anchor points, hardware specifications, and inspection protocols for interior installation crews.",
    source: "U.S. Occupational Safety and Health Administration (OSHA)",
    date: "2023-01-15",
    tags: [
      "fall protection",
      "OSHA",
      "CFR 1926",
      "interior construction",
      "harness",
    ],
    readTime: 12,
  },
  {
    id: "rl-002",
    title: "Marriott Brand Standard: Bathroom Accessory Installation Specs",
    category: "Brand Standard",
    field: "Hospitality",
    topic: "Quality & Punch",
    summary:
      "Defines precise tolerances, heights, and hardware requirements for towel bars, toilet paper holders, grab bars, and robe hooks in Marriott-branded properties. Compliance is verified during brand quality assurance inspections.",
    source: "Marriott International Brand Design & Standards Portal",
    date: "2023-06-10",
    tags: [
      "Marriott",
      "bathroom accessories",
      "brand standard",
      "hotel renovation",
      "tolerances",
    ],
    readTime: 8,
  },
  {
    id: "rl-003",
    title: "FF&E Installation Sequencing Best Practices for Hotel Renovations",
    category: "Industry Guide",
    field: "Hospitality",
    topic: "Logistics & FF&E",
    summary:
      "Establishes a recommended workflow for FF&E delivery, staging, and installation to minimize room re-entry and reduce schedule conflicts with other trades. Covers coordination with GC superintendents and brand inspectors for phased hotel turnover.",
    source: "Hospitality Design + Construction Quarterly",
    date: "2023-03-22",
    tags: [
      "FF&E",
      "sequencing",
      "hotel renovation",
      "room turnover",
      "phasing",
    ],
    readTime: 10,
  },
  {
    id: "rl-004",
    title: "HUD Multifamily Housing Quality Standards (HQS)",
    category: "Federal Standard",
    field: "Multifamily",
    topic: "Regulations & Codes",
    summary:
      "Defines minimum habitability and quality standards for HUD-assisted multifamily housing units, including interior finish requirements, bathroom fixtures, and door hardware specifications. Mandatory for federally funded multifamily renovation projects.",
    source: "U.S. Department of Housing and Urban Development (HUD)",
    date: "2022-11-01",
    tags: [
      "HUD",
      "multifamily",
      "housing quality",
      "federal standards",
      "habitability",
    ],
    readTime: 15,
  },
  {
    id: "rl-005",
    title: "Casework Installation Tolerances per AWI Standards",
    category: "Industry Standard",
    field: "Cross-Industry",
    topic: "Quality & Punch",
    summary:
      "The Architectural Woodwork Institute (AWI) establishes maximum acceptable deviations for cabinet and casework installation, including levelness (1/8″ in 10′), plumb, and reveal consistency. Adopted by most GC punch list programs across hospitality and multifamily.",
    source:
      "Architectural Woodwork Institute — Quality Standards Illustrated (QSI)",
    date: "2023-02-14",
    tags: [
      "AWI",
      "casework",
      "tolerances",
      "cabinets",
      "millwork",
      "punch list",
    ],
    readTime: 9,
  },
  {
    id: "rl-006",
    title: "Toolbox Talk: Occupied Space Safety Protocols",
    category: "Toolbox Talk",
    field: "Hospitality",
    topic: "Safety & Compliance",
    summary:
      "Pre-task safety briefing covering noise control, dust containment, fire watch requirements, and guest corridor access management when working in occupied hotels. Includes daily sign-in sheet template and supervisor checklist for occupied property renovations.",
    source: "OIS Safety Program — Internal Standard Talk Library",
    date: "2024-01-08",
    tags: [
      "toolbox talk",
      "occupied hotel",
      "dust control",
      "noise",
      "fire watch",
    ],
    readTime: 5,
  },
  {
    id: "rl-007",
    title: "Glass Shower Door ANSI Z97.1 Safety Glazing Standards",
    category: "Industry Standard",
    field: "Cross-Industry",
    topic: "Regulations & Codes",
    summary:
      "ANSI Z97.1 requires all shower enclosure glass to meet safety glazing performance standards including impact resistance, tensile strength, and breakage characteristics. Tempered and laminated glass must carry certification marks visible post-installation.",
    source: "American National Standards Institute (ANSI) Z97.1",
    date: "2022-09-30",
    tags: [
      "ANSI",
      "glass shower",
      "safety glazing",
      "tempered glass",
      "shower enclosure",
    ],
    readTime: 7,
  },
  {
    id: "rl-008",
    title: "Interior Door Frame Installation Standards (ADA Compliance)",
    category: "Compliance Guide",
    field: "Cross-Industry",
    topic: "Regulations & Codes",
    summary:
      "ADA Standards for Accessible Design (2010) require door clear widths of 32–36 inches, threshold heights not exceeding 1/2 inch, and hardware operable with a closed fist. Applies to all accessible routes in commercial renovation projects.",
    source: "ADA.gov — 2010 ADA Standards for Accessible Design",
    date: "2022-07-19",
    tags: ["ADA", "door frame", "accessibility", "clear width", "hardware"],
    readTime: 8,
  },
  {
    id: "rl-009",
    title: "Punch List Best Practices for Hospitality GC Closeout",
    category: "Best Practice Guide",
    field: "Hospitality",
    topic: "Quality & Punch",
    summary:
      "Outlines a structured punch list workflow for hotel renovation closeouts including pre-punch walkthroughs, digital documentation, trade-specific line items, and brand inspector coordination. Reduces average punch resolution time by 40% when systematically applied.",
    source: "Construction Owners Association of America (COAA)",
    date: "2023-08-05",
    tags: [
      "punch list",
      "closeout",
      "hotel",
      "GC coordination",
      "brand inspection",
    ],
    readTime: 11,
  },
  {
    id: "rl-010",
    title: "OSHA 300 Log: Recordkeeping Requirements for Construction",
    category: "Federal Standard",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "OSHA 29 CFR 1904 requires all construction employers with 11 or more employees to maintain OSHA 300 logs of work-related injuries and illnesses, post OSHA 300A summaries February–April annually, and retain records for 5 years.",
    source: "OSHA 29 CFR Part 1904 — Recordkeeping and Reporting",
    date: "2023-04-01",
    tags: ["OSHA 300", "recordkeeping", "injury log", "1904", "compliance"],
    readTime: 6,
  },
  {
    id: "rl-011",
    title: "Demountable Wall Systems: STC Ratings and Acoustic Standards",
    category: "Technical Reference",
    field: "Office",
    topic: "Quality & Punch",
    summary:
      "Sound Transmission Class (STC) ratings for demountable partition systems typically range from STC 35 (basic) to STC 52 (high performance). ASTM E90 testing methodology and IIC floor impact ratings are critical evaluation criteria for open-plan office reconfigurations.",
    source:
      "ASTM International — E90 Standard Test Method for Sound Transmission",
    date: "2023-05-20",
    tags: [
      "STC",
      "demountable walls",
      "acoustic",
      "ASTM E90",
      "office partition",
    ],
    readTime: 9,
  },
  {
    id: "rl-012",
    title: "Hotel Room Renovation: Average Duration Benchmarks by Brand",
    category: "Industry Benchmark",
    field: "Hospitality",
    topic: "Scheduling",
    summary:
      "Select-service hotel room renovations average 3–5 days per room when multi-trade bundles are coordinated; full-service brands (Marriott, Hilton, Hyatt) average 5–10 days due to MEP overlay and brand inspection requirements. Proper sequencing cuts re-entry by 60%.",
    source: "Hotel Management & Construction Network Annual Benchmark Report",
    date: "2023-07-15",
    tags: [
      "room turnover",
      "renovation duration",
      "benchmark",
      "select service",
      "schedule",
    ],
    readTime: 7,
  },
  {
    id: "rl-013",
    title: "FF&E Damage Claims: Documentation and Recovery Procedures",
    category: "Best Practice Guide",
    field: "Cross-Industry",
    topic: "Logistics & FF&E",
    summary:
      "Establishes chain-of-custody documentation requirements for FF&E receipt, staging, and installation to support damage claims against vendors or carriers. Photographic condition reporting at delivery and installation reduces claim disputes by over 70%.",
    source: "Interior Construction & FF&E Industry Alliance (ICFIA)",
    date: "2023-09-12",
    tags: [
      "FF&E",
      "damage claims",
      "documentation",
      "chain of custody",
      "logistics",
    ],
    readTime: 8,
  },
  {
    id: "rl-014",
    title: "NFPA 101 Life Safety Code: Interior Renovation Requirements",
    category: "Federal Standard",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "Governs egress widths, door hardware (fire-rated assemblies), and smoke barrier continuity during and after interior renovations. Critical for occupied hospitality and multifamily projects to avoid code violations during phased scopes.",
    source: "National Fire Protection Association — NFPA 101 (2021 Edition)",
    date: "2022-12-05",
    tags: [
      "NFPA 101",
      "life safety",
      "egress",
      "fire-rated doors",
      "renovation",
    ],
    readTime: 14,
  },
  {
    id: "rl-015",
    title:
      "IBC Chapter 11: Accessibility Requirements for Commercial Interior Projects",
    category: "Building Code",
    field: "Cross-Industry",
    topic: "Regulations & Codes",
    summary:
      "International Building Code Section 1101–1110 establishes accessible route requirements for all commercial renovation projects, including clear floor space at door hardware, lavatory knee clearance, and reach range standards for accessories.",
    source: "International Building Code (IBC) 2021 — Chapter 11",
    date: "2023-01-30",
    tags: [
      "IBC",
      "accessibility",
      "Chapter 11",
      "commercial renovation",
      "ADA",
    ],
    readTime: 10,
  },
  {
    id: "rl-016",
    title: "Hilton Brand Standards: Guestroom FF&E Installation Requirements",
    category: "Brand Standard",
    field: "Hospitality",
    topic: "Logistics & FF&E",
    summary:
      "Specifies furniture placement tolerances, electrical outlet coordination for case goods, and millwork integration requirements for Hilton-branded guestroom renovations. Includes approved vendor lists and sample approval protocols for full-service properties.",
    source: "Hilton Hotels & Resorts Brand Standards Manual",
    date: "2023-04-18",
    tags: [
      "Hilton",
      "brand standard",
      "guestroom FF&E",
      "furniture",
      "case goods",
    ],
    readTime: 9,
  },
  {
    id: "rl-017",
    title: "Apartment Interior Renovation Cost Benchmarks (2024)",
    category: "Industry Benchmark",
    field: "Multifamily",
    topic: "Cost & Estimation",
    summary:
      "National average costs for multifamily unit renovations: kitchen cabinet/vanity replacements average $8,000–$14,000 per unit; bath surround installations average $2,500–$4,500; interior door and hardware packages range $800–$1,600 per door depending on specification level.",
    source: "RSMeans Construction Cost Data — Multifamily Division (2024)",
    date: "2024-02-01",
    tags: [
      "cost benchmark",
      "multifamily",
      "renovation",
      "RSMeans",
      "cabinets",
    ],
    readTime: 8,
  },
  {
    id: "rl-018",
    title:
      "Toolbox Talk: Proper Lifting Techniques for Mattress and Appliance Installation",
    category: "Toolbox Talk",
    field: "Hospitality",
    topic: "Safety & Compliance",
    summary:
      "Covers two-person lift protocols for mattresses (40–80 lbs), refrigerators, and microwave installations in hotel corridors and rooms. Reviews back injury prevention, safe use of appliance dollies, and stairwell navigation procedures.",
    source: "OIS Safety Program — Internal Standard Talk Library",
    date: "2024-01-22",
    tags: ["toolbox talk", "lifting", "mattress", "appliance", "ergonomics"],
    readTime: 5,
  },
  {
    id: "rl-019",
    title: "Glass Shower Panel Surround Installation Guide for Hotels",
    category: "Technical Reference",
    field: "Hospitality",
    topic: "Quality & Punch",
    summary:
      "Step-by-step installation procedures for 3-panel frameless glass shower surrounds in hospitality guestrooms, including substrate preparation, waterproofing membrane requirements, silicone joint detailing, and Marriott/Hilton tolerances for reveal alignment.",
    source: "National Glass Association (NGA) Technical Handbook",
    date: "2023-10-08",
    tags: [
      "glass shower",
      "surround",
      "hotel",
      "frameless",
      "silicone",
      "waterproofing",
    ],
    readTime: 11,
  },
  {
    id: "rl-020",
    title: "Pre-Task Planning (PTP) Requirements for High-Hazard Construction",
    category: "Safety Protocol",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "Documents the JSA-based pre-task planning process for high-hazard activities including elevated work, electrical energization, confined space entry, and chemical handling. Mandatory supervisor sign-off and toolbox delivery are required before each shift.",
    source:
      "Associated Builders and Contractors (ABC) Safety Management System",
    date: "2023-11-14",
    tags: ["PTP", "JSA", "pre-task planning", "high-hazard", "supervisor"],
    readTime: 7,
  },
  {
    id: "rl-021",
    title:
      "Millwork Fabrication Standards: Cabinet-to-Wall Anchor Requirements",
    category: "Technical Reference",
    field: "Multifamily",
    topic: "Quality & Punch",
    summary:
      "Details minimum fastener spacing, anchor bolt specifications for concrete/masonry substrates, and stud-locating requirements for kitchen and bathroom cabinet installation in multifamily construction. References AWI Section 1700 and IBC structural attachment criteria.",
    source: "Architectural Woodwork Institute — AWI Section 1700",
    date: "2023-06-25",
    tags: [
      "millwork",
      "cabinet",
      "anchor",
      "fastener",
      "multifamily",
      "AWI 1700",
    ],
    readTime: 8,
  },
  {
    id: "rl-022",
    title:
      "Demountable Wall Installation: Sequence and Trade Coordination Guide",
    category: "Best Practice Guide",
    field: "Office",
    topic: "Scheduling",
    summary:
      "Defines optimal installation sequence for demountable wall systems relative to HVAC, electrical, and ceiling grid installation. Proper coordination eliminates 85% of rework during office buildout projects and supports faster client occupancy schedules.",
    source: "International Facility Management Association (IFMA) Tech Report",
    date: "2023-07-30",
    tags: [
      "demountable walls",
      "sequence",
      "office buildout",
      "HVAC coordination",
      "trade coordination",
    ],
    readTime: 9,
  },
  {
    id: "rl-023",
    title: "Workforce Retention Strategies for Interior Construction Crews",
    category: "HR Best Practice",
    field: "Cross-Industry",
    topic: "Workforce",
    summary:
      "Analyzes retention tactics for skilled interior installation workers including structured per diem packages for travel-ready crews, career development pathways, and transparent project scheduling. Average crew retention improves 30% with per diem equity structures.",
    source: "AGC America Workforce Development Research Series",
    date: "2023-09-05",
    tags: [
      "workforce",
      "retention",
      "per diem",
      "travel crew",
      "career development",
    ],
    readTime: 10,
  },
  {
    id: "rl-024",
    title: "LEED v4 Interior Construction: Low-VOC Material Compliance",
    category: "Sustainability Standard",
    field: "Office",
    topic: "Sustainability",
    summary:
      "LEED v4 CI EQ Credit: Low-Emitting Materials requires all adhesives, sealants, paints, coatings, and flooring installed during office interior construction to meet VOC limits per SCAQMD Rule 1168 or equivalent. Submittals must include manufacturer VOC documentation.",
    source: "U.S. Green Building Council — LEED v4 Reference Guide",
    date: "2023-05-10",
    tags: [
      "LEED",
      "VOC",
      "sustainability",
      "office",
      "low-emitting materials",
      "SCAQMD",
    ],
    readTime: 11,
  },
  {
    id: "rl-025",
    title:
      "Hyatt Brand Standard: Corridor FF&E Logistics and Staging Protocols",
    category: "Brand Standard",
    field: "Hospitality",
    topic: "Logistics & FF&E",
    summary:
      "Details approved staging areas, protective floor covering requirements, furniture dolly specifications, and elevator floor protection standards for Hyatt properties. Violations result in GC chargebacks; pre-move-in inspections are mandatory.",
    source: "Hyatt Hotels Corporation — Owner & Franchise Standards Manual",
    date: "2023-08-22",
    tags: [
      "Hyatt",
      "corridor logistics",
      "FF&E staging",
      "floor protection",
      "brand standard",
    ],
    readTime: 7,
  },
  {
    id: "rl-026",
    title: "Job Hazard Analysis (JHA/JSA) Template for Interior Installation",
    category: "Safety Template",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "Provides a standardized JSA format for identifying hazards associated with door hardware installation, casework hanging, glass panel setting, and appliance placement. Includes hazard rating matrix (severity × probability) and required PPE per task type.",
    source: "OIS Safety Program — JHA/JSA Template Library",
    date: "2024-02-15",
    tags: ["JSA", "JHA", "hazard analysis", "PPE", "interior installation"],
    readTime: 6,
  },
  {
    id: "rl-027",
    title: "IHG (Holiday Inn) Renovation Standards: Guestroom Scope Checklist",
    category: "Brand Standard",
    field: "Hospitality",
    topic: "Quality & Punch",
    summary:
      "Comprehensive renovation checklist for IHG-branded properties specifying scope completion criteria for guestroom renovation including lighting, millwork, bathroom accessory placement, TV mounting height, and safe installation requirements.",
    source: "IHG Hotels & Resorts — PIP and Renovation Standards (2023)",
    date: "2023-03-05",
    tags: ["IHG", "Holiday Inn", "renovation checklist", "PIP", "guestroom"],
    readTime: 8,
  },
  {
    id: "rl-028",
    title: "Hotel Renovation Schedule Compression: Multi-Trade Bundling Impact",
    category: "Industry Research",
    field: "Hospitality",
    topic: "Scheduling",
    summary:
      "Research shows that bundling FF&E, millwork, and bathroom scope to a single subcontractor reduces room re-entry by 2–3 instances per room and compresses overall renovation duration by 18–25% versus multi-contractor models.",
    source:
      "Cornell School of Hotel Administration — Hospitality Construction Review",
    date: "2023-11-20",
    tags: [
      "bundling",
      "schedule compression",
      "hotel renovation",
      "re-entry",
      "multi-trade",
    ],
    readTime: 12,
  },
  {
    id: "rl-029",
    title:
      "Americans with Disabilities Act: Vanity and Sink Clearance Standards",
    category: "Compliance Guide",
    field: "Multifamily",
    topic: "Regulations & Codes",
    summary:
      "ADA 2010 Section 606 requires knee clearance of 27″ min height, 30″ width, and 19″ depth at accessible lavatories. Vanity cabinet modifications must accommodate knee space; pipe insulation required under exposed supply lines in accessible units.",
    source: "ADA Standards for Accessible Design — Section 606",
    date: "2022-10-12",
    tags: [
      "ADA",
      "vanity",
      "knee clearance",
      "multifamily",
      "accessible units",
    ],
    readTime: 7,
  },
  {
    id: "rl-030",
    title: "Toolbox Talk: Chemical Handling for Adhesives and Sealants",
    category: "Toolbox Talk",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "Covers SDS review procedures, PPE requirements for silicone, polyurethane, and contact cement products used in glass, millwork, and accessory installation. Includes first-aid protocols for skin and eye contact with common installation adhesives.",
    source: "OIS Safety Program — Chemical Handling Toolbox Talks",
    date: "2024-01-30",
    tags: [
      "toolbox talk",
      "chemical handling",
      "SDS",
      "silicone",
      "PPE",
      "adhesives",
    ],
    readTime: 5,
  },
  {
    id: "rl-031",
    title:
      "FF&E Procurement Timelines: Lead Time Benchmarks for Hotel Projects",
    category: "Industry Benchmark",
    field: "Hospitality",
    topic: "Logistics & FF&E",
    summary:
      "Standard lead times for hospitality FF&E: custom case goods 14–22 weeks, fabric-specified seating 12–18 weeks, custom millwork 8–12 weeks, bathroom accessories 4–8 weeks. Proper procurement scheduling prevents installation float delays.",
    source:
      "Hospitality Purchasing Management Association (HPMA) Annual Report",
    date: "2023-04-25",
    tags: [
      "FF&E procurement",
      "lead times",
      "custom case goods",
      "purchasing",
      "hotel",
    ],
    readTime: 7,
  },
  {
    id: "rl-032",
    title: "Wyndham Brand Requirements: Shower Enclosure and Accessory Specs",
    category: "Brand Standard",
    field: "Hospitality",
    topic: "Quality & Punch",
    summary:
      "Specifies approved glass thickness (3/8″ tempered minimum), header/track profiles, and towel bar mounting heights for Wyndham and Wingate properties. Deviations from spec require written brand approval before installation commences.",
    source: "Wyndham Hotels & Resorts — Brand Standards and PIP Manual (2023)",
    date: "2023-05-15",
    tags: [
      "Wyndham",
      "shower enclosure",
      "tempered glass",
      "PIP",
      "brand standard",
    ],
    readTime: 7,
  },
  {
    id: "rl-033",
    title: "Office FF&E Workstation Installation: BIFMA Standards Compliance",
    category: "Industry Standard",
    field: "Office",
    topic: "Quality & Punch",
    summary:
      "BIFMA G1 establishes ergonomic guidelines for office workstation layout, while BIFMA X5.1 covers durability testing for seating and surface products. Installation teams must verify structural integrity of panel-hung components per manufacturer spec sheets.",
    source:
      "Business and Institutional Furniture Manufacturers Association (BIFMA)",
    date: "2023-06-01",
    tags: ["BIFMA", "workstation", "office FF&E", "ergonomic", "installation"],
    readTime: 8,
  },
  {
    id: "rl-034",
    title:
      "Multifamily Kitchen Cabinet Installation: Substrate and Blocking Requirements",
    category: "Technical Reference",
    field: "Multifamily",
    topic: "Quality & Punch",
    summary:
      "Defines wood blocking requirements behind drywall for upper cabinet installation in multifamily projects, including minimum lumber dimensions, fastener schedules, and verification procedures. Blocking spec errors are the #1 cause of cabinet warranty claims.",
    source:
      "Kitchen Cabinet Manufacturers Association (KCMA) Installation Guidelines",
    date: "2023-07-08",
    tags: [
      "kitchen cabinets",
      "blocking",
      "substrate",
      "KCMA",
      "multifamily",
      "installation",
    ],
    readTime: 9,
  },
  {
    id: "rl-035",
    title:
      "Toolbox Talk: Electrical Safety for TV Mounting and Electronics Installation",
    category: "Toolbox Talk",
    field: "Hospitality",
    topic: "Safety & Compliance",
    summary:
      "Reviews lockout/tagout (LOTO) requirements before connecting TV mounting brackets to in-wall power, cord management safety, and verification procedures to confirm power is de-energized. Addresses static discharge risks for electronics.",
    source: "OIS Safety Program — Electrical Safety Toolbox Talks",
    date: "2024-02-05",
    tags: [
      "toolbox talk",
      "electrical safety",
      "LOTO",
      "TV mounting",
      "electronics",
    ],
    readTime: 5,
  },
  {
    id: "rl-036",
    title:
      "OSHA Silica Rule 29 CFR 1926.1153: Interior Construction Compliance",
    category: "Federal Standard",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "Establishes Permissible Exposure Limit (PEL) of 50 μg/m³ for respirable crystalline silica in construction. Requires engineering controls (wet methods, HEPA vacuum), written exposure control plan, and medical surveillance for workers with significant silica exposure.",
    source: "OSHA 29 CFR 1926.1153 — Respirable Crystalline Silica Standard",
    date: "2023-03-10",
    tags: ["silica", "OSHA", "PEL", "dust control", "HEPA", "exposure control"],
    readTime: 11,
  },
  {
    id: "rl-037",
    title: "Carpet Demo and Disposal: Environmental Compliance Guidance",
    category: "Environmental Guide",
    field: "Hospitality",
    topic: "Sustainability",
    summary:
      "Outlines proper separation, bagging, and disposal of carpet and pad waste streams in hotel renovation projects including recycling partnerships with Carpet America Recovery Effort (CARE). Helps GCs meet waste diversion targets for LEED certification.",
    source:
      "Carpet America Recovery Effort (CARE) & EPA Waste Management Guidelines",
    date: "2023-08-18",
    tags: [
      "carpet demo",
      "disposal",
      "CARE",
      "recycling",
      "LEED waste",
      "hotel",
    ],
    readTime: 7,
  },
  {
    id: "rl-038",
    title: "Multifamily Interior Door Hardware: ADA Lever Handle Requirements",
    category: "Compliance Guide",
    field: "Multifamily",
    topic: "Regulations & Codes",
    summary:
      "ADA compliant lever handles must require no tight grasping, pinching, or twisting of the wrist to operate. Hardware operating force cannot exceed 5 lbf for accessible units. Door closer specifications and mounting height standards are also defined.",
    source: "ADA Standards for Accessible Design — Section 309.4",
    date: "2023-01-22",
    tags: [
      "ADA",
      "door hardware",
      "lever handle",
      "multifamily",
      "accessible",
      "operating force",
    ],
    readTime: 6,
  },
  {
    id: "rl-039",
    title:
      "Incident Rate Benchmarks: Interior Construction Industry (BLS Data)",
    category: "Safety Benchmark",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "Bureau of Labor Statistics NAICS 2382 (Building Equipment Contractors) reports a Total Recordable Incident Rate (TRIR) of 2.8 and Days Away Restricted Transfer (DART) rate of 1.5 — benchmarks that high-performing interior contractors consistently beat.",
    source:
      "Bureau of Labor Statistics — Industry Injury and Illness Data (2023)",
    date: "2024-01-10",
    tags: [
      "TRIR",
      "DART",
      "incident rate",
      "BLS",
      "safety benchmark",
      "NAICS 2382",
    ],
    readTime: 8,
  },
  {
    id: "rl-040",
    title: "Office Demountable Wall Systems: Fire Rating and Code Compliance",
    category: "Compliance Guide",
    field: "Office",
    topic: "Regulations & Codes",
    summary:
      "IBC Section 709 allows demountable partition systems to serve as fire barriers when tested to ASTM E119 and listed by UL. Manufacturers must provide UL listing documentation; installation must not penetrate fire-rated floor or ceiling assemblies.",
    source: "IBC 2021 Section 709 + ASTM E119 + UL Listing Documentation",
    date: "2023-09-28",
    tags: [
      "demountable wall",
      "fire rating",
      "IBC",
      "ASTM E119",
      "UL listing",
      "office",
    ],
    readTime: 9,
  },
  {
    id: "rl-041",
    title: "Cost Estimating for FF&E Installation: Labor Hour Benchmarks",
    category: "Industry Benchmark",
    field: "Cross-Industry",
    topic: "Cost & Estimation",
    summary:
      "Labor hour benchmarks for installation: standard hotel dresser placement 0.5 hrs/unit, bathroom accessory complete set 1.5 hrs/room, interior door with hardware 2.5 hrs/door, glass shower enclosure 4–6 hrs/unit. These averages support accurate ITB and proposal development.",
    source: "RSMeans Labor Cost Data & FICM Interior Construction Benchmarks",
    date: "2023-10-15",
    tags: [
      "cost estimating",
      "labor hours",
      "FF&E installation",
      "benchmark",
      "proposal",
    ],
    readTime: 8,
  },
  {
    id: "rl-042",
    title: "Toolbox Talk: Slip, Trip, and Fall Prevention in Hotel Corridors",
    category: "Toolbox Talk",
    field: "Hospitality",
    topic: "Safety & Compliance",
    summary:
      "Identifies common slip, trip, and fall hazards in hotel corridors during renovation including material staging, cord management, and wet floor signage placement. Requires daily housekeeping of work areas and prohibition of tripping hazards in egress paths.",
    source: "OIS Safety Program — Hotel Corridor Safety Talks",
    date: "2024-02-20",
    tags: [
      "slip trip fall",
      "hotel corridor",
      "housekeeping",
      "toolbox talk",
      "egress",
    ],
    readTime: 5,
  },
  {
    id: "rl-043",
    title: "Facilities Management FF&E Replacement Cycles: Industry Benchmarks",
    category: "Industry Benchmark",
    field: "Facilities",
    topic: "Cost & Estimation",
    summary:
      "Typical FF&E replacement cycles in facilities management: office seating 7–10 years, workstation panels 10–15 years, hotel guestroom case goods 8–12 years, commercial carpet 5–8 years. Lifecycle cost models improve capital planning accuracy.",
    source: "IFMA Facility and Workplace Research — Capital Planning Series",
    date: "2023-06-15",
    tags: [
      "facilities",
      "FF&E lifecycle",
      "replacement cycle",
      "capital planning",
      "benchmark",
    ],
    readTime: 9,
  },
  {
    id: "rl-044",
    title: "Travel Crew Management: Per Diem Rates and Lodging Procurement",
    category: "Operations Guide",
    field: "Cross-Industry",
    topic: "Workforce",
    summary:
      "GSA per diem rates (2024) for major construction markets range from $165–$335/day for lodging and $69–$79/day for M&IE. Efficient travel crew management with group lodging procurement reduces mobilization costs by 20–35% for multi-week scopes.",
    source: "U.S. General Services Administration — Per Diem Rates 2024",
    date: "2024-01-01",
    tags: ["per diem", "travel crew", "GSA rates", "lodging", "mobilization"],
    readTime: 7,
  },
  {
    id: "rl-045",
    title: "Interior Construction Subcontractor Prequalification: GC Checklist",
    category: "Best Practice Guide",
    field: "Cross-Industry",
    topic: "Regulations & Codes",
    summary:
      "Outlines the standard prequalification requirements used by major hospitality and multifamily GCs including: EMR below 1.0, COI minimums ($2M GL, $1M workers comp), OSHA 10/30 certifications, reference project list, and financial stability verification.",
    source:
      "Associated General Contractors (AGC) Subcontractor Prequalification Framework",
    date: "2023-08-30",
    tags: [
      "prequalification",
      "EMR",
      "COI",
      "OSHA 10",
      "subcontractor",
      "GC requirements",
    ],
    readTime: 9,
  },
  {
    id: "rl-046",
    title:
      "Sustainable Interior Fit-Out: WELL Building Standard Material Requirements",
    category: "Sustainability Standard",
    field: "Office",
    topic: "Sustainability",
    summary:
      "WELL v2 Feature M01 (Fundamental Material Precautions) restricts formaldehyde-emitting products and requires GreenGuard Gold certification for installed furnishings. Applies to office interiors seeking WELL Core & Shell or WELL tenant certifications.",
    source: "International WELL Building Institute — WELL v2 Standard (2023)",
    date: "2023-07-20",
    tags: [
      "WELL",
      "sustainable",
      "GreenGuard",
      "formaldehyde",
      "office",
      "indoor air quality",
    ],
    readTime: 10,
  },
  {
    id: "rl-047",
    title:
      "Bathroom Accessory Anchor Loads: ANSI/ASME A117.1 Grab Bar Requirements",
    category: "Technical Reference",
    field: "Cross-Industry",
    topic: "Quality & Punch",
    summary:
      "ANSI A117.1 requires grab bars to withstand a minimum 250 lb concentrated load from any direction. Blocking behind drywall (minimum 2×8 or equivalent) is required in accessible bathrooms; installation without proper blocking is a code violation.",
    source: "ANSI/ASME A117.1 — Accessible and Usable Buildings and Facilities",
    date: "2023-02-28",
    tags: [
      "grab bar",
      "ANSI A117.1",
      "accessible bathroom",
      "anchor load",
      "blocking",
    ],
    readTime: 6,
  },
  {
    id: "rl-048",
    title: "Facilities FF&E Decommission and Relocation: Cost Benchmarks",
    category: "Industry Benchmark",
    field: "Facilities",
    topic: "Cost & Estimation",
    summary:
      "Typical decommissioning and relocation costs: office workstation disassembly and move $85–$165/station, hotel room FF&E removal $350–$600/room, high-density storage relocation $25–$45/linear foot. Proper planning reduces damage rates and disposal costs.",
    source: "IFMA Relocation and Move Management Research Report",
    date: "2023-09-18",
    tags: [
      "decommission",
      "relocation",
      "facilities",
      "cost benchmark",
      "disposal",
    ],
    readTime: 7,
  },
  {
    id: "rl-049",
    title:
      "OSHA Multi-Employer Worksite Policy: Interior Subcontractor Obligations",
    category: "Federal Standard",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "OSHA Instruction CPL 02-00-124 establishes that multiple employers on a worksite can be cited for OSHA violations. Interior subcontractors (creating, exposing, correcting, or controlling employers) have distinct safety obligations even when a GC manages the site.",
    source: "OSHA CPL 02-00-124 — Multi-Employer Citation Policy",
    date: "2023-05-25",
    tags: [
      "multi-employer",
      "OSHA policy",
      "subcontractor liability",
      "CPL 02-00-124",
      "site safety",
    ],
    readTime: 10,
  },
  {
    id: "rl-050",
    title:
      "IHG PIP Standards: Interior Scope Requirements for Holiday Inn Express",
    category: "Brand Standard",
    field: "Hospitality",
    topic: "Regulations & Codes",
    summary:
      "Holiday Inn Express Property Improvement Plan requirements include vanity replacement, bath accessory updates, door hardware upgrades, and case goods specifications with defined completion timelines tied to franchise agreement milestones.",
    source: "IHG Hotels & Resorts — Holiday Inn Express PIP Standards (2023)",
    date: "2023-04-10",
    tags: [
      "IHG",
      "PIP",
      "Holiday Inn Express",
      "franchise",
      "guestroom renovation",
    ],
    readTime: 8,
  },
  {
    id: "rl-051",
    title:
      "Multifamily Sustainable Renovation: Energy Star Certification Requirements",
    category: "Sustainability Standard",
    field: "Multifamily",
    topic: "Sustainability",
    summary:
      "Energy Star Multifamily New Construction program requires efficient appliances, lighting, and insulation but also mandates installation verification of mechanical ventilation and air sealing during interior renovation. Third-party HERS rater verification is required.",
    source: "U.S. EPA Energy Star Multifamily Program Guide",
    date: "2023-10-05",
    tags: [
      "Energy Star",
      "multifamily",
      "sustainability",
      "appliances",
      "HERS rating",
    ],
    readTime: 10,
  },
  {
    id: "rl-052",
    title: "Toolbox Talk: Hand and Power Tool Safety for Installation Work",
    category: "Toolbox Talk",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "Covers daily inspection procedures for drills, impact drivers, and circular saws used in interior installation. Includes proper guarding requirements, extension cord safety, and ground fault circuit interrupter (GFCI) requirements for wet location work.",
    source: "OIS Safety Program — Power Tool Safety Library",
    date: "2024-01-15",
    tags: ["toolbox talk", "power tools", "GFCI", "hand tools", "inspection"],
    readTime: 5,
  },
  {
    id: "rl-053",
    title:
      "Glass Wall Systems for Office Interiors: Code and Installation Guide",
    category: "Technical Reference",
    field: "Office",
    topic: "Quality & Punch",
    summary:
      "Covers frame and frameless glass wall systems used in open-plan office demountable configurations including IBC glazing requirements, seismic anchorage in applicable zones, and acoustic silicone joint detailing to maintain STC ratings post-installation.",
    source:
      "National Glass Association (NGA) — Commercial Glazing Installation Guide",
    date: "2023-11-08",
    tags: [
      "glass wall",
      "office",
      "demountable",
      "IBC glazing",
      "acoustic",
      "seismic",
    ],
    readTime: 11,
  },
  {
    id: "rl-054",
    title: "Facilities Interior Renovation Safety: Occupied Building Protocols",
    category: "Safety Protocol",
    field: "Facilities",
    topic: "Safety & Compliance",
    summary:
      "Outlines infection control risk assessment (ICRA) requirements for healthcare-adjacent facilities, noise management during business hours, and coordination with building security for access control in occupied commercial and institutional facilities.",
    source: "IFMA Facility Operations Safety Manual + ICRA Guidelines (FGI)",
    date: "2023-12-01",
    tags: [
      "occupied building",
      "ICRA",
      "facilities",
      "noise management",
      "access control",
    ],
    readTime: 9,
  },
  {
    id: "rl-055",
    title: "Best Western Brand: Renovation Scope Compliance Review Process",
    category: "Brand Standard",
    field: "Hospitality",
    topic: "Quality & Punch",
    summary:
      "Best Western brand compliance inspections use a scored evaluation system across 400+ line items. Interior scope items (accessories, millwork, doors, glass) collectively represent 35% of the total score; failing to 80% threshold triggers a re-inspection within 30 days.",
    source:
      "Best Western Hotels & Resorts — Renovation Standards and Inspection Protocol",
    date: "2023-03-30",
    tags: [
      "Best Western",
      "brand inspection",
      "compliance",
      "renovation scope",
      "scoring",
    ],
    readTime: 8,
  },
  {
    id: "rl-056",
    title:
      "Apprenticeship Programs: Interior Construction Craft Training Pathways",
    category: "Workforce Development",
    field: "Cross-Industry",
    topic: "Workforce",
    summary:
      "NCCER National Craft Certificates for Carpentry and Interior Systems provide structured 4-level training programs covering millwork, door/hardware, and casework installation. Registered apprenticeship completion improves craft retention by 40% compared to informal OJT.",
    source: "National Center for Construction Education and Research (NCCER)",
    date: "2023-07-12",
    tags: [
      "apprenticeship",
      "NCCER",
      "craft training",
      "carpentry",
      "workforce development",
    ],
    readTime: 8,
  },
  {
    id: "rl-057",
    title:
      "Hotel Demolition and Disposal: Recycling and Diversion Best Practices",
    category: "Sustainability Guide",
    field: "Hospitality",
    topic: "Sustainability",
    summary:
      "Hotel renovation demolition generates an average of 2.5–4 lbs of debris per square foot. Strategic material separation for metal, wood, and carpet can achieve 60–75% landfill diversion rates while reducing hauling costs by $0.08–$0.12 per SF.",
    source: "Green Building Initiative — Construction Waste Diversion Toolkit",
    date: "2023-10-22",
    tags: [
      "demolition",
      "recycling",
      "diversion",
      "hotel renovation",
      "waste management",
    ],
    readTime: 9,
  },
  {
    id: "rl-058",
    title: "Facilities Furniture Procurement: GSA Schedule 71 Overview",
    category: "Procurement Guide",
    field: "Facilities",
    topic: "Logistics & FF&E",
    summary:
      "GSA Schedule 71 provides pre-negotiated pricing for office furniture and installation services for federal and eligible state/local agencies. Qualified contractors must provide compliant TAA-country-of-origin products and support delivery/installation coordination.",
    source:
      "U.S. General Services Administration — Schedule 71 Multiple Award Schedule",
    date: "2023-05-01",
    tags: [
      "GSA Schedule 71",
      "government furniture",
      "facilities",
      "TAA compliance",
      "procurement",
    ],
    readTime: 8,
  },
  {
    id: "rl-059",
    title: "CSI MasterFormat: Division 12 — Furnishings Specification Guide",
    category: "Technical Reference",
    field: "Cross-Industry",
    topic: "Regulations & Codes",
    summary:
      "CSI MasterFormat Division 12 organizes furnishings specifications across 10 subcategories including window treatments, casework, furnishings/accessories, and special-purpose furniture. Proper spec section alignment prevents scope gaps in GC/sub contracts.",
    source: "Construction Specifications Institute — MasterFormat Division 12",
    date: "2023-04-05",
    tags: [
      "CSI",
      "MasterFormat",
      "Division 12",
      "specifications",
      "furnishings",
      "casework",
    ],
    readTime: 7,
  },
  {
    id: "rl-060",
    title:
      "Multifamily Renovation Production Rates: Crew Size vs. Output Study",
    category: "Industry Research",
    field: "Multifamily",
    topic: "Scheduling",
    summary:
      "A 2023 study of 50 multifamily renovation projects shows that 3-person interior installation crews complete 1.8 units/day on average for kitchen/bath combo scopes; 4-person crews achieve 2.4 units/day with minimal diminishing returns beyond that size.",
    source:
      "National Multifamily Housing Council (NMHC) Construction Research Initiative",
    date: "2023-11-30",
    tags: [
      "crew size",
      "production rate",
      "multifamily renovation",
      "scheduling",
      "efficiency",
    ],
    readTime: 10,
  },
  {
    id: "rl-061",
    title: "Toolbox Talk: Heat Illness Prevention for Interior Renovation Work",
    category: "Toolbox Talk",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "Covers heat stress warning signs, mandatory water and shade requirements under OSHA Heat Illness Prevention guidelines, acclimatization schedules for new workers, and emergency response for heat exhaustion and heat stroke during summer renovation work.",
    source: "OSHA Heat Illness Prevention Campaign + OIS Safety Program",
    date: "2024-03-01",
    tags: [
      "heat illness",
      "toolbox talk",
      "OSHA",
      "heat stress",
      "summer safety",
    ],
    readTime: 5,
  },
  {
    id: "rl-062",
    title: "Marriott Renovation Benchmark: Guestroom Completion Rate Standards",
    category: "Industry Benchmark",
    field: "Hospitality",
    topic: "Scheduling",
    summary:
      "Marriott International expects a minimum completion rate of 8–12 guestrooms per day for coordinated interior scopes during full floor renovation phases. Sustained rates below 6 rooms/day typically trigger schedule recovery plan requirements from the project GC.",
    source:
      "Marriott International — Construction Renovation Standards (CRS 2023)",
    date: "2023-08-10",
    tags: [
      "Marriott",
      "completion rate",
      "guestroom renovation",
      "schedule benchmark",
      "productivity",
    ],
    readTime: 7,
  },
  {
    id: "rl-063",
    title: "Workstation Ancillary FF&E Installation: OSHA Ergonomic Guidance",
    category: "Compliance Guide",
    field: "Office",
    topic: "Workforce",
    summary:
      "OSHA ergonomics guidelines for office furnishings installation recommend monitor arm mounting heights between 19–24 inches from desk surface and keyboard tray positioning at elbow height. Proper installation reduces ergonomic-related Workers Comp claims.",
    source: "OSHA Technical Manual — Ergonomics Program Management Guidelines",
    date: "2023-06-05",
    tags: [
      "ergonomics",
      "workstation",
      "OSHA",
      "monitor arm",
      "office installation",
    ],
    readTime: 7,
  },
  {
    id: "rl-064",
    title: "NFPA 13: Sprinkler System Coordination During Interior Renovations",
    category: "Technical Reference",
    field: "Cross-Industry",
    topic: "Safety & Compliance",
    summary:
      "NFPA 13 requires that renovation activities maintain minimum sprinkler coverage and head clearance requirements. Installation of dropped ceilings, casework, or tall furnishings near sprinkler heads must be coordinated with the GC sprinkler contractor to avoid obstruction.",
    source: "National Fire Protection Association — NFPA 13 (2022 Edition)",
    date: "2023-09-15",
    tags: [
      "NFPA 13",
      "sprinkler",
      "fire suppression",
      "coordination",
      "renovation",
    ],
    readTime: 8,
  },
  {
    id: "rl-065",
    title:
      "Facilities Decommission and Relocation: Workplace Transition Best Practices",
    category: "Best Practice Guide",
    field: "Facilities",
    topic: "Workforce",
    summary:
      "Outlines employee communication protocols, phased FF&E removal scheduling, and interim workspace support during facility transitions. Change management integrated with decommission planning reduces employee productivity loss by up to 25% during major office relocations.",
    source:
      "CoreNet Global Occupancy Management & Transition Planning Framework",
    date: "2023-12-15",
    tags: [
      "decommission",
      "relocation",
      "facilities",
      "change management",
      "workplace transition",
    ],
    readTime: 9,
  },
];
