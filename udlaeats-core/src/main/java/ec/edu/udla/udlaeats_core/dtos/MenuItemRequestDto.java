package ec.edu.udla.udlaeats_core.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class MenuItemRequestDto {
    @NotNull(message = "El ID del restaurante es obligatorio")
    private Long userId;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String name;

    private String description;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal price;

    @NotBlank(message = "La categoría es obligatoria")
    private String category;

    @NotBlank(message = "La URL de la imagen del producto es obligatoria")
    private String imageUrl;

    @NotNull(message = "El stock inicial es obligatorio")
    private Integer stockQuantity;
}