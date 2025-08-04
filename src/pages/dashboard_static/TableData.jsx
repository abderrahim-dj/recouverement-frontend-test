import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import ModalCard from '../../components/UI/ModalCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import { useNavigate } from 'react-router-dom';

//functin to get the related data for the user
import filterCustomers from '../../services/filterCustomers';
import { Typography, Box, IconButton, Menu, MenuItem } from '@mui/joy';
import menuAnchorEl from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';


import FormEditCustomer from './FormEditCustomer';
import CustomerDetails from './CustomerDetails';
import deleteCustomer from '../../services/deleteCustomer';


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


export default function TableCollectedFromClientAll(){


  const isMobile = useIsMobile();

  const navigate = useNavigate();

  //get the data form the FormFilterCustomers
  const isSuperUser = localStorage.getItem('is_superuser') === 'true';
  const isStaff = localStorage.getItem('is_staff') === 'true';
  const isActive = localStorage.getItem('is_active') === 'true';
  



  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  

  const [showMessage, setShowMessageModal] = useState(false);
  const [messageModalIcon, setMessageModalIcon] = useState();
  const [messageModalTitle, setMessageModalTitle] = useState();
  const [messageModalColor, setMessageModalColor] = useState();
  



  //some state to make the table dynamic
  const [data, setData] = useState([]);
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
      const response = await filterCustomers({
        pageIndex: apiPageNumber,
        pageSize,
        searchName: filterSearch, 
        setShowModal:setShowMessageModal
      });



      // // i add this now
      // useEffect(() => {
      //   const fetchData = async () => {
      //     const data = await filterUserCollectedMoney({
      //       pageIndex: apiPageNumber,
      //       pageSize,
      //       searchName: filterSearch,
      //       user_id: localStorage.getItem('user_id'),
      //       hide_amount_equal_zero: 'True', 
      //     });

      //   }

      //   const response = fetchData();
      // }, [hideEqualZero])




      setData(response.results || []);
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









// Handle closing the menu
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  // Handle edit action
  const handleEditAction = () => {
  // Check if the customer is active
  if (activeRow && activeRow.is_validated) {
    // Show notification modal that client is active
    setMessageModalTitle('Modification impossible : le client est validé, vous ne pouvez pas effectuer cette action');
    setMessageModalIcon(<InfoOutlinedIcon fontSize='large'/>);
    setMessageModalColor('neutral');
    setShowMessageModal(true);
    
    // Close menu and reset activeRow
    handleCloseMenu();
    setActiveRow(null);
  } else {
    // Proceed with normal edit if customer is not active
    setShowEditModal(true);
    handleCloseMenu();
  }
  };

  const handlePaymentAction = (customer) => {

      if (activeRow && activeRow.is_validated) {
    // Show notification modal that client is active
    setMessageModalTitle('Paiement impossible : le client est validé, vous ne pouvez pas effectuer cette action.');
    setMessageModalIcon(<InfoOutlinedIcon fontSize='large'/>);
    setMessageModalColor('neutral');
    setShowMessageModal(true);
    
    // Close menu and reset activeRow
    handleCloseMenu();
    setActiveRow(null);
    }else{
      navigate(`/pay?id=${customer.customer_id}&name=${customer.customer_firstname} ${customer.customer_lastname} | ${customer.customer_id}`);
      handleCloseMenu();
    }
  }

  const handleInfoAction = () => {
    setShowInfoModal(true);
    handleCloseMenu();
  };

  // Handle successful form submission
  const handleFormSubmitSuccess = (updatedCustomer) => {
    console.log("Form submitted successfully:", updatedCustomer);
    // Here you would update your data state with the updated customer information
    // For example, you could map through the data and update the specific customer
    
    // Reset active row after successful submission
    // Update the local data state with the updated customer
    setData(prevData => prevData.map(customer => 
      customer.customer_id === updatedCustomer.customer_id 
        ? { ...customer, ...updatedCustomer } 
        : customer
    ));
    
    // Close the modal and reset active row
    setShowEditModal(false);
    setActiveRow(null);

    // show success message modal
    setMessageModalTitle('Modification du client réussie');
    setMessageModalIcon(<CheckCircleOutlinedIcon fontSize='large'/>);
    setMessageModalColor('success');
    setShowMessageModal(true);
  };

  // Handle failed form submission
  const handleFormSubmitFailed = () => {
    // Close the modal and reset active row
    setShowEditModal(false);
    setActiveRow(null);

    // show success message modal
    setMessageModalTitle('Modification du client a échoué');
    setMessageModalIcon(<ReportOutlinedIcon  fontSize='large'/>);
    setMessageModalColor('danger');
    setShowMessageModal(true);
  
  }










  const columns = useMemo(
    () => [
      {
        accessorKey: 'customer_id',
        header: "ID",
        size: 150,
      },
      {
        accessorKey: 'customer_firstname',
        header: 'Nom',
        size: 150,
      },{
        accessorKey: 'customer_lastname',
        header: 'Prenom',
        size: 150,
      },
      {
        accessorKey: 'customer_mobile',
        header: 'Numero de téléphone',
        size: 200,
      },
      {
        accessorKey: 'customer_email',
        header: 'Email',
        size: 200,
      },
      {
        accessorKey: 'customer_service_name',
        header: 'Service',
        size: 200,
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 80,
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
    data: data,
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
      <Box sx={{ width: isMobile ? '95%' : '85vw'}}>

        <MaterialReactTable table={table} />
      </Box>



      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          //viewCustomerDetails(activeRow, data);
          handleInfoAction()
        }}>
          Voir
        </MenuItem>

        {(isActive || isStaff) && !isSuperUser && (
          <>
            <MenuItem onClick={() => {
              //viewCustomerDetails(activeRow, data);
              handlePaymentAction(activeRow)
            }}>
              Payer
            </MenuItem>
            
            
              <Box>
                <MenuItem onClick={handleEditAction}>
                Modifier
                </MenuItem>
                
                
                {/* this is for deleting the customer is comment */}
                {/* <MenuItem onClick={() => {
                  deleteCustomer(activeRow, data, setData);
                  handleCloseMenu();
                }}>
                  Supprimer
                </MenuItem> */}
              </Box>
          
          </>
        )}

        
      </Menu>
      



      {activeRow && showEditModal && !activeRow.is_validated  && (
        <FormEditCustomer
          color="white"
          title="Modifier les données du client"
          icon={<BorderColorOutlinedIcon fontSize='large'/>}
          showModal={showEditModal}
          activeRow={activeRow}
          data={data}
          setShowModal={(value) => {
            setShowEditModal(value);
            if (!value) {
              // Only reset activeRow when explicitly closing
              setActiveRow(null);
            }
          }}
          onSubmitSuccess={handleFormSubmitSuccess}
          onSubmitFailed={handleFormSubmitFailed}
        />
      )}

      {activeRow && showInfoModal && (
        <CustomerDetails
          showModal={showInfoModal}
          setShowModal={setShowInfoModal}
          data={activeRow}
        />
      )}


      
      <ModalCard
        showModal={showMessage}
        setShowModal={setShowMessageModal}
        icon={messageModalIcon}
        color={messageModalColor}
        title={messageModalTitle}
      />
    </>
  );
}