package ec.edu.udla.udlaeats_core.controllers;

import ec.edu.udla.udlaeats_core.entities.Role;
import ec.edu.udla.udlaeats_core.entities.User;
import ec.edu.udla.udlaeats_core.repositories.RoleRepository;
import ec.edu.udla.udlaeats_core.repositories.UserRepository;
import ec.edu.udla.udlaeats_core.services.PredictiveNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PredictiveNotificationService predictiveService;

    @GetMapping("/pending-restaurants")
    public ResponseEntity<List<User>> getPendingRestaurants() {
        Role restRole = roleRepository.findByRoleName("RESTAURANT");
        return ResponseEntity.ok(userRepository.findByRoleAndAccountStatus(restRole, "PENDING"));
    }

    @PatchMapping("/approve/{userId}")
    public ResponseEntity<?> approveRestaurant(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        user.setAccountStatus("APPROVED");
        userRepository.save(user);
        return ResponseEntity.ok("Restaurante aprobado.");
    }

    @PatchMapping("/reject/{userId}")
    public ResponseEntity<?> rejectRestaurant(@PathVariable Long userId, @RequestParam String reason) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        user.setAccountStatus("REJECTED");
        user.setRejectionReason(reason);
        userRepository.save(user);
        return ResponseEntity.ok("Restaurante rechazado.");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok("Usuario eliminado correctamente.");
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUserAsAdmin(@PathVariable Long userId, @RequestBody User request) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCampus(request.getCampus());
        user.setPassword(request.getPassword());
        user.setAccountStatus(request.getAccountStatus());

        userRepository.save(user);
        return ResponseEntity.ok("Usuario actualizado por el Administrador.");
    }

    @PostMapping("/force-predictive-engine")
    public ResponseEntity<?> forcePredictiveEngine() {
        predictiveService.forceDemoExecution();
        return ResponseEntity.ok("Motor Predictivo forzado. Notificaciones enviadas.");
    }
    @GetMapping("/predictive-queue")
    public ResponseEntity<List<ec.edu.udla.udlaeats_core.dtos.PredictiveQueueItemDto>> getPredictiveQueue() {
        return ResponseEntity.ok(predictiveService.getPredictiveQueuePreview());
    }
}
