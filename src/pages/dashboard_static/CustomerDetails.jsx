import ModalCard from '../../components/UI/ModalCard'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Typography, Divider, List, ListItem, Card, Chip, Sheet, Badge } from '@mui/joy';
import { Button } from '@mui/material';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import TollOutlinedIcon from '@mui/icons-material/TollOutlined';

import CustomerDetailsChart from './CustomerDetailsChart';
import React from 'react';

import useIsMobile from '../../hooks/useIsMobile';


export default function CustomerDetails({
  showModal,
  setShowModal,
  data
}) {

  const isMobile = useIsMobile();


  const formatCurrency = (value) => {
    return Number(value).toLocaleString('fr-DZ', { maximumFractionDigits: 2 }) + ' DA';
  };

  const formattedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',

    }).format(date);
  };

  return (
    <ModalCard
      title="Détails du client"
      showModal={showModal} 
      setShowModal={setShowModal}
      icon={<InfoOutlinedIcon fontSize="large" />}
      color='white'
      
    >
      <Box 
        sx={{ 
          minWidth: 'max-content',
          maxHeight: { xs: '80vh', md: '85vh' },
          overflowY: 'auto',
          background:'white',
          px: { xs: 1, sm: 2 },
          py: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent'
          }
        }}
      >
        {/* Customer Header Card */}
        <Card
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: 'background.surface',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: 'primary.main',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, }}>
              <PersonOutlineIcon sx={{ fontSize: '2rem', mr:2, placeSelf:'start' }} />
            <Box>
              <Typography level="h3" component="h3" sx={{ fontWeight: 'bold' }}>
                {data.customer_firstname} {data.customer_lastname} #{data.customer_id}
              </Typography>
              <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                Client depuis: {data.customer_create_date?.split('T')[0] || 'N/A'}
              </Typography>
              <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                Client de: {data.customer_belong_to || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Main Content Layout */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3, 
          mb: 3,
          position: 'relative'
        }}>
          {/* Personal Information Section */}
          <Card 
  variant="outlined" 
  sx={{ 
    flex: 1, 
    minWidth: 'fit-content',
    p: 0,
    backgroundColor: 'background.surface',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  }}
>
  <Box sx={{ 
    p: 2,
    backgroundColor: 'background.level1',
    borderBottom: '1px solid',
    borderColor: 'divider',
    display: 'flex',
    alignItems: 'center',
    gap: 1
  }}>
    <PersonOutlinedIcon color="primary" />
    <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
      Informations personnelles
    </Typography>
  </Box>

  <Box sx={{ p: 2, flex: 1 }}>
    {/* Contact & Identity Section */}
    <Box sx={{ mb: 2 }}>
      <Typography level="title-sm" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
        <CallOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        Contact et identité
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(1, 1fr)' },
        gap: '10px 24px',
        p: 1.5,
        borderRadius: '8px',
        bgcolor: 'background.level1',
      }}>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0 : 2, alignItems: isMobile ? 'start' : 'center' }}>
          <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>ID CLIENT :</Typography>
          <Typography level="body-md" >{data.customer_id}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0 : 2, alignItems: isMobile ? 'start' : 'center' }}>
          <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>NOM COMPLET :</Typography>
          <Typography level="body-md">{data.customer_firstname} {data.customer_lastname}</Typography>
        </Box>
        
        
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0 : 2, alignItems: isMobile ? 'start' : 'center' }}>
          <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>TÉLÉPHONE :</Typography>
          <Typography level="body-md" fontWeight="medium">{data.customer_mobile}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0 : 2, alignItems: isMobile ? 'start' : 'center' }}>
          <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>DATE D'INSCRIPTION :</Typography>
          <Typography level="body-md">{data.customer_create_date?.split('T')[0] || 'N/A'}</Typography>
        </Box>
        {data.customer_email && (
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0 : 2, alignItems: isMobile ? 'start' : 'center'  }}>
            <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>EMAIL :</Typography>
  
              <Typography level="body-md">{data.customer_email}</Typography>
            </Box>
    
        )}
        

      
        

        {/* 
        {data.customer_status && (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>STATUT</Typography>
            <Chip 
              size="sm" 
              variant="soft"
              color={data.customer_status === 'Actif' ? 'success' : 'neutral'}
            >
              {data.customer_status}
            </Chip>
          </Box>
        )} 
         */}


     
      </Box>

      {/* Display more fields if they exist */}
      {/* 
        {data.customer_email && (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography level="body-xs" sx={{ color: 'text.secondary' }}><AlternateEmailRoundedIcon fontSize='small' className='mr-2'/>EMAIL</Typography>
            
            <Box sx={{ 
              p: 1.5,
              borderRadius: '8px',
              bgcolor: 'background.level1',
            }}>
              <Typography level="body-md">{data.customer_email}</Typography>
            </Box>
          </Box>
        )}
        */}

    </Box>

    {/* Address Section */}
    <Box sx={{ mb: 2 }}>
      <Typography level="title-sm" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
        <LocationOnOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
        Adresse complète
      </Typography>
      
      <Box sx={{ 
        p: 1.5,
        borderRadius: '8px',
        bgcolor: 'background.level1',
      }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 1.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>WILAYA</Typography>
            <Typography level="body-md">{data.customer_wilaya}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>DAIRA</Typography>
            <Typography level="body-md">{data.customer_daira}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>COMMUNE</Typography>
            <Typography level="body-md">{data.customer_commune}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography level="body-xs" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>ADRESSE DÉTAILLÉE</Typography>
          <Typography level="body-md" sx={{ whiteSpace: 'pre-wrap' }}>{data.customer_address}</Typography>
        </Box>
      </Box>
    </Box>

    <Divider sx={{ my: 2 }} />

    {/* Products Section - Keep this as it was */}
    <Typography level="title-sm" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
      <ShoppingBagOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
      Liste des produits
    </Typography>
    
    <Box sx={{ 
      maxHeight: '180px',
      overflowY: 'auto',
      p: 1,
      borderRadius: '8px',
      bgcolor: 'background.level1',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '3px',
      }
    }}>
      {data.products && data.products.length > 0 ? (
        data.products.map((product, index) => (
          <Box 
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              mb: 1,
              borderRadius: '4px',
              '&:not(:last-child)': {
                borderBottom: '1px solid',
                borderColor: 'divider'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CategoryOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'neutral.500' }} />
              <Typography level="body-sm">
                {product.product_name} 
                <Typography level="body-xs" sx={{ color: 'text.secondary' }}>{product.product_brand}</Typography>
              </Typography>
            </Box>
            <Chip 
              size="sm" 
              color="primary" 
              variant="soft" 
              sx={{ ml: 1 }}
            >
              {Number(product.product_price)} DA × {product.product_quantity}
            </Chip>
          </Box>
        ))
      ) : (
        <Typography level="body-sm" textAlign="center" sx={{ py: 2, color: 'text.secondary' }}>
          Aucun produit
        </Typography>
      )}
    </Box>
    
    {/* Add additional customer notes if available */}
    {data.customer_notes && (
      <>
        <Divider sx={{ my: 2 }} />
        <Typography level="title-sm" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>
          Notes
        </Typography>
        <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'background.level1' }}>
          <Typography level="body-sm" sx={{ whiteSpace: 'pre-wrap' }}>
            {data.customer_notes}
          </Typography>
        </Box>
      </>
    )}
  </Box>
</Card>

          {/* Financial Information Section */}
          <Card 
            variant="outlined" 
            sx={{ 
              flex: 1, 
              p: 0,
              minWidth: 'fit-content',
              backgroundColor: 'background.surface',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ 
              p: 2,
              backgroundColor: 'background.level1',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <AttachMoneyIcon color="primary" />
              <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
                Informations financières
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 2,
                mb: 3
              }}>
                {/* Current Financial Values */}
                <Box 
                  sx={{ 
                    flex: '1 0 220px',
                    p: 2,
                    borderRadius: '8px',
                    bgcolor: 'background.level1',
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                  }}
                >
                  <Typography level="body-xs" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>
                    Reste à payer
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '24px 1fr auto', 
                    gap: '8px 12px',
                    alignItems: 'center',
                    pt: 1,
                    overflowY: 'auto',
                    maxHeight: '46vh',
                  }}>

                    {/* show the tax of service frais */}
                    {Number(data.customer_frais_service) > 0 && (
                      <>
                        <TollOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                        <Typography level="body-sm">frais de service</Typography>
                        <Typography level="body-sm" fontWeight="bold">{formatCurrency(data.customer_frais_service)}</Typography>
                      </>
                    )}
                    
                    
                    {/* show the tax of apport personnel frais */}
                    {Number(data.customer_apport_personnel) > 0 && (
                      <>
                        <TollOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                        <Typography level="body-sm">frais d'apport personnel</Typography>
                        <Typography level="body-sm" fontWeight="bold">{formatCurrency(data.customer_apport_personnel	)}</Typography>
                      </>
                    )}

                    {/* show the tax of cash frais */}
                    {Number(data.customer_frais_cash) > 0 && (
                      <>
                        <TollOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                        <Typography level="body-sm">frais de cash</Typography>
                        <Typography level="body-sm" fontWeight="bold">{formatCurrency(data.customer_frais_cash)}</Typography>
                      </>
                    )}



                    {/* show the tax of ramassage frais */}
                    {Number(data.customer_frais_ramassage) > 0 && (
                      <>
                        <TollOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                        <Typography level="body-sm">frais de ramassage</Typography>
                        <Typography level="body-sm" fontWeight="bold">{formatCurrency(data.customer_frais_ramassage)}</Typography>
                      </>
                    )}



                    {/* show the tax of apport virement frais */}
                    {Number(data.customer_frais_virement) > 0 && (
                      <>
                        <TollOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                        <Typography level="body-sm">frais d'apport virement</Typography>
                        <Typography level="body-sm" fontWeight="bold">{formatCurrency(data.customer_frais_virement)}</Typography>
                      </>
                    )}
                    

                    {/* show the rest of taxes that are in the customer taxes tracking */}
                    {data.customertaxtracking_set.map((item) => {
                      return (
                        <React.Fragment key={item.id}>
                            <TollOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                            <Typography level="body-sm">{item.tax_name}</Typography>
                            <Typography level="body-sm" fontWeight="bold">{formatCurrency(item.amount)}</Typography>
                        </React.Fragment>
                      )
                    })}

                    <TollOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                    <Typography level="body-sm"><strong>Total</strong></Typography>
                    <Typography level="body-sm" fontWeight="bold">{formatCurrency(
                      data.customertaxtracking_set.reduce((acc, item) => acc + Number(item.amount), 0) + Number(data.customer_frais_service) + Number(data.customer_apport_personnel) + Number(data.customer_frais_cash) + Number(data.customer_frais_ramassage) + Number(data.customer_frais_virement)
                    )}</Typography>

                  </Box>
                </Box>
                
                {/* Starting Financial Values */}
              {/*   i dont need this section any more
                <Box 
                  sx={{ 
                    flex: '1 0 220px',
                    p: 2,
                    borderRadius: '8px',
                    bgcolor: 'background.level1',
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                  }}
                >
                  <Typography level="body-xs" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>
                    VALEURS DE DÉPART
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '24px 1fr auto', 
                    gap: '8px 12px',
                    alignItems: 'center',
                    pt: 1
                  }}>
                    <LocalShippingOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                    <Typography level="body-sm">Ramassage</Typography>
                    <Typography level="body-sm" fontWeight="bold">{formatCurrency(data.customer_ramassage_start)}</Typography>
                    
                    <EngineeringOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                    <Typography level="body-sm">Service</Typography>
                    <Typography level="body-sm" fontWeight="bold">{formatCurrency(data.customer_service_start)}</Typography>
                    
                    <InventoryOutlinedIcon fontSize="small" sx={{ color: 'neutral.600' }} />
                    <Typography level="body-sm">Livraison</Typography>
                    <Typography level="body-sm" fontWeight="bold">{formatCurrency(data.customer_livraison_start)}</Typography>
                    
                    <AccountBalanceWalletOutlinedIcon fontSize="small" />
                    <Typography level="body-sm" fontWeight="medium">Apport personnel</Typography>
                    <Typography level="body-sm" fontWeight="bold" >
                      {formatCurrency(data.customer_apport_personnel_start)}
                    </Typography>
                  </Box>
                </Box>
               */}
              
              </Box>
              
              {/* Chart Section */}
              {/* i don't need this section any more
              <Box sx={{ mt: 2 }}>
                <Typography level="body-xs" sx={{ mb: 1, fontWeight: 'medium', color: 'text.secondary' }}>
                  ANALYSE VISUELLE
                </Typography>
                <Box sx={{ height: '200px' }}>
                  <CustomerDetailsChart data={data} />
                </Box>
              </Box>
               */}
            </Box>
          
          </Card>

          {/* Payment History Section */}
          <Card 
            variant="outlined" 
            sx={{ 
              flex: 1, 
              p: 0,
              minWidth: 'fit-content',
              backgroundColor: 'background.surface',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ 
              p: 2,
              backgroundColor: 'background.level1',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <HistoryIcon color="primary" />
              <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
                Historique des paiements
              </Typography>
            </Box>

            <Box sx={{ 
              p: 2,
              flex: 1,
              overflowY: 'auto',
              maxHeight: '40rem',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '3px',
              }
            }}>
              {data.histories && data.histories.length > 0 ? (
                data.histories.map((history, index) => (
                  <Sheet
                    key={index}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: '8px',
                      boxShadow: 'sm',
                      position: 'relative',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: 'md',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography level="title-sm" fontWeight="bold" sx={{ color: 'primary.main', minWidth:'max-content', paddingRight:'1rem' }}>
                        {formatCurrency(history.total_payment)}
                      </Typography>
                      <Box className='flex flex-wrap gap-2'>
                       
                        {/*                         
                        {history.what_pay.map((element, idx) => {
                          <Chip
                            key={idx}
                            variant="soft"
                            size="sm"
                            color="success"
                            startDecorator={<PaymentsOutlinedIcon fontSize="small" />}
                          >
                            {element}
                          </Chip>
                          
                        })}
                        */}

                        {history.what_pay.map((element, idx) => {
                          return (
                            <Chip
                              key={idx}
                              variant="soft"
                              size="sm"
                              color="success"
                              startDecorator={<PaymentsOutlinedIcon fontSize="small" />}
                            >
                              {element}
                            </Chip>
                          );
                        })}

                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'auto 1fr', 
                      gap: '4px 16px',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <CalendarTodayOutlinedIcon fontSize="small" sx={{ color: 'text.tertiary' }} />
                      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        {formattedDate(history.date_of_payment)}
                      </Typography>
                      
                      <PersonOutlinedIcon fontSize="small" sx={{ color: 'text.tertiary' }} />
                      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        {history.collected_by}
                      </Typography>
                      
                      <ReceiptIcon fontSize="small" sx={{ color: 'text.tertiary' }} />
                      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        {history.type_payment}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Box
                        component="a"
                        href={history.payment_receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          py: 1,
                          px: 2,
                          borderRadius: '6px',
                          bgcolor: 'primary.softBg',
                          color: 'primary.main',
                          fontWeight: 'medium',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'primary.softHoverBg',
                          }
                        }}
                      >
                        <FeedOutlinedIcon fontSize="small" />
                        Reçu de paiement
                      </Box>
                    </Box>
                  </Sheet>
                ))
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <ReceiptIcon sx={{ fontSize: '2.5rem', mb: 2, opacity: 0.6 }} />
                  <Typography level="body-md">Aucun historique de paiement</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Box>

      </Box>

        {/* Add close button */}
        <Box className='flex justify-center'>
            <Button 
              onClick={() =>  setShowModal(false)}
              variant="contained"
              color={"error"}
              sx={{ mt: 3, alignSelf: 'center', fontSize:'1.2rem', padding:'0.5rem 1.7rem', textTransform: 'none' }}
            >
              Fermer
            </Button>
          </Box>
    </ModalCard>
  );
}