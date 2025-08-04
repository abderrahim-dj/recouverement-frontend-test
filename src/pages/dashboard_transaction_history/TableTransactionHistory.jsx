import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';


//functin to get the related data for the user
import filterHistorySendingMoney from '../../services/filterHistorySendingMoney';
import { Typography, Box } from '@mui/joy';

import ModalCard from '../../components/UI/ModalCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import useIsMobile from '../../hooks/useIsMobile';
import { Co2Sharp } from '@mui/icons-material';

// Example data
const data = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    state: 'Nebraska',
  },
];

export default function TableTransactionHistory(){

  const isMobile = useIsMobile();

  const [showModal, setShowModal] = useState(false);


  //some state to make the table dynamic
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // ref To track the previous search term
  const prevSearchRef = useRef('');










  // useEffect to log the filtering search
  useEffect(()=> {
    console.log('filtering: ', globalFilter);
    
  }, [globalFilter])



  // useEffect to fetch the data form the API
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
          pageIndex:0
        }))
      }

      //call the API to updata the filter History
      const response = await filterHistorySendingMoney({
        pageIndex: apiPageNumber,
        pageSize,
        searchName: filterSearch,
        setShowModal
      });




      setUserData(response.results || []);
      setRowCount(response.count || 0);
      prevSearchRef.current = filterSearch;

    } catch (error) {
      console.error('Error fetcing data:', error);
      
    }
    finally {
      setIsLoading(false)
    }
  },[] ) 
  



  //fetch data when the pagination or filter changes
  
  /* 
  // useEffect to reset pagination when globalFilter changes
  useEffect(() => {
    if (prevGlobalFilterForPaginationResetRef.current !== globalFilter) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
      prevGlobalFilterForPaginationResetRef.current = globalFilter;
    }
  }, [globalFilter]);
  
 */  
  
  useEffect(() => {
    if (isLoading) return; // Prevent fetching if already loading
    
    fetchData(pagination.pageIndex, pagination.pageSize, globalFilter || '');
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, fetchData]);



  const columns = useMemo(
    () => [
      {
        accessorKey: 'transaction_sender',
        header: "Nom de l’envoyeur",
        size: 150,
      },
      {
        accessorKey: 'transaction_receiver',
        header: 'Nom du destinataire',
        size: 150,
      },
      {
        accessorKey: 'transaction_amount',
        header: 'Montant',
        size: 200,
      },
      {
        accessorKey: 'transaction_status',
        header: 'Statut',
        size: 150,
        Cell : ({cell}) => {
          if (cell.getValue() === 'En attente') {
            return <Typography style={{ color: 'orange', fontWeight: 'bold' }}>{cell.getValue()}</Typography>;
          }

          if (cell.getValue() === 'Acceptée') {
            return <Typography style={{ color: 'green', fontWeight: 'bold' }}>{cell.getValue()}</Typography>;
          }

          if (cell.getValue() === 'Refusée') {
            return <Typography style={{ color: 'red', fontWeight: 'bold' }}>{cell.getValue()}</Typography>;
          }
        }
      },
      {
        accessorKey: 'transaction_date_send',
        header: "Date d'envoi",
        size: 150,
      },
      {
        accessorKey: 'transaction_date_action',
        header: "Date de l'action",
        size: 150,
        Cell: ({cell}) => {
          const value = cell.getValue();
          return value && value.trim() !== '' ? value : 'N/A'
        }
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: userData,
    enableRowVirtualization:false,
    enableColumnVirtualization:false,
    enableGlobalFilter:true,
    enableColumnFilters:false,
    enableColumnOrdering:false,
    enablePagination:true,
    enableBottomToolbar:true,
    manualPagination: true, // Add this line
    manualFiltering: true,
    paginationDisplayMode:'pages',
    muiTableContainerProps: {
      sx:{ height: 'auto', maxHeight: '40rem', overflowY:'auto'},
    },
    enableStickyHeader:true,
    //manualFiltering:true,
    rowCount:rowCount,
    onGlobalFilterChange:setGlobalFilter,
    onPaginationChange: (newPagination) => {
      console.log('⚡ onPaginationChange called with:', newPagination);
      console.log('Previous pagination:', pagination);
      setPagination(newPagination);
    },
    globalFilterFn: 'contains',
    muiPaginationProps: {
      color:'primary',
      shape: 'rounded',
      variant:'outlined'
    },
    density: "compact",
    enableDensityToggle: true,
    initialState: {
      density: "compact",
    },
    /* 
    initialState: {
      globalFilter,
      pagination,
      isLoading: isLoading
    },
     */
    state: {
      globalFilter,
      pagination,
      isLoading: isLoading
    },
    muiSkeletonProps: {
      animation: 'wave',
      height: 30,
      sx : { transform: 'scale(1)', my:1}
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
          backgroundColor: '#ffcdd2',
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
      <Box sx={{width: isMobile ? '95%' : '100%',}}>
        <MaterialReactTable table={table} />
      </Box>
    </Box>
      <ModalCard
        showModal={showModal}
        setShowModal={setShowModal}
        color={'danger'}
        title={'Impossible de récupérer les données'}
      />
    </>
  );
}