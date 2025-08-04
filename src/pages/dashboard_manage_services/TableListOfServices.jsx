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


import Button from '@mui/material/Button';

//functin to get the related data for the user
import filterHistorySendingMoney from '../../services/filterHistorySendingMoney';
import { Typography, Box } from '@mui/joy';
import getListOfUsers from '../../services/getListOfUsers';


import getListOfServicesCreated from '../../services/getListOfServicesCreated'


//import the modal to change the service name
import ActionChangeServiceName from './ActionChangeServiceName';


//import the modal to add new service
import ActionAddNewService from './ActionAddNewService';


import ModalCard from '../../components/UI/ModalCard';


import useIsMobile from '../../hooks/useIsMobile';


export default function TableListOfServices(){


  const isMobile = useIsMobile();

  //some state to make the table dynamic
  const [servicesData, setServicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });




  //state for the modal to select the user data 
  const [selectedServiceData, setSelectedServiceData] = useState(null);
  
  //state for the modal the selected user data for the change service name
  const [showChangeServiceNameModal, setShowChangeServiceNameModal] = useState(false); 
  
  //state for the modal the selected user data for the change first and last name
  const [showAddNewServiceModal, setShowAddNewServiceModal] = useState(false); 
  

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
      const response = await getListOfServicesCreated(
        filterSearch, apiPageNumber, pageSize, setShowModal
      );




      setServicesData(response.results || []);
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



  //functin to handle update the service name
  const handleServiceNameUpdate = (updatedService) => {
    setServicesData((prev) =>
      prev.map((service) =>
        service.id === updatedService.id
          ? { ...service, ...updatedService }
          : service
      )
    );
  };


  //function to handle add new service after successfully created
  //this will add the new service to the existing list of services
  const handleServiceCreated = (newService) => {
    setServicesData((prev) => [
      ...prev,
      {
        id: newService.id,
        service_name: newService.service_name,
        created_by_full_name: newService.created_by_full_name,
        created_at: newService.created_at,
        last_updated: newService.last_updated,
        modefied_by_full_name: newService.modefied_by_full_name
      }
    ])

  }



  const columns = useMemo(
    () => [
      {
        accessorKey: 'service_name',
        header: "Nom de la service",
        size: 150,
      },
      {
        accessorKey: 'created_by_full_name',
        header: 'Créé par',
        size: 200,
      },
      {
        accessorKey: 'created_at',
        header: 'Date de création',
        size: 150,
      },
      {
        accessorKey: 'last_updated',
        header: '	Dernière mise à jour',
        size: 250,
        Cell : ({ cell }) => {
          return cell.getValue() 
          ? <Typography style={{fontWeight: 'bold' }}>{cell.getValue()}</Typography>
          : <Typography style={{fontWeight: 'bold' }}>N/A</Typography>;
        }
      },

      {
        accessorKey: 'modefied_by_full_name',
        header: 'Modifié par',
        size: 150,
        Cell: ({ cell }) => {
          return cell.getValue()
          ? <Typography style={{fontWeight: 'bold' }}>{cell.getValue()}</Typography>
          : <Typography style={{fontWeight: 'bold' }}>N/A</Typography>;
        }
      },
      
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 80,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const [anchorEl, setAnchorEl] = useState(null);
          const open = Boolean(anchorEl);

          const handleMenuOpen = (event) => {
            setAnchorEl(event.currentTarget);
          };

          const handleMenuClose = () => {
            setAnchorEl(null);
          };

          const handleChangeServiceName = () => {
            //set the selected user data to the state
            setSelectedServiceData(row.original);


            
            //set show modal to change password to true
            setShowChangeServiceNameModal(true);


            //handleChangePassword(row.original);
            handleMenuClose();
          };


          // maybe this function will be used later as for removing services 
          // const handleUsername = () => {

          //   //set the selected user data to the state
          //   setSelectedUserData(row.original);
            
          //   //set show modal to change username to true
          //   setShowChangeUsernamedModal(true);


          //   //handleChangeUsername(row.original);
          //   handleMenuClose();
          // };


          // Prevent any user from editing other superusers (except themselves)
          const isTargetSuperuser = localStorage.getItem("is_superuser");


          return (
            <>
              <IconButton
                aria-label="more"
                aria-controls={`menu-${row.id}`}
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>



              <Menu
                id={`menu-${row.id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
              >
              {isTargetSuperuser ? (
                  <>
                    <MenuItem onClick={handleChangeServiceName}>Changer le nom de la service</MenuItem>
                    {/* <MenuItem onClick={handleUsername}>Changer username</MenuItem> */}
                  </>
                ) : (
                  <MenuItem disabled>Accès refusé à l'action</MenuItem>
                )
              }
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
    data: servicesData,
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

          {/* button to create new service */}
          <Button
            variant="contained"
            
            sx={{ 
              backgroundColor: '#f44336',
              mb: 2,
              width: 'fit-content',
              alignSelf: 'flex-end',
              mr: 3,
              ml: isMobile ? 0 : '2rem',
              fontWeight: 'bold',
              textTransform: 'none'
            }}
            onClick={() => setShowAddNewServiceModal(true)}
          >
            <LibraryAddOutlinedIcon fontSize='medium' sx={{marginRight:2}}/>
            Nouveau service
          </Button>

          <MaterialReactTable table={table} />
        </Box>
      </Box>

      {showChangeServiceNameModal && (
        <>
        
        {console.log('selectedservicedata: ', selectedServiceData)}
        
        <ActionChangeServiceName 
          service={selectedServiceData}
          openModal={showChangeServiceNameModal}
          onClose={() => setShowChangeServiceNameModal(false)}
          onServiceNameUpdate={handleServiceNameUpdate}
        />
        </>
        
      )}

      {showAddNewServiceModal && (
        <ActionAddNewService
          openModal={showAddNewServiceModal}
          onClose={() => setShowAddNewServiceModal(false)}
          onServiceCreated={handleServiceCreated}
        />
      )}


      <ModalCard
        showModal={showModal}
        setShowModal={setShowModal}
        color={'danger'}
        title={'Impossible de récupérer les données'}
      />
    
    </>
  );
}