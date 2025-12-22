import { jsPDF } from "jspdf";
import ChoiseXLogo from "../assets/MainLogoBlack.png";

/**
 * Format number with commas for thousands
 */
const formatCurrency = (amount) => {
    return Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Load image and convert to base64
 */
const loadImageAsBase64 = (imageSrc) => {
    return new Promise((resolve, reject) => {
        // If imageSrc is already a base64 string, return it
        if (imageSrc.startsWith("data:")) {
            resolve(imageSrc);
            return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const base64 = canvas.toDataURL("image/png");
                resolve(base64);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = (error) => {
            console.error("Error loading image:", error);
            reject(new Error("Failed to load image"));
        };

        img.src = imageSrc;
    });
};

/**
 * Generate and download invoice PDF
 * @param {Object} orderData - Order data containing cart, address, orderId, date, paymentMethod
 * @param {Function} enqueueSnackbar - Optional snackbar function for notifications
 */
export const generateInvoicePDF = async (orderData, enqueueSnackbar = null) => {
    try {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        const contentWidth = pageWidth - margin * 2;

        let yPos = margin;
        const leftColumnX = margin;
        const rightColumnX = pageWidth - margin;

        // ========== TOP SECTION: Logo & Company Info (Left) ==========
        let companyInfoY = yPos;

        // Load and add logo
        try {
            const logoBase64 = await loadImageAsBase64(ChoiseXLogo);
            const logoWidth = 50;
            const logoHeight = 20;

            pdf.addImage(
                logoBase64,
                "PNG",
                leftColumnX,
                companyInfoY,
                logoWidth,
                logoHeight
            );

            companyInfoY += logoHeight + 5;
        } catch (logoError) {
            console.warn("Could not load logo, using text instead:", logoError);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.text("ChoiseX", leftColumnX, companyInfoY);
            companyInfoY += 7;
        }

        // Company details below logo
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.text("Your trusted partner for premium products", leftColumnX, companyInfoY);
        companyInfoY += 4;
        pdf.text("1234 Company St.", leftColumnX, companyInfoY);
        companyInfoY += 4;
        pdf.text("Company Town, ST 12345", leftColumnX, companyInfoY);
        companyInfoY += 4;
        pdf.text("Email: support@choisex.com", leftColumnX, companyInfoY);
        companyInfoY += 4;
        pdf.text("Phone: +91 1234567890", leftColumnX, companyInfoY);

        // ========== INVOICE HEADER (Right Top) ==========
        let invoiceHeaderY = margin;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(24);
        pdf.setTextColor("#9e2067"); // Light brown/orange color
        pdf.text("INVOICE", rightColumnX, invoiceHeaderY, { align: "right" });
        invoiceHeaderY += 10;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Invoice #: ${orderData.orderId || "N/A"}`, rightColumnX, invoiceHeaderY, { align: "right" });
        invoiceHeaderY += 5;

        const invoiceDate = orderData.date
            ? new Date(orderData.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
            : new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

        pdf.text(`Invoice date: ${invoiceDate}`, rightColumnX, invoiceHeaderY, { align: "right" });
        invoiceHeaderY += 5;



        // Payment Status/Method
        const paymentStatus = orderData.paymentStatus;
        const paymentMethod = orderData.paymentMethod;
        const orderStatus = orderData.status;

        let paymentInfo = "";
        let paymentColor = [0, 0, 0]; // Default black

        if (paymentStatus === "Failed") {
            // If payment failed via Razorpay, show Canceled
            paymentInfo = "Cancelled";
            paymentColor = [220, 53, 69]; // Red color
        } else if (orderStatus === "Confirmed" || paymentStatus === "Paid") {
            // If order is confirmed or payment is paid, show payment method
            if (paymentMethod === "Cash on Delivery") {
                paymentInfo = "Cash on Delivery";
                paymentColor = [0, 128, 0]; // Green color
            } else if (paymentMethod === "Razorpay") {
                paymentInfo = "Razorpay";
                paymentColor = [0, 128, 0]; // Green color
            } else {
                paymentInfo = paymentMethod || "Pending";
            }
        } else if (orderStatus === "Cancelled") {
            paymentInfo = "Cancelled";
            paymentColor = [220, 53, 69]; // Red color
        } else {
            paymentInfo = paymentMethod || "Pending";
        }

        pdf.setTextColor(paymentColor[0], paymentColor[1], paymentColor[2]);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Payment: ${paymentInfo}`, rightColumnX, invoiceHeaderY, { align: "right" });
        pdf.setTextColor(0, 0, 0); // Reset to black

        // ========== BILL TO SECTION (with blue box) ==========
        yPos = Math.max(companyInfoY, invoiceHeaderY) + 15;

        // Draw blue box around "Bill To"




        // "Bill To" text inside box
        pdf.setTextColor("#9e2067");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text("Bill To", leftColumnX, yPos);

        yPos += 8;

        // Customer details
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text(`Customer Name: ${orderData.address?.name || "N/A"}`, leftColumnX, yPos);
        yPos += 5;

        const addressText = `${orderData.address?.address || ""}, ${orderData.address?.area || ""}, ${orderData.address?.city || ""}, ${orderData.address?.state || ""} - ${orderData.address?.postal || ""}`;
        const addressLines = pdf.splitTextToSize(addressText, 85);
        pdf.text(addressLines, leftColumnX, yPos);
        yPos += addressLines.length * 4.5;

        pdf.text(`Mobile: +91 ${orderData.address?.mobile || "N/A"}`, leftColumnX, yPos);
        yPos += 5;
        pdf.text(`Email: ${orderData.address?.email || "N/A"}`, leftColumnX, yPos);

        // ========== PRODUCTS TABLE HEADER ==========

        const colQty = 15;
        const colName = 90;
        const colUnit = 35;
        const colAmount = contentWidth - (colQty + colName + colUnit);

        const xQty = leftColumnX;
        const xName = xQty + colQty;
        const xUnit = xName + colName;
        const xAmount = xUnit + colUnit;

        yPos += 10;

        pdf.setLineWidth(0.5);
        pdf.setDrawColor(210, 140, 100);
        pdf.setFillColor(158, 32, 103); // #9e2067
        pdf.rect(leftColumnX, yPos - 6, contentWidth, 10, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);

        // Column headers
        pdf.text("QTY", xQty + colQty / 2, yPos, { align: "center" });
        pdf.text("Product Name", xName + 2, yPos);
        pdf.text("Unit Price", xUnit + colUnit - 2, yPos, { align: "right" });
        pdf.text("Amount", xAmount + colAmount - 2, yPos, { align: "right" });

        yPos += 10;


        // Calculate totals
        const totalInclusive = orderData.cart.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
        );
        const basePrice = Number((totalInclusive / 1.18).toFixed(2));
        const gst = Number((totalInclusive - basePrice).toFixed(2));

        // Products List
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);

        // ========== PRODUCTS LIST ==========
        orderData.cart.forEach((item) => {
            if (yPos > pageHeight - 80) {
                pdf.addPage();
                yPos = margin;
            }

            const qty = String(item.quantity);
            const description = item.name;
            const unitPrice = Number(item.price);
            const amount = unitPrice * Number(item.quantity);

            // QTY (center aligned)
            pdf.text(qty, xQty + colQty / 2, yPos, { align: "center" });

            // Product Name (wrapped inside column)
            const descLines = pdf.splitTextToSize(description, colName - 4);
            const descStartY = yPos;
            pdf.text(descLines, xName + 2, descStartY);
            const descHeight = Math.max(descLines.length * 4, 5);

            // Unit Price (right aligned)
            pdf.text(
                String(unitPrice),
                xUnit + colUnit - 2,
                descStartY,
                { align: "right" }
            );

            // Amount (right aligned)
            pdf.text(
                String(amount),
                xAmount + colAmount - 2,
                descStartY,
                { align: "right" }
            );

            yPos += descHeight + 3;


            yPos += descHeight + 3;

            // Add subtle line between items
            pdf.setDrawColor(230, 230, 230);
            pdf.setLineWidth(0.2);
            pdf.line(leftColumnX, yPos - 1, rightColumnX, yPos - 1);
        });

        // ========== TOTALS SECTION (Right Aligned) ==========
        yPos += 8;
        if (yPos > pageHeight - 60) {
            pdf.addPage();
            yPos = margin;
        }

        const totalsStartX = leftColumnX + 120;

        // Separator line
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(200, 200, 200);
        pdf.line(totalsStartX, yPos, rightColumnX, yPos);
        yPos += 8;

        // Subtotal
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Subtotal", totalsStartX, yPos);
        const subtotalText = "Rs. " + formatCurrency(basePrice);
        pdf.text(String(subtotalText), rightColumnX, yPos, { align: "right" });
        yPos += 6;

        // Shipping
        pdf.text("Shipping", totalsStartX, yPos);
        pdf.setTextColor(0, 128, 0);
        pdf.text("Free", rightColumnX, yPos, { align: "right" });
        pdf.setTextColor(0, 0, 0);
        yPos += 6;

        // GST
        pdf.text("GST (18%)", totalsStartX, yPos);
        const gstText = "Rs. " + formatCurrency(gst);
        pdf.text(String(gstText), rightColumnX, yPos, { align: "right" });
        yPos += 8;

        // Total separator line
        pdf.setLineWidth(0.5);
        pdf.setDrawColor("#9e2067");
        pdf.line(totalsStartX, yPos, rightColumnX, yPos);
        yPos += 8;

        // Total (bold and colored)
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor("#9e2067");
        pdf.text("Total", totalsStartX, yPos);
        const totalText = "Rs. " + formatCurrency(totalInclusive);
        pdf.text(String(totalText), rightColumnX, yPos, { align: "right" });

        // ========== FOOTER (Terms and Conditions) ==========
        const footerY = pageHeight - 10;
        pdf.setTextColor("#9e2067");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("support@choisex.com", leftColumnX, footerY);

        

        // Save PDF
        const fileName = `Invoice_${orderData.orderId || "Order"}.pdf`;
        pdf.save(fileName);

        if (enqueueSnackbar) {
            enqueueSnackbar("Invoice PDF downloaded successfully", { variant: "success" });
        }
    } catch (error) {
        console.error("Error generating invoice:", error);
        if (enqueueSnackbar) {
            enqueueSnackbar("Failed to generate invoice", { variant: "error" });
        }
        throw error;
    }
};

