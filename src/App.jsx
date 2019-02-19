import React, { Component } from 'react';
import './App.css';
import Navbar from './navbar';
import Routes from './router';
import Footer from './footer';
// import FootOrder from './foodorder';
// import api from  './api';
import { withAlert } from 'react-alert'


class App extends Component {

      constructor(props) {
        super(props);
        this.state = {
          search:'',
          FoodList:[],
        }
        if(!(JSON.parse(sessionStorage.getItem('user')))) {
            localStorage.clear();
        }
      }


  render() {
            // optional cofiguration

    return (
      <div className="App">
         
              <Navbar/> 
              {/* <button
        onClick={() => {
          this.props.alert.show('Oh look, an alert!')
        }}
      >
        Show Alert
      </button> */}
              <Routes />
        <hr/>
              <Footer/>
        
      </div>
    );
  }
}

export default App;
