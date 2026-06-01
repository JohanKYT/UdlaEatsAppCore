package ec.edu.udla.udlaeats_core.controllers;

import ec.edu.udla.udlaeats_core.dtos.UserUpdateRequestDto;
import ec.edu.udla.udlaeats_core.entities.Notification;
import ec.edu.udla.udlaeats_core.entities.User;
import ec.edu.udla.udlaeats_core.repositories.NotificationRepository;
import ec.edu.udla.udlaeats_core.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequestDto request) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        user.setName(request.getName());

        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            user.setPassword(request.getNewPassword()); // Otra vez, tocará encriptar luego
        }

        userRepository.save(user);
        return ResponseEntity.ok("Perfil actualizado correctamente.");
    }

    @GetMapping("/{userId}/notifications")
    public ResponseEntity<List<Notification>> getMyNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId));
    }
}
