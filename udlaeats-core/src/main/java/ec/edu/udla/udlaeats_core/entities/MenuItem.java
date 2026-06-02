package ec.edu.udla.udlaeats_core.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "menu_items")
@Data
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private RestaurantInfo restaurant;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Column(nullable = false)
    private String name;

    @Column(length = 255)
    private String description;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal price;

    @NotBlank(message = "La categoria es obligatoria")
    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private boolean isAvailable = true;

    @Column(nullable = false)
    private int stockQuantity;

    @Column(nullable = false, length = 500)
    private String imageUrl;

}
