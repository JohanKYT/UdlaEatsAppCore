package ec.edu.udla.udlaeats_core.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserUpdateRequestDto {
    @NotBlank(message = "El nombre no puede estar vacío")
    private String name;
    private String newPassword;
    private String phone;
    private String campus;
    private String openingTime;
    private String closingTime;
}