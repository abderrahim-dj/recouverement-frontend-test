import { Modal, ModalDialog, ModalClose, Typography, Button, Box } from "@mui/joy"

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


import useIsMobile from "../../hooks/useIsMobile";

export default function ModalCard({
  title, 
  showModal, 
  setShowModal, 
  icon,
  children, 
  color
}) {


  const isMobile = useIsMobile();


  return(
    <>
    <Modal 
    open={showModal}
    onClose={() => setShowModal(false)}

    >
      <ModalDialog
        disableEnforceFocus
        color={color}
        layout="center"
        size="lg"
        variant="soft"
        sx={{padding:'2rem', paddingBottom:'2rem', width: isMobile ? '90vw' : 'auto',}}
        className={children ? 'w-max' :   'w-auto'}
      >
        
        <ModalClose 
          sx={{
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.05)",
            },
          }} 
        />

        <Box className="flex items-center justify-center">
          {icon ? icon : <InfoOutlinedIcon fontSize="large"/>}
        </Box>
        <Typography className='text-center'level="h3">{title || 'title'}</Typography>
        
          {children}

          {!children && (
            <>
              {/* Add close button */}
              <Button 
                onClick={() => setShowModal(false)}
                variant="solid"
                color={color || "primary"}
                sx={{ mt: 3, alignSelf: 'center', fontSize:'1.2rem', padding:'0.5rem 1.7rem'}}
              >
                Fermer
              </Button>
            </>
          )
          }
       
      </ModalDialog>
    </Modal>
    </>
  )
}