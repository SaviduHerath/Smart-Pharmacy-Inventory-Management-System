package com.pharmacy.repository;

//database operations
/*save()
findAll()
findById()
delete()
findByEmail()
existsByEmail()*/

import com.pharmacy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}