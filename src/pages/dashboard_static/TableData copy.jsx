import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import filterCustomersByDate from '../../services/filterCustomersByDate';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';

import Typography from '@mui/material/Typography';

import { useNavigate } from 'react-router-dom';

//import function to delete the customer
import deleteCustomer from '../../services/deleteCustomer';

//import functin to get the customer and open the modal
import viewCustomerDetails from '../../utils/viewCustomerDetail';

//import function to open the modal to edit the customer data
import FormEditCustomer from './FormEditCustomer';


import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import ModalCard from '../../components/UI/ModalCard';


//the detail modal for the customer
import CustomerDetails from './CustomerDetails';

//the apport personnel chart
import ChartApportPayed from './ChartApportPayed';

//the evaluation of apport start 
import ChartApportNeedPayed from './ChartApportNeedPay';


export default function TableData({receivedData, waiting}) {
  
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const rowVirtualizerInstanceRef = useRef(null);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showEditModal, setShowEditModal] = useState(false);

  const [showInfoModal, setShowInfoModal] = useState(false);
  
  
  //message modal
  const [showMessage, setShowMessageModal] = useState(false);
  const [messageModalIcon, setMessageModalIcon] = useState();
  const [messageModalTitle, setMessageModalTitle] = useState();
  const [messageModalColor, setMessageModalColor] = useState();


  //get the data form the FormFilterCustomers
  const isSuperUser = localStorage.getItem('is_superuser') === 'true';
  const isStaff = localStorage.getItem('is_staff') === 'true';
  const isActive = localStorage.getItem('is_active') === 'true';
  
  useEffect(() => {
    if (receivedData) {
      setData(receivedData);
      console.log('receivedData all : ', receivedData);
    }
    setIsLoading(waiting);
  }, [receivedData, waiting]);

  // Fetch customers from last 30 days
  useEffect(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000)
      .toISOString()
      .split('T')[0];

    (async () => {
      try {
        const customers = await filterCustomersByDate({
          customer_create_date_after: thirtyDaysAgo,
          customer_create_date_before: '',
          customer_last_date_of_payment_after: '',
          customer_last_date_of_payment_before: '',
        });
        setData(customers);
        console.log('All customers data details :', customers);
      } catch (err) {
        console.error('Failed loading customers', err);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    })();
  }, []);

  // Handle closing the menu
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  // Handle edit action
  const handleEditAction = () => {
    setShowEditModal(true);
    handleCloseMenu();
  };

  const handlePaymentAction = (customer) => {
    navigate(`/pay?id=${customer.customer_id}&name=${customer.customer_firstname} ${customer.customer_lastname} | ${customer.customer_id}`);
    handleCloseMenu();
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
      { accessorKey: 'customer_id', header: 'ID', size: 80 },
      { accessorKey: 'customer_firstname', 
        header: 'Nom', 
        size: 150, 
        Cell: ({ cell }) => (
        <Typography fontWeight="bold">
          {cell.getValue()}
        </Typography>
      ), },
      { accessorKey: 'customer_lastname', 
        header: 'Prénom',
        size: 150,
        Cell: ({ cell }) => (
          <Typography fontWeight="bold">
            {cell.getValue()}
          </Typography>
        ),
      },
      //{ accessorKey: 'customer_wilaya', header: 'Wilaya', size: 150 },
      //{ accessorKey: 'customer_daira', header: 'Daira', size: 150 },
      //{ accessorKey: 'customer_commune', header: 'Commune', size: 150 },
      
      //the progress bar
      /*       
      {
        id: 'progress',
        header: 'Progress',
        accessorFn: (row) => {
          // calculate the percentage difference between start and current apport
          const start = row.customer_apport_personnel_start || 0;
          const current = row.customer_apport_personnel_current || 0;
          const diff = start - current;

          if (diff === 0) {
            return 0;
          }

          return start > 0 ? 100 * (diff / start) : 0;
        },
        Cell: ({ cell }) => {
          const pct = Math.round(cell.getValue()*1000)/1000;
          return (
            <LinearProgress
              variant="determinate"
              value={pct.toFixed(3)}
              sx={{
                width: '100%',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: pct === 100 ? '#00e676' : undefined,
                },
              }}
            />
          );
        },
        size: 50,
      },
      */

     { accessorKey: 'customer_frais_service', 
      header: 'Service',
      size: 150,
      Cell: ({ cell }) => (
        <Typography fontWeight="bold">
            {cell.getValue()} ({cell.row.original.customer_service_name	})
          </Typography>
        ),
      },
      { accessorKey: 'customer_apport_personnel', 
        header: 'Apport personnel',
        size: 150,
        Cell: ({ cell }) => (
          <Typography fontWeight="bold">
            {cell.getValue()}
          </Typography>
        ),
      },

      {
        accessorKey: 'customer_last_date_of_payment',
        header: 'Dernier paiement',
        Cell: ({ cell }) => cell.getValue() || '—',
      },
      {
        accessorKey: 'customer_create_date',
        header: "Date d'enregistrement",
        Cell: ({ cell }) => cell.getValue() || '—',
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
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: true,
    enableBottomToolbar: true,
    onPaginationChange: setPagination,
    state: { isLoading, sorting, pagination },
    onSortingChange: setSorting,
    rowVirtualizerInstanceRef,
    enableStickyHeader: true,
    density: "compact",
    enableDensityToggle: true,
    initialState: {
      density: "compact",
    },

    muiTableContainerProps: {
      sx: { height: 'auto', maxHeight: '40rem', overflowY: 'auto' },
    },
    muiPaperProps: { sx: { width: '100%', maxWidth: '100vw' } },
    muiTablePaginationProps: {
      rowsPerPageOptions: [10, 20, 50, 100],
      showFirstButton: true,
      showLastButton: true,
    },

    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        backgroundColor: 'rgba(173, 220, 255, 0.2)',
        fontSize: '1.2rem',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#171a1c',
        cursor: 'pointer',
        ":hover": {
          backgroundColor: 'rgba(173, 220, 255, 0.5)',
        },
      },
      // Wrap the header label in a Tooltip
      title: typeof column.columnDef.header === 'string' ? column.columnDef.header : undefined,
    }),
  });

  return (
    <>
      <Box sx={{ width: '84vw',overflowX: 'auto'}}>
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
                <MenuItem onClick={() => {
                  deleteCustomer(activeRow, data, setData);
                  handleCloseMenu();
                }}>
                  Supprimer
                </MenuItem>
              </Box>
          
          </>
        )}

        
      </Menu>

      {activeRow && showEditModal && (
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

      {/* Message Modal */}

      {/* 
      <Box className='flex flex-col gap-80 w-[90%] pb-[30rem]'>
        this was old version of chart where i was having the apport start and current

        <Box className='w-full h-56'>
          <ChartApportPayed data={data} />
        </Box>
        <Box>
          <ChartApportNeedPayed data={data}/>
        </Box>
        *

      </Box> 
      */}

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