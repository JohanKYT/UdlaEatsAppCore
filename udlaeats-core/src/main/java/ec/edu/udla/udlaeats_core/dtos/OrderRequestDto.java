package ec.edu.udla.udlaeats_core.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequestDto {
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long userId;

    @NotNull(message = "El ID del menú es obligatorio")
    private Long menuItemId;
}
