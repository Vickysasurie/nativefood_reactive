import React, { Component } from 'react';
import './cart.css';
import { withAlert } from 'react-alert'

class OfferCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: JSON.parse(localStorage.getItem('offerCart')),
            total_price: 0,
            checkout:{"food_id":"","food_name":"","food_image":"","price":"","available":"","quantity":"","provider_id":"","provider_name":"","provider_address":"","provider_mobile_number":"","order_status":"","user_id":"","email":"","user_mobile_number":"","total_price":"","gstin":"","tax":""},
    
            user: JSON.parse(sessionStorage.getItem('user')),
            i:0,
            total:[],
        }
        this.updateQuantity = this.updateQuantity.bind(this);
        this.remove = this.remove.bind(this);
        this.checkout = this.checkout.bind(this);
        //console.log(this.state.user.address, ' ', this.state.user.mobile_number);
      

        console.log(this.state.cartItems);
        console.log(this.state.user);
    }

    componentDidMount() {
        window.scrollTo(0,0);
        localStorage.clear('invoice');
    }
    // update quantity
    updateQuantity(q) {
        var quantity = q;
        console.log(quantity);
    }

    calculateTotal(){
        var temp=0;
        this.state.total.map(p=>{
            temp=temp+p;
            console.log("new price upon add or sub: "+temp);
        });
        this.setState({total_price:temp});
    }
    add() {
        
        if(parseInt((this.state.cartItems.food_id)) === (this.state.checkout.food_id)) {
      
            if (this.state.cartItems.available > this.state.cartItems.quantity) {
               
                this.state.count++;
           
                this.state.cartItems.quantity=this.state.cartItems.quantity+1;
            
                var price = this.state.cartItems.quantity * this.state.cartItems.price;
          
                //this.state.total=price;
                this.state.cartItems.total_price+=price;
                //var pri=this.state.total_price;
            
                //this.setState({ totalprice: 50 });
             
                //console.log(this.state.cartItems.quantity[i]);
                //this.calculateTotal();
            } else {
                //alert("The selected food is no more available");
                this.props.alert.show("The selected food is no more available")
            }
        } else{
            if (this.state.cartItems.available > this.state.cartItems.quantity) {
                this.setState({ cartItem: ++this.state.cartItems.quantity });
                var price = this.state.cartItems.quantity * this.state.cartItems.price;
                //console.log(price);
                //this.state.total[i]=price;
                this.state.cartItems.total_price+=this.state.cartItems.price;
                //var pri=this.state.cartItems.total_price;
                //console.log(pri);
                //this.setState({ total_price: pri });
                //console.log(this.state.total_price);
                //this.calculateTotal();
            } else {
                //alert("No more food is available");
                this.props.alert.show("The selected food is no more available")
            }
        }
    }

    sub() {
        if (this.state.cartItems.quantity > 0) {
            this.setState({ cartItem: --this.state.cartItems.quantity});
            //var price = this.state.cartItems.quantity * this.state.cartItems.price;
            //console.log(price);
            //this.state.total[i]=price;
            //console.log("total price before",this.state.total_price);
            this.state.cartItems.total_price-=this.state.cartItems.price;
            //var pri=this.state.cartitems.total_price;
            //this.setState({ total_price: pri });
            //console.log("total price after",this.state.total_price);
            //this.state.total_price-=this.state.total[i];
            // for(var i=0;i<this.state.cartItems.food_id.length;i++){
            //     this.state.totalprice-=price[i];
            // }
            //this.setState({ totalprice: price });
            //this.calculateTotal();
        } else {
            this.remove();
        }
    }
    // remove cart items
    remove() {
        //console.log(i);
        // this.state.cartItems.available.splice(i,1);
        // this.state.cartItems.food_id.splice(i,1);
        // this.state.cartItems.food_image.splice(i,1);
        // this.state.cartItems.food_name.splice(i,1);
        // this.state.cartItems.indexOf.splice(i,1);

        // this.state.cartItems.price.splice(i,1);
        // this.state.cartItems.provider_address.splice(i,1);
        // this.state.cartItems.provider_id.splice(i,1);
        // this.state.cartItems.provider_name.splice(i,1);
        // this.state.cartItems.gstin.splice(i,1);
        // this.state.cartItems.provider_mobile_number.splice(i,1);
        // this.state.cartItems.quantity.splice(i,1);
        // this.state.cartItems.tax.splice(i,1);

        // //console.log(this.state.cartItems);
        // localStorage.setItem('cart',JSON.stringify(this.state.cartItems));
        // this.setState({cartItems:this.state.cartItems});
        //this.total();
        localStorage.removeItem("cart");//clear all cart items

        window.location.reload(true);
        //console.log(this.state.cartItems);
        //console.log(this.state.user);
    }
    // proceed to checkout
    checkout() {
        
    if(this.state.user) {
      
        
            this.state.checkout.user_id=this.state.user.user_id;
            this.state.checkout.user_mobile_number=this.state.user.mobile_number;
            this.state.checkout.delivery_address=this.state.user.address;
            this.state.checkout.email=this.state.user.email;
            this.state.checkout.total_price=this.state.cartItems.total_price;
            // this.setState({user_mobile_number:this.state.user.user_mobile_number});
            // this.setState({delivery_address:this.state.user.address});
            this.state.checkout.food_id=this.state.cartItems.food_id;
            this.state.checkout.food_name=this.state.cartItems.food_name;
            this.state.checkout.food_image=this.state.cartItems.food_image;
            this.state.checkout.price=this.state.cartItems.price;
            this.state.checkout.available=this.state.cartItems.available;
            this.state.checkout.quantity=this.state.cartItems.quantity;
            this.state.checkout.provider_id=this.state.cartItems.provider_id;
            this.state.checkout.provider_mobile_number=this.state.cartItems.provider_mobile_number;
            this.state.checkout.provider_address=this.state.cartItems.provider_address;
            this.state.checkout.gstin=this.state.cartItems.gstin;
            this.state.checkout.tax=this.state.cartItems.tax;
            this.state.checkout.order_status=this.state.cartItems.order_status;
            this.state.checkout.provider_name=this.state.cartItems.provider_name;
            console.log(this.state.checkout);
            localStorage.setItem('offerCheckout',JSON.stringify(this.state.checkout));
            localStorage.removeItem('cart');
            this.props.history.push('/offerCheckout');
        
     } else {
         //alert("signin first");
         this.props.alert.show("signin first")
     }
    }
    render() {
        if (this.state.cartItems) {
            return (
                <div className="container-fill">
                    <div className="card shopping-cart">
                        <div className="card-header bg-dark text-light">
                            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                            Shopping cart
                            {/* <a href="/" className="btn btn-outline-info btn-sm pull-right">Continue Shopping</a> */}
                            <div className="clearfix"></div>
                        </div>
                        <div className="card-body">
                            
                                <div key={this.state.cartItems.food_id}>
                                    <div className="row" >


                                        <div className="col-12 col-sm-12 col-md-2 text-center">

                                            <img className="img-responsive" src={this.state.cartItems.food_image} alt="preview" width="120" height="80" />
                                            
                                        </div>
                                        <div className="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
                                            <h4 className="col-4 col-sm-4 col-md-4"><strong>{this.state.cartItems.food_name}</strong></h4>
                                            
                                        </div>
                                        
                                        <div className="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                                            
                                            {/* <div className="col-3 col-sm-3 col-md-6 text-md-right" style={{ paddingTop: '5px' }}>
                                                <h6><strong>{this.state.cartItems.price} <span className="text-muted">x</span></strong></h6>
                                            </div> */}
                                            <div className="col-4 col-sm-4 col-md-4">
                                                <div className="quantity">
                                                    <button type="button" value="+" className="plus" onClick={() => this.add()}><i className="fas fa-plus-circle"></i></button>
                                                    <input type="number" value={this.state.cartItems.quantity} title="Qty" className="qty" onChange={() => this.updateQuantity(this.state.cartItems.quantity)} />
                                                    <button type="button" value="-" className="minus" onClick={() => this.sub()}><i className="fas fa-minus-circle"></i></button>
                                                </div>
                                            </div>
                                            <div className="col-2 col-sm-2 col-md-2 text-right">
                                                <button type="button" className="btn btn-outline-danger btn-xs" onClick={() => this.remove()}>
                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>
                            
                                        </div>
                               

                                    </div>
                                             {/* <div className="row">
                                                <div className=" col-sm-9">
                                                </div>
                                                <div className="col-sm-3">
                                                    <p>Rs. {this.state.cartItems.total_price}</p>
                                                </div>
                                            </div> */}
                                    <hr/>
                            
                                </div>
                          
                         <button className="btn btn-secondary" onClick={() => this.checkout()}>Proceed to checkout</button>

                        </div>
                        <div className="card-footer">
                            {/* <div className="coupon col-md-5 col-sm-5 no-padding-left pull-left">
                                <div className="row">
                                    <div className="col-6">
                                        <input type="text" className="form-control" placeholder="cupone code" />
                                    </div>
                                    <div className="col-6">
                                        <input type="submit" className="btn btn-default" value="Use cupone" />
                                    </div>
                                </div>
                            </div> */}
                            <div className="pull-right" style={{ margin: "10px" }}>

                                <div className="pull-right" style={{ margin: "5px" }}>
                                    Total price: <b>{this.state.cartItems.total_price}</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } if (!this.state.cartItems) {
            return (
                <div>
                    {!(JSON.parse(sessionStorage.getItem('user')))?(
                        <div>
                            <h3>Oops! There is no items in your cart</h3>
                            <h3>Login and add products to continue</h3>
                        </div>
                    ):(
                        <div>
                             <h3>Oops! There is no items in your cart</h3>
                             <h3>Add products to continue</h3>
                        </div>
                        
                    )}
                    
                    <a href="/" >Go home</a>
                </div>
            )
        }
    }
}
export default withAlert(OfferCart);