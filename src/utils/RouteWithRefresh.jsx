
import { useLocation } from "react-router-dom";

import { useEffect, useState } from "react";

import React from "react";

import SideNavbar from "../components/UI/SideNavbar";

import { CircularProgress } from "@mui/material";

const LoadingFallback = () => (
  <div>
    <SideNavbar/>
    <CircularProgress className='absolute top-[50%] left-[50%]'/>
  </div>
)

const RouteWithRefresh = ({ component: Component }) => {
  const location = useLocation();
  const [key, setKey] = useState(Date.now());
  
  // Reset the key whenever the location changes
  useEffect(() => {
    setKey(Date.now());
  }, [location.pathname]);
  
  const LazyComponent = React.lazy(() => Component());
  
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <LazyComponent key={key} />
    </React.Suspense>
  );
};

export default RouteWithRefresh