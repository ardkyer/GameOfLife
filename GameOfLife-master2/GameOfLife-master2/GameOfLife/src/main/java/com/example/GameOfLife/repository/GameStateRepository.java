package com.example.GameOfLife.repository;

import com.example.GameOfLife.model.GameState;
import com.example.GameOfLife.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GameStateRepository extends JpaRepository<GameState, Long> {
    Optional<GameState> findByUser(User user);
}