  import React, { useEffect } from "react";
  import { useLocation, useNavigate, useParams } from "react-router-dom";
  import { toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import "./PaymentSucess.css"; // Import the CSS file
  import axios from "axios";
  import { PDFDocument, rgb,StandardFonts } from "pdf-lib";
  import baseUrl from "../../baseUrl";

  const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const paymentIntent = queryParams.get("payment_intent") || "N/A";
    const redirectStatus = queryParams.get("redirect_status");
    const userId = queryParams.get("userId");
    useEffect(() => {
      if (redirectStatus === "succeeded") {
        toast.success("Payment succeeded!");
        datapusher();
      } else {
        toast.error("Payment failed or was canceled.");
      }
    }, [redirectStatus]);

    const handleContinueShopping = () => {
      navigate( `/dashboard/${userId}`, { replace: true });
    };
    const datapusher = async () => {
      try {
        const response = await axios.patch(
          `${baseUrl}/api/v1/user/update/${userId}`
        );
      } catch (error) {
        console.log(error);
      }
    };
    const generateInvoice = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(
          `${baseUrl}/api/v1/user/usercarddetails/${userId}`
        );
        console.log('User Data:', userResponse.data.data);
      
        const userName = userResponse.data.data.firstName || "User";
        const amount = "100 Pounds"; // Static amount
    
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
    
        // Correct way to embed standard fonts
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
        // Define styles
        const fontSize = 12;
        const titleSize = 20;
        const sectionTitleSize = 14;
        const lineHeight = 24;
        let yPos = height - 50;
    
        // Invoice Title
        page.drawText("PAYMENT INVOICE", {
          x: width / 2 - 60,
          y: yPos,
          size: titleSize,
          color: rgb(0, 0, 0),
          font: boldFont, // Use the correct bold font reference
        });
        yPos -= lineHeight * 1.5;
    
        // Company & Invoice Details
        page.drawText("Ezhava Matrimony", { x: 50, y: yPos, size: fontSize, font: regularFont, color: rgb(0, 0, 0) });
        page.drawText(`Invoice No: INV-${Math.floor(Math.random() * 10000)}`, { x: 400, y: yPos, size: fontSize, font: regularFont, color: rgb(0, 0, 0) });
        yPos -= lineHeight;
    
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y: yPos, size: fontSize, font: regularFont, color: rgb(0, 0, 0) });
        yPos -= lineHeight;
    
        // Invoice Details Section
        page.drawText("BILL TO:", { x: 50, y: yPos, size: sectionTitleSize, font: boldFont, color: rgb(0, 0, 0.8) });
        yPos -= lineHeight;
    
        page.drawText(`Account Holder: ${userName}`, { x: 50, y: yPos, size: fontSize, font: regularFont, color: rgb(0.2, 0.2, 0.2) });
        yPos -= lineHeight;
    
        // Payment Details Section
        page.drawText("PAYMENT DETAILS:", { x: 50, y: yPos, size: sectionTitleSize, font: boldFont, color: rgb(0, 0, 0.8) });
        yPos -= lineHeight;
    
        page.drawText(`Transaction ID: ${paymentIntent}`, { x: 50, y: yPos, size: fontSize, font: regularFont, color: rgb(0.2, 0.2, 0.2) });
        yPos -= lineHeight;
        page.drawText(`Amount Paid: ${amount}`, { x: 50, y: yPos, size: fontSize, font: boldFont, color: rgb(0, 0.5, 0) });
        yPos -= lineHeight;
        page.drawText(`Status: Payment Succeeded`, { x: 50, y: yPos, size: fontSize, font: boldFont, color: rgb(0, 0.5, 0) });
        yPos -= lineHeight * 2;
    
        // Footer
    
        // Serialize the PDFDocument to bytes (Uint8Array)
        const pdfBytes = await pdfDoc.save();
    
        // Create a Blob and trigger download
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `invoice_${paymentIntent}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating invoice:", error);
        toast.error("Failed to generate invoice");
      }
    };
    

    return (
      <div className="payment-success-container">
        <div className="payment-success-card">
          <h1 className="payment-success-title">Payment Successful!</h1>
          <p className="payment-success-message">
            Thank you for your purchase. Your payment was successful.
          </p>
          <div className="payment-details">
            <p>
              <strong>Payment Intent ID:</strong> {paymentIntent}
            </p>
            <p>
              <strong>Status:</strong> {redirectStatus}
            </p>
          </div>
          <div className="buttonClass">
          <button
            className="continue-shopping-button"
            onClick={handleContinueShopping}
          >
            Continue
          </button>
          <button  className="continue-shopping-button2 "onClick={generateInvoice}>Download Invoice</button>  
        </div>
        </div>
        
      </div>
    );
  };

  export default PaymentSuccess;
