"use client"
import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Moon, Sun, Lightbulb } from "lucide-react"
import "./dashboard.css"

// Define the type for our clothing items
interface ClothingItem {
  id: number
  tipo: string
  cor: string
  tamanho: string
  preco: number
  estacao: string
  imagem: string
  genero: string
  estoque: number // Stock quantity
  vendas: number // Number of items sold
}

// Add interface for monthly sales data
interface MonthlySalesData {
  month: string
  sales: number
  value: number
}

// Color palette for charts
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f97316", // Orange
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f59e0b", // Amber
  "#6366f1", // Indigo
  "#ef4444", // Red
  "#14b8a6", // Teal
]

// Chart types
type ChartType = "type" | "color" | "price" | "gender" | "season" | "availability" | "sales" | "monthly"

export default function Dashboard() {
  const [data, setData] = useState<ClothingItem[]>([])
  const [filteredData, setFilteredData] = useState<ClothingItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [activeChart, setActiveChart] = useState<ChartType | null>(null)
  const [loading, setLoading] = useState(true) // Track loading state
  const [darkMode, setDarkMode] = useState(false)
  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySalesData[]>([])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark", newDarkMode)
    localStorage.setItem("darkMode", newDarkMode ? "true" : "false")
  }

  // Fetch data from Flask backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/clothing") // Flask backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const result: ClothingItem[] = await response.json()
        setData(result)
        setFilteredData(result) // Initialize filtered data with all items

        // Also fetch monthly sales data
        try {
          const monthlySalesResponse = await fetch("http://localhost:5000/api/monthly-sales")
          if (monthlySalesResponse.ok) {
            const monthlySales: MonthlySalesData[] = await monthlySalesResponse.json()
            setMonthlySalesData(monthlySales)
          }
        } catch (error) {
          console.error("Error fetching monthly sales data:", error)
          // If we can't fetch monthly data, we'll show a message in the UI
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false) // Stop loading
      }
    }

    fetchData()
  }, [])

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    document.documentElement.classList.toggle("dark", savedDarkMode)
  }, [])

  // Function to get unique values for a specific key
  const getUniqueValues = (key: keyof ClothingItem) => {
    const values = new Set<string>()
    data.forEach((item) => {
      values.add(String(item[key]))
    })
    return Array.from(values)
  }

  // Prepare data for charts
  const prepareTypeData = () => {
    const typeCount: Record<string, number> = {}
    filteredData.forEach((item) => {
      typeCount[item.tipo] = (typeCount[item.tipo] || 0) + 1
    })
    return Object.keys(typeCount).map((key) => ({
      name: key,
      value: typeCount[key],
    }))
  }

  const prepareColorData = () => {
    const colorCount: Record<string, number> = {}
    filteredData.forEach((item) => {
      colorCount[item.cor] = (colorCount[item.cor] || 0) + 1
    })
    return Object.keys(colorCount).map((key) => ({
      name: key,
      value: colorCount[key],
    }))
  }

  const preparePriceByTypeData = () => {
    const priceByType: Record<string, number[]> = {}
    filteredData.forEach((item) => {
      if (!priceByType[item.tipo]) {
        priceByType[item.tipo] = []
      }
      priceByType[item.tipo].push(item.preco)
    })
    return Object.keys(priceByType).map((key) => ({
      name: key,
      value: priceByType[key].reduce((a, b) => a + b, 0) / priceByType[key].length,
    }))
  }

  const prepareGenderData = () => {
    const genderCount: Record<string, number> = {}
    filteredData.forEach((item) => {
      genderCount[item.genero] = (genderCount[item.genero] || 0) + 1
    })
    return Object.keys(genderCount).map((key) => ({
      name: key,
      value: genderCount[key],
    }))
  }

  const prepareSeasonData = () => {
    const seasonCount: Record<string, number> = {}
    filteredData.forEach((item) => {
      seasonCount[item.estacao] = (seasonCount[item.estacao] || 0) + 1
    })
    return Object.keys(seasonCount).map((key) => ({
      name: key,
      value: seasonCount[key],
    }))
  }

  const prepareSalesData = () => {
    const salesCount: Record<string, number> = {}
    filteredData.forEach((item) => {
      salesCount[item.tipo] = (salesCount[item.tipo] || 0) + item.vendas
    })
    return Object.keys(salesCount).map((key) => ({
      name: key,
      value: salesCount[key],
    }))
  }

  // Apply filters and search
  useEffect(() => {
    let result = [...data]
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          item.tipo.toLowerCase().includes(term) ||
          item.cor.toLowerCase().includes(term) ||
          item.tamanho.toLowerCase().includes(term) ||
          item.estacao.toLowerCase().includes(term) ||
          item.genero.toLowerCase().includes(term) ||
          item.id.toString().includes(term) ||
          item.preco.toString().includes(term),
      )
    }
    // Apply active filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        result = result.filter((item) => {
          const itemValue = item[key as keyof ClothingItem]
          return itemValue.toString().toLowerCase() === value.toLowerCase()
        })
      }
    })
    setFilteredData(result)
  }, [searchTerm, activeFilters, data])

  // Handle selling an item
  const handleSell = async (itemId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sell/${itemId}`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error("Failed to register sale")
      }
      const updatedItem = await response.json()
      // Update local state with the new data
      setData((prevData) => prevData.map((item) => (item.id === itemId ? updatedItem.item : item)))
      setFilteredData((prevData) => prevData.map((item) => (item.id === itemId ? updatedItem.item : item)))
    } catch (error) {
      console.error("Error registering sale:", error)
    }
  }

  // Calculate summary statistics
  const totalItems = filteredData.length
  const totalValue = filteredData.reduce((sum, item) => sum + item.preco * item.estoque, 0).toFixed(2)
  const totalSalesValue = filteredData.reduce((sum, item) => sum + item.preco * item.vendas, 0).toFixed(2)
  const availableItems = filteredData.filter((item) => item.estoque > 0).length
  const outOfStockItems = filteredData.filter((item) => item.estoque === 0).length
  const totalSales = filteredData.reduce((sum, item) => sum + item.vendas, 0)
  const estimatedProfit = filteredData.reduce((sum, item) => sum + item.preco * 0.3 * item.vendas, 0).toFixed(2)

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({})
    setSearchTerm("")
  }

  // Navigate to insights page
  const goToInsights = () => {
    window.location.href = "/insights"
  }

return (
  <div className="dashboard-container">
    <header className="dashboard-header">
      <div className="header-content">
        <h1>Painel de Estoque de Roupas</h1>
        <div className="header-actions">
          <button
            className="theme-toggle-button"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Alternar para modo claro" : "Alternar para modo escuro"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>

    {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando dados do estoque...</div>
      </div>
    ) : (
      <>
        {/* Pesquisa e Filtros */}
        <div className="search-filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar itens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="clear-button" onClick={clearFilters}>
              Limpar Filtros
            </button>
          </div>
          <div className="filter-tabs">
            <div className="filter-group">
              <label>Tipo:</label>
              <select
                value={activeFilters.tipo || "all"}
                onChange={(e) => setActiveFilters({ ...activeFilters, tipo: e.target.value })}
              >
                <option value="all">Todos os Tipos</option>
                {getUniqueValues("tipo").map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Cor:</label>
              <select
                value={activeFilters.cor || "all"}
                onChange={(e) => setActiveFilters({ ...activeFilters, cor: e.target.value })}
              >
                <option value="all">Todas as Cores</option>
                {getUniqueValues("cor").map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Tamanho:</label>
              <select
                value={activeFilters.tamanho || "all"}
                onChange={(e) => setActiveFilters({ ...activeFilters, tamanho: e.target.value })}
              >
                <option value="all">Todos os Tamanhos</option>
                {getUniqueValues("tamanho").map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Estação:</label>
              <select
                value={activeFilters.estacao || "all"}
                onChange={(e) => setActiveFilters({ ...activeFilters, estacao: e.target.value })}
              >
                <option value="all">Todas as Estações</option>
                {getUniqueValues("estacao").map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Gênero:</label>
              <select
                value={activeFilters.genero || "all"}
                onChange={(e) => setActiveFilters({ ...activeFilters, genero: e.target.value })}
              >
                <option value="all">Todos os Gêneros</option>
                {getUniqueValues("genero").map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total de Itens</h3>
            <p>{totalItems}</p>
          </div>
          <div className="summary-card">
            <h3>Valor Total</h3>
            <p>R$ {totalValue}</p>
          </div>
          <div className="summary-card">
            <h3>Valor Total de Vendas</h3>
            <p>R$ {totalSalesValue}</p>
          </div>
          <div className="summary-card">
            <h3>Disponíveis</h3>
            <p>{availableItems}</p>
          </div>
          <div className="summary-card">
            <h3>Sem Estoque</h3>
            <p>{outOfStockItems}</p>
          </div>
          <div className="summary-card">
            <h3>Unidades Vendidas</h3>
            <p>{totalSales}</p>
          </div>
          <div className="summary-card">
            <h3>Lucro Estimado</h3>
            <p>R$ {estimatedProfit}</p>
          </div>
        </div>

        {/* Seletor de Gráfico */}
        <div className="chart-selector">
          <h2>Visualizações</h2>
          <p>Selecione um tipo de gráfico:</p>
          <div className="chart-buttons">
            <button
              className={`chart-button ${activeChart === "type" ? "active" : ""}`}
              onClick={() => setActiveChart("type")}
            >
              Por Tipo
            </button>
            <button
              className={`chart-button ${activeChart === "color" ? "active" : ""}`}
              onClick={() => setActiveChart("color")}
            >
              Por Cor
            </button>
            <button
              className={`chart-button ${activeChart === "price" ? "active" : ""}`}
              onClick={() => setActiveChart("price")}
            >
              Por Preço
            </button>
            <button
              className={`chart-button ${activeChart === "gender" ? "active" : ""}`}
              onClick={() => setActiveChart("gender")}
            >
              Por Gênero
            </button>
            <button
              className={`chart-button ${activeChart === "season" ? "active" : ""}`}
              onClick={() => setActiveChart("season")}
            >
              Por Estação
            </button>
            <button
              className={`chart-button ${activeChart === "sales" ? "active" : ""}`}
              onClick={() => setActiveChart("sales")}
            >
              Por Vendas
            </button>
            <button
              className={`chart-button ${activeChart === "monthly" ? "active" : ""}`}
              onClick={() => setActiveChart("monthly")}
            >
              Vendas Mensais
            </button>
          </div>
        </div>

        {/* Gráfico Ativo */}
        {/* (As legendas internas dos gráficos já estão adequadas, pois são baseadas nos dados ou nos nomes das funções) */}

        {/* Tabela de Itens */}
        <div className="table-container">
          <h3>Itens em Estoque ({filteredData.length})</h3>
          {filteredData.length === 0 ? (
            <div className="no-results">Nenhum item corresponde aos filtros de busca</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Cor</th>
                  <th>Tamanho</th>
                  <th>Preço (R$)</th>
                  <th>Estação</th>
                  <th>Gênero</th>
                  <th>Estoque</th>
                  <th>Vendas</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className={item.estoque === 0 ? "out-of-stock" : ""}>
                    <td>{item.id}</td>
                    <td>{item.tipo}</td>
                    <td>
                      <span
                        className="color-dot"
                        style={{
                          backgroundColor:
                            item.cor === "Branco"
                              ? "#ffffff"
                              : item.cor === "Preto"
                              ? "#000000"
                              : item.cor === "Vermelho"
                              ? "#ff0000"
                              : item.cor === "Azul"
                              ? "#0000ff"
                              : item.cor === "Rosa"
                              ? "#ff69b4"
                              : item.cor === "Jeans"
                              ? "#5f9ea0"
                              : item.cor === "Listrado"
                              ? "#a9a9a9"
                              : item.cor === "Cinza"
                              ? "#808080"
                              : item.cor === "Florido"
                              ? "#ff8c00"
                              : item.cor === "Bege"
                              ? "#f5f5dc"
                              : "#cccccc",
                        }}
                      ></span>
                      {item.cor}
                    </td>
                    <td>{item.tamanho}</td>
                    <td>{item.preco.toFixed(2)}</td>
                    <td>{item.estacao}</td>
                    <td>{item.genero}</td>
                    <td>{item.estoque > 0 ? `${item.estoque} em estoque` : "Sem estoque"}</td>
                    <td>{item.vendas}</td>
                    <td>
                      <button onClick={() => handleSell(item.id)} disabled={item.estoque === 0}>
                        Vender
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    )}
  </div>
)
}
