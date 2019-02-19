import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import api from './api';
import paypal from "./images/paypal.png";
import PaypalExpressBtn from 'react-paypal-express-checkout';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import {withAlert} from 'react-alert';

function searchAddress(term) {
	return function(x) {
		return x.toLowerCase().includes(term.toLowerCase()) || !term;
	}
}

class OfferCheckout extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            paymentID:'',
			payment:'',
			rating: 1,
			isVisible: false,
			rating: 1,
            paymentID:'',
            payment: '',
            user: JSON.parse(sessionStorage.getItem('user')),
            newaddress: false,
            delivery_address: "",
           
            order: {
                "provider_id": [], "food_id": [],
                "price": [], "quantity": [],
                "indexOf": [], "provider_address": [],"provider_name":[], "food_image": [], "food_name": [],"provider_mobile_number": [], "order_status": "dispatched", "user_id": 0, "user_mobile_number": "", "delivery_address": "", "total_price": 0, "payment_option": "", "invoice_number": "", "delivered_on": "30 Minutes","user_email":"","gstin":[],"tax":[]
            },
            grand_total:0,
            ordered_on:Date,
            total:0,
            gst:0,
			sgst:0,
			cgst:0,
            modalShow:false,
            feedback:{ 
                    "available":0,
                    "food_id":0,
                    "rating":0
				},
			paymentShow:false,
			userOrder:[],
			view:"true",
			oldAddress:"false",
			packing:25,
			provider_wo_duplicate_length:1,
			old_user_delivery_address:[],
            offerCheckout:JSON.parse(localStorage.getItem('offerCheckout')),
            //checkout:JSON.parse(localStorage.getItem('checkout')),
            offerUpdate:{"available":""},
        }
		//localStorage.removeItem('invoice');
        this.searchHandler=this.searchHandler.bind(this);
		this.searchHandlers=this.searchHandlers.bind(this);
		console.log(this.state.offerCheckout)
        if (this.state.offerCheckout){
			
		// 	function find_duplicate_in_array(arra1) {
		// 		var object = {};
		// 		var result = [];
		
		// 		arra1.forEach(function (item) {
		// 		  if(!object[item])
		// 			  object[item] = 0;
		// 			object[item] += 1;
		// 		})
		
		// 		for (var prop in object) {
		// 		   if(object[prop] >=1) {
		// 			   result.push(prop);
		// 		   }
		// 		}
		
		// 		return result;
		
		// 	}
		// var provider_wo_duplicate = find_duplicate_in_array(this.state.checkout.provider_id);
		//console.log(provider_wo_duplicate.length)
		//	console.log(provider_wo_duplicate);
			// if(provider_wo_duplicate.length>1) {
			// 	this.state.packing=this.state.packing*provider_wo_duplicate.length;
			// 	this.state.provider_wo_duplicate_length=provider_wo_duplicate.length;
			// 	console.log(this.state.packing);
			// } else {
			// 	console.log(this.state.packing)
			// }

            this.state.grand_total=this.state.offerCheckout.total_price;
            this.state.gst=(this.state.offerCheckout.total_price*5)/100;
            
			this.state.sgst=(this.state.offerCheckout.total_price*(2.5))/100;
            this.state.cgst=(this.state.offerCheckout.total_price*(2.5))/100;
            
            this.state.grand_total =this.state.offerCheckout.total_price+this.state.packing;
            this.state.grand_total=(Number(this.state.grand_total).toFixed(1));

        }
         this.newAddress = this.newAddress.bind(this);
         this.changeAddress = this.changeAddress.bind(this);

        if (this.state.user && this.state.offerCheckout) {
            this.state.delivery_address = this.state.user.address;
            //console.log("offerCart data: ",this.state.offerCheckout);
        }
     
    }

    componentDidMount() {
		console.log(this.state.offerCheckout.tax)
		window.scrollTo(0,0);
		if(this.state.user){
            api.get('/ordersBy/'.concat(this.state.user.user_id)).then(response=>{
                this.setState({userOrder:response.data});
                console.log("Selected User Orders(for getting previous delivery address): ",this.state.userOrder);
            }).catch(error=>{
                console.log(error);
            })
		}	
				
	}
	address() {

		let a = [];
		for(var i=0;i<this.state.userOrder.length;i++) {
			
			a.push(this.state.userOrder[i].delivery_address);
			
		}
		var set = new Set(a);
		this.state.old_user_delivery_address = Array.from(set)
		console.log("User old delivery address without duplicates: ",this.state.old_user_delivery_address);
	}
	updateModal(isVisible) {
    	this.state.isVisible = isVisible;
      	this.forceUpdate();
    }
	//for toggle new address textarea
    newAddress() {
		this.setState({ newaddress: true });
		this.setState({oldAddress:"false"});
    }
    // for add new address
    changeAddress() {
        var address = this.state.delivery_address;
        this.setState({ newaddress: false });
		this.props.alert.show("Your delivery address changed successfully!!!")
	}
	// show payment
	showPayment(){
		this.setState({paymentShow:true});
	}
	confirmOrder() {

            this.state.order.provider_id.push(this.state.offerCheckout.provider_id);
            this.state.order.food_id.push(this.state.offerCheckout.food_id);
            this.state.order.price.push(this.state.offerCheckout.price);
            this.state.order.quantity.push(this.state.offerCheckout.quantity);
            this.state.order.food_image.push(this.state.offerCheckout.food_image);
            this.state.order.food_name.push(this.state.offerCheckout.food_name);
            this.state.order.provider_mobile_number.push(this.state.offerCheckout.provider_mobile_number);
            this.state.order.provider_address.push(this.state.offerCheckout.provider_address);
            this.state.order.user_id=this.state.offerCheckout.user_id;
            this.state.order.user_mobile_number=this.state.user.mobile_number;
            this.state.order.user_email=this.state.user.email;
            this.state.order.delivery_address=this.state.delivery_address;
            this.state.order.total_price=this.state.grand_total;
            this.state.order.payment_option=this.state.payment;
			this.state.order.indexOf.push(0);

			this.state.order.gstin.push(this.state.offerCheckout.gstin);
			this.state.order.tax.push(this.state.offerCheckout.tax);
			this.state.order.provider_name.push(this.state.offerCheckout.provider_name);
			//this.state.order.invoice_number=Date.now();
			var today=new Date();
		var date= today.getDate();
		var month=today.getMonth()+1;
		var year=today.getFullYear();

		if(date<10) {
			date='0'+date;
		}
		if(month<10) {
			month='0'+month;
		}
		var hours=today.getHours();
		var minutes=today.getMinutes();

		if (hours<10) {
			hours='0'+hours;
		}

		if(minutes<10) {
			minutes='0'+minutes;
		}
		
		var inv = year+''+month+''+date+''+''+hours+''+minutes;
		//console.log(inv);
		this.state.order.invoice_number=inv;
		//console.log(this.state.order.invoice_number);
		//this.state.order1.invoice_number=inv;
        
        //console.log(this.state.order);
         api.post('/order',this.state.order).then(response =>{
		 	console.log("Order updated successfully",response.data);
		 	this.state.order.gst=this.state.gst;
		 	this.state.order.sgst=this.state.sgst;
		 	this.state.order.cgst=this.state.cgst;
		 	this.state.order.total_price=this.state.offerCheckout.total_price;
		 	this.state.order.username=this.state.user.username;
		 	this.state.order.packing_fee=this.state.packing;
		 	this.state.order.provider_wo_duplicate_length=1;
		 	//console.log("Checkout data: ",this.state.order);
		 	//alert("data updated");
		// 	console.log(this.state.order.invoice_number);
		 	localStorage.setItem('invoice',JSON.stringify(this.state.order));
			
         }).catch(error =>{
             console.log(error);
         })
            

        //axios.get('http://api.msg91.com/api/sendhttp.php?country=91&sender=MSGIND&route=4&mobiles='+this.state.order.user_mobile_number+'&authkey=243177AyunGcNGL5bc6ed47&message= Hai! '+this.state.user.username.charAt(0).toUpperCase() + this.state.user.username.slice(1)+' .Your order placed successfully. Please pay Rs. '+this.state.order.total_price+' and get your food. Your invoice number is: '+this.state.order.invoice_number+' use it for future reference. Have a healthy food. Browse again @ http://13.58.92.162:3006 .',{headers: {'crossDomain':true}});
		

        var available=this.state.offerCheckout.available-this.state.offerCheckout.quantity;
        console.log(available);
        console.log(this.state.offerCheckout.provider_id)
        this.state.offerUpdate.available=available;
        console.log(this.state.offerUpdate.available);
        var id =this.state.offerCheckout.provider_id
        api.put('/offers/updatequantity/'+id,this.state.offerUpdate). then(response =>{
            console.log(response.data);
            //console.log("hello");
        }).catch(err =>{
            console.log(err);
		})
		console.log("hai",JSON.parse(localStorage.getItem('invoice')))
		//window.location.reload(true);
		//localStorage.clear('offercart');
        this.props.history.push('/success');
        //this.availableUpdate();

    }

    onStarClick(nextValue, prevValue, name) {
		this.setState({rating: nextValue});
		this.state.rating=nextValue;
		//console.log(nextValue);
		//this.close();
      }
    close(){
        this.state.feedback.rating=this.state.rating;
         for(var i=0;i<this.state.offerCheckout.food_id.length;i++) {
            
            this.state.feedback.available=(this.state.offerCheckout.available[i])-(this.state.offerCheckout.quantity[i]);
            this.state.feedback.food_id=this.state.offerCheckout.food_id[i];
            //console.log("Food already available in provider store "+this.state.checkout.available[i]);
            //console.log("quantity checkout "+this.state.checkout.quantity[i]);
			//console.log("available after quantity update "+this.state.feedback.available);
			//console.log(this.state.feedback);
            api.put('/offers/updatequantity/'+this.state.offerCheckout.provider_id[i]). then(response =>{
				console.log(response.data);
				//console.log("hello");
            }).catch(err =>{
                console.log(err);
            })
        }
        //console.log("star rating and available and food id: "+this.state.feedback.rating);
		this.confirmOrder();
		//this.setState({modalShow:false});
		//this.state.modalShow=false;
        //this.props.history.push('/');
    }
    
    fb(cod){
        this.setState({payment:cod});
        this.state.payment=cod
        this.confirmOrder();
		//(this.modal).modal('show');
		
	}

	searchHandler(event) {
		this.state.view="true";
		this.setState({view:"true"});
		this.setState({delivery_address:event.target.value});
	}

	searchHandlers(a) {
		this.state.delivery_address=a;
		for(var i=0;i<this.state.order;i++) {
				this.state.order.delivery_address=this.state.delivery_address;
				
		}
		//alert("Delivery address selected successfully")
		this.props.alert.show("Delivery address selected successfully");
		this.state.view="false";
		this.setState({oldAddress:"false"});
		//this.scroll();
		
	}

	showOldAddress() {
		this.address();
		this.setState({oldAddress:"true"});
		this.setState({ newaddress: false });
	}

	// scroll() {
	// 	window.scrollTo({
	// 		top:this.myRef.current.offsetTop,
	// 		behavior:"smooth"
	// 	})
    // }
    
    render(){
		if(this.state.offerCheckout) {
		const {rating} = this.state;
		const onSuccess = (payment) => {
            // Congratulation, it came here means everything's fine!
            		console.log("The payment was succeeded!", payment);
            		// You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
					this.state.paymentID=payment.paymentID;
					this.fb("paypal");
					this.state.rating=4;
					this.close();
				}
 
        const onCancel = (data) => {
			// User pressed "cancel" or close Paypal's popup!
			alert("Transaction cancelled. Try again!!!");	
			console.log('The payment was cancelled!', data);
			
            // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
        }
 
        const onError = (err) => {
			// The main Paypal's script cannot be loaded or somethings block the loading of that script!
			alert("Transaction cancelled. Try again!!!");	
            console.log("Error!", err);
            // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
            // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
        }
 
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = 1; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/
 
        const client = {
            sandbox:    'AZOydPphjOEGhm-gS8iPiBdESForP9ExEeUsUXQkOg4Y_TM97VH9ZKUrpUbkt_ePXbmCEm1wVC1-2vHm',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        // In order to get production's app-ID, you will have to send your app to Paypal for approval first
        // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
        //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
        // For production app-ID:
        //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/
 
        // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
        return(
            <div>
				{/* <button className="btn btn-success" onClick={()=> this.scroll()}>Track your order</button> */}
             <div className="privacy">
		<div className="container">
			
			<h3 className="tittle-w3l">Checkout
				<span className="heading-style">
					<i></i>
					<i></i>
					<i></i>
				</span>
			</h3>
		
			<div className="checkout-right">
				<h4>Your shopping cart contains:
					{this.state.offerCheckout?(
					<span>{this.state.offerCheckout.food_id.length} 
					{this.state.offerCheckout.food_id.length>1?(" items"):
						(" item")
					}
					</span>
					):(
						<h4>Nothing to show</h4>
					)}
				</h4>
				<div className="table-responsive">
					<table className="timetable_sub">
						<thead>
							<tr>
								<th>S. No.</th>
								<th>Provider Id</th>
								<th>Product Name</th>
								<th>Quantity</th>
								<th>Price</th>
								<th>GST</th>
								<th>SGST</th>
								<th>CGST</th>
								<th>Total</th>
							</tr>
						</thead>
						{this.state.offerCheckout?(
						<tbody>
						
							<tr className="rem1" >
								<td className="invert">{1}</td>
								
								<td>{this.state.offerCheckout.provider_id}</td>
								<td className="invert">{this.state.offerCheckout.food_name}</td>
								<td className="invert">
									
									{this.state.offerCheckout.quantity}
								</td>
								
								<td className="invert">{this.state.offerCheckout.price - ( ( (this.state.offerCheckout.price)*(this.state.offerCheckout.tax) )/100 ).toFixed(1)}</td>

								<td className="invert">{( ( (this.state.offerCheckout.price)*(this.state.offerCheckout.tax) )/100 ).toFixed(1)}({this.state.offerCheckout.tax}%)</td>
								<td className="invert">{(( ( (this.state.offerCheckout.price)*(this.state.offerCheckout.tax) )/100 )/2).toFixed(2)}({this.state.offerCheckout.tax/2}%)</td>
								<td className="invert">{(( ( (this.state.offerCheckout.price)*(this.state.offerCheckout.tax) )/100 )/2).toFixed(2)}({this.state.offerCheckout.tax/2}%)</td>
								<td className="invert">{this.state.offerCheckout.price* this.state.offerCheckout.quantity}</td>
						
							</tr>
						
						</tbody>
						):[]}
					</table>
				</div>
			</div>
<br/>
<br/>
								{/* total starts */}
			<div className="row">
				<div className="col-8">
				</div>
				<div className="col-sm-4" style={{border:"1px solid", textAlign:"justify"}}>

					 <div className="row">
						  <div className="col-6">
								<label>Total price</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.offerCheckout.total_price}</label>
						  </div>
					 </div>

					 {/* <div className="row">
						  <div className="col-6">
								<label>GST</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.gst}</label>
						  </div>
					 </div>

					<div className="row">
						  <div className="col-6">
								<label>SGST</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.sgst}</label>
						  </div>
					 </div>

					<div className="row">
						  <div className="col-6">
								<label>CGST</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.cgst}</label>
						  </div>
					</div> */}

					<div className="row">
					   
						  <div className="col-6">
						  {(this.state.offerCheckout.provider_id.length>1)  ?(
							  <div>
							  	<label>Packing fee</label>
								<label data-toggle="tooltip" title="packing charges * no of providers">  (25 * {this.state.provider_wo_duplicate_length})</label>
							  </div>	
						  ):(
								<label>Packing fee</label>
						  )}
								
						  </div>
						  {this.state.offerCheckout.provider_id.length>1?(
								<div className="col-6">
									<label>Rs. {this.state.packing}</label>
									{/* <span>(for each provider)</span> */}
								</div>
						  ):(
								<div className="col-6">
									<label>Rs. {this.state.packing}</label>
								</div>
						  )}
						  
					 </div>
<hr/>
					 <div className="row">
						  <div className="col-6">
								<label>Grand total</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.grand_total}</label>
						  </div>
					 </div>
				</div>
			</div>
					{/* total ends */}

							{/* address starts */}

			
			<div className="checkout-left" style={{backgroundColor:"#10bcb3"}}>
			<h2 >Delivery address</h2>
			<br/>
				<div className="row">
					<div className="col-sm-12" ref={this.myRef}>
						<h4 style={{display:"inline"}}> Your address:</h4>
						<h4 style={{display:"inline"}}>{this.state.delivery_address}</h4>
					</div>


					<div className="col-sm-6">
						<button onClick={()=> this.showOldAddress()} className="btn" style={{backgroundColor:"#1affc6"}}>Select from old orders</button>
						
						{this.state.oldAddress === "true"?(
							<div >
								<input type="search" onChange={this.searchHandler} placeholder="Type the cityname..."  />
								{this.state.old_user_delivery_address.filter(searchAddress(this.state.delivery_address)).map((a,index)=>
										<ul style={{listStyleType:"none"}} key={index}>
											{this.state.view === "true"?(
												<li><a href="#" onClick={()=> this.searchHandlers(a)} style={{color:"#ffff99"}}>{a}</a></li>
											):[]}
										</ul>
									)}
							</div>
						):[]}
						
					</div>



					<div className="col-sm-6">
					<button className="btn btn-info" onClick={() => this.newAddress()}>New delivery address</button><br /><br />
						{this.state.newaddress ? (
							<div>
								<textarea style={{ backgroundColor: "#dadfe8" }} onChange={event => this.setState({ delivery_address: event.target.value })} /><br /><br />
								<button className="btn btn-success" onClick={() => this.changeAddress()}>Change</button>
							</div>
						) : []
						}
					</div>
				</div>		
			</div>
			{/* address ends */}
				<div className="clearfix"> </div>
			</div>
		</div>
		<div className="checkout-right-basket">
			<a onClick={()=> this.showPayment()} className="btn" style={{backgroundColor:"#b3ff66"}}>Make a Payment
				{/* <span className="fa fa-hand-o-right" aria-hidden="true"></span> */}
			</a>
		</div>
			{this.state.paymentShow === true?(
				<div style={{minHeight:"500px"}}>

				<ul className="nav nav-pills nav-fill">
					<li className="nav-item">
						<a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Cash on delivery (COD)</a>
					</li>
					<li className="nav-item disabled">
						<a className="nav-link" id="home-tab" data-toggle="" href="#profile" role="tab" aria-controls="home" aria-selected="true">Stripe Checkout</a>
					</li>
				
					<li className="nav-item">
						<a className="nav-link " id="home-tab" data-toggle="tab" href="#settings" role="tab" aria-controls="home" aria-selected="true">Paypal Account</a>
					</li>
				</ul>
	
			 {/* Tab panes  */}
				<div className="tab-content">
						{/* tab 1*/}
					<div className="tab-pane active" id="home" role="tabpanel" aria-labelledby="home-tab">
						<div>
							<div className="vertical_post check_box_agile">
								{/* <h5>COD</h5> */}
								<div className="checkbox" style={{padding:"50px"}}>
									<div className="check_box_one cashon_delivery">
										<label className="anim">
										{/* <a ref={modal=> this.modal = modal} data-toggle="modal" data-target="#feedback">
							<span className="fa fa-unlock-alt" aria-hidden="true"></span> fb </a> */}
										{/* <button onClick={()=>this.fb()}>fb</button> */}
											<button className="btn btn-info" onClick={()=> this.fb("cod")} >COD</button>
											
											<span> We also accept Credit/Debit card on delivery. Please Check with the delivery boy.</span>
										</label>
									</div>

								</div>
							</div>
						</div>
					</div>
						{/* tab 2  */}
					<div className="tab-pane disabled" id="profile" role="tabpanel" aria-labelledby="profile-tab">
					<div style={{padding:"50px"}}>
						<StripeCheckout
							token={this.onToken}
							stripeKey="pk_test_7Yx1hK8cWQh1flMaqeAiQTcv"
							name="SmartShopping"
							description="Shopping Product Application"
							image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRtpO609q3ZGjn8kwk1_IW1rfk1EDwkumw0eo-YV8Q5mqsNoD-xQ"
							panelLabel="Donate"
							amount={this.state.grand_total} // cents
							currency="INR"
							locale="auto"
							zipCode={true}
							billingAddress={true}
						><br />
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button className="btn btn-primary"><i className="fab fa-cc-stripe"></i>&nbsp;Pay With Card</button>
                        </StripeCheckout>
						</div>
					</div>

							{/* tab 3 */}

					<div className="tab-pane" id="settings" role="tabpanel" aria-labelledby="settings-tab">
							<div className="row" style={{padding:"50px"}}>
									<div className="col-md-6">
										<img className="pp-img" src={paypal} alt="Image Alternative text" title="Image Title"/>
										<p>Important: You will be redirected to PayPal's website to securely complete your payment.</p>
										{/* <a className="btn btn-primary">Checkout via Paypal</a> */}
									</div>
									<div className="col-md-6 number-paymk">
										<PaypalExpressBtn client={client} currency={'USD'} total={this.state.grand_total} data-toggle="modal" data-target="#feedback" />
									</div>
								</div>
							</div>
				</div>
				</div>
			):[]}

			<div>

				<div className="modal fade" id="feedback" tabIndex="-1" role="dialog">
                                <div className="modal-dialog">
                                
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" onClick={()=> this.close()}>&times;</button>
                                        </div>
                                        <div className="modal-body modal-body-sub_agile">
                                          
                                            <div className="modal_body_left modal_body_left1">
                                                <h3 className="agileinfo_sign">Rate Us </h3>
                                               
													<div>
															<h2>Please give the rating</h2>
																<StarRatingComponent 
																	name="rate1" 
																	starCount={5}
																	value={rating}
																	onStarClick={this.onStarClick.bind(this)}
																/>
													</div>
												 
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                            
                                </div>
                            </div>
					</div>
            </div>
		);
	  } else {
		  return(
			  <div>
				   {!(JSON.parse(sessionStorage.getItem('user')))?(
						<h2>You must login and add product to continue</h2>
				   ):(
						<h2>Add product to continue</h2>
				   )}
				<a href="/">
				<span>Click here to </span>
				Go Home!!!</a>
			  </div>
		  );
	  }
    }


}
export default withAlert(OfferCheckout);