import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
// import Logout from "./pages/Logout";
import AuctionDetail from "./pages/AuctionDetail";
import Login from "./pages/login";
import Home from "./pages/Home";
import Auctionpost from "./pages/Auctionpost";
import QnAboard from "./pages/QnAboard";
import Post from "./pages/Post";
import Register from "./pages/Register";
import SearchResult from "./pages/SearchResult";
import UserPage from "./pages/UserPage";
import UpdatePost from "./pages/UpdatePost";
import InterestList from "./pages/InterestList";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/AuctionDetail",
        element: <AuctionDetail />,
      },
      {
        path: "/Auctionpost/:auctionNo",
        element: <Auctionpost />,
      },
      {
        path: "/comments",
        element: <Auctionpost />,
      },
      {
        path: "/qnapost",
        element: <QnAboard />,
      },     
      {
        path: "/Post",
        element: <Post />,
      },
      {
        path: "/update",
        element: <UpdatePost />,
      },
      {
        path: "/SearchResult",
        element: <SearchResult />,
      },
      {
        path: "/UserPage",
        element: <UserPage />,
      },
      {
        path: "/InterestList",
        element: <InterestList />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
export default router;
