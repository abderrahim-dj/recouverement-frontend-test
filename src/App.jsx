//route
import { Routes, Route, useLocation } from 'react-router-dom';

//pages
import Login from "./pages/login/Login"
import DashboardHome from './pages/dashboard home/DashboardHome';
import DashboardPay from './pages/dashboard pay/DashboardPay';
import DashboardNewCustomer from './pages/dashboard new customer/DashboardNewCustomer';
import DashboardStatic from './pages/dashboard_static/DashboardStatic';
//import ListOfCompletePayed from './pages/dashboard_list_of_complete_paid/ListOfCompletePayed';
//import ListOfUnpaid from './pages/dashboard_list_of_unpaid/ListOfUnpaid';
import PrintCheck from './pages/dashboard_print_check/PrintCheck';
import DashBoardSendMoney from './pages/dashboard_send_money/DashBoardSendMoney';
import DashboardTransactionHistory from './pages/dashboard_transaction_history/DashboardTransactionHistory';
import DashboardTransactionAction from './pages/dashboard_transaction_action/DashboardTransactionAction';
import DashboardDeductAmount from './pages/dashboard_deduct_amount/DashboardDeductAmount';
import DashboardDeductHistory from './pages/dashboard_deduct_history/DashboardDeductHistory';
import DashboardEmpleyeeTransaction from './pages/dashboard employee transaction /DashboardEmpleyeeTransaction';
import PageNotFound from './pages/404 page/PageNotFound';

//pages for managing the users (workers) managed by the super user only
import DashboardCreateUsers from './pages/dashboard create users/DashboardCreateUsers';
import DashboardListOfUsers from './pages/dashboard list of users/DachboardListOfUsers';

//pages for managing the taxes
import DashboardManageTaxes from './pages/dashboard manage taxes/DashboardManageTaxes';

//pages for managing the services
import DashboardManageServices from './pages/dashboard_manage_services/DashboardMnanageServices';

import DashboardCustomerWaitingForValidation from './pages/dashboard_customer_waiting_for_validation/DashboardCustomerWaitingFOrValidation';
import DashboardApprovedCustomers from './pages/dashboard_approved_customers/DashboardApprovedCustomers';


import DashboardCollectedFromClient from './pages/dashboard_collected_form_client/DashboardCollectedFromClient';
import DashboardCollectedFromClientAll from './pages/dashboard_collected_form_client_all/DashboardCollectedFromClientAll';


import DashboardMangeRecuPaiement from './pages/dashboard_manage_recu_paiement/DashboardListOfRecuOfPaiement';

import SideNavbar from './components/UI/SideNavbar';

//routes security
import PrivateRouter from './routes/PrivateRouter';
import React, { Component, use } from 'react';


//import the route with refresh
import RouteWithRefresh from './utils/RouteWithRefresh';



import { CircularProgress } from '@mui/material';


function App() {
  
  const IncompletePaid = React.lazy(() => import('./pages/dashboard_list_of_unpaid/ListOfUnpaid'));
  const ListOfCompletePayed = React.lazy(() => import('./pages/dashboard_list_of_complete_paid/ListOfCompletePayed'));







  return (
    <Routes>
      <Route path="/" element={<PrivateRouter><DashboardHome /></PrivateRouter>}></Route>
      <Route path="*" element={<PageNotFound />}></Route>
      
      
      <Route path="/pay" element={<PrivateRouter><DashboardPay /></PrivateRouter>}></Route>
      <Route path="/new-customer" element={<PrivateRouter><DashboardNewCustomer /></PrivateRouter>}></Route>
      <Route path="/customers-waiting-validation" element={<PrivateRouter><DashboardCustomerWaitingForValidation /></PrivateRouter>}></Route>
      <Route path="/customers-approved" element={<PrivateRouter><DashboardApprovedCustomers /></PrivateRouter>}></Route>
      <Route path="/Clients-encaisses" element={<PrivateRouter><DashboardCollectedFromClient /></PrivateRouter>}></Route>
      <Route path="/Clients-encaisses-all" element={<PrivateRouter><DashboardCollectedFromClientAll /></PrivateRouter>}></Route>
      
      
      {/* for transation the money */}
      <Route path="/send-money" element={<PrivateRouter><DashBoardSendMoney /></PrivateRouter>}></Route>
      <Route path="/transaction-history" element={<PrivateRouter><DashboardTransactionHistory /></PrivateRouter>}></Route>
      <Route path="/transaction-action" element={<PrivateRouter><DashboardTransactionAction /></PrivateRouter>}></Route>
      <Route path="/deduct-balance-action" element={<PrivateRouter><DashboardDeductAmount /></PrivateRouter>}></Route>
      <Route path="/deduct-balance-history" element={<PrivateRouter><DashboardDeductHistory /></PrivateRouter>}></Route>
      <Route path="/employee-transactions" element={<PrivateRouter><DashboardEmpleyeeTransaction /></PrivateRouter>}></Route>
      
      {/* dashboard managing taxes */}
      <Route path="/manage-taxes" element={<PrivateRouter><DashboardManageTaxes /></PrivateRouter>}></Route>
      
      
      {/* dashboard managing services */}
      <Route path="/manage-services" element={<PrivateRouter><DashboardManageServices /></PrivateRouter>}></Route>

      {/* dashboard managing recu paiements */}
      <Route path="/manage-recu-paiement" element={<PrivateRouter><DashboardMangeRecuPaiement /></PrivateRouter>}></Route>


      {/* for managing workers */}
      <Route path="/workers-create" element={<PrivateRouter><DashboardCreateUsers/></PrivateRouter>}></Route>
      <Route path="/workers-list" element={<PrivateRouter><DashboardListOfUsers/></PrivateRouter>}></Route>






      <Route path="/complet" element={
        <PrivateRouter>
         <RouteWithRefresh component={() => import('./pages/dashboard_list_of_complete_paid/ListOfCompletePayed')}/>
        </PrivateRouter>}>
      </Route>
      
      <Route path="/incomplet" element={
        <PrivateRouter>
          <RouteWithRefresh component={() => import('./pages/dashboard_list_of_unpaid/ListOfUnpaid')}/>
        </PrivateRouter>}>
      </Route>

      <Route path="/print-check" element={<PrivateRouter><PrintCheck /></PrivateRouter>}></Route>
      <Route path="/static" element={<PrivateRouter><DashboardStatic /></PrivateRouter>}></Route>
      <Route path="/login" element={<Login />}></Route>
    </Routes>
  )
}

export default App
