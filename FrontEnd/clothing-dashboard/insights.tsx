"use client"
import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Moon, Sun, ArrowLeft, TrendingUp, BrainCircuit, ShoppingBag, Calendar } from "lucide-react"
import "./dashboard.css"

// Define types
interface TopSellingItem {
  id: number
  tipo: string
  cor: string
  tamanho: string
  preco: number
  vendas: number
  revenue: number
}

interface SalesPrediction {
  month: string
  predicted: number
  actual?: number
}

interface SalesInsight {
  id: string
  title: string
  description: string
  type: "primary" | "success" | "warning" | "info"
}

export default function Insights() {
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [topItems, setTopItems] = useState<TopSellingItem[]>([])
  const [predictions, setPredictions] = useState<SalesPrediction[]>([])
  const [insights, setInsights] = useState<SalesInsight[]>([])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark", newDarkMode)
    localStorage.setItem("darkMode", newDarkMode ? "true" : "false")
  }

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    document.documentElement.classList.toggle("dark", savedDarkMode)
  }, [])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch this data from your backend
        // For now, we'll use sample data

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample top selling items
        setTopItems([
          { id: 1, tipo: "Camiseta", cor: "Preto", tamanho: "M", preco: 49.9, vendas: 120, revenue: 5988 },
          { id: 2, tipo: "Calça Jeans", cor: "Azul", tamanho: "42", preco: 129.9, vendas: 85, revenue: 11041.5 },
          { id: 3, tipo: "Vestido", cor: "Vermelho", tamanho: "P", preco: 89.9, vendas: 62, revenue: 5573.8 },
          { id: 4, tipo: "Blusa", cor: "Branco", tamanho: "G", preco: 59.9, vendas: 58, revenue: 3474.2 },
          { id: 5, tipo: "Shorts", cor: "Jeans", tamanho: "M", preco: 69.9, vendas: 45, revenue: 3145.5 },
        ])

        // Sample sales predictions
        setPredictions([
          { month: "Jan", predicted: 320, actual: 340 },
          { month: "Feb", predicted: 350, actual: 380 },
          { month: "Mar", predicted: 400, actual: 420 },
          { month: "Apr", predicted: 450, actual: 430 },
          { month: "May", predicted: 480, actual: 500 },
          { month: "Jun", predicted: 520, actual: 540 },
          { month: "Jul", predicted: 550, actual: 530 },
          { month: "Aug", predicted: 500, actual: 520 },
          { month: "Sep", predicted: 480, actual: 490 },
          { month: "Oct", predicted: 520, actual: null },
          { month: "Nov", predicted: 550, actual: null },
          { month: "Dec", predicted: 600, actual: null },
        ])

        // Sample AI insights
        setInsights([
          {
            id: "1",
            title: "Sales Trend Analysis",
            description:
              "Sales have increased by 18% compared to the same period last year. The growth is primarily driven by casual wear and summer collections.",
            type: "primary",
          },
          {
            id: "2",
            title: "Seasonal Recommendation",
            description:
              "Based on current trends, increasing inventory of summer dresses and lightweight shirts by 25% could maximize revenue for the upcoming season.",
            type: "success",
          },
          {
            id: "3",
            title: "Inventory Alert",
            description:
              "Black t-shirts in size M are consistently selling out before restocking. Consider increasing order quantities by 30% to meet demand.",
            type: "warning",
          },
          {
            id: "4",
            title: "Customer Preference",
            description:
              "Data shows customers prefer darker colors in winter months. Adjust your inventory to include more dark-colored items starting in October.",
            type: "info",
          },
          {
            id: "5",
            title: "Price Optimization",
            description:
              "Items priced between R$50-80 have the highest turnover rate. Consider adjusting pricing strategy for slow-moving premium items.",
            type: "primary",
          },
          {
            id: "6",
            title: "Cross-Selling Opportunity",
            description:
              "Customers who purchase jeans often buy t-shirts in the same transaction. Consider creating bundle promotions to increase average order value.",
            type: "success",
          },
        ])
      } catch (error) {
        console.error("Error fetching insights data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Prepare data for seasonal sales chart
  const seasonalData = [
    { name: "Summer", value: 35 },
    { name: "Fall", value: 25 },
    { name: "Winter", value: 20 },
    { name: "Spring", value: 20 },
  ]

  return (
    <div className="insights-container">
      <header className="insights-header">
        <div className="header-content">
          <div className="header-actions" style={{ justifyContent: "flex-start" }}>
            <button className="clear-button" onClick={() => (window.location.href = "/")} aria-label="Back to Dashboard">
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <h1>AI Sales Insights</h1>
          <button
            className="theme-toggle-button"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading">Analyzing sales data...</div>
      ) : (
        <>
          <section className="insights-section">
            <h2>
              <BrainCircuit className="inline-icon" size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} />{" "}
              AI-Generated Insights
            </h2>
            <div className="insights-grid">
              {insights.map((insight) => (
                <div key={insight.id} className={`insight-card ${insight.type}`}>
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="insights-section">
            <h2>
              <ShoppingBag className="inline-icon" size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} />{" "}
              Top Selling Items
            </h2>
            <table className="top-items-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Price (R$)</th>
                  <th>Units Sold</th>
                  <th>Revenue (R$)</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.tipo}</td>
                    <td>{item.cor}</td>
                    <td>{item.tamanho}</td>
                    <td>{item.preco.toFixed(2)}</td>
                    <td>{item.vendas}</td>
                    <td>{item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="insights-section">
            <h2>
              <TrendingUp className="inline-icon" size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} />{" "}
              Sales Predictions
            </h2>
            <div className="prediction-chart">
              <h3>Monthly Sales Forecast</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={predictions} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Actual Sales"
                    dot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="insights-section">
            <h2>
              <Calendar className="inline-icon" size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} />{" "}
              Seasonal Analysis
            </h2>
            <div className="prediction-chart">
              <h3>Sales Distribution by Season</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={seasonalData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage of Annual Sales"]} />
                  <Legend />
                  <Bar dataKey="value" name="Percentage of Annual Sales" fill="#8884d8">
                    {seasonalData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#f97316"
                            : // Summer - orange
                              index === 1
                              ? "#8b5cf6"
                              : // Fall - purple
                                index === 2
                                ? "#3b82f6"
                                : // Winter - blue
                                  "#10b981" // Spring - green
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
