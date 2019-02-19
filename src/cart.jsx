import React, { Component } from 'react';
import './cart.css';
import { withAlert } from 'react-alert'

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: JSON.parse(localStorage.getItem('cart')),
            total_price: 0,
            checkout: {"provider_id":[],"food_id":[],
            "price":[],"quantity":[],
            "indexOf":[],"provider_address":[],"provider_name":[],"food_image":[],"food_name":[],"available":[],"provider_mobile_number":[],"order_status":"confirmed","user_id":0,"user_mobile_number":"","delivery_address":"","email":"","total_price":0,"gstin":[],"tax":[]},
            user: JSON.parse(sessionStorage.getItem('user')),
            i:0,
            total:[],
        }
        this.updateQuantity = this.updateQuantity.bind(this);
        this.remove = this.remove.bind(this);
        this.checkout = this.checkout.bind(this);
        //console.log(this.state.user.address, ' ', this.state.user.mobile_number);
        
        this.total();

        console.log(this.state.cartItems);
        console.log(this.state.user);
    }
    total(){
        if((this.state.cartItems) && (this.state.user)) {
            for (var i=0;i<this.state.cartItems.food_id.length;i++){
                this.state.total_price+= this.state.cartItems.price[i]*this.state.cartItems.quantity[i];
                console.log(this.state.total_price);
                this.state.total[i]=this.state.cartItems.price[i]*this.state.cartItems.quantity[i];
                console.log(this.state.cartItems.food_id.length);
                //console.log(this.state.user);
            }
        } else {
            console.log("No data is fetch");
        }
    }
    componentDidMount() {
        // var arr = JSON.parse(localStorage.getItem('cart'));
        // console.log(typeof (arr));
        // this.state.cartItems.push(arr);

        // console.log(this.state.cartItems);
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
    add(i) {
        
        if(parseInt((this.state.cartItems.food_id[i])) === (this.state.checkout.food_id[i])) {
            console.log('hello1');
            if (this.state.cartItems.available[i] > this.state.cartItems.quantity[i]) {
                //console.log('hello2');
                this.state.count++;
                //this.setState({ quantitySeleceted: (this.state.cart.quantity[i]) });
                // console.log(this.state.quantitySeleceted);
                this.state.cartItems.quantity[i]=this.state.cartItems.quantity[i]+1;
                //this.setState({food_quantity:this.state.cart.quantity[i]});
                var price = this.state.cartItems.quantity[i] * this.state.cartItems.price[i];
                //console.log(price);
                this.state.total[i]=price;
                this.state.total_price+=this.state.total[i];
                var pri=this.state.total_price;
                console.log(pri);
                this.setState({ totalprice: 50 });
                // for(var i=0;i<this.state.cartItems.food_id.length;i++){
                //     this.state.totalprice+=price[i];
                //     this.state.total_price
                // }
                console.log(this.state.cartItems.quantity[i]);
                this.calculateTotal();
            } else {
                //alert("The selected food is no more available");
                this.props.alert.show("The selected food is no more available")
            }
        } else{
            if (this.state.cartItems.available[i] > this.state.cartItems.quantity[i]) {
                this.setState({ cartItem: ++this.state.cartItems.quantity[i] });
                var price = this.state.cartItems.quantity[i] * this.state.cartItems.price[i];
                console.log(price);
                this.state.total[i]=price;
                this.state.total_price+=this.state.cartItems.price[i];
                var pri=this.state.total_price;
                console.log(pri);
                this.setState({ total_price: pri });
                console.log(this.state.total_price);
                this.calculateTotal();
            } else {
                //alert("No more food is available");
                this.props.alert.show("The selected food is no more available")
            }
        }
    }

    sub(i) {
        if (this.state.cartItems.quantity[i] > 0) {
            this.setState({ cartItem: --this.state.cartItems.quantity[i]});
            var price = this.state.cartItems.quantity[i] * this.state.cartItems.price[i];
            //console.log(price);
            this.state.total[i]=price;
            //console.log("total price before",this.state.total_price);
            this.state.total_price-=this.state.cartItems.price[i];
            var pri=this.state.total_price;
            this.setState({ total_price: pri });
            //console.log("total price after",this.state.total_price);
            //this.state.total_price-=this.state.total[i];
            // for(var i=0;i<this.state.cartItems.food_id.length;i++){
            //     this.state.totalprice-=price[i];
            // }
            //this.setState({ totalprice: price });
            this.calculateTotal();
        } else {
            this.remove(i);
        }
    }
    // remove cart items
    remove(i) {
        console.log(i);
        this.state.cartItems.available.splice(i,1);
        this.state.cartItems.food_id.splice(i,1);
        this.state.cartItems.food_image.splice(i,1);
        this.state.cartItems.food_name.splice(i,1);
        this.state.cartItems.indexOf.splice(i,1);

        this.state.cartItems.price.splice(i,1);
        this.state.cartItems.provider_address.splice(i,1);
        this.state.cartItems.provider_id.splice(i,1);
        this.state.cartItems.provider_name.splice(i,1);
        this.state.cartItems.gstin.splice(i,1);
        this.state.cartItems.provider_mobile_number.splice(i,1);
        this.state.cartItems.quantity.splice(i,1);
        this.state.cartItems.tax.splice(i,1);

        //console.log(this.state.cartItems);
        localStorage.setItem('cart',JSON.stringify(this.state.cartItems));
        this.setState({cartItems:this.state.cartItems});
        //this.total();
        //localStorage.removeItem("cart");//clear all cart items
        window.location.reload(true);
        //console.log(this.state.cartItems);
        //console.log(this.state.user);
    }
    // proceed to checkout
    checkout() {
        
    if(this.state.user) {
      
        for (var i=0;i<this.state.cartItems.food_id.length;i++){
            this.state.checkout.user_id=this.state.user.user_id;
            this.state.checkout.user_mobile_number=this.state.user.mobile_number;
            this.state.checkout.delivery_address=this.state.user.address;
            this.state.checkout.email=this.state.user.email;
            this.state.checkout.total_price=this.state.total_price;
            // this.setState({user_mobile_number:this.state.user.user_mobile_number});
            // this.setState({delivery_address:this.state.user.address});
            this.state.checkout.food_id.push(this.state.cartItems.food_id[i]);
            this.state.checkout.food_name.push(this.state.cartItems.food_name[i]);
            this.state.checkout.food_image.push(this.state.cartItems.food_image[i]);
            this.state.checkout.price.push(this.state.cartItems.price[i]);
            this.state.checkout.available.push(this.state.cartItems.available[i]);
            this.state.checkout.indexOf.push(this.state.cartItems.indexOf[i]);
            this.state.checkout.quantity.push(this.state.cartItems.quantity[i]);
            this.state.checkout.provider_id.push(this.state.cartItems.provider_id[i]);
            this.state.checkout.provider_mobile_number.push(this.state.cartItems.provider_mobile_number[i]);
            this.state.checkout.provider_address.push(this.state.cartItems.provider_address[i]);
            this.state.checkout.gstin.push(this.state.cartItems.gstin[i]);
            this.state.checkout.tax.push(this.state.cartItems.tax[i]);
            this.state.checkout.provider_name.push(this.state.cartItems.provider_name[i]);
            console.log(this.state.checkout);
            localStorage.setItem('checkout',JSON.stringify(this.state.checkout));
            localStorage.removeItem('cart');
            this.props.history.push('/checkout');
        }
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
                            <a href="/" className="btn btn-outline-info btn-sm pull-right">Continue Shopping</a>
                            <div className="clearfix"></div>
                        </div>
                        <div className="card-body">
                            {this.state.cartItems.food_id.map((a, index) =>
                                <div key={this.state.cartItems.food_id[index]}>
                                    <div className="row" >


                                        <div className="col-12 col-sm-12 col-md-2 text-center">

                                            <img className="img-responsive" src={this.state.cartItems.food_image[index]} alt="preview" width="120" height="80" />
                                            
                                        </div>
                                        <div className="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
                                            <h4 className="col-4 col-sm-4 col-md-4"><strong>{this.state.cartItems.food_name[index]}</strong></h4>
                                            
                                        </div>
                                        
                                        <div className="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                                            
                                            <div className="col-3 col-sm-3 col-md-6 text-md-right" style={{ paddingTop: '5px' }}>
                                                <h6><strong>{this.state.cartItems.price[index]} <span className="text-muted">x</span></strong></h6>
                                            </div>
                                            <div className="col-4 col-sm-4 col-md-4">
                                                <div className="quantity">
                                                    <button type="button" value="+" className="plus" onClick={() => this.add(index)}><i className="fas fa-plus-circle"></i></button>
                                                    <input type="number" value={this.state.cartItems.quantity[index]} title="Qty" className="qty" onChange={() => this.updateQuantity(this.state.cartItems.quantity[index])} />
                                                    <button type="button" value="-" className="minus" onClick={() => this.sub(index)}><i className="fas fa-minus-circle"></i></button>
                                                </div>
                                            </div>
                                            <div className="col-2 col-sm-2 col-md-2 text-right">
                                                <button type="button" className="btn btn-outline-danger btn-xs" onClick={() => this.remove(index)}>
                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>
                            
                                        </div>
                               

                                    </div>
                                             <div className="row">
                                                <div className=" col-sm-9">
                                                </div>
                                                <div className="col-sm-3">
                                                    <p>Rs. {this.state.total[index]}</p>
                                                </div>
                                            </div>
                                    <hr/>
                            
                                </div>
                            )}
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
                                    Total price: <b>{this.state.total_price}</b>
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
export default withAlert(Cart);