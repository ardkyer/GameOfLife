/* package com.example.GameOfLife.repository;

import com.example.GameOfLife.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testCreateAndFindUser() {
        //Given
        User user = new User("Iron Dragon", "k0207k@naver.com");
        userRepository.save(user);

        //When
        User foundUser = userRepository.findById(user.getId()).orElse(null);

        //Then
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getName()).isEqualTo(user.getName());
        assertThat(foundUser.getEmail()).isEqualTo(user.getEmail());
    }
}
*/