package com.example.demo.services.user;

import com.example.demo.dtos.user.UpdateUserDto;
import com.example.demo.dtos.user.UserDto;

public interface IUserService {
    UserDto getCurrentUser();

    UserDto updateUser(UpdateUserDto updateUserDto);

    UserDto getUserById(Long id);
}
