// export const samplePayloads = [
//   {
//     id: 1,
//     title: "Sales Revenue by Industry 2025",
//     intent: "descriptive",
//     operation: "sql",
//     kpi: "sales revenue",
//     result: {
//       sql: `WITH __leads AS (
//   SELECT
//     industry,
//     lead_id
//   FROM brightcandy.mytelco.leads
// ), __opportunities AS (
//   SELECT
//     lead_id,
//     stage,
//     close_date,
//     created_date,
//     amount AS total_revenue
//   FROM brightcandy.mytelco.opportunities
// ), industry_sales AS (
//   SELECT
//     l.industry,
//     MIN(o.created_date) AS start_date,
//     MAX(o.created_date) AS end_date,
//     SUM(o.total_revenue) AS total_revenue
//   FROM __leads AS l
//   INNER JOIN __opportunities AS o
//     ON l.lead_id = o.lead_id
//   WHERE
//     DATE_PART('year', o.close_date) = 2025 AND o.stage = 'Closed Won'
//   GROUP BY
//     l.industry
// )
// SELECT
//   i.industry,
//   i.start_date,
//   i.end_date,
//   i.total_revenue
// FROM industry_sales AS i
// ORDER BY
//   i.total_revenue DESC NULLS LAST;`,
//       data: [
//         ["Education", "2024-08-31", "2025-04-26", 5019728.01],
//         ["Health", "2024-08-08", "2025-04-20", 4755438.4],
//         ["Finance", "2024-08-18", "2025-03-31", 3986574.79],
//         ["Retail", "2024-08-20", "2025-04-11", 3844606.33],
//         ["Tech", "2024-08-09", "2025-04-18", 3789155.56]
//       ],
//       tableData: {
//         headers: ["INDUSTRY", "START_DATE", "END_DATE", "TOTAL_REVENUE", "GROWTH_RATE", "TREND"],
//         rows: [
//           {
//             INDUSTRY: "Education",
//             START_DATE: "2024-08-31",
//             END_DATE: "2025-04-26",
//             TOTAL_REVENUE: 5019728.01,
//             GROWTH_RATE: 0.125, // 12.5% growth
//             TREND: "up",
//             // New: Monthly breakdown for sparklines and trend charts
//             MONTHLY_DATA: [
//               { month: "2024-09", revenue: 380000, leads: 245 },
//               { month: "2024-10", revenue: 420000, leads: 268 },
//               { month: "2024-11", revenue: 445000, leads: 282 },
//               { month: "2024-12", revenue: 468000, leads: 295 },
//               { month: "2025-01", revenue: 492000, leads: 310 },
//               { month: "2025-02", revenue: 515000, leads: 325 },
//               { month: "2025-03", revenue: 548000, leads: 342 },
//               { month: "2025-04", revenue: 582000, leads: 358 }
//             ]
//           },
//           {
//             INDUSTRY: "Health",
//             START_DATE: "2024-08-08", 
//             END_DATE: "2025-04-20",
//             TOTAL_REVENUE: 4755438.4,
//             GROWTH_RATE: 0.083, // 8.3% growth
//             TREND: "up",
//             MONTHLY_DATA: [
//               { month: "2024-09", revenue: 360000, leads: 225 },
//               { month: "2024-10", revenue: 385000, leads: 238 },
//               { month: "2024-11", revenue: 402000, leads: 245 },
//               { month: "2024-12", revenue: 415000, leads: 252 },
//               { month: "2025-01", revenue: 428000, leads: 260 },
//               { month: "2025-02", revenue: 445000, leads: 268 },
//               { month: "2025-03", revenue: 462000, leads: 275 },
//               { month: "2025-04", revenue: 478000, leads: 285 }
//             ]
//           },
//           {
//             INDUSTRY: "Finance",
//             START_DATE: "2024-08-18",
//             END_DATE: "2025-03-31",
//             TOTAL_REVENUE: 3986574.79,
//             GROWTH_RATE: -0.032, // -3.2% decline
//             TREND: "down",
//             MONTHLY_DATA: [
//               { month: "2024-09", revenue: 340000, leads: 198 },
//               { month: "2024-10", revenue: 335000, leads: 195 },
//               { month: "2024-11", revenue: 328000, leads: 190 },
//               { month: "2024-12", revenue: 322000, leads: 185 },
//               { month: "2025-01", revenue: 318000, leads: 180 },
//               { month: "2025-02", revenue: 312000, leads: 175 },
//               { month: "2025-03", revenue: 308000, leads: 170 }
//             ]
//           },
//           {
//             INDUSTRY: "Retail",
//             START_DATE: "2024-08-20",
//             END_DATE: "2025-04-11", 
//             TOTAL_REVENUE: 3844606.33,
//             GROWTH_RATE: 0.045, // 4.5% growth
//             TREND: "stable",
//             MONTHLY_DATA: [
//               { month: "2024-09", revenue: 290000, leads: 210 },
//               { month: "2024-10", revenue: 295000, leads: 215 },
//               { month: "2024-11", revenue: 302000, leads: 220 },
//               { month: "2024-12", revenue: 308000, leads: 225 },
//               { month: "2025-01", revenue: 315000, leads: 230 },
//               { month: "2025-02", revenue: 322000, leads: 235 },
//               { month: "2025-03", revenue: 328000, leads: 240 },
//               { month: "2025-04", revenue: 335000, leads: 245 }
//             ]
//           },
//           {
//             INDUSTRY: "Tech",
//             START_DATE: "2024-08-09",
//             END_DATE: "2025-04-18",
//             TOTAL_REVENUE: 3789155.56,
//             GROWTH_RATE: 0.152, // 15.2% growth  
//             TREND: "up",
//             MONTHLY_DATA: [
//               { month: "2024-09", revenue: 260000, leads: 182 },
//               { month: "2024-10", revenue: 285000, leads: 195 },
//               { month: "2024-11", revenue: 312000, leads: 208 },
//               { month: "2024-12", revenue: 338000, leads: 225 },
//               { month: "2025-01", revenue: 365000, leads: 242 },
//               { month: "2025-02", revenue: 392000, leads: 260 },
//               { month: "2025-03", revenue: 418000, leads: 278 },
//               { month: "2025-04", revenue: 445000, leads: 295 }
//             ]
//           }
//         ]
//       },
//       // Add aggregated time series for overall trend
//       timeSeriesData: [
//         { month: "Sep 2024", total: 1630000, avg_growth: 0 },
//         { month: "Oct 2024", total: 1720000, avg_growth: 0.055 },
//         { month: "Nov 2024", total: 1789000, avg_growth: 0.040 },
//         { month: "Dec 2024", total: 1851000, avg_growth: 0.035 },
//         { month: "Jan 2025", total: 1918000, avg_growth: 0.036 },
//         { month: "Feb 2025", total: 1986000, avg_growth: 0.035 },
//         { month: "Mar 2025", total: 2054000, avg_growth: 0.034 },
//         { month: "Apr 2025", total: 2118000, avg_growth: 0.031 }
//       ],
//       narrative: "Analysis shows Education and Tech sectors leading growth at 12.5% and 15.2% respectively, while Finance sector is experiencing a 3.2% decline. Overall market grew 7.8% YoY."
//     }
//   },
//   {
//     id: 2,
//     title: "Lead Conversion Rate by Source",
//     intent: "descriptive",
//     operation: "sql",
//     kpi: "lead conversion rate",
//     result: {
//       sql: `WITH __leads AS (
//   SELECT
//     converted,
//     lead_id,
//     lead_source,
//     created_date
//   FROM brightcandy.mytelco.leads
// ), lead_metrics AS (
//   SELECT
//     l.lead_source,
//     COUNT(DISTINCT l.lead_id) AS total_leads,
//     COUNT(DISTINCT CASE WHEN l.converted = TRUE THEN l.lead_id END) AS converted_leads
//   FROM __leads AS l
//   WHERE
//     DATE_PART('year', l.created_date) = 2024
//   GROUP BY
//     l.lead_source
// )
// SELECT
//   lm.lead_source,
//   lm.total_leads,
//   lm.converted_leads,
//   CASE
//     WHEN lm.total_leads > 0
//     THEN lm.converted_leads / NULLIF(NULLIF(CAST(lm.total_leads AS FLOAT), 0), 0)
//     ELSE NULL
//   END AS conversion_rate
// FROM lead_metrics AS lm
// ORDER BY
//   conversion_rate DESC NULLS LAST;`,
//       tableData: {
//         headers: ["LEAD_SOURCE", "TOTAL_LEADS", "CONVERTED_LEADS", "CONVERSION_RATE", "TREND", "AVG_DEAL_SIZE"],
//         rows: [
//           {
//             LEAD_SOURCE: "Ad",
//             TOTAL_LEADS: 347,
//             CONVERTED_LEADS: 213,
//             CONVERSION_RATE: 0.6138,
//             TREND: "improving",
//             AVG_DEAL_SIZE: 45000,
//             MONTHLY_DATA: [
//               { month: "2024-07", rate: 0.52, volume: 38, converted: 20 },
//               { month: "2024-08", rate: 0.54, volume: 42, converted: 23 },
//               { month: "2024-09", rate: 0.56, volume: 45, converted: 25 },
//               { month: "2024-10", rate: 0.58, volume: 48, converted: 28 },
//               { month: "2024-11", rate: 0.60, volume: 52, converted: 31 },
//               { month: "2024-12", rate: 0.61, volume: 55, converted: 34 }
//             ]
//           },
//           {
//             LEAD_SOURCE: "Web", 
//             TOTAL_LEADS: 337,
//             CONVERTED_LEADS: 204,
//             CONVERSION_RATE: 0.6053,
//             TREND: "stable",
//             AVG_DEAL_SIZE: 38000,
//             MONTHLY_DATA: [
//               { month: "2024-07", rate: 0.58, volume: 52, converted: 30 },
//               { month: "2024-08", rate: 0.59, volume: 55, converted: 32 },
//               { month: "2024-09", rate: 0.60, volume: 58, converted: 35 },
//               { month: "2024-10", rate: 0.60, volume: 60, converted: 36 },
//               { month: "2024-11", rate: 0.61, volume: 62, converted: 38 },
//               { month: "2024-12", rate: 0.61, volume: 65, converted: 40 }
//             ]
//           },
//           {
//             LEAD_SOURCE: "Referral",
//             TOTAL_LEADS: 352,
//             CONVERTED_LEADS: 211,
//             CONVERSION_RATE: 0.5994,
//             TREND: "declining", 
//             AVG_DEAL_SIZE: 52000,
//             MONTHLY_DATA: [
//               { month: "2024-07", rate: 0.65, volume: 48, converted: 31 },
//               { month: "2024-08", rate: 0.64, volume: 52, converted: 33 },
//               { month: "2024-09", rate: 0.62, volume: 55, converted: 34 },
//               { month: "2024-10", rate: 0.61, volume: 58, converted: 35 },
//               { month: "2024-11", rate: 0.60, volume: 60, converted: 36 },
//               { month: "2024-12", rate: 0.59, volume: 62, converted: 37 }
//             ]
//           },
//           {
//             LEAD_SOURCE: "Cold Call",
//             TOTAL_LEADS: 343,
//             CONVERTED_LEADS: 198,
//             CONVERSION_RATE: 0.5773,
//             TREND: "improving",
//             AVG_DEAL_SIZE: 35000,
//             MONTHLY_DATA: [
//               { month: "2024-07", rate: 0.48, volume: 50, converted: 24 },
//               { month: "2024-08", rate: 0.50, volume: 53, converted: 27 },
//               { month: "2024-09", rate: 0.53, volume: 56, converted: 30 },
//               { month: "2024-10", rate: 0.55, volume: 58, converted: 32 },
//               { month: "2024-11", rate: 0.57, volume: 60, converted: 34 },
//               { month: "2024-12", rate: 0.58, volume: 62, converted: 36 }
//             ]
//           },
//           {
//             LEAD_SOURCE: "Partner",
//             TOTAL_LEADS: 334,
//             CONVERTED_LEADS: 186,
//             CONVERSION_RATE: 0.5569,
//             TREND: "stable",
//             AVG_DEAL_SIZE: 48000,
//             MONTHLY_DATA: [
//               { month: "2024-07", rate: 0.54, volume: 52, converted: 28 },
//               { month: "2024-08", rate: 0.55, volume: 54, converted: 30 },
//               { month: "2024-09", rate: 0.56, volume: 56, converted: 31 },
//               { month: "2024-10", rate: 0.56, volume: 58, converted: 32 },
//               { month: "2024-11", rate: 0.56, volume: 60, converted: 34 },
//               { month: "2024-12", rate: 0.56, volume: 62, converted: 35 }
//             ]
//           }
//         ]
//       },
//       // Correlation data: Volume vs Conversion Rate
//       correlationData: {
//         volumeVsRate: [
//           { source: "Ad", volume: 347, rate: 61.4, dealSize: 45 },
//           { source: "Web", volume: 337, rate: 60.5, dealSize: 38 },
//           { source: "Referral", volume: 352, rate: 59.9, dealSize: 52 },
//           { source: "Cold Call", volume: 343, rate: 57.7, dealSize: 35 },
//           { source: "Partner", volume: 334, rate: 55.7, dealSize: 48 }
//         ]
//       },
//       narrative: "Ad campaigns show strongest improvement trend (+17% over 6 months) despite not having highest conversion rate. Referral channel declining but maintains highest average deal size at $52k."
//     }
//   }
// ];

export const samplePayloads = [
  {
    id: 1,
    title: "Sales Revenue by Industry 2025",
    intent: "descriptive",
    operation: "sql",
    kpi: "sales revenue",
    result: {
      sql: `WITH __leads AS (
  SELECT
    industry,
    lead_id
  FROM brightcandy.mytelco.leads
), __opportunities AS (
  SELECT
    lead_id,
    stage,
    close_date,
    created_date,
    amount AS total_revenue
  FROM brightcandy.mytelco.opportunities
), industry_sales AS (
  SELECT
    l.industry,
    MIN(o.created_date) AS start_date,
    MAX(o.created_date) AS end_date,
    SUM(o.total_revenue) AS total_revenue
  FROM __leads AS l
  INNER JOIN __opportunities AS o
    ON l.lead_id = o.lead_id
  WHERE
    DATE_PART('year', o.close_date) = 2025 AND o.stage = 'Closed Won'
  GROUP BY
    l.industry
)
SELECT
  i.industry,
  i.start_date,
  i.end_date,
  i.total_revenue
FROM industry_sales AS i
ORDER BY
  i.total_revenue DESC NULLS LAST;`,
      data: [
        ["Education", "2024-08-31", "2025-04-26", 5019728.01],
        ["Health", "2024-08-08", "2025-04-20", 4755438.4],
        ["Finance", "2024-08-18", "2025-03-31", 3986574.79],
        ["Retail", "2024-08-20", "2025-04-11", 3844606.33],
        ["Tech", "2024-08-09", "2025-04-18", 3789155.56]
      ],
      tableData: {
        headers: ["INDUSTRY", "START_DATE", "END_DATE", "TOTAL_REVENUE", "GROWTH_RATE", "TREND"],
        rows: [
          {
            INDUSTRY: "Education",
            START_DATE: "2024-08-31",
            END_DATE: "2025-04-26",
            TOTAL_REVENUE: 5019728.01,
            GROWTH_RATE: 0.125,
            TREND: "up",
            MONTHLY_DATA: [
              { month: "2024-09", revenue: 380000, leads: 245 },
              { month: "2024-10", revenue: 420000, leads: 268 },
              { month: "2024-11", revenue: 445000, leads: 282 },
              { month: "2024-12", revenue: 468000, leads: 295 },
              { month: "2025-01", revenue: 492000, leads: 310 },
              { month: "2025-02", revenue: 515000, leads: 325 },
              { month: "2025-03", revenue: 548000, leads: 342 },
              { month: "2025-04", revenue: 582000, leads: 358 }
            ]
          },
          {
            INDUSTRY: "Health",
            START_DATE: "2024-08-08",
            END_DATE: "2025-04-20",
            TOTAL_REVENUE: 4755438.4,
            GROWTH_RATE: 0.083,
            TREND: "up",
            MONTHLY_DATA: [
              { month: "2024-09", revenue: 360000, leads: 225 },
              { month: "2024-10", revenue: 385000, leads: 238 },
              { month: "2024-11", revenue: 402000, leads: 245 },
              { month: "2024-12", revenue: 415000, leads: 252 },
              { month: "2025-01", revenue: 428000, leads: 260 },
              { month: "2025-02", revenue: 445000, leads: 268 },
              { month: "2025-03", revenue: 462000, leads: 275 },
              { month: "2025-04", revenue: 478000, leads: 285 }
            ]
          },
          {
            INDUSTRY: "Finance",
            START_DATE: "2024-08-18",
            END_DATE: "2025-03-31",
            TOTAL_REVENUE: 3986574.79,
            GROWTH_RATE: -0.032,
            TREND: "down",
            MONTHLY_DATA: [
              { month: "2024-09", revenue: 340000, leads: 198 },
              { month: "2024-10", revenue: 335000, leads: 195 },
              { month: "2024-11", revenue: 328000, leads: 190 },
              { month: "2024-12", revenue: 322000, leads: 185 },
              { month: "2025-01", revenue: 318000, leads: 180 },
              { month: "2025-02", revenue: 312000, leads: 175 },
              { month: "2025-03", revenue: 308000, leads: 170 }
            ]
          },
          {
            INDUSTRY: "Retail",
            START_DATE: "2024-08-20",
            END_DATE: "2025-04-11",
            TOTAL_REVENUE: 3844606.33,
            GROWTH_RATE: 0.045,
            TREND: "stable",
            MONTHLY_DATA: [
              { month: "2024-09", revenue: 290000, leads: 210 },
              { month: "2024-10", revenue: 295000, leads: 215 },
              { month: "2024-11", revenue: 302000, leads: 220 },
              { month: "2024-12", revenue: 308000, leads: 225 },
              { month: "2025-01", revenue: 315000, leads: 230 },
              { month: "2025-02", revenue: 322000, leads: 235 },
              { month: "2025-03", revenue: 328000, leads: 240 },
              { month: "2025-04", revenue: 335000, leads: 245 }
            ]
          },
          {
            INDUSTRY: "Tech",
            START_DATE: "2024-08-09",
            END_DATE: "2025-04-18",
            TOTAL_REVENUE: 3789155.56,
            GROWTH_RATE: 0.152,
            TREND: "up",
            MONTHLY_DATA: [
              { month: "2024-09", revenue: 260000, leads: 182 },
              { month: "2024-10", revenue: 285000, leads: 195 },
              { month: "2024-11", revenue: 312000, leads: 208 },
              { month: "2024-12", revenue: 338000, leads: 225 },
              { month: "2025-01", revenue: 365000, leads: 242 },
              { month: "2025-02", revenue: 392000, leads: 260 },
              { month: "2025-03", revenue: 418000, leads: 278 },
              { month: "2025-04", revenue: 445000, leads: 295 }
            ]
          }
        ]
      },
      timeSeriesData: [
        { month: "Sep 2024", total: 1630000, avg_growth: 0.01, conversion_rate: 50, lead_volume: 245 },
        { month: "Oct 2024", total: 1720000, avg_growth: 0.055, conversion_rate: 52, lead_volume: 268 },
        { month: "Nov 2024", total: 1789000, avg_growth: 0.040, conversion_rate: 54, lead_volume: 282 },
        { month: "Dec 2024", total: 1851000, avg_growth: 0.035, conversion_rate: 56, lead_volume: 295 },
        { month: "Jan 2025", total: 1918000, avg_growth: 0.036, conversion_rate: 58, lead_volume: 310 },
        { month: "Feb 2025", total: 1986000, avg_growth: 0.035, conversion_rate: 60, lead_volume: 325 },
        { month: "Mar 2025", total: 2054000, avg_growth: 0.034, conversion_rate: 62, lead_volume: 342 },
        { month: "Apr 2025", total: 2118000, avg_growth: 0.031, conversion_rate: 64, lead_volume: 358 }
      ],
      narrative: "Analysis shows Education and Tech sectors leading growth at 12.5% and 15.2% respectively, while Finance sector is experiencing a 3.2% decline. Overall market grew 7.8% YoY."
    }
  },
  {
    id: 2,
    title: "Lead Conversion Rate by Source",
    intent: "descriptive",
    operation: "sql",
    kpi: "lead conversion rate",
    result: {
      sql: `WITH __leads AS (
  SELECT
    converted,
    lead_id,
    lead_source,
    created_date
  FROM brightcandy.mytelco.leads
), lead_metrics AS (
  SELECT
    l.lead_source,
    COUNT(DISTINCT l.lead_id) AS total_leads,
    COUNT(DISTINCT CASE WHEN l.converted = TRUE THEN l.lead_id END) AS converted_leads
  FROM __leads AS l
  WHERE
    DATE_PART('year', l.created_date) = 2024
  GROUP BY
    l.lead_source
)
SELECT
  lm.lead_source,
  lm.total_leads,
  lm.converted_leads,
  CASE
    WHEN lm.total_leads > 0
    THEN lm.converted_leads / NULLIF(NULLIF(CAST(lm.total_leads AS FLOAT), 0), 0)
    ELSE NULL
  END AS conversion_rate
FROM lead_metrics AS lm
ORDER BY
  conversion_rate DESC NULLS LAST;`,
      tableData: {
        headers: ["LEAD_SOURCE", "TOTAL_LEADS", "CONVERTED_LEADS", "CONVERSION_RATE", "TREND", "AVG_DEAL_SIZE"],
        rows: [
          {
            LEAD_SOURCE: "Ad",
            TOTAL_LEADS: 347,
            CONVERTED_LEADS: 213,
            CONVERSION_RATE: 0.6138,
            TREND: "improving",
            AVG_DEAL_SIZE: 45000,
            MONTHLY_DATA: [
              { month: "2024-07", rate: 0.52, volume: 38, converted: 20 },
              { month: "2024-08", rate: 0.54, volume: 42, converted: 23 },
              { month: "2024-09", rate: 0.56, volume: 45, converted: 25 },
              { month: "2024-10", rate: 0.58, volume: 48, converted: 28 },
              { month: "2024-11", rate: 0.60, volume: 52, converted: 31 },
              { month: "2024-12", rate: 0.61, volume: 55, converted: 34 }
            ]
          },
          {
            LEAD_SOURCE: "Web",
            TOTAL_LEADS: 337,
            CONVERTED_LEADS: 204,
            CONVERSION_RATE: 0.6053,
            TREND: "stable",
            AVG_DEAL_SIZE: 38000,
            MONTHLY_DATA: [
              { month: "2024-07", rate: 0.58, volume: 52, converted: 30 },
              { month: "2024-08", rate: 0.59, volume: 55, converted: 32 },
              { month: "2024-09", rate: 0.60, volume: 58, converted: 35 },
              { month: "2024-10", rate: 0.60, volume: 60, converted: 36 },
              { month: "2024-11", rate: 0.61, volume: 62, converted: 38 },
              { month: "2024-12", rate: 0.61, volume: 65, converted: 40 }
            ]
          },
          {
            LEAD_SOURCE: "Referral",
            TOTAL_LEADS: 352,
            CONVERTED_LEADS: 211,
            CONVERSION_RATE: 0.5994,
            TREND: "declining",
            AVG_DEAL_SIZE: 52000,
            MONTHLY_DATA: [
              { month: "2024-07", rate: 0.65, volume: 48, converted: 31 },
              { month: "2024-08", rate: 0.64, volume: 52, converted: 33 },
              { month: "2024-09", rate: 0.62, volume: 55, converted: 34 },
              { month: "2024-10", rate: 0.61, volume: 58, converted: 35 },
              { month: "2024-11", rate: 0.60, volume: 60, converted: 36 },
              { month: "2024-12", rate: 0.59, volume: 62, converted: 37 }
            ]
          },
          {
            LEAD_SOURCE: "Cold Call",
            TOTAL_LEADS: 343,
            CONVERTED_LEADS: 198,
            CONVERSION_RATE: 0.5773,
            TREND: "improving",
            AVG_DEAL_SIZE: 35000,
            MONTHLY_DATA: [
              { month: "2024-07", rate: 0.48, volume: 50, converted: 24 },
              { month: "2024-08", rate: 0.50, volume: 53, converted: 27 },
              { month: "2024-09", rate: 0.53, volume: 56, converted: 30 },
              { month: "2024-10", rate: 0.55, volume: 58, converted: 32 },
              { month: "2024-11", rate: 0.57, volume: 60, converted: 34 },
              { month: "2024-12", rate: 0.58, volume: 62, converted: 36 }
            ]
          },
          {
            LEAD_SOURCE: "Partner",
            TOTAL_LEADS: 334,
            CONVERTED_LEADS: 186,
            CONVERSION_RATE: 0.5569,
            TREND: "stable",
            AVG_DEAL_SIZE: 48000,
            MONTHLY_DATA: [
              { month: "2024-07", rate: 0.54, volume: 52, converted: 28 },
              { month: "2024-08", rate: 0.55, volume: 54, converted: 30 },
              { month: "2024-09", rate: 0.56, volume: 56, converted: 31 },
              { month: "2024-10", rate: 0.56, volume: 58, converted: 32 },
              { month: "2024-11", rate: 0.56, volume: 60, converted: 34 },
              { month: "2024-12", rate: 0.56, volume: 62, converted: 35 }
            ]
          }
        ]
      },
      correlationData: {
        volumeVsRate: [
          { source: "Ad", volume: 347, rate: 61.4, dealSize: 45 },
          { source: "Web", volume: 337, rate: 60.5, dealSize: 38 },
          { source: "Referral", volume: 352, rate: 59.9, dealSize: 52 },
          { source: "Cold Call", volume: 343, rate: 57.7, dealSize: 35 },
          { source: "Partner", volume: 334, rate: 55.7, dealSize: 48 }
        ]
      },
      narrative: "Ad campaigns show strongest improvement trend (+17% over 6 months) despite not having highest conversion rate. Referral channel declining but maintains highest average deal size at $52k."
    }
  },

  // ID3: Top 5 Sales Representatives by Revenue
  {
    id: 3,
    title: "Top 5 Sales Representatives by Revenue",
    intent: "descriptive",
    operation: "sql",
    kpi: "sales revenue",
    result: {
      sql: `WITH __opportunities AS (
  SELECT
    owner_id,
    stage,
    close_date,
    amount AS total_revenue
  FROM brightcandy.mytelco.opportunities
), __sales_reps AS (
  SELECT
    name,
    rep_id
  FROM brightcandy.mytelco.sales_reps
), rep_revenue AS (
  SELECT
    sr.rep_id,
    sr.name AS rep_name,
    SUM(o.total_revenue) AS total_revenue
  FROM __opportunities AS o
  INNER JOIN __sales_reps AS sr
    ON o.owner_id = sr.rep_id
  WHERE
    DATE_PART('year', o.close_date) = 2024 AND o.stage = 'Closed Won'
  GROUP BY
    sr.rep_id,
    sr.name
)
SELECT
  rep_name,
  total_revenue
FROM rep_revenue
ORDER BY
  total_revenue DESC NULLS LAST
LIMIT 5
 -- Generated by Ajay Katariya
;`,
      data: [
        ["Michael Nichols", 1063980.06],
        ["Aaron Meyer", 906575.38],
        ["Robyn Howell", 890142.51],
        ["James Morgan", 806405.57],
        ["Jennifer Solomon", 772342.96]
      ],
      tableData: {
        headers: ["REP_NAME", "TOTAL_REVENUE"],
        rows: [
          {
            REP_NAME: "Michael Nichols",
            TOTAL_REVENUE: 1063980.06,
            DEALS_COUNT: 23,
            AVG_DEAL_SIZE: 46260.87,
            QUOTA_ATTAINMENT: 1.18,
            PERFORMANCE_TREND: "improving",
            MONTHLY_PERFORMANCE: [
              { month: "2024-07", revenue: 156000, deals: 3, quota: 180000 },
              { month: "2024-08", revenue: 172000, deals: 4, quota: 180000 },
              { month: "2024-09", revenue: 189000, deals: 4, quota: 180000 },
              { month: "2024-10", revenue: 198000, deals: 4, quota: 180000 },
              { month: "2024-11", revenue: 174000, deals: 4, quota: 180000 },
              { month: "2024-12", revenue: 174980, deals: 4, quota: 180000 }
            ]
          },
          {
            REP_NAME: "Aaron Meyer",
            TOTAL_REVENUE: 906575.38,
            DEALS_COUNT: 21,
            AVG_DEAL_SIZE: 43170.26,
            QUOTA_ATTAINMENT: 1.01,
            PERFORMANCE_TREND: "stable",
            MONTHLY_PERFORMANCE: [
              { month: "2024-07", revenue: 148000, deals: 3, quota: 150000 },
              { month: "2024-08", revenue: 152000, deals: 4, quota: 150000 },
              { month: "2024-09", revenue: 149000, deals: 3, quota: 150000 },
              { month: "2024-10", revenue: 153000, deals: 4, quota: 150000 },
              { month: "2024-11", revenue: 151000, deals: 4, quota: 150000 },
              { month: "2024-12", revenue: 153575, deals: 3, quota: 150000 }
            ]
          },
          {
            REP_NAME: "Robyn Howell",
            TOTAL_REVENUE: 890142.51,
            DEALS_COUNT: 19,
            AVG_DEAL_SIZE: 46849.61,
            QUOTA_ATTAINMENT: 1.11,
            PERFORMANCE_TREND: "improving",
            MONTHLY_PERFORMANCE: [
              { month: "2024-07", revenue: 142000, deals: 3, quota: 160000 },
              { month: "2024-08", revenue: 145000, deals: 3, quota: 160000 },
              { month: "2024-09", revenue: 148000, deals: 3, quota: 160000 },
              { month: "2024-10", revenue: 151000, deals: 3, quota: 160000 },
              { month: "2024-11", revenue: 152000, deals: 4, quota: 160000 },
              { month: "2024-12", revenue: 152142, deals: 3, quota: 160000 }
            ]
          },
          {
            REP_NAME: "James Morgan",
            TOTAL_REVENUE: 806405.57,
            DEALS_COUNT: 18,
            AVG_DEAL_SIZE: 44800.31,
            QUOTA_ATTAINMENT: 0.94,
            PERFORMANCE_TREND: "declining",
            MONTHLY_PERFORMANCE: [
              { month: "2024-07", revenue: 145000, deals: 3, quota: 140000 },
              { month: "2024-08", revenue: 138000, deals: 3, quota: 140000 },
              { month: "2024-09", revenue: 135000, deals: 3, quota: 140000 },
              { month: "2024-10", revenue: 132000, deals: 3, quota: 140000 },
              { month: "2024-11", revenue: 128000, deals: 3, quota: 140000 },
              { month: "2024-12", revenue: 128406, deals: 3, quota: 140000 }
            ]
          },
          {
            REP_NAME: "Jennifer Solomon",
            TOTAL_REVENUE: 772342.96,
            DEALS_COUNT: 20,
            AVG_DEAL_SIZE: 38617.15,
            QUOTA_ATTAINMENT: 0.98,
            PERFORMANCE_TREND: "stable",
            MONTHLY_PERFORMANCE: [
              { month: "2024-07", revenue: 128000, deals: 3, quota: 130000 },
              { month: "2024-08", revenue: 129000, deals: 4, quota: 130000 },
              { month: "2024-09", revenue: 127000, deals: 3, quota: 130000 },
              { month: "2024-10", revenue: 130000, deals: 3, quota: 130000 },
              { month: "2024-11", revenue: 129000, deals: 4, quota: 130000 },
              { month: "2024-12", revenue: 129343, deals: 3, quota: 130000 }
            ]
          }
        ]
      },
      narrative: "This is our interpretation of your question:\n\nShow me the Top 5 Sales Representatives with the highest total revenue from opportunities that were closed in calendar year 2024. For each rep, show their name and total revenue."
    }
  }
];