import React, {Component} from 'react';
//import './invoice.css';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import {withAlert} from 'react-alert';
import QRCode from 'qrcode.react';

class Invoice1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData:[],
            date:'',
            exarray:[],
            numPages: null,
            pageNumber: 1,
            provider: false,
            sameProvider:{"provider_address":"","provider_mobile_number":0,"gstin":"","provider_id":0,"provider_name":""},
            provider_id:[],
            path:'',
            grand_total:0,
            totalGst:0,
        }
        
        
    }
    componentWillMount() {
        this.state.orderData=JSON.parse(localStorage.getItem('invoice'));
    }
    componentDidMount() {
        //localStorage.clear('invoice')
        if(this.state.orderData) {
          //  console.log( 25* (this.state.provider_wo_duplicate_length))
            this.state.grand_total=this.state.orderData.total_price+(25* (this.state.orderData.provider_wo_duplicate_length));
            this.setState({grand_total:this.state.grand_total});
            console.log(this.state.grand_total)
var j=0;
            for (var i=0;i<this.state.orderData.food_id.length;i++) {
               j+=( ( (this.state.orderData.price[i])/(100+(this.state.orderData.tax[i])))*(this.state.orderData.tax[i]));
                //console.log(j);
            }
            this.setState({totalGst:j.toFixed(1)});
            console.log(j.toFixed(1));

            var today = new Date();
            var date = today.getDate()+ '-' + (today.getMonth() + 1) + '-' +today.getFullYear()   ;
            this.setState({date:date})
            console.log("Invoice data: ",this.state.orderData);
            this.checkProviders();
         
            if(typeof window !== 'undefined') {
                this.state.path = window.location.protocol + '//' + "103.207.1.123:3006" + '/qr_invoice?in=';
                console.log(this.state.path);
                this.setState({path:this.state.path});
            }

        }
     
    }
    checkProviders() {
        var count=0;
        var array=[]; 
        for(var i=0;i<this.state.orderData.food_id.length;i++) {
                         
                array.push(this.state.orderData.provider_id[i])
        }

        var set= new Set(array);
        var set1=Array.from(set);
        this.state.provider_id=set1;
         //console.log(this.state.provider_id)
         if(this.state.provider_id.length>1) {
                count++;
                console.log("No same provider");
                                      
            } else {
                console.log("Same provider");
                for(var i=0;i<this.state.orderData.food_id.length;i++) {
                    console.log(this.state.orderData.provider_id[i])
                    this.state.sameProvider.provider_address=this.state.orderData.provider_address[i];
                    this.state.sameProvider.provider_mobile_number=this.state.orderData.provider_mobile_number[i];
                    this.state.sameProvider.gstin=this.state.orderData.gstin[i];
                    this.state.sameProvider.provider_id=this.state.orderData.provider_id[i];
                    this.state.sameProvider.provider_name=this.state.orderData.provider_name[i];
                }
            
            }
            
        if(count>=1) {
            this.setState({provider:true});
        } else {
            this.setState({provider:false});
        }
       
    }

    render() {
        if(this.state.orderData) {
      if(this.state.provider === true) {
          //console.log("No same provider",this.state.provider_id)
          return(
              <div>
            {this.state.orderData.provider_id.map((o,index)=>
              <div key={index} style={{textAlign:"left",paddingLeft:"10px"}}>
                
                  <h3 style={{ color:"white", backgroundColor:" #10bcb3"}}>Native Food</h3> 
                  <div>
                        <h4 style={{display:"inline", float:"left"}}>Invoice Number:    
                            <p style={{color:"black", display:"inline"}}> {this.state.orderData.invoice_number+''+this.state.orderData.provider_id[index]}</p> 
                        </h4>
                            
                        <h4 style={{ display:"inline", float:"right"}}>Date:
                            <p style={{color:"black", display:"inline"}}> {this.state.date}</p>
                        </h4>
                    </div>
                    <hr/>
<br/>
<br/>

                       
               {/* Provider info */}
               <div >
                        <h4 style={{color:"#10bcb3", fontWeight:"bold"}}>PROVIDER ADDRESS: </h4>
                        
                        <h4 style={{color:"black", fontWeight:"bold"}}>Mr/Ms. {this.state.orderData.provider_name[index].charAt(0).toUpperCase() + this.state.orderData.provider_name[index].slice(1)}</h4>
                        <h4 style={{color:"black", fontWeight:"bold"}}>Address: {this.state.orderData.provider_address[index]}</h4>     
                        <h4 style={{color:"black", fontWeight:"bolder"}}>Mobile: (91)-{this.state.orderData.provider_mobile_number[index]}</h4>         
                        <h4 style={{color:"black", fontWeight:"bolder"}}>GSTIN: {this.state.orderData.gstin[index]}</h4>
                   
                    </div>
                            {/* Customer info */}
              
                    <div >
                        <h4 style={{color:"#10bcb3", fontWeight:"bold"}}>THIS BILLING IS ADDRESSED TO: </h4>
                        
                        <h4 style={{color:"black", fontWeight:"bold"}}>Name: Mr/Ms. {this.state.orderData.username.charAt(0).toUpperCase() + this.state.orderData.username.slice(1)}</h4>
                        <h4 style={{color:"black", fontWeight:"bolder"}}>Mobiel: (91)-{this.state.orderData.user_mobile_number}</h4>
                        <h4 style={{color:"black", fontWeight:"bold"}}>Delivery Address: {this.state.orderData.delivery_address.charAt(0).toUpperCase() + this.state.orderData.delivery_address.slice(1)}</h4>              
                    </div>


                {/* food info */}
                <div>
                    <h3 style={{backgroundColor:"#10bcb3 "}}>Food Details</h3>
                    <br/>
                    <table className="table table-responsive-sm">
                      <thead>
                            <tr style={{ fontSize:"20px"}}>
                                <th style={{textAlign:"center"}}>Food Name</th>
                                <th style={{textAlign:"center"}}>Quantity <i className="fas fa-times "></i> Price</th>
                                <th style={{textAlign:"center"}}>GST</th>
                                <th style={{textAlign:"center"}}>CGST</th>
                                <th style={{textAlign:"center"}}>SGST</th>
                                <th style={{textAlign:"center"}}>Total(GST+Total)</th>
                            </tr>
                       </thead>

                       <tbody>  
                            <tr style={{ color:"black", backgroundColor:"white", fontSize:"15px"}} >
                                <td style={{textAlign:"center"}}>{this.state.orderData.food_name[index]}</td>                                        
                                <td style={{textAlign:"center"}}>{this.state.orderData.quantity[index]} <i className="fas fa-times "></i> {this.state.orderData.price[index]}</td>
                                <td style={{textAlign:"center"}}> { ( ( (this.state.orderData.price[index])/(100+(this.state.orderData.tax[index])))*(this.state.orderData.tax[index])).toFixed(1) }</td>

                                <td style={{textAlign:"center"}}> { ( ( (this.state.orderData.price[index])/(100+(this.state.orderData.tax[index])))*((this.state.orderData.tax[index])/2)).toFixed(1) }</td>
                                <td style={{textAlign:"center"}}> { ( ( (this.state.orderData.price[index])/(100+(this.state.orderData.tax[index])))*((this.state.orderData.tax[index])/2)).toFixed(1) }</td>

                                <td style={{textAlign:"center"}}>Rs.{this.state.orderData.quantity[index] * this.state.orderData.price[index]} </td>
                            </tr>  
                           
                        </tbody>

                     </table>
                </div>
                <hr/>

               

<hr/>
<QRCode  value={this.state.path+this.state.orderData.invoice_number+''+this.state.orderData.provider_id[index]} />
              </div>
              )}
              <hr/>
 {/* Total and packing */}
 <div className="row">
				    <div className="col-9">
				    </div>
				    <div className="col-sm-3" style={{ textAlign:"justify",fontSize:"15px"}}>

                        <div className="row">
                            <div className="col-6">
                                    <label>Total price</label>
                            </div>
                            <div className="col-6">
                                    <label>Rs.{this.state.orderData.total_price}</label>
                            </div>
                        </div>

					    <div className="row">
                            <div className="col-6">
                                 {this.state.orderData.provider_wo_duplicate_length>1?(
                                    <label>Packing Fee ({25}*{this.state.orderData.provider_wo_duplicate_length})</label>
                                ):(
                                    <label>Packing Fee</label>
                                )} 
                            </div>
                            <div className="col-6">
                                {this.state.orderData.provider_wo_duplicate_length>1?(
                                    <label> Rs.{(25*this.state.orderData.provider_wo_duplicate_length)}</label>
                                ):(
                                    <label>Rs.25</label>
                                )}       
                            </div>
    
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

              </div>
              
          )
       
      } else {
        return(
            <div>
                
                <h3 style={{ color:"white", backgroundColor:" #10bcb3"}}>Native Food</h3> 
                    <div>
                        <h4 style={{display:"inline", float:"left"}}>Invoice Number:    
                            <p style={{color:"black", display:"inline"}}> {this.state.orderData.invoice_number+''+this.state.sameProvider.provider_id}</p> 
                        </h4>
                            
                        <h4 style={{ display:"inline", float:"right"}}>Date:
                            <p style={{color:"black", display:"inline"}}> {this.state.date}</p>
                        </h4>
                    </div>
                    <hr/>
<br/>
<br/>
                                  {/* Provider info */}
                    <div style={{textAlign:"left"}}>
                        <h4 style={{color:"#10bcb3", fontWeight:"bold"}}>PROVIDER ADDRESS: </h4>
                        
                        <h4 style={{color:"black", fontWeight:"bold"}}>Mr/Ms. {this.state.sameProvider.provider_name.charAt(0).toUpperCase() + this.state.sameProvider.provider_name.slice(1)}</h4>
                        <h4 style={{color:"black", fontWeight:"bold"}}>Address:{this.state.sameProvider.provider_address}</h4>              
                        <h4 style={{color:"black", fontWeight:"bolder"}}>Mobile:(91)-{this.state.sameProvider.provider_mobile_number}</h4>
                        <h4 style={{color:"black", fontWeight:"bolder"}}>GSTIN:{this.state.sameProvider.gstin}</h4>
                         
                    </div>
                     {/* Customer info */}
                
                    <div style={{textAlign:"left"}}>
                        <h4 style={{color:"#10bcb3", fontWeight:"bold"}}>THIS BILLING IS ADDRESSED TO: </h4>
                        
                        <h4 style={{color:"black", fontWeight:"bold"}}>Name: Mr/Ms. {this.state.orderData.username.charAt(0).toUpperCase() + this.state.orderData.username.slice(1)}</h4>
                        <h4 style={{color:"black", fontWeight:"bolder"}}>Mobile: (91)-{this.state.orderData.user_mobile_number}</h4>
                        <h4 style={{color:"black", fontWeight:"bold"}}>Delivery Address: {this.state.orderData.delivery_address.charAt(0).toUpperCase() + this.state.orderData.delivery_address.slice(1)}</h4>              
                    </div>
              

                {/* food info */}
                <div>
                    <h3 style={{backgroundColor:"#10bcb3 "}}>Food Details</h3>
                    <br/>
                    <table className="table table-responsive-sm">
                      <thead>
                            <tr style={{ fontSize:"20px"}}>
                                <th style={{textAlign:"center"}}>Food Name</th>
                                <th style={{textAlign:"center"}}>Quantity <i className="fas fa-times "></i> Price</th>
                                <th style={{textAlign:"center"}}>GST</th>
                                <th style={{textAlign:"center"}}>SGST</th>
                                <th style={{textAlign:"center"}}>CGST</th>
                                <th style={{textAlign:"center"}}>Total(GST+Total)</th>
                            </tr>
                       </thead>
                       <tbody>
                          {this.state.orderData.food_id.map((o,index)=>
                            <tr key={index} style={{ color:"black", backgroundColor:"white", fontSize:"15px"}} >
                            
                                <td style={{textAlign:"center"}}>{this.state.orderData.food_name[index]}</td>                                        
                                <td style={{textAlign:"center"}}>{this.state.orderData.quantity[index]} <i className="fas fa-times "></i> {this.state.orderData.price[index]}</td>
                                <td style={{textAlign:"center"}}> { ( ( (this.state.orderData.price[index])/(100+(this.state.orderData.tax[index])))*(this.state.orderData.tax[index])).toFixed(1) }({this.state.orderData.tax[index]}%)</td>

                                <td style={{textAlign:"center"}}> { ( ( (this.state.orderData.price[index])/(100+(this.state.orderData.tax[index])))*((this.state.orderData.tax[index])/2)).toFixed(1) }({this.state.orderData.tax[index]/2}%)</td>
                                <td style={{textAlign:"center"}}> { ( ( (this.state.orderData.price[index])/(100+(this.state.orderData.tax[index])))*((this.state.orderData.tax[index])/2)).toFixed(1) }({this.state.orderData.tax[index]/2}%)</td>

                                <td style={{textAlign:"center"}}>Rs.{this.state.orderData.quantity[index] * this.state.orderData.price[index]} </td>
                            
                            </tr>   
                          )}  
            
                          <tr>
                                <td></td>
                                <td style={{textAlign:"center"}}>Total GST</td>
                                <td style={{textAlign:"center"}}>{this.state.totalGst}</td>
                            </tr>                           
                        </tbody>
                     </table>
             
                </div>
                <hr/>

            {/* Total and packing */}
                <div className="row">
				    <div className="col-3">
                    <QRCode value={this.state.path+this.state.orderData.invoice_number+''+this.state.orderData.provider_id } />
				    </div>
                    <div className="col-6">
                    </div>
				    <div className="col-sm-3" style={{ textAlign:"justify",fontSize:"15px"}}>

                        <div className="row">
                            <div className="col-6">
                                    <label>Total price</label>
                            </div>
                            <div className="col-6">
                                    <label>Rs.{this.state.orderData.total_price}</label>
                            </div>
                        </div>

					    <div className="row">
                            <div className="col-6">
                                <label>Packing fee</label>
                            </div>
                            <div className="col-6">
                            {this.state.orderData.provider_wo_duplicate_length>1?(
                                <label>Rs. {(25* this.state.orderData.provider_wo_duplicate_length)}</label>
                            ):(
                                <label>Rs. 25</label>
                            )}
                                    
                            </div>
                            {/* <div className="col-6">
                                    <label>Rs. 25</label>
                            </div> */}
					    </div>
<hr/>
					    <div className="row">
						  <div className="col-6">
								<label>Grand total</label>
						  </div>
						  <div className="col-6">
								<label>Rs.{this.state.orderData.total_price + 25}</label>
						  </div>
					     </div>
				    </div>
			    </div>

<hr/>

            </div>
        )
          
      }
    } else {
        return(
        <div>
          <p>Refresh the page to get your invoie</p>
          <a href="/hello">Refresh</a>
        </div>
            
        )
    }
    }
}
export default withAlert(Invoice1);