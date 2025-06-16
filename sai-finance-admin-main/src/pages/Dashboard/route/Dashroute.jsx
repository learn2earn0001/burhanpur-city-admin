import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Authentication from "../../../componant/authentication/authentication";
import { Riple } from 'react-loading-indicators';
import DashHome from "../userPanal/dashhome/DashHome";
import DemoUser from "../userControl/DemoUser";
import ViewCourse from "../courseControl/ViewCourse";
import ActiveUser from "../userControl/ActiveUser";
import CreateCourses from "../courseControl/CreateCourse";
import AddQuestion from "../questionControl/AddQuestion";
import EditCourses from "../courseControl/EditCourse";
import ViewQuestion from "../questionControl/ViewQuestion";
import EditQuestion from "../questionControl/EditQuestion";
import AddContest from "../contestControl/AddContest";
import ViewContest from "../contestControl/ViewContest";
import ContAddQ from "../questionControl/ContestAddQ";
import EditContest from "../contestControl/EditContest";
import ContestViewQ from "../questionControl/ContestViewQ";
import ContestEditQ from "../questionControl/ContestEditQ";
import ContestJoinUser from "../contestControl/JoinUser";
import PaymentRequest from "../paymentControl/PaymentRequest";
import LoanAccount from "../../LoanAccounts/LoanAccount";
import CreateLoanUser from "../../LoanAccounts/CreateLoanUser";
import ViewLoanUser from "../../LoanAccounts/ViewLoanUser";
import Officer from "../../OfficerData/Officer";
import CreateOfficer from "../../OfficerData/CreateOfficer";
import AddDailyCollection from "../../LoanAccounts/AddDailyCollection";
import Carousel from "../../OfficerData/Corouasol";
import CategorySection from "../../Categorypart/CategorySection";
// import Buisness from "../../buisnesspart/buisness";
import BusinessMain from "../../buisnesspart/BusinessMain";

const DashRoute = () => {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
      setLoading(true);
      const timer = setTimeout(() => {
          setLoading(false);
      }, 1000); // Adjust timeout as needed

      return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {/* <Authentication> */}
        {/* {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <Riple color="#000000" size="medium" text="" textColor="" />
          </div>
        )} */}
        <Routes>
          {/* <Route path='/home' element={<MainMcqs />} /> */}

          {/* User Routes */}
          <Route path='/home' element={<DashHome />} />
          <Route path='/c' element={<Carousel />} />
       
          <Route path='/loan-account' element={<LoanAccount />} />
          <Route path='/create-loan-account' element={<CreateLoanUser />} />
          <Route path='/view-user-details/:id' element={<ViewLoanUser />} />
          <Route path='/demo-user' element={<DemoUser />} />
          <Route path='/active-user' element={<ActiveUser />} />
          <Route path='/officer' element={<Officer />} />
          <Route path='/create-officer' element={<CreateOfficer />} />
          <Route path='/add-daily-collection/:id' element={<AddDailyCollection />} />
          <Route path='/category' element={<CategorySection/>} />
          <Route path="/buisness" element={<BusinessMain/>} />

          {/* Course Routes */}
          {/* <Route path='/view-course' element={<ViewCourse />} />
          <Route path='/create-course' element={<CreateCourses />} />
          <Route path='/edit-course/:id' element={<EditCourses />} />
          <Route path='/add-question/:id' element={<AddQuestion />} />
          <Route path='/view-question/:id' element={<ViewQuestion />} />
          <Route path='/edit-question/:id' element={<EditQuestion />} /> */}
          
          {/* Contest Routes */}
          {/* <Route path='/add-contest' element={<AddContest />} />
          <Route path='/view-contest' element={<ViewContest />} />
          <Route path='/edit-contest/:id' element={<EditContest />} />
          <Route path='/addcontest-question/:id' element={<ContAddQ />} />
          <Route path='/viewcontest-question/:id' element={<ContestViewQ />} />
          <Route path='/editcontest-question/:id' element={<ContestEditQ />} />
          <Route path='/join-user/:id' element={<ContestJoinUser/>} /> */}

          {/* Payment Routes */}
          {/* <Route path='/payment-request' element={<PaymentRequest />} /> */}


          <Route path="*" element={<Navigate to="/dash/home" replace />} />
         
        </Routes>
      {/* </Authentication> */}
    </>
  );
};

export default DashRoute;
