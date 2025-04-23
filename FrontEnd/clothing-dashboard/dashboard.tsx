"use client";
import type React from "react";
import { useState, useEffect } from "react";
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
} from "recharts";
import "./dashboard.css";

// Define the type for our clothing items
interface ClothingItem {
  id: number;
  tipo: string;
  cor: string;
  tamanho: string;
  preco: number;
  estacao: string;
  imagem: string;
  genero: string;
  estoque: number; // Stock quantity
  vendas: number; // Number of items sold
}

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
];

// Chart types
type ChartType =
  | "type"
  | "color"
  | "price"
  | "gender"
  | "season"
  | "availability"
  | "sales";

export default function Dashboard() {
  const [data, setData] = useState<ClothingItem[]>([]);
  const [filteredData, setFilteredData] = useState<ClothingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [activeChart, setActiveChart] = useState<ChartType | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch data from Flask backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/clothing"); // Flask backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result: ClothingItem[] = await response.json();
        setData(result);
        setFilteredData(result); // Initialize filtered data with all items
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Function to get unique values for a specific key
  const getUniqueValues = (key: keyof ClothingItem) => {
    const values = new Set<string>();
    data.forEach((item) => {
      values.add(String(item[key]));
    });
    return Array.from(values);
  };

  // Handle filter change
  /*const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };*/

  // Prepare data for charts
  const prepareTypeData = () => {
    const typeCount: Record<string, number> = {};
    filteredData.forEach((item) => {
      typeCount[item.tipo] = (typeCount[item.tipo] || 0) + 1;
    });
    return Object.keys(typeCount).map((key) => ({
      name: key,
      value: typeCount[key],
    }));
  };

  const prepareColorData = () => {
    const colorCount: Record<string, number> = {};
    filteredData.forEach((item) => {
      colorCount[item.cor] = (colorCount[item.cor] || 0) + 1;
    });
    return Object.keys(colorCount).map((key) => ({
      name: key,
      value: colorCount[key],
    }));
  };

  const preparePriceByTypeData = () => {
    const priceByType: Record<string, number[]> = {};
    filteredData.forEach((item) => {
      if (!priceByType[item.tipo]) {
        priceByType[item.tipo] = [];
      }
      priceByType[item.tipo].push(item.preco);
    });
    return Object.keys(priceByType).map((key) => ({
      name: key,
      value: priceByType[key].reduce((a, b) => a + b, 0) / priceByType[key].length,
    }));
  };

  const prepareGenderData = () => {
    const genderCount: Record<string, number> = {};
    filteredData.forEach((item) => {
      genderCount[item.genero] = (genderCount[item.genero] || 0) + 1;
    });
    return Object.keys(genderCount).map((key) => ({
      name: key,
      value: genderCount[key],
    }));
  };

  const prepareSeasonData = () => {
    const seasonCount: Record<string, number> = {};
    filteredData.forEach((item) => {
      seasonCount[item.estacao] = (seasonCount[item.estacao] || 0) + 1;
    });
    return Object.keys(seasonCount).map((key) => ({
      name: key,
      value: seasonCount[key],
    }));
  };

  const prepareSalesData = () => {
    const salesCount: Record<string, number> = {};
    filteredData.forEach((item) => {
      salesCount[item.tipo] = (salesCount[item.tipo] || 0) + item.vendas;
    });
    return Object.keys(salesCount).map((key) => ({
      name: key,
      value: salesCount[key],
    }));
  };

  // Apply filters and search
  useEffect(() => {
    let result = [...data];
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.tipo.toLowerCase().includes(term) ||
          item.cor.toLowerCase().includes(term) ||
          item.tamanho.toLowerCase().includes(term) ||
          item.estacao.toLowerCase().includes(term) ||
          item.genero.toLowerCase().includes(term) ||
          item.id.toString().includes(term) ||
          item.preco.toString().includes(term),
      );
    }
    // Apply active filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        result = result.filter((item) => {
          const itemValue = item[key as keyof ClothingItem];
          return itemValue.toString().toLowerCase() === value.toLowerCase();
        });
      }
    });
    setFilteredData(result);
  }, [searchTerm, activeFilters, data]);

  // Handle selling an item
  const handleSell = async (itemId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sell/${itemId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to register sale");
      }
      const updatedItem = await response.json();
      // Update local state with the new data
      setData((prevData) =>
        prevData.map((item) => (item.id === itemId ? updatedItem.item : item)),
      );
      setFilteredData((prevData) =>
        prevData.map((item) => (item.id === itemId ? updatedItem.item : item)),
      );
    } catch (error) {
      console.error("Error registering sale:", error);
    }
  };

  // Calculate summary statistics
  const totalItems = filteredData.length;
  const totalValue = filteredData.reduce((sum, item) => sum + item.preco * item.estoque, 0).toFixed(2);
  const availableItems = filteredData.filter((item) => item.estoque > 0).length;
  const outOfStockItems = filteredData.filter((item) => item.estoque === 0).length;

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Clothing Inventory Dashboard</h1>
      </header>

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <>
          {/* Search and filter components */}
          <div className="search-filter-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button className="clear-button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
            <div className="filter-tabs">
              <div className="filter-group">
                <label>Type:</label>
                <select
                  value={activeFilters.tipo || "all"}
                  onChange={(e) => setActiveFilters({ ...activeFilters, tipo: e.target.value })}
                >
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
                <select
                  value={activeFilters.cor || "all"}
                  onChange={(e) => setActiveFilters({ ...activeFilters, cor: e.target.value })}
                >
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
                  onChange={(e) => setActiveFilters({ ...activeFilters, tamanho: e.target.value })}
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
                  onChange={(e) => setActiveFilters({ ...activeFilters, estacao: e.target.value })}
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
                  onChange={(e) => setActiveFilters({ ...activeFilters, genero: e.target.value })}
                >
                  <option value="all">All Genders</option>
                  {getUniqueValues("genero").map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Summary cards */}
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

          {/* Chart selector */}
          <div className="chart-selector">
            <h2>Visualizations</h2>
            <p>Select a chart type to view:</p>
            <div className="chart-buttons">
              <button
                className={`chart-button ${activeChart === "type" ? "active" : ""}`}
                onClick={() => setActiveChart("type")}
              >
                By Type
              </button>
              <button
                className={`chart-button ${activeChart === "color" ? "active" : ""}`}
                onClick={() => setActiveChart("color")}
              >
                By Color
              </button>
              <button
                className={`chart-button ${activeChart === "price" ? "active" : ""}`}
                onClick={() => setActiveChart("price")}
              >
                By Price
              </button>
              <button
                className={`chart-button ${activeChart === "gender" ? "active" : ""}`}
                onClick={() => setActiveChart("gender")}
              >
                By Gender
              </button>
              <button
                className={`chart-button ${activeChart === "season" ? "active" : ""}`}
                onClick={() => setActiveChart("season")}
              >
                By Season
              </button>
              <button
                className={`chart-button ${activeChart === "sales" ? "active" : ""}`}
                onClick={() => setActiveChart("sales")}
              >
                By Sales
              </button>
            </div>
          </div>

          {/* Active chart */}
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
              {activeChart === "sales" && (
                <div className="chart-card">
                  <h3>Sales by Type</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={prepareSalesData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Sales" fill="#ff6f61">
                        {prepareSalesData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Table container */}
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
                    <th>Stock</th>
                    <th>Sales</th>
                    <th>Action</th>
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
                      <td>{item.estoque > 0 ? `${item.estoque} in stock` : "Out of stock"}</td>
                      <td>{item.vendas}</td>
                      <td>
                        <button onClick={() => handleSell(item.id)} disabled={item.estoque === 0}>
                          Sell
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
  );
}