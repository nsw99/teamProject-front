import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
const Layout = () => {  
  return (
    <>
     <Header />
     <Sidebar />
      <Outlet />      
    </>
  );
};
export default Layout;