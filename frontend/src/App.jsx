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
  const [activeTab, setActiveTab] = useState("overview");
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
  fetchRevenueProfitByRegion();
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

    const formattedMonth = new Date(
      highestMonth.month
    ).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    insightTitle = `${formattedMonth} records the highest revenue`;
    insightText =
      `${formattedMonth} has the highest monthly revenue in the current dataset. MetricMind identified this trend through the governed semantic layer.`;
  } else {
    insightTitle = "Monthly revenue trend";
    insightText =
      "MetricMind analyzed revenue month by month using the governed Sales Analytics semantic model.";
  }
}

if (analysis === "revenue-profit-region") {
  insightTitle = "Revenue and profit by region";
  insightText =
    "MetricMind analyzed both revenue and profit across regions using the governed Sales Analytics semantic model.";
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
  <button
    className={`nav-item ${
      activeTab === "overview" ? "active" : ""
    }`}
    onClick={() => setActiveTab("overview")}
  >
    <LayoutDashboard size={18} />
    Overview
  </button>

  <button
    className={`nav-item ${
      activeTab === "ai-analysis" ? "active" : ""
    }`}
    onClick={() => setActiveTab("ai-analysis")}
  >
    <Sparkles size={18} />
    AI Analysis
  </button>

  <button
    className={`nav-item ${
      activeTab === "data-explorer" ? "active" : ""
    }`}
    onClick={() => setActiveTab("data-explorer")}
  >
    <Database size={18} />
    Data Explorer
  </button>

  <button
    className={`nav-item ${
      activeTab === "semantic-layer" ? "active" : ""
    }`}
    onClick={() => setActiveTab("semantic-layer")}
  >
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
      {activeTab === "overview" && (
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
  <div className="chart-card large combined-chart-card">
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
  {realProfitByRegion.length > 0
    ? [...realProfitByRegion].sort(
        (a, b) => b.profit - a.profit
      )[0].region
    : "—"}
</strong>

<span
  style={{
    color: "#5eead4",
    marginTop: "8px",
  }}
>
  {realProfitByRegion.length > 0
    ? `₹${(
        [...realProfitByRegion].sort(
          (a, b) => b.profit - a.profit
        )[0].profit / 10000000
      ).toFixed(2)} Cr`
    : "—"}
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
  tickFormatter={(value) => {
    const date = new Date(value);

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }}
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
    
  )
}

{activeTab === "ai-analysis" && (
  <main className="main">

    <header className="topbar">
      <div>
        <span className="eyebrow">
          AI ANALYSIS
        </span>

        <h1>Ask MetricMind.</h1>

        <p>
          Explore your business data using natural-language questions.
        </p>
      </div>

      <div className="status">
        <span className="status-dot" />
        Cube connected
      </div>
    </header>

    {/* AI Question */}
    <section className="query-section">
      <div className="query-icon">
        <Sparkles size={21} />
      </div>

      <div className="query-content">
        <span>Ask a business question</span>

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
            placeholder="Example: Show profit by region..."
          />

          <button onClick={handleSubmit}>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </section>

    {/* Suggested Questions */}
    <section style={{ marginTop: "28px" }}>
      <span className="eyebrow">SUGGESTED QUESTIONS</span>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginTop: "14px",
        }}
      >
        <button
          className="nav-item"
          onClick={() => handleSuggestion("Show revenue by region")}
        >
          <Database size={17} />
          Show revenue by region
        </button>

        <button
          className="nav-item"
          onClick={() => handleSuggestion("Show profit by region")}
        >
          <Database size={17} />
          Show profit by region
        </button>

        <button
          className="nav-item"
          onClick={() => handleSuggestion("Show monthly trend")}
        >
          <Database size={17} />
          Show monthly revenue trend
        </button>

        <button
          className="nav-item"
          onClick={() => handleSuggestion("Show revenue and profit by region")}
        >
          <Database size={17} />
          Compare revenue and profit
        </button>
      </div>
    </section>

    {/* Semantic Understanding */}
    {currentSemantic && (
      <section style={{ marginTop: "30px" }}>
        <div className="semantic-card">

          <div className="semantic-header">
            <div>
              <span className="eyebrow">
                METRICMIND UNDERSTOOD
              </span>

              <h3>
                Your question has been mapped to the semantic layer
              </h3>
            </div>

            <span className="semantic-status">
              ● LIVE
            </span>
          </div>

          <div className="semantic-grid">

            <div>
              <span className="semantic-label">
                METRIC
              </span>

              <strong>
                {currentSemantic.metric}
              </strong>
            </div>

            <div>
              <span className="semantic-label">
                DIMENSION
              </span>

              <strong>
                {currentSemantic.dimension}
              </strong>
            </div>

            {currentSemantic.timeGrain && (
              <div>
                <span className="semantic-label">
                  TIME GRAIN
                </span>

                <strong>
                  {currentSemantic.timeGrain}
                </strong>
              </div>
            )}

            <div>
              <span className="semantic-label">
                SOURCE
              </span>

              <strong>
                {currentSemantic.source}
              </strong>
            </div>

          </div>

          <p className="semantic-description">
            {currentSemantic.description}
          </p>

        </div>
      </section>
    )}

    ```jsx
{/* Current Analysis */}
<section
  className="charts-grid"
  style={{ marginTop: "28px" }}
>
  <div className="chart-card large">

    <div className="chart-header">
      <div>
        <span className="eyebrow">
          CURRENT ANALYSIS
        </span>

        <h3>
          {activeQuery}
        </h3>
      </div>
    </div>

    {/* Revenue by Region */}
    {analysis === "revenue-region" && (
      <div style={{ padding: "20px 0" }}>
        {realRevenueByRegion.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={realRevenueByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
               <Bar
  dataKey="revenue"
  name="Revenue"
  fill="#6366f1"
  radius={[6, 6, 0, 0]}
/>
              </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: "18px" }}>
              <strong>
                {insightTitle}
              </strong>

              <p
                style={{
                  marginTop: "6px",
                  color: "#777b8f",
                }}
              >
                {insightText}
              </p>
            </div>
          </>
        ) : (
          <p>Loading revenue data...</p>
        )}
      </div>
    )}

    {/* Profit by Region */}
    {analysis === "profit-region" && (
      <div style={{ padding: "20px 0" }}>
        {realProfitByRegion.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={realProfitByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
               <Bar
  dataKey="profit"
  name="Profit"
  fill="#10b981"
  radius={[6, 6, 0, 0]}
/>
              </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: "18px" }}>
              <strong>
                {insightTitle}
              </strong>

              <p
                style={{
                  marginTop: "6px",
                  color: "#777b8f",
                }}
              >
                {insightText}
              </p>
            </div>
          </>
        ) : (
          <p>Loading profit data...</p>
        )}
      </div>
    )}

    {/* Revenue + Profit by Region */}
    {analysis === "revenue-profit-region" && (
      <div style={{ padding: "20px 0" }}>
        {realRevenueProfitByRegion.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={realRevenueProfitByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />

              <Bar
  dataKey="revenue"
  name="Revenue"
  fill="#6366f1"
  radius={[6, 6, 0, 0]}
/>

<Bar
  dataKey="profit"
  name="Profit"
  fill="#10b981"
  radius={[6, 6, 0, 0]}
/>
              </BarChart>
            </ResponsiveContainer>

            <div style={{ marginTop: "18px" }}>
              <strong>
                {insightTitle}
              </strong>

              <p
                style={{
                  marginTop: "6px",
                  color: "#777b8f",
                }}
              >
                {insightText}
              </p>
            </div>
          </>
        ) : (
          <p>Loading revenue and profit data...</p>
        )}
      </div>
    )}

    {/* Monthly Revenue */}
    {analysis === "monthly-revenue" && (
      <div style={{ padding: "20px 0" }}>
        {realMonthlyRevenue.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={realMonthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Line
  type="monotone"
  dataKey="revenue"
  name="Revenue"
  stroke="#6366f1"
  strokeWidth={3}
  dot={{ r: 4 }}
/>
              </LineChart>
            </ResponsiveContainer>

            <div style={{ marginTop: "18px" }}>
              <strong>
                {insightTitle}
              </strong>

              <p
                style={{
                  marginTop: "6px",
                  color: "#777b8f",
                }}
              >
                {insightText}
              </p>
            </div>
          </>
        ) : (
          <p>Loading monthly revenue...</p>
        )}
      </div>
    )}

    {/* Total Revenue */}
    {analysis === "total-revenue" && (
      <div
        style={{
          minHeight: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        {realTotalRevenue !== null ? (
          <>
            <span
              style={{
                fontSize: "14px",
                color: "#777b8f",
              }}
            >
              TOTAL REVENUE
            </span>

            <strong
              style={{
                marginTop: "10px",
                fontSize: "38px",
              }}
            >
              ₹{(realTotalRevenue / 10000000).toFixed(2)} Cr
            </strong>

            <p
              style={{
                marginTop: "8px",
                color: "#777b8f",
              }}
            >
              {insightText}
            </p>
          </>
        ) : (
          <p>Loading total revenue...</p>
        )}
      </div>
    )}

  </div>
</section>
```

  </main>
)}
{activeTab === "data-explorer" && (
  <main className="main">

    <header className="topbar">
      <div>
        <span className="eyebrow">
          DATA EXPLORER
        </span>

        <h1>Explore your data.</h1>

        <p>
          Browse the sales data behind your semantic model.
        </p>
      </div>

      <div className="status">
        <span className="status-dot" />
        Cube connected
      </div>
    </header>

    <section
      className="chart-card large"
      style={{ marginTop: "28px" }}
    >
      <div className="chart-header">
        <div>
          <span className="eyebrow">
            FCTSALES
          </span>

          <h3>Sales Data</h3>
        </div>

        <span className="semantic-status">
          ● LIVE
        </span>
      </div>

      <div style={{ marginTop: "20px" }}>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px",
    }}
  >
    <div>
      <span className="eyebrow">
        SEMANTIC VIEW
      </span>

      <p
        style={{
          marginTop: "6px",
          color: "#777b8f",
        }}
      >
        Revenue and profit grouped by region
      </p>
    </div>

    <span
      style={{
        color: "#777b8f",
        fontSize: "13px",
      }}
    >
      {realRevenueProfitByRegion.length} regions
    </span>
  </div>

  ```jsx
{realRevenueProfitByRegion.length > 0 ? (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e8e9ef",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 18px rgba(20, 24, 40, 0.04)",
    }}
  >

    {/* Table Header */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr",
        padding: "16px 20px",
        background: "#f8f9fc",
        borderBottom: "1px solid #e8e9ef",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.08em",
          color: "#777b8f",
        }}
      >
        REGION
      </span>

      <span
        style={{
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.08em",
          color: "#777b8f",
          textAlign: "right",
        }}
      >
        REVENUE
      </span>

      <span
        style={{
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.08em",
          color: "#777b8f",
          textAlign: "right",
        }}
      >
        PROFIT
      </span>
    </div>

    {/* Table Rows */}
    {realRevenueProfitByRegion.map((row, index) => (
      <div
        key={row.region}
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr",
          alignItems: "center",
          padding: "18px 20px",
          borderBottom:
            index === realRevenueProfitByRegion.length - 1
              ? "none"
              : "1px solid #f0f1f5",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#fafbff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
        }}
      >

        {/* Region */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0f1ff",
              color: "#6366f1",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            {row.region.charAt(0)}
          </div>

          <div>
            <strong
              style={{
                display: "block",
                fontSize: "14px",
                color: "#202333",
              }}
            >
              {row.region}
            </strong>

            <span
              style={{
                display: "block",
                marginTop: "3px",
                fontSize: "11px",
                color: "#999daf",
              }}
            >
              Regional sales
            </span>
          </div>
        </div>

        {/* Revenue */}
        <div
          style={{
            textAlign: "right",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              fontSize: "14px",
              fontWeight: "650",
              color: "#303346",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#6366f1",
              }}
            />

            ₹{(row.revenue / 10000000).toFixed(2)} Cr
          </span>
        </div>

        {/* Profit */}
        <div
          style={{
            textAlign: "right",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              fontSize: "14px",
              fontWeight: "650",
              color: "#303346",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#10b981",
              }}
            />

            ₹{(row.profit / 10000000).toFixed(2)} Cr
          </span>
        </div>

      </div>
    ))}
  </div>
) : (
  <div
    style={{
      minHeight: "220px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#777b8f",
    }}
  >
    Loading sales data...
  </div>
)}
```

</div>
    </section>

  </main>
)}

{activeTab === "semantic-layer" && (
  <main className="main">

    <header className="topbar">
      <div>
        <span className="eyebrow">
          SEMANTIC LAYER
        </span>

        <h1>Understand your model.</h1>

        <p>
          Explore the governed metrics and dimensions used by MetricMind.
        </p>
      </div>

      <div className="status">
        <span className="status-dot" />
        Semantic Layer Connected
      </div>
    </header>

    {/* Model Overview */}
    <section
      className="chart-card large"
      style={{ marginTop: "28px" }}
    >

      <div className="chart-header">
        <div>
          <span className="eyebrow">
            SEMANTIC MODEL
          </span>

          <h3>FctSales</h3>
        </div>

        <span className="semantic-status">
          ● GOVERNED
        </span>
      </div>

      <p
        style={{
          marginTop: "8px",
          color: "#777b8f",
          fontSize: "14px",
        }}
      >
        Sales Analytics semantic model powering MetricMind queries.
      </p>

      {/* Model Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "14px",
          marginTop: "24px",
        }}
      >

        <div
          style={{
            padding: "18px",
            border: "1px solid #e8e9ef",
            borderRadius: "14px",
            background: "#fafbff",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#777b8f",
              letterSpacing: "0.08em",
            }}
          >
            MODEL
          </span>

          <strong
            style={{
              display: "block",
              marginTop: "8px",
              fontSize: "17px",
              color: "#202333",
            }}
          >
            FctSales
          </strong>
        </div>

        <div
          style={{
            padding: "18px",
            border: "1px solid #e8e9ef",
            borderRadius: "14px",
            background: "#fafbff",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#777b8f",
              letterSpacing: "0.08em",
            }}
          >
            METRICS
          </span>

          <strong
            style={{
              display: "block",
              marginTop: "8px",
              fontSize: "17px",
              color: "#202333",
            }}
          >
            Revenue · Profit
          </strong>
        </div>

        <div
          style={{
            padding: "18px",
            border: "1px solid #e8e9ef",
            borderRadius: "14px",
            background: "#fafbff",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#777b8f",
              letterSpacing: "0.08em",
            }}
          >
            DIMENSIONS
          </span>

          <strong
            style={{
              display: "block",
              marginTop: "8px",
              fontSize: "17px",
              color: "#202333",
            }}
          >
            Region · Order Date
          </strong>
        </div>

      </div>
    </section>
{/* Semantic Model Structure */}
<section
  className="chart-card large"
  style={{ marginTop: "22px" }}
>
  <div className="chart-header">
    <div>
      <span className="eyebrow">
        MODEL STRUCTURE
      </span>

      <h3>Business definitions</h3>
    </div>

    <span
      style={{
        fontSize: "12px",
        color: "#777b8f",
      }}
    >
      Governed definitions
    </span>
  </div>

  <p
    style={{
      marginTop: "8px",
      color: "#777b8f",
      fontSize: "13px",
    }}
  >
    MetricMind maps natural-language questions to defined
    business metrics and analysis dimensions.
  </p>

  <div
    style={{
      marginTop: "28px",
      display: "grid",
      gridTemplateColumns: "1fr 80px 1fr",
      alignItems: "stretch",
      gap: "18px",
    }}
  >

    {/* Metrics */}
    <div
      style={{
        border: "1px solid #e8e9ef",
        borderRadius: "16px",
        padding: "20px",
        background: "#fafbff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0f1ff",
            color: "#6366f1",
            fontWeight: "700",
          }}
        >
          M
        </div>

        <div>
          <span
            className="eyebrow"
            style={{ color: "#6366f1" }}
          >
            METRICS
          </span>

          <strong
            style={{
              display: "block",
              marginTop: "3px",
              fontSize: "15px",
              color: "#202333",
            }}
          >
            Business Measures
          </strong>
        </div>
      </div>

      <div
        style={{
          padding: "15px",
          background: "#ffffff",
          border: "1px solid #e8e9ef",
          borderRadius: "12px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#6366f1",
            }}
          />

          <strong
  style={{
    color: "#6366f1",
    fontSize: "14px",
    fontWeight: "700",
  }}
>
  Total Revenue
</strong>
        </div>

        <span
          style={{
            display: "block",
            marginTop: "6px",
            fontSize: "12px",
            color: "#777b8f",
          }}
        >
          Sum of sales revenue
        </span>
      </div>

      <div
        style={{
          padding: "15px",
          background: "#ffffff",
          border: "1px solid #e8e9ef",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
            }}
          />

          <strong
  style={{
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "700",
  }}
>
  Total Profit
</strong>
        </div>

        <span
          style={{
            display: "block",
            marginTop: "6px",
            fontSize: "12px",
            color: "#777b8f",
          }}
        >
          Total revenue minus total cost
        </span>
      </div>
    </div>

    {/* Connector */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5ff",
          border: "1px solid #e1e2ff",
          color: "#6366f1",
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        ×
      </div>
    </div>

    {/* Dimensions */}
    <div
      style={{
        border: "1px solid #e8e9ef",
        borderRadius: "16px",
        padding: "20px",
        background: "#fafbff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ecfdf5",
            color: "#10b981",
            fontWeight: "700",
          }}
        >
          D
        </div>

        <div>
          <span
            className="eyebrow"
            style={{ color: "#10b981" }}
          >
            DIMENSIONS
          </span>

          <strong
            style={{
              display: "block",
              marginTop: "3px",
              fontSize: "15px",
              color: "#202333",
            }}
          >
            Analysis Dimensions
          </strong>
        </div>
      </div>

      <div
        style={{
          padding: "15px",
          background: "#ffffff",
          border: "1px solid #e8e9ef",
          borderRadius: "12px",
          marginBottom: "10px",
        }}
      >
        <strong
  style={{
    color: "#6366f1",
    fontSize: "14px",
    fontWeight: "700",
  }}
>
  Region
</strong>

        <span
          style={{
            display: "block",
            marginTop: "6px",
            fontSize: "12px",
            color: "#777b8f",
          }}
        >
          Geographic sales grouping
        </span>
      </div>

      <div
        style={{
          padding: "15px",
          background: "#ffffff",
          border: "1px solid #e8e9ef",
          borderRadius: "12px",
        }}
      >
        <strong
  style={{
    color: "#10b981",
    fontSize: "14px",
    fontWeight: "700",
  }}
>
  Order Date
</strong>

        <span
          style={{
            display: "block",
            marginTop: "6px",
            fontSize: "12px",
            color: "#777b8f",
          }}
        >
          Time dimension for trend analysis
        </span>
      </div>
    </div>

  </div>
</section>
    {/* Semantic Mapping */}
    <section
      className="chart-card large"
      style={{ marginTop: "22px" }}
    >

      <div className="chart-header">
        <div>
          <span className="eyebrow">
            QUERY MAPPING
          </span>

          <h3>How MetricMind understands questions</h3>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "18px",
          marginTop: "22px",
        }}
      >

        <div
          style={{
            padding: "18px",
            borderRadius: "14px",
            background: "#fafbff",
            border: "1px solid #e8e9ef",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#777b8f",
              letterSpacing: "0.08em",
            }}
          >
            USER QUESTION
          </span>

          <strong
            style={{
              display: "block",
              marginTop: "10px",
              color: "#202333",
            }}
          >
            "Show revenue by region"
          </strong>
        </div>

        <div
          style={{
            color: "#6366f1",
            fontSize: "20px",
            fontWeight: "700",
          }}
        >
          →
        </div>

        <div
          style={{
            padding: "18px",
            borderRadius: "14px",
            background: "#f8f8ff",
            border: "1px solid #e2e3ff",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#6366f1",
              letterSpacing: "0.08em",
            }}
          >
            SEMANTIC INTERPRETATION
          </span>

          <strong
            style={{
              display: "block",
              marginTop: "10px",
              color: "#202333",
            }}
          >
            Total Revenue × Region
          </strong>
        </div>

      </div>

    </section>

  </main>
)}
  </div>);
}


export default App;