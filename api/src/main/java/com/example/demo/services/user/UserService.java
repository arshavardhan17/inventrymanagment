package com.example.demo.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.user.UpdateUserDto;
import com.example.demo.dtos.user.UserDto;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByName(username).orElseThrow();
        return convertToDto(user);
    }

    @Override
    public UserDto updateUser(UpdateUserDto updateUserDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByName(username).orElseThrow();

        if (updateUserDto.getName() != null && !updateUserDto.getName().trim().isEmpty()) {
            user.setName(updateUserDto.getName());
        }
        if (updateUserDto.getEmail() != null && !updateUserDto.getEmail().trim().isEmpty()) {
            user.setEmail(updateUserDto.getEmail());
        }
        if (updateUserDto.getPhone() != null && !updateUserDto.getPhone().trim().isEmpty()) {
            user.setPhone(updateUserDto.getPhone());
        }

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return convertToDto(user);
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        userDto.setRole(user.getRole());
        return userDto;
    }
}
