package com.example.GameOfLife.repository;

import com.example.GameOfLife.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}