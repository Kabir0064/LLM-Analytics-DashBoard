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
        headers: ["INDUSTRY", "START_DATE", "END_DATE", "TOTAL_REVENUE"],
        rows: [
          {
            INDUSTRY: "Education",
            START_DATE: "2024-08-31",
            END_DATE: "2025-04-26",
            TOTAL_REVENUE: 5019728.01
          },
          {
            INDUSTRY: "Health",
            START_DATE: "2024-08-08",
            END_DATE: "2025-04-20",
            TOTAL_REVENUE: 4755438.4
          },
          {
            INDUSTRY: "Finance",
            START_DATE: "2024-08-18",
            END_DATE: "2025-03-31",
            TOTAL_REVENUE: 3986574.79
          },
          {
            INDUSTRY: "Retail",
            START_DATE: "2024-08-20",
            END_DATE: "2025-04-11",
            TOTAL_REVENUE: 3844606.33
          },
          {
            INDUSTRY: "Tech",
            START_DATE: "2024-08-09",
            END_DATE: "2025-04-18",
            TOTAL_REVENUE: 3789155.56
          }
        ]
      },
      narrative: "This is our interpretation of your question:\n\nCalculate total sales revenue by industry for calendar year 2025 from opportunities data. Since this is a time series analysis without specific filtering instructions, include the start and end dates to show the time range analyzed."
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
        headers: ["LEAD_SOURCE", "TOTAL_LEADS", "CONVERTED_LEADS", "CONVERSION_RATE"],
        rows: [
          {
            LEAD_SOURCE: "Ad",
            TOTAL_LEADS: 347,
            CONVERTED_LEADS: 213,
            CONVERSION_RATE: 0.6138328530259366
          },
          {
            LEAD_SOURCE: "Web",
            TOTAL_LEADS: 337,
            CONVERTED_LEADS: 204,
            CONVERSION_RATE: 0.6053412462908012
          },
          {
            LEAD_SOURCE: "Referral",
            TOTAL_LEADS: 352,
            CONVERTED_LEADS: 211,
            CONVERSION_RATE: 0.5994318181818182
          },
          {
            LEAD_SOURCE: "Cold Call",
            TOTAL_LEADS: 343,
            CONVERTED_LEADS: 198,
            CONVERSION_RATE: 0.577259475218659
          },
          {
            LEAD_SOURCE: "Partner",
            TOTAL_LEADS: 334,
            CONVERTED_LEADS: 186,
            CONVERSION_RATE: 0.5568862275449101
          }
        ]
      },
      narrative: "This is our interpretation of your question:\n\nCalculate the lead conversion rate (number of converted leads divided by total leads) by lead source for calendar year 2024. Note: if you want to analyze the past 365 days instead of calendar year 2024, please ask for 'past 365 days' specifically."
    }
  }
];