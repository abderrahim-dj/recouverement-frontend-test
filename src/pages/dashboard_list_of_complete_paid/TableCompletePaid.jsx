import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { 
  MaterialReactTable, 
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Typography, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import CustomerDetails from '../dashboard_static/CustomerDetails';
import ModalCard from '../../components/UI/ModalCard';

import useIsMobile from '../../hooks/useIsMobile';


export default function TableCompletePaid() {
  
  const isMobile = useIsMobile();
  
  // State for storing customer data
  const [customerData, setCustomerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  
  // ref To track the previous search term
  const prevSearchRef = useRef('');

  //states to select and open the customer details modal
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // useEffect to log the filtering search
  useEffect(() => {
    console.log('filtering: ', globalFilter);
  }, [globalFilter]);

  //function to fetch data from the server
  const fetchData = useCallback(async (pageIndex, pageSize, filterSearch) => {
    try {
      setIsLoading(true);

      //check if the search changed
      const searchChanged = prevSearchRef.current !== filterSearch;
      const pageNumber = searchChanged ? 0 : pageIndex;
      const apiPageNumber = pageNumber + 1;

      //update pagination state if search changed
      if (searchChanged) {
        setPagination(prev => ({
          ...prev,
          pageIndex: 0
        }));
      }

      //url
      const url = `${import.meta.env.VITE_BACKEND_URL}customers/complete-paying/?page=${apiPageNumber}&page_size=${pageSize}&search=${filterSearch}`;
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        setRowCount(data.count || 0);
        setCustomerData(data.results || []);
        prevSearchRef.current = filterSearch;
      } else {
        setShowModal(true);
        console.error('Error fetching data: Server responded with status', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return; // Prevent fetching if already loading
    fetchData(pagination.pageIndex, pagination.pageSize, globalFilter || '');
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, fetchData]);



  // Define columns for the table
  const columns = useMemo(() => [
    {
      accessorKey: 'customer_id',
      header: 'ID',
      size: 80,
    },
    {
      accessorFn: (row) => `${row.customer_firstname}`,
      id: 'Nom',
      header: 'Nom',
      size: 180,
      Cell: ({ cell }) => (
        <Typography fontWeight="bold">
          {cell.getValue()}
        </Typography>
      ),
    },
    {
      accessorFn: (row) => `${row.customer_lastname}`,
      id: 'Prenom',
      header: 'Prenom',
      size: 300,
      Cell: ({ cell }) => (
        <Typography fontWeight="bold">
          {cell.getValue()}
        </Typography>
      ),
    },
  /* 
    {
      accessorKey: 'customer_apport_personnel_start',
      header: 'Apport de départ',
      size: 150,
      Cell: ({ cell }) => (
        <Typography>{Number(cell.getValue()).toLocaleString()} DA</Typography>
      ),
    },
 */

    {
      accessorKey: 'customer_wilaya',
      header: 'Wilaya',
      size: 300,
    },
    {
      accessorKey: 'customer_create_date',
      header: 'Date d\'inscription',
      size: 300,
      Cell: ({ cell }) => {
        const date = cell.getValue() ? new Date(cell.getValue()) : null;
        return <Typography>{date ? date.toLocaleDateString('fr-FR') : '-'}</Typography>;
      },
    },
    {
      accessorKey: 'customer_last_date_of_payment',
      header: 'Dernier paiement',
      size: 300,
      Cell: ({ cell }) => {
        const date = cell.getValue() ? new Date(cell.getValue()) : null;
        return (
          <Typography 
            sx={{ 
              color: date ? 'green' : 'text.secondary',
              fontWeight: date ? 'bold' : 'normal'
            }}
          >
            {date ? date.toLocaleDateString('fr-FR') : 'Aucun paiement'}
          </Typography>
        );
      },
    },
/* old progress bar i don't need it anymore
    {
      accessorFn: (row) => {
        const totalStart = Number(row.customer_apport_personnel_start) + 
                          Number(row.customer_ramassage_start) + 
                          Number(row.customer_service_start) + 
                          Number(row.customer_livraison_start);
        
        const totalCurrent = Number(row.customer_apport_personnel_current) + 
                            Number(row.customer_ramassage_current) + 
                            Number(row.customer_service_current) + 
                            Number(row.customer_livraison_current);
        
        // Calculate percentage paid
        const percentPaid = totalStart > 0 ? ((totalStart - totalCurrent) / totalStart) * 100 : 0;
        
        return percentPaid.toFixed(0);
      },
      id: 'percentPaid',
      header: 'Progrès',
      size: 120,
      Cell: ({ cell }) => {
        const percent = Number(cell.getValue());
        return (
          <Box sx={{ position: 'relative', width: '100%', height: '20px', bgcolor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
            <Box sx={{ 
              position: 'absolute', 
              height: '100%', 
              width: `${percent}%`, 
              bgcolor: percent >= 80 ? 'green' : percent >= 50 ? 'orange' : '#f44336',
              transition: 'width 0.3s ease'
            }} />
            <Typography 
              sx={{ 
                position: 'absolute', 
                width: '100%', 
                textAlign: 'center', 
                color: percent > 50 ? 'white' : 'black',
                lineHeight: '20px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              {percent}%
            </Typography>
          </Box>
        );
      },
    },
     */
    {
      id: 'actions',
      header: 'Actions',
      size: 200,
      enableColumnFilter: false,
      enableSorting: false, // Actions don't need sorting
      muiTableHeadCellProps: {
        align: 'center',
      },
      muiTableBodyCellProps: {
        align: 'center',
      },
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setSelectedCustomer(row.original);
            setShowCustomerDetails(true);
          }}
          startIcon={<InfoOutlinedIcon />}
          sx={{ 
            fontSize: '0.75rem',
            whiteSpace: 'nowrap'
          }}
        >
          Détails
        </Button>
      ),
    }
  ], []);
  
  // Configure the table
  const table = useMaterialReactTable({
    columns,
    data: customerData,

    enableRowVirtualization: true,
    enableColumnVirtualization:true,

    enableGlobalFilter: true,
    enableColumnFilters: false,
    enableColumnOrdering: false,
    // Enable pagination
    enablePagination: true,
    enableBottomToolbar:true,
    paginationDisplayMode: 'pages',
    muiTableContainerProps: {
      sx: { height: 'auto', maxHeight: '40rem', overflowY: 'auto' },
    },
    enableStickyHeader: true,

    manualFiltering: true,
    manualPagination: true,

    //set total row count from the server
    rowCount: rowCount,

    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: 'contains',
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      variant: 'outlined',
    },
    density: "compact",
    enableDensityToggle: true,

    // Default initial pagination state
    initialState: {
      density: "compact",
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
    state: {
      globalFilter,
      pagination,
      isLoading: isLoading,
    },

    // Configure skeleton display
    muiSkeletonProps: {
      animation: "wave",
      height: 40,
      sx: { 
        transform: 'scale(1)', // Removes default scaling down
        my: 1 
      }
  },

  muiTableHeadCellProps: ({ column }) => ({
    sx: {
      backgroundColor: '#ffebee',
      fontSize: '1.2rem',
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#171a1c',
      cursor: 'pointer',
      ":hover": {
        backgroundColor: '#171a1c',
      },
    },
    // Wrap the header label in a Tooltip
    title: typeof column.columnDef.header === 'string' ? column.columnDef.header : undefined,
  }),

  });

  return (

    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Box sx={{
          width: isMobile ? '95%' : '100%',
        }}>
          <MaterialReactTable table={table}/>

        </Box>

        {showCustomerDetails && (
          <CustomerDetails 
            showModal={showCustomerDetails}
            setShowModal={setShowCustomerDetails}
            data={selectedCustomer}
          />
        )}



      </Box>
    

      <ModalCard
        showModal={showModal}
        setShowModal={setShowModal}
        color={'danger'}
        title={'Impossible de récupérer les données'}
      />
    </>
  )
}