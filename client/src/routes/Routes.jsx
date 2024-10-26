import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import JobDetails from "../pages/JobDetails";
import AddJobs from "../pages/AddJobs";
import ErrorPage from "../pages/ErrorPage";
import MyPostedJobs from "../pages/MyPostedJobs";
import MyBids from "../pages/MyBids";
import BidRequests from "../pages/BidRequest";
import UpdateJob from "../pages/UpdateJob";
import PrivateRoutes from "./PrivateRoutes";
import AllJobs from "../pages/AllJobs";

const router =createBrowserRouter([
    {
        path:'/',
        element:<Main></Main>,
        errorElement:<ErrorPage></ErrorPage>,
        children:[
            {
                index:true,
                element:<Home></Home>,
            },
            {
                path:'/login',
                element:<Login></Login>
            },
            {
                path:'/register',
                element:<Register></Register>
            },
            {
                path:'/job/:id',
                element:<PrivateRoutes><JobDetails></JobDetails></PrivateRoutes>,
                loader:({params})=> fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`)
            },
            {
                path:'/add-job',
                element:<PrivateRoutes><AddJobs></AddJobs></PrivateRoutes>
            },
            {
                path:'/my-posted-jobs',
                element:<PrivateRoutes><MyPostedJobs></MyPostedJobs></PrivateRoutes>
            },
            {
                path:'/my-bids',
                element:<PrivateRoutes><MyBids></MyBids></PrivateRoutes>
            },
            {
                path:'/bid-requests',
                element:<PrivateRoutes><BidRequests></BidRequests></PrivateRoutes>
            },
            {
                path:'/update-job/:id',
                element:<PrivateRoutes><UpdateJob></UpdateJob></PrivateRoutes>,
                loader:({params})=> fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`)
            },
            {
                path:'/all-jobs',
                element:<AllJobs></AllJobs>
            }

        ]

    }
])

export default router