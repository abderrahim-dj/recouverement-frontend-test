import { parseISO, format, differenceInDays, differenceInMonths } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

export default function ChartApportPayed({ data }) {
  // Basic check for data availability
  if (!data || data.length === 0) {
    return <div>Chargement des données de paiement ou aucune donnée disponible...</div>;
  }

  // 1. Flatten all history entries from all customers
  const allHistories = data.flatMap(customer => customer.histories || [])
    .map(h => ({
      date: parseISO(h.date_of_payment),
      amount: parsePrice(h.total_payment)
    }))
    // Filter out entries with invalid dates or zero/invalid amounts
    .filter(h => h.date instanceof Date && !isNaN(h.date) && h.amount > 0)
    // Sort history entries chronologically
    .sort((a, b) => a.date - b.date);

  // If no valid payment history entries found, display a message
  if (allHistories.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-lg">Aucune donnée d'historique de paiements disponible.</p>
        <p className="text-sm text-gray-500 mt-2">Vérifiez si les dossiers du client contiennent un historique de paiements.</p>
      </div>
    );
  }

  // 2. Determine the time range and granularity for dates
  const minDate = allHistories[0].date;
  const maxDate = allHistories[allHistories.length - 1].date;

  // Calculate the difference in days and months
  const diffDays = differenceInDays(maxDate, minDate);
  const diffMonths = differenceInMonths(maxDate, minDate);

  let granularity = 'Quotidien';
  let dateFormat = 'yyyy-MM-dd'; 

  // Adjust granularity based on the time range
  if (diffMonths > 12) {
    granularity = 'Annuel';
    dateFormat = 'yyyy';
  } else if (diffDays > 30) {
    granularity = 'Mensuel';
    dateFormat = 'yyyy-MM';
  }

  // 3. Aggregate payment amounts based on the determined granularity
  const aggregatedData = allHistories.reduce((acc, history) => {
    const key = format(history.date, dateFormat);
    acc[key] = (acc[key] || 0) + history.amount;
    return acc;
  }, {});

  // 4. Prepare dates and sums as chart data
  const dates = Object.keys(aggregatedData).sort();
  const sums = dates.map(date => aggregatedData[date]);

  // Calculate running total
  let runningTotal = 0;
  const cumulativeSums = sums.map(sum => {
    runningTotal += sum;
    return runningTotal;
  });

  // 5. Display stats about the data
  const totalPayments = runningTotal;
  const averagePerPeriod = totalPayments / dates.length;
  const maxPaymentPeriod = Math.max(...sums);
  const minPaymentPeriod = Math.min(...sums);

  // 6. Configure Chart.js data
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Paiements de la période',
        data: sums,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Total cumulé',
        data: cumulativeSums,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
          // Format y-axis ticks as currency
          callback: function(value) {
            return formatAsCurrency(value);
          }
        },
        title: {
          display: true,
          text: 'Montant (DZD)'
        }
      },
      x: {
        title: {
          display: true,
          text: `Temps (${granularity})`
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
          }
        }
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Vue de l'évolution des paiements des clients (${granularity})`,
        font: {
          size: 16,
        }
      },
    }
  };

  // 8. Render stats panel and chart
  return (
    <div className="space-y-6">
      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Total des paiements</div>
          <div className="text-xl font-bold text-blue-600">{formatAsCurrency(totalPayments)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Moyenne par période {granularity}</div>
          <div className="text-xl font-bold text-green-600">{formatAsCurrency(averagePerPeriod)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Période la plus élevée {granularity}</div>
          <div className="text-xl font-bold text-amber-600">{formatAsCurrency(maxPaymentPeriod)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="text-sm text-gray-500">Période la plus basse {granularity}</div>
          <div className="text-xl font-bold text-red-600">{formatAsCurrency(minPaymentPeriod)}</div>
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