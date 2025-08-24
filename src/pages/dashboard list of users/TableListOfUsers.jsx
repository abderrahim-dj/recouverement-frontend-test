import { useMemo, useEffect, useState, useCallback, useRef, use } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip';

//functin to get the related data for the user
import filterHistorySendingMoney from '../../services/filterHistorySendingMoney';
import { Typography, Box } from '@mui/joy';
import getListOfUsers from '../../services/getListOfUsers';


// components to handle the action of changing the password
import ActionChangePassword from './ActionChangePassword';

// components to handle the action of changing the username (first and last name)
import ActionChangeUsername from './ActionChangeUsername';


import ModalCard from '../../components/UI/ModalCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


import useIsMobile from '../../hooks/useIsMobile';

// Example data
// const data = [
//   {
//     name: {
//       firstName: 'John',
//       lastName: 'Doe',
//     },
//     address: '261 Erdman Ford',
//     city: 'East Daphne',
//     state: 'Kentucky',
//   },
//   {
//     name: {
//       firstName: 'Jane',
//       lastName: 'Doe',
//     },
//     address: '769 Dominic Grove',
//     city: 'Columbus',
//     state: 'Ohio',
//   },
//   {
//     name: {
//       firstName: 'Joe',
//       lastName: 'Doe',
//     },
//     address: '566 Brakus Inlet',
//     city: 'South Linda',
//     state: 'West Virginia',
//   },
//   {
//     name: {
//       firstName: 'Kevin',
//       lastName: 'Vandy',
//     },
//     address: '722 Emie Stream',
//     city: 'Lincoln',
//     state: 'Nebraska',
//   },
//   {
//     name: {
//       firstName: 'Joshua',
//       lastName: 'Rolluffs',
//     },
//     address: '32188 Larkin Turnpike',
//     city: 'Omaha',
//     state: 'Nebraska',
//   },
// ];

export default function TableListOfUsers(){


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




  //state for the modal to select the user data 
  const [selectUserData, setSelectedUserData] = useState(null);
  
  //state for the modal the selected user data for the change password
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); 
  
  //state for the modal the selected user data for the change first and last name
  const [showChangeUsernamedModal, setShowChangeUsernamedModal] = useState(false); 
  
  
  // ref To track the previous search term
  const prevSearchRef = useRef('');

  //state for the modal
  const [showModal, setShowModal] = useState()








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
      const response = await getListOfUsers(
        filterSearch, apiPageNumber, pageSize, setShowModal
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



  //functin to handle update the username 
  const handleUsernameUpdate = (updatedUser) => {
    setUserData((prev) =>
      prev.map((user) =>
        user.id === updatedUser.id
          ? { ...user, ...updatedUser }
          : user
      )
    );
  };



  const columns = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: "Username",
        size: 150,
      },
      {
        accessorKey: 'last_name',
        header: 'Nom',
        size: 200,
      },
      {
        accessorKey: 'first_name',
        header: 'Prénom',
        size: 150,
      },
      {
        header: 'Position',
        size: 150,
        Cell: ({ cell}) => {
          const { is_active, is_staff, is_superuser } = cell.row.original;
          let position = '';
          if (is_superuser) {
            position = 'Admin'
            return <Chip label={position} color="error" variant="outlined" sx={{ placeSelf: 'center', width:'100%' }} />;
          } else if (is_staff) {
            position = 'Superviseur';
            return <Chip label={position} color="success" variant="outlined" sx={{ placeSelf: 'center', width:'100%' }} />;
          } else if (is_active) {
            position = 'Agent';
            return <Chip label={position} color="neutral" variant="outlined" sx={{ placeSelf: 'center', width:'100%' }} />;
          }
          
        }
      },
      // {
      //   accessorKey: 'is_active',
      //   header: 'Agent',
      //   size: 150,
      //   Cell : ({cell}) => {
      //     return cell.getValue()
      //       ? <Typography style={{ color: 'green', fontWeight: 'bold' }}>Oui</Typography>
      //       : <Typography style={{ color: 'red', fontWeight: 'bold' }}>Non</Typography>;
      //   }
      // },

      // {
      //   accessorKey: 'is_staff',
      //   header: 'Superviseur',
      //   size: 150,
      //   Cell : ({cell}) => {
      //     return cell.getValue()
      //       ? <Typography style={{ color: 'green', fontWeight: 'bold' }}>Oui</Typography>
      //       : <Typography style={{ color: 'red', fontWeight: 'bold' }}>Non</Typography>;
      //   }
      // },

      // {
      //   accessorKey: 'is_superuser',
      //   header: 'Administrateur',
      //   size: 150,
      //   Cell : ({cell}) => {
      //     return cell.getValue()
      //       ? <Typography style={{ color: 'green', fontWeight: 'bold' }}>Oui</Typography>
      //       : <Typography style={{ color: 'red', fontWeight: 'bold' }}>Non</Typography>;
      //   }
      // },
      {
        accessorKey: 'balance',
        header: "Solde actuel",
        size: 150,
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

          const handlePassword = () => {
            //set the selected user data to the state
            setSelectedUserData(row.original);
            
            //set show modal to change password to true
            setShowChangePasswordModal(true);


            //handleChangePassword(row.original);
            handleMenuClose();
          };

          const handleUsername = () => {

            //set the selected user data to the state
            setSelectedUserData(row.original);
            
            //set show modal to change username to true
            setShowChangeUsernamedModal(true);


            //handleChangeUsername(row.original);
            handleMenuClose();
          };


          // Prevent any user from editing other superusers (except themselves)
          const isTargetSuperuser = row.original.is_superuser;
          const isSelf = row.original.id === Number(localStorage.getItem('user_id'));

          const canEdit =
            // Only allow if:
            // - The target is NOT a superuser
            // - OR the target is the current user
            !isTargetSuperuser || isSelf;


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
              {canEdit ? (
                  <>
                    <MenuItem onClick={handlePassword}>Changer mot de passe</MenuItem>
                    <MenuItem onClick={handleUsername}>Changer username</MenuItem>
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
      display : 'flex',
      justifyContent: 'center',
    }}>
      <Box sx={{
        width: isMobile ? '95%' : '100%',
      }}>
        <MaterialReactTable table={table} />
      </Box>
    </Box>

      {/* Modal for changing password */}
      {showChangePasswordModal && (
        <ActionChangePassword
          user={selectUserData}
          openModal={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}



      {/* Modal for changing username first and lastname */}
      {showChangeUsernamedModal && (
        <ActionChangeUsername
          user={selectUserData}
          openModal={showChangeUsernamedModal}
          onClose={() => setShowChangeUsernamedModal(false)}
          onUsernameUpdate={handleUsernameUpdate}
        />
      )}

    

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