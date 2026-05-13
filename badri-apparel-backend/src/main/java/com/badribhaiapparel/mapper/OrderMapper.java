package com.badribhaiapparel.mapper;

import com.badribhaiapparel.dto.OrderResponseDto;
import com.badribhaiapparel.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface OrderMapper {

    @Mapping(target = "orderStatus", expression = "java(order.getOrderStatus().name())")
    @Mapping(target = "totalAmount", expression = "java(java.math.BigDecimal.valueOf(order.getTotalAmount()))")
    OrderResponseDto toDto(Order order);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.title")
    @Mapping(target = "price", expression = "java(java.math.BigDecimal.valueOf(item.getPrice()))")
    @Mapping(target = "productImage", expression = "java(item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty() ? item.getProduct().getImages().get(0).getUrl() : null)")
    com.badribhaiapparel.dto.OrderItemDto toItemDto(com.badribhaiapparel.entity.OrderItem item);

    List<OrderResponseDto> toDtoList(List<Order> orders);
}
