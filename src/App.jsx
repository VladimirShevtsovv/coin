import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import Login from "./Components/Login/login";
import Header from "./Components/Heder/header";
import Accounts from "./Components/Account/account";
import AccountDetails from "./Components/Account/account-details/account-details";
import {useEffect, useState} from "react";
import Currencies from "./Components/Currencies/Currencies";
import ATMsPage from "./Components/ATMsPage/ATMsPage";

function App() {
    // sessionStorage.getItem('activeLink')
    const navigateToLogin = useNavigate()

    useEffect(() => {
        if (sessionStorage.getItem('isAuthorized') !== 'true') {
            navigateToLogin('/login')
        }
        if (!sessionStorage.getItem('arrayForAutocomplete')) {
            sessionStorage.setItem('arrayForAutocomplete', JSON.stringify([]))
        }
    }, [])

const [activeLink, setActiveLink] = useState('')

    return (
        <div className="App">
            <Header activeLink={activeLink}/>
            <Routes>
                <Route path={"/login"} element={<Login setActiveLink={setActiveLink}/>}/>
                <Route path={'/accounts'} element={<Accounts setActiveLink={setActiveLink}/>}/>
                <Route path={'/account-details/*'} element={<AccountDetails/>}/>
                <Route path={'/currency'} element={<Currencies setActiveLink={setActiveLink}/>}/>
                <Route path={'/ATMs'} element={<ATMsPage setActiveLink={setActiveLink}/>}/>
            </Routes>
        </div>
    );
}

export default App;
