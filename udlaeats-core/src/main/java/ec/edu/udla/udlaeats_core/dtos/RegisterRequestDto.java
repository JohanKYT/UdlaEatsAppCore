package ec.edu.udla.udlaeats_core.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequestDto {
    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Debe ser un correo electrónico válido")
    @Pattern(regexp = "^[\\w-\\.]+@udla\\.edu\\.ec$", message = "El correo DEBE pertenecer al dominio @udla.edu.ec")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    @NotNull(message = "El rol es obligatorio")
    private Long roleId; // Esto vendrá del Dropdown en el Frontend
}
