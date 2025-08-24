import DesktopSideNavbar from './DesktopSideNavbar'
import MobileSideNavbar from './MobileSideNavbar'
import useIsMobile from '../../hooks/useIsMobile'



export default function SideNavbar() {

  const isMobile = useIsMobile();
  

  return (
    <>
      {isMobile ? <MobileSideNavbar /> : <DesktopSideNavbar />}
    </>
  )
}