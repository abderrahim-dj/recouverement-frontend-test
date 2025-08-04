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


import getListOfTaxesCreated from '../../services/getListOfTaxesCreated'


//import the modal to change the tax name
import ActionChangeTaxName from './ActionChangeTaxName';


//import the modal to add new tax
import ActionAddNewTax from './ActionAddNewTax';



import ModalCard from '../../components/UI/ModalCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


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

export default function TableListOfTaxes(){



  const isMobile = useIsMobile();


  //some state to make the table dynamic
  const [taxesData, setTaxesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });




  //state for the modal to select the user data 
  const [selectedTaxData, setSelectedTaxData] = useState(null);
  
  //state for the modal the selected user data for the change tax name
  const [showChangeTaxNameModal, setShowChangeTaxNameModal] = useState(false); 
  
  //state for the modal the selected user data for the change first and last name
  const [showAddNewTaxModal, setShowAddNewTaxModal] = useState(false); 
  
  
  // ref To track the previous search term
  const prevSearchRef = useRef('');



  const [showModal, setShowModal] = useState(false);






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
      const response = await getListOfTaxesCreated(
        filterSearch, apiPageNumber, pageSize, setShowModal
      );




      setTaxesData(response.results || []);
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



  //functin to handle update the tax name
  const handleTaxNameUpdate = (updatedTax) => {
    setTaxesData((prev) =>
      prev.map((tax) =>
        tax.id === updatedTax.id
          ? { ...tax, ...updatedTax }
          : tax
      )
    );
  };


  //function to handle add new tax after successfully created
  //this will add the new tax to the existing list of taxes
  const handleTaxCreated = (newTax) => {
    setTaxesData((prev) => [
      ...prev,
      {
        id: newTax.id,
        tax_name: newTax.tax_name,
        created_by_full_name: newTax.created_by_full_name,
        created_at: newTax.created_at,
        last_updated: newTax.last_updated,
        modefied_by_full_name: newTax.modefied_by_full_name
      }
    ])

  }



  const columns = useMemo(
    () => [
      {
        accessorKey: 'tax_name',
        header: "Nom de la taxe",
        size: 150,
      },
      {
        accessorKey: 'created_by_full_name',
        header: 'Créé par',
        size: 100,
      },
      {
        accessorKey: 'created_at',
        header: 'Date de création',
        size: 150,
      },
      {
        accessorKey: 'last_updated',
        header: '	Dernière mise à jour',
        size: 200,
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

          const handleChangeTaxName = () => {
            //set the selected user data to the state
            setSelectedTaxData(row.original);


            
            //set show modal to change password to true
            setShowChangeTaxNameModal(true);


            //handleChangePassword(row.original);
            handleMenuClose();
          };


          // maybe this function will be used later as for removing taxes 
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
                    <MenuItem onClick={handleChangeTaxName}>Changer le nom de la taxe</MenuItem>
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
    data: taxesData,
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
      justifyContent:'center',


    }}>
      <Box sx={{
        width: isMobile ? '95%' : '100%',
        
      }}>

        {/* button to create new Tax */}
        <Button
          variant="contained"
          
          sx={{ 
            backgroundColor: '#d32f2f',
            mb: 2,
            width: 'fit-content',
            alignSelf: 'flex-end',
            mr: 3,
            fontWeight: 'bold',
            textTransform: 'none',
            marginTop: isMobile ? '1.5rem' : '0',
            ml: isMobile ? 0 : '2rem',
          }}
          onClick={() => setShowAddNewTaxModal(true)}
        >
          <LibraryAddOutlinedIcon fontSize='medium' sx={{marginRight:2}}/>
          Nouvelle taxe
        </Button>

        <MaterialReactTable table={table} />
      </Box>
    </Box>


      {showChangeTaxNameModal && (
        <>
        
        {console.log('selectedtaxdata: ', selectedTaxData)}
        
        <ActionChangeTaxName 
          tax={selectedTaxData}
          openModal={showChangeTaxNameModal}
          onClose={() => setShowChangeTaxNameModal(false)}
          onTaxNameUpdate={handleTaxNameUpdate}
        />
        </>
        
      )}

      {showAddNewTaxModal && (
        <ActionAddNewTax
          openModal={showAddNewTaxModal}
          onClose={() => setShowAddNewTaxModal(false)}
          onTaxCreated={handleTaxCreated}
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