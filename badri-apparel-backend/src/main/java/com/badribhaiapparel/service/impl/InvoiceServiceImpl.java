package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.entity.Order;
import com.badribhaiapparel.entity.OrderItem;
import com.badribhaiapparel.service.InvoiceService;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Override
    public ByteArrayInputStream generateInvoicePdf(Order order) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            DeviceRgb maroon = new DeviceRgb(128, 0, 0);

            // Header Logo Silhouette
            document.add(new Paragraph("B")
                    .setBold()
                    .setFontSize(32)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(maroon)
                    .setMarginBottom(0));

            document.add(new Paragraph("BADRIBHAI APPAREL")
                    .setBold()
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(maroon)
                    .setMarginTop(0)
                    .setCharacterSpacing(2f));

            document.add(new Paragraph("Artisanal Heritage, Modern Grace")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(9)
                    .setItalic()
                    .setFontColor(ColorConstants.GRAY));

            document.add(new Paragraph("\n"));

            // Order Details
            Table orderInfoTable = new Table(UnitValue.createPointArray(new float[]{250, 250}));
            orderInfoTable.addCell(new Cell().add(new Paragraph("Invoice To:").setBold().setFontSize(10)).setBorder(null));
            orderInfoTable.addCell(new Cell().add(new Paragraph("Order Details:").setBold().setFontSize(10)).setBorder(null));
            
            orderInfoTable.addCell(new Cell().add(new Paragraph(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                    .setFontSize(9)).setBorder(null));
            orderInfoTable.addCell(new Cell().add(new Paragraph("Order #: " + order.getOrderNumber())
                    .setFontSize(9)).setBorder(null));
            
            orderInfoTable.addCell(new Cell().add(new Paragraph(order.getShippingAddress())
                    .setFontSize(9)).setBorder(null));
            orderInfoTable.addCell(new Cell().add(new Paragraph("Date: " + order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")))
                    .setFontSize(9)).setBorder(null));

            document.add(orderInfoTable);
            document.add(new Paragraph("\n"));

            // Items Table
            Table table = new Table(UnitValue.createPointArray(new float[]{200, 50, 100, 100}));
            table.addCell(new Cell().add(new Paragraph("Product").setBold().setFontSize(10)).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            table.addCell(new Cell().add(new Paragraph("Qty").setBold().setFontSize(10)).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            table.addCell(new Cell().add(new Paragraph("Price").setBold().setFontSize(10)).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            table.addCell(new Cell().add(new Paragraph("Total").setBold().setFontSize(10)).setBackgroundColor(ColorConstants.LIGHT_GRAY));

            for (OrderItem item : order.getItems()) {
                table.addCell(new Cell().add(new Paragraph(item.getProduct().getTitle() + " (" + item.getSelectedSize() + ")").setFontSize(9)));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(item.getQuantity())).setFontSize(9)));
                table.addCell(new Cell().add(new Paragraph("Rs. " + item.getPrice()).setFontSize(9)));
                table.addCell(new Cell().add(new Paragraph("Rs. " + (item.getPrice() * item.getQuantity())).setFontSize(9)));
            }

            document.add(table);

            // Totals
            document.add(new Paragraph("\n"));
            Table totalTable = new Table(UnitValue.createPointArray(new float[]{350, 100}));
            totalTable.addCell(new Cell().add(new Paragraph("Subtotal").setFontSize(9)).setBorder(null).setTextAlignment(TextAlignment.RIGHT));
            totalTable.addCell(new Cell().add(new Paragraph("Rs. " + order.getTotalAmount()).setFontSize(9)).setBorder(null).setTextAlignment(TextAlignment.RIGHT));
            
            totalTable.addCell(new Cell().add(new Paragraph("Shipping").setFontSize(9)).setBorder(null).setTextAlignment(TextAlignment.RIGHT));
            totalTable.addCell(new Cell().add(new Paragraph("FREE").setFontSize(9)).setBorder(null).setTextAlignment(TextAlignment.RIGHT));
            
            totalTable.addCell(new Cell().add(new Paragraph("Total Amount").setBold().setFontSize(11)).setBorder(null).setTextAlignment(TextAlignment.RIGHT));
            totalTable.addCell(new Cell().add(new Paragraph("Rs. " + order.getTotalAmount()).setBold().setFontSize(11)).setBorder(null).setTextAlignment(TextAlignment.RIGHT));

            document.add(totalTable);

            document.add(new Paragraph("\n\nThank you for choosing BadriBhai Apparels.\nYour support keeps the artisanal traditions alive.")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
