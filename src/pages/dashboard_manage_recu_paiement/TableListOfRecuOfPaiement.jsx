import { useMemo, useEffect, useState, useCallback, useRef, use } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';

import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import Button from '@mui/material/Button';
import getPDFForPreview from '../../services/getPDFForPreview';


import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

//functin to get the related data for the user
import { Typography, Box } from '@mui/joy';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import getListOfServicesCreated from '../../services/getListOfServicesCreated'




import ModalCard from '../../components/UI/ModalCard';


import useIsMobile from '../../hooks/useIsMobile';


import getListOfCampaniesRecuOfPayment from '../../services/getListOfCampaniesRecuOfPayment ';


import FormEditRecuOfPaiement from './FormEditRecuOfPaiement';


export default function TableLListOfRecuOfPaiement(){


  const isMobile = useIsMobile();

  //some state to make the table dynamic
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');



  // for showing the loading screen when waiting to see the PDF
  const [loadingPDF, setLoadingPDF] = useState(false);



  //state for the modal to select the user data 
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  
  //state for the modal the selected user data for the change service name
  const [showChangeServiceNameModal, setShowChangeServiceNameModal] = useState(false); 
  
  //state for the modal the selected user data for the change first and last name
  const [showAddNewServiceModal, setShowAddNewServiceModal] = useState(false); 
  

  const [showModal, setShowModal] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  
  // ref To track the previous search term
  const prevSearchRef = useRef('');










  // useEffect to log the filtering search
  useEffect(()=> {
    console.log('filtering: ', globalFilter);
    
  }, [globalFilter])



  // useEffect to fetch the data form the API
  const fetchData = useCallback(async () => {
      

    
    try {
      setIsLoading(true);

      //call the API to updata the filter History
      const response = await getListOfCampaniesRecuOfPayment(
        setShowModal
      );

      setData(response || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      
    }
    finally {
      setIsLoading(false)
    }
  },[] ) 
  

  
  useEffect(() => {
    if (isLoading) return; // Prevent fetching if already loading
    
    fetchData();
  }, []);



  // Add this function before the return statement
  const handleEditCompany = (companyData) => {
    console.log('Edit company:', companyData);
    setSelectedCompanyData(companyData);
    // You can implement your edit functionality here
    // For example, open a modal with company data for editing
  };




  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: "Nom de la compagnie",
        size: 150,
      },
      {
        accessorKey: 'created_recu',
        header: 'Créé',
        size: 200,
        Cell: ({ cell }) => cell.getValue() ? <CheckCircleIcon color='success'/> : <CancelIcon color='error'/>,
      },
      {
        accessorKey: 'phone',
        header: 'Téléphone',
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 200,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        accessorKey: 'RC',
        header: 'RC',
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 100,
        Cell: ({ row }) => {
          const [anchorEl, setAnchorEl] = useState(null);

          const handleMenuOpen = (event) => {
            setAnchorEl(event.currentTarget);
          };

          const handleMenuClose = () => {
            setAnchorEl(null);
          };

          const handleEdit = () => {
            
            handleEditCompany(row.original);
            handleMenuClose();
          };

          const handleView = async () => {

            setLoadingPDF(true); // Show loading screen while fetching PDF
            handleMenuClose(); // Close the menu after viewing
            try {
              // Implement your view logic here
              console.log('View company:', row.original);
              const response = await getPDFForPreview(row.original.id)
              
              response && window.open(response, '_blank');

            } catch (error) {
              console.error('Error fetching PDF:', error);
            } finally {
              setLoadingPDF(false); // Hide loading screen after fetching PDF
            }


            
          };

          return (
            <>
              <IconButton
                aria-label="more"
                aria-controls="actions-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="actions-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Modifier
                </MenuItem>

                {row.original.created_recu && (
                  <MenuItem onClick={handleView}>
                    <LibraryAddOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    Voir
                  </MenuItem>
                )}
              </Menu>
            </>
          );
        },
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
    manualPagination: false, 
    manualFiltering: false,
    paginationDisplayMode:'pages',
    muiTableContainerProps: {
      sx:{ height: 'auto', maxHeight: '40rem', overflowY:'auto'},
    },
    enableStickyHeader:true,
    //manualFiltering:true,
    onGlobalFilterChange:setGlobalFilter,

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

      {/* to show a loading screen when waiting to see the PDF */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingPDF}
      >
        <CircularProgress color="inherit" />
      </Backdrop>





      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Box sx={{
          width: isMobile ? '95%' : '100%',
        }}>
          <Button
            variant="contained"
            startIcon={<LibraryAddOutlinedIcon />}
            sx={{
              width: 'fit-content', 
              textTransform: 'none', 
              background: '#f44336',
              marginBottom: 2,
              placeSelf: 'start',
              marginLeft:  isMobile ? '0' : '2rem',
            }}
            onClick={() => setShowCreateModal(true)}
          >Ajouter un nouveau reçu de paiement</Button>

          <MaterialReactTable table={table} />
        </Box>
      </Box>


      <ModalCard
        showModal={showModal}
        setShowModal={setShowModal}
        color={'danger'}
        title={'Impossible de récupérer les données'}
      />



      <Dialog
        open={selectedCompanyData !== null}
        onClose={() => setSelectedCompanyData(null)}
        fullWidth
        maxWidth="md"

        PaperProps={{
          sx: {
            borderRadius: '8px',
            overflowY: 'visible'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', marginY: 2, textAlign: 'center', fontSize: '1.5rem' }}>
          Modifier les informations de la compagnie
         <IconButton
      aria-label="close"
      onClick={() => setSelectedCompanyData(null)}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
       
        </DialogTitle>
        <DialogContent sx={{
            overflowY: 'auto',
            maxHeight: '80vh',
           }}>  
          {selectedCompanyData && (
            <FormEditRecuOfPaiement
              isEdit={true}
              companyData={selectedCompanyData}
              onSuccess={(updatedData) => {
                fetchData(); // Refresh the data after successful edit
                setSelectedCompanyData(null); // Clear the selected company data
              }}
              onCancel={() => setSelectedCompanyData(null)}
            />
          )}
        </DialogContent>
      </Dialog>




      <Dialog
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '8px',
            overflowY: 'visible'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', marginTop: 8, textAlign: 'center', fontSize: '1.5rem' }}>
          Créer un nouveau reçu de paiement
          <IconButton
            aria-label="close"
            onClick={() => setShowCreateModal(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{
          overflowY: 'auto',
          maxHeight: '80vh',
        }}>  
          <FormEditRecuOfPaiement
            isEdit={false}
            companyData={{}} // Empty object for a new company
            onSuccess={(createdData) => {
              fetchData(); // Refresh the data after successful creation
              setShowCreateModal(false); // Close the modal
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>






      

    </>
  );
}