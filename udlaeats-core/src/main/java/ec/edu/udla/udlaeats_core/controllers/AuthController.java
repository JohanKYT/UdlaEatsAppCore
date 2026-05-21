package ec.edu.udla.udlaeats_core.controllers;

import ec.edu.udla.udlaeats_core.dtos.RegisterRequestDto;
import ec.edu.udla.udlaeats_core.entities.Role;
import ec.edu.udla.udlaeats_core.entities.User;
import ec.edu.udla.udlaeats_core.repositories.RoleRepository;
import ec.edu.udla.udlaeats_core.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDto request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("El correo ya está registrado.");
        }

        Role assignedRole = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Error: El rol seleccionado no existe."));

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword()); // Nota: Encriptar deja la pereza.
        newUser.setRole(assignedRole);
        newUser.setPenaltyPoints(0);

        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado exitosamente");
    }
}
