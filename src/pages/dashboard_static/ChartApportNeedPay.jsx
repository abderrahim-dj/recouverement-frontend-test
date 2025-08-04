import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
} from "chart.js";
import { parseISO, format, differenceInDays, differenceInMonths, isValid } from 'date-fns';

// Register ChartJS components including Title
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Title);

// Helper function to parse price string (e.g., "10.000") into a number
const parsePrice = (priceStr) => {
  if (typeof priceStr !== 'string') return 0;
  
  // Correctly parse price format where "1.000" means 1 DZD (not 1000 DZD)
  // This handles the notation where dots are decimal separators
  return parseFloat(priceStr.replace(',', '.')) || 0;
};

// Format number as DZD currency
const formatAsCurrency = (value) => {
  return new Intl.NumberFormat('fr-DZ', { 
    style: 'currency', 
    currency: 'DZD', 
    minimumFractionDigits: 3, 
    maximumFractionDigits: 3 
  }).format(value);
};

export default function ChartApportNeedPayed({ data }) {
  // Basic check for data availability
  if (!data || data.length === 0) {
    return <div>Loading chart data or no data available...</div>;
  }

  // 1. Process customer data for both start and current apport values
  const customerApportData = data
    .map(customer => ({
      date: parseISO(customer.customer_create_date),
      startAmount: parsePrice(customer.customer_apport_personnel_start),
      currentAmount: parsePrice(customer.customer_apport_personnel_current),
      customerId: customer.customer_id
    }))
    // Filter out entries with invalid dates
    .filter(c => isValid(c.date))
    // Sort entries by creation date chronologically
    .sort((a, b) => a.date - b.date);

  // If no valid customer apport data found, display a message
  if (customerApportData.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-lg">Aucune donnée d'apport client valide disponible.</p>
        <p className="text-sm text-gray-500 mt-2">Vérifiez si les dossiers du client contiennent des informations sur l'apport.</p>
      </div>
    );
  }

  // 2. Determine the time range and granularity for the x-axis based on creation dates
  const minDate = customerApportData[0].date;
  const maxDate = customerApportData[customerApportData.length - 1].date;

  // Calculate the difference in days and months
  const diffDays = differenceInDays(maxDate, minDate);
  const diffMonths = differenceInMonths(maxDate, minDate);

  let granularity = 'Quotidien';
  let dateFormat = 'yyyy-MM-dd';

  // Adjust granularity based on the time range
  if (diffMonths > 12) {
    granularity = ' Annuel';
    dateFormat = 'yyyy';
  } else if (diffDays > 30) {
    granularity = 'Mensuel';
    dateFormat = 'yyyy-MM';
  }

  // 3. Aggregate data by date periods
  const aggregatedData = customerApportData.reduce((acc, customer) => {
    // Format the date according to the chosen granularity
    const key = format(customer.date, dateFormat);
    
    // Initialize the period data if not already present
    if (!acc[key]) {
      acc[key] = {
        startApport: 0,
        currentApport: 0,
        customerCount: 0
      };
    }
    
    // Accumulate data for this period
    acc[key].startApport += customer.startAmount;
    acc[key].currentApport += customer.currentAmount;
    acc[key].customerCount += 1;
    
    return acc;
  }, {});

  // 4. Prepare dates and data for the chart
  const dates = Object.keys(aggregatedData).sort();
  const startApportValues = dates.map(date => aggregatedData[date].startApport);
  const currentApportValues = dates.map(date => aggregatedData[date].currentApport);
  const customerCounts = dates.map(date => aggregatedData[date].customerCount);

  // Calculate running totals
  let startApportTotal = 0;
  let currentApportTotal = 0;
  let customerTotal = 0;
  
  const cumulativeStartApport = startApportValues.map(value => {
    startApportTotal += value;
    return startApportTotal;
  });
  
  const cumulativeCurrentApport = currentApportValues.map(value => {
    currentApportTotal += value;
    return currentApportTotal;
  });
  
  const cumulativeCustomers = customerCounts.map(count => {
    customerTotal += count;
    return customerTotal;
  });

  // 5. Calculate stats about the data
  const totalStartApport = startApportTotal;
  const totalCurrentApport = currentApportTotal;
  const totalCustomers = customerTotal;
  const paymentProgress = totalStartApport > 0 ? 
    ((totalStartApport - totalCurrentApport) / totalStartApport * 100).toFixed(2) : 0;

  // 6. Configure Chart.js data
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Apport de départ (initial)',
        data: cumulativeStartApport,
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Apport actuel (restant)',
        data: cumulativeCurrentApport,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.4,
      }
    ]
  };

  // 7. Configure Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatAsCurrency(value);
          }
        },
        title: {
          display: true,
          text: "Montant total de l'apport (DZD)"
        }
      },
      x: {
        title: {
          display: true,
          text: ` Temps d'enregistrement du client (${granularity})`
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatAsCurrency(context.parsed.y);
            }
            return label;
          },
          afterBody: function(context) {
            const index = context[0].dataIndex;
            return [
              `Customers in period: ${customerCounts[index]}`,
              `Cumulative customers: ${cumulativeCustomers[index]}`
            ];
          }
        }
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Évolution de l'apport : Initial vs Restant (vue pa ${granularity})`,
        font: {
          size: 16,
        }
      },
    }
  };

  // 8. Render stats panel and chart
  return (
    <div className="space-y-6">
      {/* Apport Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Apport initial total</div>
          <div className="text-xl font-bold text-orange-600">{formatAsCurrency(totalStartApport)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500"> Apport restant actuel</div>
          <div className="text-xl font-bold text-blue-600">{formatAsCurrency(totalCurrentApport)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Total des clients</div>
          <div className="text-xl font-bold text-emerald-600">{totalCustomers}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Progression du paiement</div>
          <div className="text-xl font-bold text-purple-600">{paymentProgress}%</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200" 
           style={{ height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}