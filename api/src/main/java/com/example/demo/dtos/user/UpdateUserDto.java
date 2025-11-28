package com.example.demo.dtos.user;

import lombok.Data;

@Data
public class UpdateUserDto {
    private String name;
    private String email;
    private String phone;
}
