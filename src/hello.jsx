import React from 'react'
// import api from './api';
import {withAlert} from 'react-alert';
//import PrintButton from "./PrintButton";
import Invoice from "./invoice1";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
//import { CSSTransitionGroup } from 'react-transition-group'
var QRCode = require('qrcode.react');


class Hello extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            path:'',
        }
    }
    componentWillMount() {
      
    }
    printDocument() {
        const input = document.getElementById('divToPrint');
        html2canvas(input)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 0, 0);
            // pdf.output('dataurlnewwindow');
            pdf.save("download.pdf");
          })
        ;
      }
    render() {
        return (
            <div className="container">
                {/* <PrintButton id={"singlePage"} label={"Print single page"} />
  <Invoice id={"singlePage"} /> */}
                

                <div className="mb5">
                        <button className="btn btn-warning" onClick={this.printDocument} style={{float:"center"}}>Print</button>
                    </div>
                    <div id="divToPrint" className="mt4" style={{
                    backgroundColor: '#f5f5f5',
                    width: '210mm',
                    minHeight: '297mm',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                    }}>
{/*         
        {JSON.parse(sessionStorage.getItem('offerInvoice'))?(
            <div>
                {console.log(JSON.parse(sessionStorage.getItem('offerInvoice')))}
            </div>
        ):( */}
       
            <div><Invoice/></div>
        {/* )} */}
                
      </div>
            </div>
        )
    }
}
export default withAlert(Hello);