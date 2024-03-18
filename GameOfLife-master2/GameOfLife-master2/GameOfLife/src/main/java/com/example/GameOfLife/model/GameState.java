package com.example.GameOfLife.model;

import jakarta.persistence.*;

@Entity
public class GameState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Lob
    private String stateData; // This will store your game state as a JSON or serialized string

    public void setUser(User user) {
        this.user = user;
    }

    public void setStateData(String stateData) {
        this.stateData = stateData;
    }
}
