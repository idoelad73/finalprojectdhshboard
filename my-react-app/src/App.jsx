
// import Dashboard from "./components/pages/dashboard/Dashboard";
// import DashboardNavbar from "./components/layout/Navbar";

import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index';
function App() {
  return(
    <RouterProvider router={router}/>
  )
}
export default App;
