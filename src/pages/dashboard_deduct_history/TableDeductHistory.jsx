import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Typography, Box } from '@mui/joy';


//functin to get the related data for the user
import filterHistoryDeductMoney from '../../services/filterHistoryDeductMoney';


import ModalCard from '../../components/UI/ModalCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { set } from 'react-hook-form';

import useIsMobile from '../../hooks/useIsMobile';


export default function DashboardDeductHistory() {

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

  const [showModal, setShowModal] = useState(false);

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
      const response = await filterHistoryDeductMoney(
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
        accessorKey: 'user_full_name',
        header: "Nom complet",
        size: 'auto',
      },
      {
        accessorKey: 'amount',
        header: 'Montant',
        size: 'auto',
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 'auto',
        Cell: ({cell}) => {
          const value = cell.getValue() || '';
            // Normalize line breaks and split into lines
            const lines = value.replace(/\r\n/g, '\n').split('\n');
            return (
              <div
                style={{
                  maxHeight: '5rem', // adjust as needed
                  overflowY: 'auto',
                  overflowX: 'auto',
                  maxWidth:'20vw',
                  //background: '#f7f7f7',
                  //border: '1px solid #ddd',
                  //borderRadius: 4,
                  //padding: '0.5em',
                  whiteSpace: 'pre-line',
                  fontFamily: 'inherit',
                  fontSize: '1em',
                }}
                title={value}
              >
                {lines.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < lines.length - 1 && <br />}
                  </span>
                ))}
              </div>
            );
        }
      },
      {
        accessorKey: 'date',
        header: "Date",
        size: 'auto',
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
      <Box
        sx={{
          width: isMobile ? '95%' : '100%',
        }}
      >
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