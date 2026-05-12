package com.badribhaiapparel.service;

import com.badribhaiapparel.entity.Order;
import java.io.ByteArrayInputStream;

public interface InvoiceService {
    ByteArrayInputStream generateInvoicePdf(Order order);
}
