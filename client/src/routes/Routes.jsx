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
                element:<JobDetails></JobDetails>,
                loader:({params})=> fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`)
            },
            {
                path:'/add-job',
                element:<AddJobs></AddJobs>
            },
            {
                path:'/my-posted-jobs',
                element:<MyPostedJobs></MyPostedJobs>
            },
            {
                path:'/my-bids',
                element:<MyBids></MyBids>
            },
            {
                path:'/bid-requests',
                element:<BidRequests></BidRequests>
            },
            {
                path:'/update-job/:id',
                element:<UpdateJob></UpdateJob>,
                loader:({params})=> fetch(`${import.meta.env.VITE_API_URL}/job/${params.id}`)
            }

        ]

    }
])

export default router