import { loadCubeData } from "./cubeApi";
import { useState, useEffect } from "react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Sparkles,
  Search,
  Database,
  Layers3,
  LayoutDashboard,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

import "./App.css";

/* ---------------- DEMO DATA ---------------- */

const revenueByRegion = [
  { region: "North", revenue: 642 },
  { region: "South", revenue: 781 },
  { region: "East", revenue: 518 },
  { region: "West", revenue: 740 },
];


const profitByRegion = [
  { region: "North", profit: 248 },
  { region: "South", profit: 312 },
  { region: "East", profit: 196 },
  { region: "West", profit: 281 },
];

const revenueTrend = [
  { month: "Jan", revenue: 185 },
  { month: "Feb", revenue: 198 },
  { month: "Mar", revenue: 211 },
  { month: "Apr", revenue: 205 },
  { month: "May", revenue: 224 },
  { month: "Jun", revenue: 231 },
  { month: "Jul", revenue: 219 },
  { month: "Aug", revenue: 237 },
  { month: "Sep", revenue: 229 },
  { month: "Oct", revenue: 244 },
  { month: "Nov", revenue: 251 },
  { month: "Dec", revenue: 247 },
];

const revenueMix = [
  { name: "North", value: 642 },
  { name: "South", value: 781 },
  { name: "East", value: 518 },
  { name: "West", value: 740 },
];

/* ---------------- APP ---------------- */

function App() {
  const [query, setQuery] = useState(
    "Show revenue and profit by region"
  );

  const [activeQuery, setActiveQuery] = useState(
    "Show revenue and profit by region"
  );

  const [analysis, setAnalysis] = useState("revenue-region");
  const semanticInfo = {
  "revenue-region": {
    metric: "Total Revenue",
    dimension: "Region",
    source: "FctSales",
    description: "Revenue grouped by region",
  },

  "profit-region": {
    metric: "Total Profit",
    dimension: "Region",
    source: "FctSales",
    description: "Profit grouped by region",
  },

   "revenue-profit-region": {
    metric: "Total Revenue + Total Profit",
    dimension: "Region",
    source: "FctSales",
    description: "Revenue and profit grouped by region",
  },

  "monthly-revenue": {
    metric: "Total Revenue",
    dimension: "Order Date",
    timeGrain: "Monthly",
    source: "FctSales",
    description: "Revenue analyzed month by month",
  },

  "total-revenue": {
    metric: "Total Revenue",
    dimension: "Overall",
    source: "FctSales",
    description: "Overall revenue across the dataset",
  },
};
  const currentSemantic = semanticInfo[analysis];
  const [cubeData, setCubeData] = useState([]);
  const [profitCubeData, setProfitCubeData] = useState([]);
  const [revenueProfitCubeData, setRevenueProfitCubeData] = useState([]);
  const [monthlyCubeData, setMonthlyCubeData] = useState([]);
  const [totalRevenueCubeData, setTotalRevenueCubeData] = useState([]);
  const [cubeLoading, setCubeLoading] = useState(false);
  const [cubeError, setCubeError] = useState("");
  
  const realRevenueByRegion = cubeData.map((row) => ({
  region: row["FctSales.region"],
  revenue: Number(row["FctSales.totalRevenue"]),
}));
  
  const realRevenueMix = cubeData.map((row) => ({
  name: row["FctSales.region"],
  value: Number(row["FctSales.totalRevenue"]),
}));

  const realProfitByRegion = profitCubeData.map((row) => ({
  region: row["FctSales.region"],
  profit: Number(row["FctSales.totalProfit"]),
}));
 
const realRevenueProfitByRegion =
  revenueProfitCubeData.map((row) => ({
    region: row["FctSales.region"],
    revenue: Number(row["FctSales.totalRevenue"]),
    profit: Number(row["FctSales.totalProfit"]),
  }));

const realMonthlyRevenue = monthlyCubeData.map((row) => ({
  month: row["FctSales.orderDate.month"],
  revenue: Number(row["FctSales.totalRevenue"]),
}));

const realTotalRevenue =
  totalRevenueCubeData.length > 0
    ? Number(totalRevenueCubeData[0]["FctSales.totalRevenue"])
    : null;

  // ADD fetchRevenueByRegion HERE
  const fetchRevenueByRegion = async () => {
    setCubeLoading(true);
    setCubeError("");

    try {
      const data = await loadCubeData({
        measures: ["FctSales.totalRevenue"],
        dimensions: ["FctSales.region"],
      });

      setCubeData(data);
    } catch (error) {
      console.error("Cube error:", error);
      setCubeError(error.message);
    } finally {
      setCubeLoading(false);
    }
  };
  
  // ADD fetchProfitByRegion HERE
  const fetchProfitByRegion = async () => {
  setCubeLoading(true);
  setCubeError("");

  try {
    const data = await loadCubeData({
      measures: ["FctSales.totalProfit"],
      dimensions: ["FctSales.region"],
    });

    setProfitCubeData(data);
  } catch (error) {
    console.error("Cube profit error:", error);
    setCubeError(error.message);
  } finally {
    setCubeLoading(false);
  }
};

const fetchRevenueProfitByRegion = async () => {
  setCubeLoading(true);
  setCubeError("");

  try {
    const data = await loadCubeData({
      measures: [
        "FctSales.totalRevenue",
        "FctSales.totalProfit",
      ],
      dimensions: ["FctSales.region"],
    });

    console.log("Revenue + Profit by region:", data);

    setRevenueProfitCubeData(data);
  } catch (error) {
    console.error("Cube revenue + profit error:", error);
    setCubeError(error.message);
  } finally {
    setCubeLoading(false);
  }
};

 // ADD fetchMonthByRevenue HERE
const fetchMonthlyRevenue = async () => {
  setCubeLoading(true);
  setCubeError("");

  try {
    const data = await loadCubeData({
      measures: ["FctSales.totalRevenue"],
      timeDimensions: [
        {
          dimension: "FctSales.orderDate",
          granularity: "month",
        },
      ],
    });
    console.log("Monthly Cube data:", data);
    setMonthlyCubeData(data);
  } catch (error) {
    console.error("Cube monthly error:", error);
    setCubeError(error.message);
  } finally {
    setCubeLoading(false);
  }
};
useEffect(() => {
  fetchRevenueByRegion();
  fetchMonthlyRevenue();
}, []);
// ADD TotalRevenue HERE

const fetchTotalRevenue = async () => {
  setCubeLoading(true);
  setCubeError("");

  try {
    const data = await loadCubeData({
      measures: ["FctSales.totalRevenue"],
    });

    setTotalRevenueCubeData(data);
  } catch (error) {
    console.error("Cube total revenue error:", error);
    setCubeError(error.message);
  } finally {
    setCubeLoading(false);
  }
};
  /* ---------------- QUERY ENGINE ---------------- */

 const runQuery = (question) => {
  const q = question.toLowerCase().trim();

  console.log("QUERY RECEIVED:", q);

  setActiveQuery(question);

  // Revenue + Profit by Region
  if (
    q.includes("revenue") &&
    q.includes("profit") &&
    q.includes("region")
  ) {
    console.log("COMBINED ANALYSIS SELECTED");
    setAnalysis("revenue-profit-region");
    fetchRevenueProfitByRegion();
    return;
  }

  // Profit by Region
  if (
    q.includes("profit") &&
    q.includes("region")
  ) {
    setAnalysis("profit-region");
    fetchProfitByRegion();
    return;
  }

  // Monthly Revenue
  if (
    q.includes("monthly") ||
    q.includes("trend") ||
    q.includes("month")
  ) {
    setAnalysis("monthly-revenue");
    fetchMonthlyRevenue();
    return;
  }

  // Revenue by Region
  if (
    q.includes("revenue") &&
    q.includes("region")
  ) {
    setAnalysis("revenue-region");
    fetchRevenueByRegion();
    return;
  }

  // Total Revenue
  if (
    q.includes("total revenue") ||
    q === "revenue"
  ) {
    setAnalysis("total-revenue");
    fetchTotalRevenue();
    return;
  }

  setAnalysis("revenue-region");
};

  const handleSubmit = () => {
    if (!query.trim()) return;

    runQuery(query);
  };

  const handleSuggestion = (suggestion) => {
    setQuery(suggestion);
    runQuery(suggestion);
  };

  /* ---------------- DYNAMIC CONTENT ---------------- */

  let understoodTitle = "Revenue by region";
  let metric = "Revenue";
  let dimension = "Region";
  let filter = "None";
  let chartTitle = "Revenue by Region";
  let insightTitle = "Revenue distribution by region";
let insightText =
  "MetricMind analyzed the regional revenue distribution using the governed Sales Analytics semantic model.";

if (analysis === "revenue-region") {
  if (realRevenueByRegion.length > 0) {
    const topRegion = [...realRevenueByRegion].sort(
      (a, b) => b.revenue - a.revenue
    )[0];

    insightTitle = `${topRegion.region} leads revenue`;
    insightText =
      `${topRegion.region} has the highest recorded revenue in the current dataset, with MetricMind analyzing the result through the governed Sales Analytics semantic model.`;
  }
}

if (analysis === "profit-region") {
  if (realProfitByRegion.length > 0) {
    const topRegion = [...realProfitByRegion].sort(
      (a, b) => b.profit - a.profit
    )[0];

    insightTitle = `${topRegion.region} leads profit`;
    insightText =
      `${topRegion.region} has the highest recorded profit in the current dataset, based on the governed Sales Analytics semantic model.`;
  }
}

if (analysis === "monthly-revenue") {
  if (realMonthlyRevenue.length > 0) {
    const highestMonth = [...realMonthlyRevenue].sort(
      (a, b) => b.revenue - a.revenue
    )[0];

    insightTitle = `${highestMonth.month} records the highest revenue`;
    insightText =
      `${highestMonth.month} has the highest monthly revenue in the current dataset. MetricMind identified this trend through the governed semantic layer.`;
  } else {
    insightTitle = "Monthly revenue trend";
    insightText =
      "MetricMind analyzed revenue month by month using the governed Sales Analytics semantic model.";
  }
}

if (analysis === "total-revenue") {
  insightTitle = "Total revenue analyzed";
  insightText =
    "MetricMind calculated the overall revenue directly through the governed Sales Analytics semantic model.";
}
  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>

          <div>
            <h2>MetricMind</h2>
            <span>Semantic BI Engine</span>
          </div>
        </div>

        <nav>
          <button className="nav-item active">
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button className="nav-item">
            <Sparkles size={18} />
            AI Analysis
          </button>

          <button className="nav-item">
            <Database size={18} />
            Data Explorer
          </button>

          <button className="nav-item">
            <Layers3 size={18} />
            Semantic Layer
          </button>
        </nav>

        <div className="connection">
          <div className="connection-dot" />

          <div>
            <strong>Semantic Layer</strong>
            <span>Connected</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">
              AI ANALYTICS WORKSPACE
            </span>

            <h1>Understand your data.</h1>

            <p>
              Ask MetricMind a business question and explore the
              answer.
            </p>
          </div>

          <div className="status">
            <span className="status-dot" />
            Cube connected
          </div>
        </header>

        {/* AI Query */}
        <section className="query-section">
          <div className="query-icon">
            <Sparkles size={21} />
          </div>

          <div className="query-content">
            <span>Ask MetricMind</span>

            <div className="query-box">
              <Search size={19} />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                placeholder="Ask a business question..."
              />

              <button onClick={handleSubmit}>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Active Query */}
        <div
          style={{
            marginTop: "12px",
            marginBottom: "18px",
            color: "#777b8f",
            fontSize: "13px",
          }}
        >
          Query:
          <span
            style={{
              color: "#c7c9d5",
              marginLeft: "6px",
            }}
          >
            {activeQuery}
          </span>
        </div>

        {/* Semantic Understanding */}
        <section className="understood">
          <div className="understood-header">
            <div>
              <span className="eyebrow">
                METRICMIND UNDERSTOOD
              </span>

              <h3>{understoodTitle}</h3>
            </div>

            <span className="live-badge">LIVE</span>
          </div>

          <div className="semantic-items">
            <div>
              <span>Metric</span>
              <strong>{metric}</strong>
            </div>

            <div>
              <span>Dimension</span>
              <strong>{dimension}</strong>
            </div>

            <div>
              <span>Filter</span>
              <strong>{filter}</strong>
            </div>

            <div>
              <span>Semantic Model</span>
              <strong>Sales Analytics</strong>
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="kpi-grid">
          <div className="kpi-card featured">
            <span>Total Revenue</span>
            <strong>₹268.15 Cr</strong>
            <small>Current dataset</small>
          </div>

          <div className="kpi-card">
            <span>Total Cost</span>
            <strong>₹164.52 Cr</strong>
            <small>Current dataset</small>
          </div>

          <div className="kpi-card">
            <span>Total Profit</span>
            <strong>₹103.63 Cr</strong>
            <small>Current dataset</small>
          </div>
        </section>

        {/* Charts */}
        <section className="charts-grid">

          {/* TOTAL REVENUE */}
          {analysis === "total-revenue" && (
            <div className="chart-card large">
              <div className="chart-header">
                <div>
                  <span className="eyebrow">
                    REVENUE OVERVIEW
                  </span>

                  <h3>Total Revenue</h3>
                </div>
              </div>

              <div
                style={{
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: "#777b8f",
                  }}
                >
                  Governed Revenue Metric
                </span>

                <strong
                  style={{
                    fontSize: "52px",
                    marginTop: "10px",
                    background:
                      "linear-gradient(90deg,#8b7cff,#5eead4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₹268.15 Cr
                </strong>

                <span
                  style={{
                    color: "#777b8f",
                    marginTop: "8px",
                  }}
                >
                  Current dataset
                </span>
              </div>
            </div>
          )}
          
          {/* METRICMIND UNDERSTOOD */}
{currentSemantic && (
  <div className="semantic-card">
    <div className="semantic-header">
      <div>
        <span className="eyebrow">METRICMIND UNDERSTOOD</span>
        <h3>Your question has been mapped to the semantic layer</h3>
      </div>

      <span className="semantic-status">
        ● LIVE
      </span>
    </div>

    <div className="semantic-grid">
      <div>
        <span className="semantic-label">METRIC</span>
        <strong>{currentSemantic.metric}</strong>
      </div>

      <div>
        <span className="semantic-label">DIMENSION</span>
        <strong>{currentSemantic.dimension}</strong>
      </div>

      {currentSemantic.timeGrain && (
        <div>
          <span className="semantic-label">TIME GRAIN</span>
          <strong>{currentSemantic.timeGrain}</strong>
        </div>
      )}

      <div>
        <span className="semantic-label">SOURCE</span>
        <strong>{currentSemantic.source}</strong>
      </div>
    </div>

    <p className="semantic-description">
      {currentSemantic.description}
    </p>
  </div>
)}

{/* REVENUE + PROFIT BY REGION */}
{analysis === "revenue-profit-region" && (
  <div className="chart-card large">
    <div className="chart-header">
      <div>
        <span className="eyebrow">
          REGIONAL PERFORMANCE
        </span>
        <h3>Revenue & Profit by Region</h3>
      </div>
    </div>

    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={realRevenueProfitByRegion}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis dataKey="region" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="revenue"
            name="Revenue"
            radius={[8, 8, 0, 0]}
            fill="#8b7cff"
          />

          <Bar
            dataKey="profit"
            name="Profit"
            radius={[8, 8, 0, 0]}
            fill="#4ade80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)}


          {/* REVENUE BY REGION */}
          {analysis === "revenue-region" && (
            <>
              <div className="chart-card large">
                <div className="chart-header">
                  <div>
                    <span className="eyebrow">
                      REGIONAL PERFORMANCE
                    </span>

                    <h3>{chartTitle}</h3>
                  </div>

                  <button className="more-btn">
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
 <BarChart
  data={realRevenueByRegion}
>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#252938"
                      />

                      <XAxis
                        dataKey="region"
                        stroke="#777b8f"
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        stroke="#777b8f"
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#171923",
                          border: "1px solid #2b2e3d",
                          borderRadius: "12px",
                        }}
                      />

                      <Bar
                        dataKey="revenue"
                        radius={[8, 8, 0, 0]}
                        fill="#8b7cff"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <span className="eyebrow">
                      COMPOSITION
                    </span>

                    <h3>Revenue Mix</h3>
                  </div>
                </div>

                <div className="pie-chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
  data={realRevenueMix}
  dataKey="value"
  nameKey="name"
  innerRadius={65}
  outerRadius={95}
  paddingAngle={4}
>
                        {realRevenueMix.map((_, index) => (
                          <Cell
                            key={index}
                            fill={
                              [
                                "#8b7cff",
                                "#5eead4",
                                "#f59e0b",
                                "#60a5fa",
                              ][index]
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          background: "#171923",
                          border: "1px solid #2b2e3d",
                          borderRadius: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

               <div className="legend">
  {realRevenueMix.map(
    (item, index) => (
      <div key={item.name}>
        <span
          className="legend-dot"
          style={{
            background: [
              "#8b7cff",
              "#5eead4",
              "#f59e0b",
              "#60a5fa",
            ][index],
          }}
        />

                {item.name}
      </div>
    )
  )}
</div>
</div>

              <div className="chart-card trend-card">
                <div className="chart-header">
                  <div>
                    <span className="eyebrow">
                      TREND ANALYSIS
                    </span>

                    <h3>Monthly Revenue</h3>
                  </div>

                  <span className="trend-label">
                    12 months
                  </span>
                </div>

                <div className="trend-chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
 data={realMonthlyRevenue}
>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#252938"
                      />

                      <XAxis
                        dataKey="month"
                        stroke="#777b8f"
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        stroke="#777b8f"
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#171923",
                          border: "1px solid #2b2e3d",
                          borderRadius: "12px",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#5eead4"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* PROFIT BY REGION */}
          {analysis === "profit-region" && (
            <>
              <div className="chart-card large">
                <div className="chart-header">
                  <div>
                    <span className="eyebrow">
                      PROFITABILITY ANALYSIS
                    </span>

                    <h3>Profit by Region</h3>
                  </div>

                  <button className="more-btn">
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
  data={
    realProfitByRegion.length > 0
      ? realProfitByRegion
      : profitByRegion
  }
>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#252938"
                      />

                      <XAxis
                        dataKey="region"
                        stroke="#777b8f"
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        stroke="#777b8f"
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#171923",
                          border: "1px solid #2b2e3d",
                          borderRadius: "12px",
                        }}
                      />

                      <Bar
                        dataKey="profit"
                        radius={[8, 8, 0, 0]}
                        fill="#5eead4"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-header">
                  <div>
                    <span className="eyebrow">
                      PROFIT INSIGHT
                    </span>

                    <h3>Highest Profit</h3>
                  </div>
                </div>

                <div
                  style={{
                    height: "230px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      color: "#777b8f",
                      fontSize: "14px",
                    }}
                  >
                    Leading region
                  </span>

                  <strong
                    style={{
                      fontSize: "42px",
                      marginTop: "10px",
                    }}
                  >
                    South
                  </strong>

                  <span
                    style={{
                      color: "#5eead4",
                      marginTop: "8px",
                    }}
                  >
                    ₹312 Cr
                  </span>
                </div>
              </div>
            </>
          )}

          {/* MONTHLY REVENUE */}
          {analysis === "monthly-revenue" && (
            <div className="chart-card large trend-card">
              <div className="chart-header">
                <div>
                  <span className="eyebrow">
                    TREND ANALYSIS
                  </span>

                  <h3>Monthly Revenue</h3>
                </div>

                <span className="trend-label">
                  12 months
                </span>
              </div>

              <div className="trend-chart">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
  data={
    realMonthlyRevenue.length > 0
      ? realMonthlyRevenue
      : revenueTrend
  }
>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#252938"
                    />

                    <XAxis
                      dataKey="month"
                      stroke="#777b8f"
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      stroke="#777b8f"
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#171923",
                        border: "1px solid #2b2e3d",
                        borderRadius: "12px",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#5eead4"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        {/* AI Insight */}
        <section className="insight-card">
          <div className="insight-icon">
            <Sparkles size={20} />
          </div>

          <div className="insight-content">
            <span className="eyebrow">AI INSIGHT</span>

            <h3>{insightTitle}</h3>

            <p>{insightText}</p>

            <div className="suggestions">
              <button
                onClick={() =>
                  handleSuggestion("Show profit by region")
                }
              >
                Show profit by region
              </button>

              <button
                onClick={() =>
                  handleSuggestion("Show revenue by region")
                }
              >
                Show revenue by region
              </button>

              <button
                onClick={() =>
                  handleSuggestion("Show monthly revenue trend")
                }
              >
                Show monthly trend
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;