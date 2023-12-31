import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Web3 from "web3";
import PatientRegistration from "./components/PatientRegistration";
import LoginPage from "./components/LoginPage";
import PatientDashBoard from "./components/PatientDashBoard";
import DoctorDashBoard from "./components/DoctorDashBoard";
import CreateEhr from "./components/CreateEhr";
import LandingPage from "./components/LandingPage";
import NavBar from "./components/NavBar";
import ContractInteraction from "./components/ContractInteraction";
import RecordPermission from "./components/RecordPermission";
import DoctorPermission from "./components/DoctorPermission";
import DoctorLoginPage from "./components/DoctorLoginPage";
import PatientLogin from "./components/PatientLogin";
import DoctorRegistrationForm from "./components/DoctorRegistration";
import PatientWritePermission from "./components/PatientWritePermission";
import DoctorPermissionPage from "./components/DoctorPermissionPage";
import InsurerRegistration from "./components/InsurerRegistration";
import InsurerLoginPage from "./components/InsurerLoginPage";
import InsurerDashBoard from "./components/InsurerDashBoard";
import InsuranceClaimsInterface from "./components/InsuranceClaimsInterface";
import RaiseClaim from "./components/RaiseClaim";
import UnProcessedClaims from "./components/UnProcessedClaims";
import InsurerViewRecords from "./components/InsurerViewRecords";
import ContractInteractionDoctor from "./components/ContractInteractionDoctor";
import PaymentPortal from "./components/PaymentPortal";
import PatientViewClaims from "./components/PatientViewClaims";
import BookAppointment from "./components/BookAppointment";
import ViewAppointment from "./components/ViewAppointment";
import Footer from "./components/Footer";
import LandingPage_1 from "./components/LandingPage_1";

const BrowseRouter = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loggedInPatient, setLoggedInPatient] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const fetchedAccounts = await web3Instance.eth.getAccounts();
          setAccounts(fetchedAccounts);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);
  return (
    <BrowserRouter>
      <NavBar></NavBar>

      <Routes>
        <Route path="/" element={<LandingPage_1></LandingPage_1>}></Route>
        <Route path="/register" element={<LandingPage></LandingPage>}></Route>
        <Route
          path="/patient/:address/writepermission"
          element={<PatientWritePermission></PatientWritePermission>}
        ></Route>
        <Route
          path="/patient_registration"
          element={<PatientRegistration></PatientRegistration>}
        ></Route>
        <Route
          path="/doctor_registration"
          element={<DoctorRegistrationForm></DoctorRegistrationForm>}
        ></Route>
        <Route
          path="/insurer_registration"
          element={<InsurerRegistration></InsurerRegistration>}
        ></Route>
        <Route
          path="/patient_login"
          element={<PatientLogin></PatientLogin>}
        ></Route>
        <Route
          path="/doctor_login"
          element={<DoctorLoginPage></DoctorLoginPage>}
        ></Route>
        <Route
          path="/insurer_login"
          element={<InsurerLoginPage></InsurerLoginPage>}
        ></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/patient/:address" element={<PatientDashBoard />}></Route>
        <Route path="/doctor/:address" element={<DoctorDashBoard />}></Route>
        <Route path="/insurer/:address" element={<InsurerDashBoard />}></Route>
        <Route
          path="/doctor/:address/createehr"
          element={<CreateEhr web3={web3} />}
        ></Route>
        <Route
          path="/patient/:address/viewrecord"
          element={<ContractInteraction />}
        ></Route>
        <Route
          path="/patient/:address/permissionstab"
          element={<RecordPermission />}
        ></Route>
        <Route
          path="/patient/:address/bookappointment"
          element={<BookAppointment></BookAppointment>}
        ></Route>
        <Route
          path="/doctor/:address/viewrec"
          element={<DoctorPermission />}
        ></Route>
        <Route
          path="/doctor/:address/viewapp"
          element={<ViewAppointment />}
        ></Route>

        <Route
          path="/doctor/:address/viewrec/:patientaddress"
          element={<ContractInteractionDoctor />}
        ></Route>
        <Route
          path="/doctor/:address/doctorpermissionpage"
          element={<DoctorPermissionPage />}
        ></Route>

        <Route
          path="/insurance_claims/:address/processedClaims"
          element={<InsuranceClaimsInterface></InsuranceClaimsInterface>}
        ></Route>
        <Route
          path="/insurance_claims/:address/processedClaims/paymentPortal"
          element={<PaymentPortal></PaymentPortal>}
        ></Route>
        <Route
          path="/insurance_claims/:address/unprocessedClaims"
          element={<UnProcessedClaims></UnProcessedClaims>}
        ></Route>

        <Route
          path="/patient/:address/raiseclaim"
          element={<RaiseClaim></RaiseClaim>}
        ></Route>
        <Route
          path="/patient/:address/viewclaim"
          element={<PatientViewClaims></PatientViewClaims>}
        ></Route>
        <Route
          path="/insurance_claims/insurance_view_rec/:pa"
          element={<InsurerViewRecords></InsurerViewRecords>}
        ></Route>
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
};

export default BrowseRouter;
