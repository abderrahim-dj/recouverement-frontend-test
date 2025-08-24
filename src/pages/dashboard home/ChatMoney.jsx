import { useState, useEffect, use } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { parseISO, getMonth, getYear, format } from "date-fns";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const rawData = [
  { date: "2024-01-10", value: 20 },
  { date: "2024-01-15", value: 30 },
  { date: "2024-02-05", value: 40 },
  { date: "2024-02-18", value: 50 },
  { date: "2024-03-01", value: 60 },
  { date: "2025-01-10", value: 70 },
];



export default function ChartMoney() {
  const [filterType, setFilterType] = useState("year"); // 'month', 'year', 'total'
  const [selectedMonth, setSelectedMonth] = useState(0); // January = 0
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  

  const selectedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`;

  useEffect(() => {
    if (filterType === "month") {
      console.log("Selected date:", selectedDate);

      fetchData(selectedDate, 'month')

    }
    else if (filterType === "year") {
      console.log("Selected year:", selectedDate);
      fetchData(selectedDate, 'year')
    }
  }, [selectedYear, selectedMonth, filterType, selectedDate]);



  const filteredData = data.filter((item) => {
    const date = parseISO(item.date);
      

    
    if (filterType === "month") {
      
      return getMonth(date) === selectedMonth && getYear(date) === selectedYear;
    }
    if (filterType === "year") {
      return getYear(date) === selectedYear;
    }
    return true; // total
  });


  
  //function to fetch data form the API
  const fetchData = async (selectedDate, filterBy) => {
    
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}payments-per-month/?date=${selectedDate}&calculate=${filterType}`;

      const response = await  fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
      })

      if(response.ok) {
        const data = await response.json();
        console.log("Data fetched:", data);
        setData(data);
      }else {
        alert("Error fetching data");
        console.error("Error fetching data:", response.statusText);
      }

    } catch (error) {
      alert("Error fetching data from API lol");
    }



  }

  const chartData = {
    labels: filteredData.map((d) => format(parseISO(d.date), "MMM dd")),
    datasets: [
      {
        label: "Total Payments (DA)",
        data: filteredData.map((d) => d.value),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.2,
      },
    ],
  };


  // Chart.js options for title and legend position
  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom", // Move legend to the bottom
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    responsive: true,
    //maintainAspectRatio: false,

    scales: {
      y: {
        title: {
          display: true,
          text: "DA",
          font: {
            size: 16,
          },
          color: "#333",
          position: "start",      // Move label to the top of the axis
          padding: { top: 10, bottom: 0 },
          
        },
        
      },
    },
  };


  return (
    <div style={{ maxWidth: 700, margin: "0 auto", boxShadow: "5px 10px 8px rgba(0,0,0,0.1)", padding: "20px", borderRadius: "8px", width:'40vw' }}>
      <h2 className="text-2xl font-bold pb-6 pl-8">Historique des paiements</h2>

      <div style={{ marginBottom: "1rem", border: "1px solid #ccc", borderRadius:'10px', padding: "10px", width:'fit-content', marginLeft:'1.6rem' }}>
        <label>Filtree: </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="cursor-pointer"
        >
          {/* <option value="total">Total</option> */}
          <option value="year">Par Annee</option>
          <option value="month">Par Moi</option>
        </select>

        {filterType !== "total" && (
          <>
            <label style={{ marginLeft: 10 }}>Annee: </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="cursor-pointer"
            >
              {Array.from(
                { length: new Date().getFullYear() - 2024 + 1 },
                (_, i) => 2024 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </>
        )}

        {filterType === "month" && (
          <>
            <label style={{ marginLeft: 10 }}>Moi: </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {format(new Date(0, i), "MMMM")}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <Line data={chartData} options={chartOptions} />
    </div>
  );
}