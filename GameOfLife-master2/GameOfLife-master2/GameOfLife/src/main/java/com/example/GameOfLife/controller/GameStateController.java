package com.example.GameOfLife.controller;

import com.example.GameOfLife.model.GameState;
import com.example.GameOfLife.model.User;
import com.example.GameOfLife.service.GameStateService;
import com.example.GameOfLife.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gameState")
public class GameStateController {

    @Autowired
    private GameStateService gameStateService;

    @Autowired
    private UserService userService;

    @PostMapping("/save")
    public ResponseEntity<?> saveGameState(@RequestBody String stateData, @RequestParam Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        GameState gameState = gameStateService.saveGameState(user, stateData);
        return ResponseEntity.ok(gameState);
    }

    @PostMapping("/load/{userId}")
    public ResponseEntity<?> loadGameState(@PathVariable Long userId) {
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        GameState gameState = gameStateService.loadGameState(user);
        return gameState != null ? ResponseEntity.ok(gameState) : ResponseEntity.notFound().build();
    }
}