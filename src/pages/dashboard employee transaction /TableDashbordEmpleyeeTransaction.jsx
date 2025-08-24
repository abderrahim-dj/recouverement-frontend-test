import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';


//functin to get the related data for the user
import filterEmployeeTransaction from '../../services/filterEmployeeTransaction';
import { Typography } from '@mui/joy';

//functin to get the related data for the user
import filterHistoryDeductMoney from '../../services/filterHistoryDeductMoney';


import ModalCard from '../../components/UI/ModalCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box } from '@mui/material';


import useIsMobile from '../../hooks/useIsMobile';


export default function TableDashbordEmpleyeeTransaction(){
  
  
  const isMobile = useIsMobile(); 
  
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



  //state for the modal
  const [showModal, setShowModal] = useState(false)








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
      const response = await filterEmployeeTransaction(
        apiPageNumber,
        pageSize,
        filterSearch,
        setShowModal
      );




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
        header: "Nom evoyeur",
        size: 'auto',
      },
      {
        accessorKey: 'transaction_receiver',
        header: 'Nom receveur',
        size: 'auto',
      },
      {
        accessorKey: 'transaction_related_customer_full_name',
        header: 'Nom du client',
        size: 'auto',
      },
      {
        accessorKey: 'transaction_amount',
        header: 'Montant (DA)',
        size: 'auto',
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
        header: "Date d’envoi",
        size: 'auto',
      },
      {
        accessorKey: 'transaction_date_action',
        header: "Date d’action",
        size: 'auto',
        Cell: ({cell}) => {
          return (
            <Typography>
              {cell.getValue() ? cell.getValue() : 'N/A'}
            </Typography>
          );
        }
      },

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
      <Box sx={{
        width: isMobile ? '95%' : '100%',
      }}>
        <MaterialReactTable table={table}/>

      </Box>
    
    
    </Box>
      <ModalCard
        showModal={showModal}
        setShowModal={setShowModal}
        icon={<InfoOutlinedIcon fontSize='large'/>}
        color={'danger'}
        title={'Impossible de récupérer les données'}
      />
    </>
  );
}