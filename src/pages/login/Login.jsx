import { set, useForm } from "react-hook-form"
import { Button, Typography, Box, Input } from "@mui/joy"

import Modal from "../../components/UI/ModalCard"
import { useState } from "react"
import ModalCard from "../../components/UI/ModalCard"

import login from "../../services/login"
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';

import { useNavigate } from 'react-router-dom';

import useIsMobile from "../../hooks/useIsMobile"


import diarDzair from '/groupe_diar_dzair.png';

export default function Login() {


  const isMobile = useIsMobile();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false)

  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true);

    console.log(data);
    const response = await login(data);
    console.log(response);

    if (!response){
      setShowModal(true);
      setLoading(false);
      return
    } 

    setLoading(false);
    
    navigate('/');
  }

  return (
    
    
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '2rem',
      bgcolor: '#fafafa'
      
    }}>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <img src={diarDzair} alt="Diar Dzair" className='w-90 '/>
         <Typography level="h1" sx={{
          textAlign: 'center',
          
          
         }}>
          Recouvrement
         </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)} className={`bg-white flex flex-col gap-[2rem] ${isMobile ? 'w-[90%]' : 'w-[20vw]'} align-middle shadow-xl p-[2rem] rounded-2xl`}>
        <Typography level="h2">Login</Typography>

        <Box>
          <Input size="lg" placeholder="Username" type="text" required={true}
          {...register("username")}/>
        </Box>

        <Box>
          <Input size="lg" placeholder="Password" type="password" required={true}
          {...register("password")}/>
        </Box>

        <Button loading={loading} disabled={loading} type="submit" size="lg" sx={{alignSelf:'end', background:'#f44336', '&:hover': {background:'#e53935'}}}>Login</Button>
      </form>

      <ModalCard 
        showModal={showModal} 
        setShowModal={setShowModal} 
        title={'Identifiants incorrects'}
        icon={<GppMaybeOutlinedIcon fontSize="large"/>}
        color={'danger'}
      />
    </Box>
  )
}