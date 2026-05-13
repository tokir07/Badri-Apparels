package com.badribhaiapparel.mapper;

import com.badribhaiapparel.dto.UserResponseDto;
import com.badribhaiapparel.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(source = "role", target = "role")
    UserResponseDto toDto(User user);

    List<UserResponseDto> toDtoList(List<User> users);
}
