import React, {Component} from 'react';
import api from './api';
import queryString from 'query-string';

class QrInvoice extends React.Component {

constructor(props) {
    super(props);
    this.state= {
            invoice:{"food_id":[],"food_name":[],"food_image":[],"price":[],"quantity":[],"provider_id":0,"provider_mobile_number":"","invoice_number":"","payment_option":"","order_status":"","total_price":0,"user_id":0,"user_mobile_number":0,"user_email":"","indexOf":[],"order_id":"","delivery_address":"","provider_name":"","provider_address":""},
            //invoice1:{},
           
        }
    }
   async componentDidMount() {
        const values1= (queryString.parse(this.props.location.search));
        console.log(values1.in);
        var values2=values1.in
        var values = values2.slice(0,12);
        var values3 = values2.slice(12,14);
        console.log(typeof(values));
        
        var data = {};
        api.get('/order/'+values2.slice(0,12)).then(response=>{
            console.log(response.data);
     
           data=response.data;
           console.log(this.state.invoice1);
           this.getInvoice(data,values3);
        }).catch(err=>{
            console.log(err);
        })
            
    }
    getInvoice(data,values3) {
        console.log(typeof(values3));
        console.log(data);
        for(var i=0;i<data.provider_id.length;i++) {
            console.log("hai")
            console.log(typeof(data.provider_id[i]));
            if((data.provider_id[i]) === parseInt(values3) ) {
                console.log("hello")
                //this.state.invoice=data.provider_id[i];
                //this.setState({invoice:data.data});
                //console.log(data);
                this.state.invoice.food_id[i]=data.food_id[i];
                this.state.invoice.food_name[i]=data.food_name[i]
                this.state.invoice.food_image[i]=data.food_image[i]
                this.state.invoice.price[i]=data.price[i]
                this.state.invoice.quantity[i]=data.quantity[i]
                this.state.invoice.provider_id=data.provider_id[i]
                this.state.invoice.provider_mobile_number=data.provider_mobile_number[i]

                this.state.invoice.provider_address=data.provider_address[i]
                this.state.invoice.provider_name=data.provider_name[i]

                this.state.invoice.indexOf[i]=data.indexOf[i]
                this.state.invoice.gstin=data.gstin[i]
                this.state.invoice.invoice_number=data.invoice_number+''+data.provider_id[i]

                this.state.invoice.user_id=data.user_id
                this.state.invoice.user_mobile_number=data.user_mobile_number
                this.state.invoice.delivery_address=data.delivery_address
                this.state.invoice.order_id=data.order_id

                this.state.invoice.order_status=data.order_status
                this.state.invoice.payment_option=data.payment_option
                this.state.invoice.user_email=data.user_email

                this.state.invoice.total_price=data.total_price;
                this.setState({invoice:this.state.invoice})
            }
        }
        console.log(this.state.invoice);
    }
    render() {
        return(
            <div>
                <h1>Invoice Data</h1>
               
                    <p>Invoice Number:{this.state.invoice.invoice_number}</p>
                
                <table className="table table-responsive-sm" >
                    <thead>
                        <tr>
                          
                            <th>Food Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Provider Name</th>
                            <th>Provider Address</th>
                            <th>GSTIN</th>
                            <th>Provider Mobile Number</th>
                        </tr>
                    </thead>
                {this.state.invoice.delivery_address.length>1?(
                    <tbody>
                        {this.state.invoice.food_id.map((i,index)=>
                        <tr key={index}>
                           
                            <td>{this.state.invoice.food_name[index]}</td>
                            <td>{this.state.invoice.quantity[index]}</td>
                            <td>{this.state.invoice.price[index]}</td>
                            <td>{this.state.invoice.quantity[index] * this.state.invoice.price[index]}</td>
                            <td>{this.state.invoice.provider_name}</td>
                            <td>{this.state.invoice.provider_address}</td>
                            <td>{this.state.invoice.gstin}</td>
                            <td>{this.state.invoice.provider_mobile_number}</td>
                        </tr>
                        )}

                    </tbody>
   
                ):[]}
                </table>
            </div>
        )
    }
    
}
export default QrInvoice;