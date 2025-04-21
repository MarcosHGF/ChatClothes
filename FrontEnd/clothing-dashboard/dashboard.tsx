"use client"

import type React from "react"
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
  disponibilidade: string
}

// Sample data from the provided CSV
const sampleData: ClothingItem[] = [
  {
    id: 1,
    tipo: "Camiseta",
    cor: "Branco",
    tamanho: "M",
    preco: 49.9,
    estacao: "Verao",
    imagem: "camiseta_branca.jpg",
    genero: "Unissex",
    disponibilidade: "Disponivel",
  },
  {
    id: 2,
    tipo: "Calca",
    cor: "Preto",
    tamanho: "G",
    preco: 89.9,
    estacao: "Inverno",
    imagem: "calca_preta.jpg",
    genero: "Masculino",
    disponibilidade: "Esgotado",
  },
  {
    id: 3,
    tipo: "Saia",
    cor: "Vermelho",
    tamanho: "P",
    preco: 59.9,
    estacao: "Primavera",
    imagem: "saia_vermelha.jpg",
    genero: "Feminino",
    disponibilidade: "Disponivel",
  },
  {
    id: 4,
    tipo: "Jaqueta",
    cor: "Azul",
    tamanho: "GG",
    preco: 149.9,
    estacao: "Outono",
    imagem: "jaqueta_azul.jpg",
    genero: "Masculino",
    disponibilidade: "Disponivel",
  },
  {
    id: 5,
    tipo: "Blusa",
    cor: "Rosa",
    tamanho: "M",
    preco: 69.9,
    estacao: "Inverno",
    imagem: "blusa_rosa.jpg",
    genero: "Feminino",
    disponibilidade: "Disponivel",
  },
  {
    id: 6,
    tipo: "Short",
    cor: "Jeans",
    tamanho: "P",
    preco: 39.9,
    estacao: "Verao",
    imagem: "short_jeans.jpg",
    genero: "Feminino",
    disponibilidade: "Esgotado",
  },
  {
    id: 7,
    tipo: "Camisa",
    cor: "Listrado",
    tamanho: "G",
    preco: 79.9,
    estacao: "Primavera",
    imagem: "camisa_listrada.jpg",
    genero: "Masculino",
    disponibilidade: "Disponivel",
  },
  {
    id: 8,
    tipo: "Moletom",
    cor: "Cinza",
    tamanho: "GG",
    preco: 129.9,
    estacao: "Outono",
    imagem: "moletom_cinza.jpg",
    genero: "Unissex",
    disponibilidade: "Disponivel",
  },
  {
    id: 9,
    tipo: "Vestido",
    cor: "Florido",
    tamanho: "M",
    preco: 99.9,
    estacao: "Primavera",
    imagem: "vestido_florido.jpg",
    genero: "Feminino",
    disponibilidade: "Disponivel",
  },
  {
    id: 10,
    tipo: "Bermuda",
    cor: "Bege",
    tamanho: "M",
    preco: 44.9,
    estacao: "Verao",
    imagem: "bermuda_bege.jpg",
    genero: "Masculino",
    disponibilidade: "Disponivel",
  },
]

// Color palette for charts
const COLORS = [
  "#4e79a7",
  "#f28e2c",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
]

// Chart types
type ChartType = "type" | "color" | "price" | "gender" | "season" | "availability"

export default function Dashboard() {
  const [data, setData] = useState<ClothingItem[]>(sampleData)
  const [filteredData, setFilteredData] = useState<ClothingItem[]>(sampleData)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [activeChart, setActiveChart] = useState<ChartType | null>(null)

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

  const prepareAvailabilityData = () => {
    const availabilityCount: Record<string, number> = {}
    filteredData.forEach((item) => {
      availabilityCount[item.disponibilidade] = (availabilityCount[item.disponibilidade] || 0) + 1
    })
    return Object.keys(availabilityCount).map((key) => ({
      name: key,
      value: availabilityCount[key],
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

  // Apply filters and search
  useEffect(() => {
    let result = [...sampleData]

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
          item.disponibilidade.toLowerCase().includes(term) ||
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
  }, [searchTerm, activeFilters])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Handle filter change
  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }))
  }

  // Toggle chart visibility
  const toggleChart = (chartType: ChartType) => {
    setActiveChart(activeChart === chartType ? null : chartType)
  }

  // Get unique values for filter options
  const getUniqueValues = (key: keyof ClothingItem) => {
    const values = new Set<string>()
    sampleData.forEach((item) => {
      values.add(String(item[key]))
    })
    return Array.from(values)
  }

  // Calculate summary statistics
  const totalItems = filteredData.length
  const totalValue = filteredData.reduce((sum, item) => sum + item.preco, 0).toFixed(2)
  const availableItems = filteredData.filter((item) => item.disponibilidade === "Disponivel").length
  const outOfStockItems = filteredData.filter((item) => item.disponibilidade === "Esgotado").length

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({})
    setSearchTerm("")
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Clothing Inventory Dashboard</h1>
      </header>

      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="clear-button" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        <div className="filter-tabs">
          <div className="filter-group">
            <label>Type:</label>
            <select value={activeFilters.tipo || "all"} onChange={(e) => handleFilterChange("tipo", e.target.value)}>
              <option value="all">All Types</option>
              {getUniqueValues("tipo").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Color:</label>
            <select value={activeFilters.cor || "all"} onChange={(e) => handleFilterChange("cor", e.target.value)}>
              <option value="all">All Colors</option>
              {getUniqueValues("cor").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Size:</label>
            <select
              value={activeFilters.tamanho || "all"}
              onChange={(e) => handleFilterChange("tamanho", e.target.value)}
            >
              <option value="all">All Sizes</option>
              {getUniqueValues("tamanho").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Season:</label>
            <select
              value={activeFilters.estacao || "all"}
              onChange={(e) => handleFilterChange("estacao", e.target.value)}
            >
              <option value="all">All Seasons</option>
              {getUniqueValues("estacao").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Gender:</label>
            <select
              value={activeFilters.genero || "all"}
              onChange={(e) => handleFilterChange("genero", e.target.value)}
            >
              <option value="all">All Genders</option>
              {getUniqueValues("genero").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select
              value={activeFilters.disponibilidade || "all"}
              onChange={(e) => handleFilterChange("disponibilidade", e.target.value)}
            >
              <option value="all">All Status</option>
              {getUniqueValues("disponibilidade").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Items</h3>
          <p>{totalItems}</p>
        </div>
        <div className="summary-card">
          <h3>Total Value</h3>
          <p>R$ {totalValue}</p>
        </div>
        <div className="summary-card">
          <h3>Available</h3>
          <p>{availableItems}</p>
        </div>
        <div className="summary-card">
          <h3>Out of Stock</h3>
          <p>{outOfStockItems}</p>
        </div>
      </div>

      <div className="chart-selector">
        <h2>Visualizations</h2>
        <p>Select a chart type to view:</p>
        <div className="chart-buttons">
          <button
            className={`chart-button ${activeChart === "type" ? "active" : ""}`}
            onClick={() => toggleChart("type")}
          >
            By Type
          </button>
          <button
            className={`chart-button ${activeChart === "color" ? "active" : ""}`}
            onClick={() => toggleChart("color")}
          >
            By Color
          </button>
          <button
            className={`chart-button ${activeChart === "price" ? "active" : ""}`}
            onClick={() => toggleChart("price")}
          >
            By Price
          </button>
          <button
            className={`chart-button ${activeChart === "gender" ? "active" : ""}`}
            onClick={() => toggleChart("gender")}
          >
            By Gender
          </button>
          <button
            className={`chart-button ${activeChart === "season" ? "active" : ""}`}
            onClick={() => toggleChart("season")}
          >
            By Season
          </button>
          <button
            className={`chart-button ${activeChart === "availability" ? "active" : ""}`}
            onClick={() => toggleChart("availability")}
          >
            By Availability
          </button>
        </div>
      </div>

      {activeChart && (
        <div className="active-chart">
          {activeChart === "type" && (
            <div className="chart-card">
              <h3>Items by Type</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={prepareTypeData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#8884d8">
                    {prepareTypeData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === "color" && (
            <div className="chart-card">
              <h3>Items by Color</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={prepareColorData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareColorData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === "price" && (
            <div className="chart-card">
              <h3>Average Price by Type</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={preparePriceByTypeData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, "Avg Price"]} />
                  <Legend />
                  <Bar dataKey="value" name="Average Price (R$)" fill="#82ca9d">
                    {preparePriceByTypeData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === "gender" && (
            <div className="chart-card">
              <h3>Items by Gender</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={prepareGenderData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareGenderData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === "season" && (
            <div className="chart-card">
              <h3>Items by Season</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={prepareSeasonData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#ffc658">
                    {prepareSeasonData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === "availability" && (
            <div className="chart-card">
              <h3>Availability Status</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={prepareAvailabilityData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareAvailabilityData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === "Disponivel" ? "#4CAF50" : "#FF5252"} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="table-container">
        <h3>Inventory Items ({filteredData.length})</h3>
        {filteredData.length === 0 ? (
          <div className="no-results">No items match your search criteria</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Color</th>
                <th>Size</th>
                <th>Price (R$)</th>
                <th>Season</th>
                <th>Gender</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className={item.disponibilidade === "Esgotado" ? "out-of-stock" : ""}>
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
                  <td className={item.disponibilidade === "Disponivel" ? "available" : "unavailable"}>
                    {item.disponibilidade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
