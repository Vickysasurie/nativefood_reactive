import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './home';
import UserInfo from './userinfo';
import Cart from './cart';
import Checkout from './checkout';
import FoodOrder from './foodorder';
import Search from './search';
import ForgotPassword from './forgot_password';
import Success from './success';
import Success1 from './success1';
import Hello from './hello';
import Invoice1 from './invoice1';
import OfferCheckout from './offerCheckout';
import QrInvoice from './qr_invoice';
import OfferCart from './offerCart';
//import NotFound from './notfound';


const Routes = () => (
    <BrowserRouter >
        <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/userpro' component={UserInfo}></Route>
            <Route exact path='/cart' component={Cart}></Route>
            <Route exact path='/checkout' component={Checkout}></Route>   
            <Route exact path='/foodorder' component={FoodOrder}></Route>
            <Route exact path='/search' component={Search}></Route>
            <Route exact path='/forgot_password' component={ForgotPassword}></Route>
            <Route exact path='/success' component={Success}></Route>
            <Route exact path='/success1' component={Success1}></Route>
            <Route exact path='/hello' component={Hello}></Route>
            <Route exact path='/invoice1' component={Invoice1}></Route>
            <Route exact path='/qr_invoice' component={QrInvoice}></Route>
            <Route exact path='/offerCheckout' component={OfferCheckout}></Route>
            <Route exact path='/offerCart' component={OfferCart}></Route>
            
            {/* <Route exact path='/food/*' component={NotFound}></Route> */}
        </Switch>
    </BrowserRouter>
)
export default Routes;