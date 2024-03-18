package com.example.GameOfLife.service;

import com.example.GameOfLife.model.GameState;
import com.example.GameOfLife.model.User;
import com.example.GameOfLife.repository.GameStateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameStateService {

    private final GameStateRepository gameStateRepository;

    @Autowired
    public GameStateService(GameStateRepository gameStateRepository) {
        this.gameStateRepository = gameStateRepository;
    }

    public GameState saveGameState(User user, String stateData){
        GameState gameState = new GameState();
        gameState.setUser(user);
        gameState.setStateData(stateData);
        return gameStateRepository.save(gameState);
    }

    public GameState loadGameState(User user){
        return gameStateRepository.findByUser(user).stream().findFirst().orElse(null);
    }
}
