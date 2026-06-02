package ec.edu.udla.udlaeats_core.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Debe ser un correo electrónico válido")
    @Pattern(regexp = "^[\\w-\\.]+@udla\\.edu\\.ec$", message = "El correo DEBE pertenecer al dominio @udla.edu.ec")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Column(nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(nullable = false, columnDefinition = "int default 0")
    private int penaltyPoints;

    @Column(nullable = false)
    private String accountStatus = "APPROVED";

    @Column(length = 500)
    private String rejectionReason;

    @Column(length = 15)
    private String phone;

    @Column(length = 100)
    private String campus;

    @Column
    private String openingTime = "07:00";

    @Column
    private String closingTime = "19:30";
}
