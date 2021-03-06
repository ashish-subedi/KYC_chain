import React, { useState, useEffect } from "react";
import Bank1 from "../contracts/Bank1.json";
import getWeb3 from "../getWeb3";
import io from "socket.io-client";
import "./App.css";
import BlockchainContext from "./BlockchainContext.js";
import Login from "./Login.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home.js";
import Mykyc from "./SubmitKyc";
import Mykycreq from "./Mykycreq";
import Header from "./Header";
import Signup from "./Signup";
import Signin from "./Signin";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import NotFound from "./NotFound";
import AdminRoute from "./AdminRoute";
import UserRoute from "./UserRoute";
import SubmitKyc from "./SubmitKyc";
import MyKyc from "./MyKyc";
import URLs from "./URLs";


function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);
  const [isvalid, setIsValid ] = useState('');

  useEffect(() => {

    const init = async() => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        let accounts;
        await web3.eth.getAccounts().then(function(acc){ accounts = acc })

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Bank1.networks[networkId];
        const contract = new web3.eth.Contract(
          Bank1.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        console.log(accounts[0]);

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();

  }, []);


  // useEffect( async () => {
  //   const socket = new WebSocket("ws://localhost:5001");

  //   socket.onopen(() => {
  //     socket.send("Hello!");
  //   });
    
  //   socket.onmessage(data => {
  //     console.log(data);
  //   });
    
  // },[])

  if(typeof web3 === undefined){
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <Router>
      <div className="App">
        <BlockchainContext.Provider value={{ web3, accounts, contract }}>
          <Header />
          <Switch>
            <Route exact path="/" component={Signup} />
            <Route exact path="/user/submitkyc" component={SubmitKyc} />
            <Route exact path="/user/mykyc" component={MyKyc} />
            <Route exact path="/mykycreq" component={Mykycreq} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
            <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
            <UserRoute exact path="/user/dashboard" component={UserDashboard} />
            <Route component={NotFound} />
          </Switch>
        </BlockchainContext.Provider>
      </div>
    </Router>
  );
}

export default App;
