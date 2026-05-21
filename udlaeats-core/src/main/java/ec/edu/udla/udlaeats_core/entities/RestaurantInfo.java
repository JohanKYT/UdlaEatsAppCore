package ec.edu.udla.udlaeats_core.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Table(name = "restaurant_info")
@Data
public class RestaurantInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "La ubicación dentro del campus es obligatoria")
    @Column(nullable = false)
    private String campusLocation;

    @Column(nullable = false)
    private LocalTime openTime;

    @Column(nullable = false)
    private LocalTime closeTime;

    @NotBlank(message = "El número de contacto es obligatorio")
    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private boolean isVerifiedByAdmin = false;
}
