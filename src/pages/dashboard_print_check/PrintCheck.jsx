import SideNavbar from "../../components/UI/SideNavbar";
import PrintCheckFrom from "./PrintCheckFrom";
import useAuth from "../../hooks/useAuth";
import UserLogged from "../../components/UI/UserLogged";

import useIsMobile from "../../hooks/useIsMobile";

export default function PrintCheck() {


  const isMobile = useIsMobile();
  useAuth();

  return (
    <>
      <SideNavbar />
      {isMobile ? (<></>) : (<UserLogged/>)}
      <PrintCheckFrom/>
    </>
  );

}