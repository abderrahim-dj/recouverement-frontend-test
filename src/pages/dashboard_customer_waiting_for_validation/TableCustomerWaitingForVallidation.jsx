import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';


import ModalCard from '../../components/UI/ModalCard';
import CustomerDetails from '../dashboard_static/CustomerDetails';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';



//functin to get the related data for the user
import getListOfCustomerWaitingForVallidation from '../../services/getListOfCustomerWaitingForVallidation';
import { Typography } from '@mui/joy';



//function to validate the customer
import actionValidationCustomer from '../../services/actionValidationCustomer';
import { set } from 'date-fns';



import useIsMobile from '../../hooks/useIsMobile';

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

export default function TableCustomerWaitingForValidation(){


  const isMobile = useIsMobile();



  //some state to make the table dynamic
  const [customersData, setCustomersData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });





  //state fo the modal
  const [messageModalTitle, setMessageModalTitle] = useState();
  const [showMessage, setShowMessageModal] = useState(false);
  const [messageModalIcon, setMessageModalIcon] = useState();
  const [messageModalColor, setMessageModalColor] = useState();



  //state for the action menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  //function to handle the menu opening and closing
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

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
      const response = await getListOfCustomerWaitingForVallidation({
        pageIndex: apiPageNumber,
        pageSize,
        searchQuery: filterSearch,
        setShowModal: setShowMessageModal,
        setMessageModalTitle: setMessageModalTitle,
        setMessageModalColor: setMessageModalColor,

      });




      setCustomersData(response.results || []);
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







  //function to handle the view detail action 
  const handleInfoAction = () => {
    setActiveRow(activeRow)
    setShowInfoModal(true);
    handleCloseMenu();
  };



  //function to handle the validation customer
  const handleValidateAction = async (row) => {
    try{
      const response = await actionValidationCustomer(row.customer_id);
      console.log('response from validation', response);

      // if the response is successful, i will show the message of success in the modal
      if (response) {
        setMessageModalTitle('Validation réussie');
        setMessageModalIcon(<CheckCircleOutlineOutlinedIcon fontSize='large'/>);
        setMessageModalColor('success');
        setShowMessageModal(true);


        // remove the customer from the list cause he is validated now and it will be in the list of validated customers
        setCustomersData((prevData) => prevData.filter((item) => item.customer_id !== row.customer_id));
        setRowCount((prevCount) => prevCount - 1);
        

      }

    }catch(err){
      console.error('Error validating customer', err);

      setMessageModalTitle('Erreur de validation');
      setMessageModalIcon(<CancelOutlinedIcon fontSize='large'/>);
      setMessageModalColor('danger');
      setShowMessageModal(true);


    } finally {
      handleCloseMenu();
    }
  }




  const columns = useMemo(
    () => [
      {
        accessorKey: 'customer_id',
        header: "ID de Client",
        size: 150,
      },
      {
        accessorKey: 'customer_firstname',
        header: "Nom de Client",
        size: 150,
      },
      {
        accessorKey: 'customer_lastname',
        header: "Prenom de Client",
        size: 150,
      },
      {
        accessorKey: 'customer_ready_for_validation_date',
        header: 'En attente de validation depuis',
        size: 250,
      },
      {
        id: 'actions',
        header: 'Action',
        size: 50,
        Cell: ({ row }) => (
          <IconButton
            aria-label="actions"
            onClick={(e) => {
              setMenuAnchorEl(e.currentTarget);
              setActiveRow(row.original);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: customersData,
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
    /* 
    initialState: {
      globalFilter,
      pagination,
      isLoading: isLoading
    },
     */

    density: "compact",
    enableDensityToggle: true,

    initialState: {
      density: "compact",
    },

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
        <Box sx={{width: isMobile ? '95%' : '100%'}}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >


        <MenuItem onClick={() => {
          //Implement view detail logic
          handleInfoAction();

        }}>
          Voir détail
        </MenuItem>


        {/* <MenuItem onClick={() => {
          // TODO: Implement view transaction details logic maybe if i have some time i will think about it
          handleCloseMenu();
        }}>
          Voir transaction
        </MenuItem> */}
        <MenuItem onClick={() => {
          // TODO: Implement validate logic
          handleValidateAction(activeRow)
          
        }}>
          Valider
        </MenuItem>
      </Menu>


      {activeRow && showInfoModal && (
        <CustomerDetails
          showModal={showInfoModal}
          setShowModal={setShowInfoModal}
          data={activeRow}
        />
      )}
        


      <ModalCard
        title={messageModalTitle}
        showModal={showMessage}
        setShowModal={setShowMessageModal}
        icon={messageModalIcon}
        color={messageModalColor}
      />


    </>
  );
}