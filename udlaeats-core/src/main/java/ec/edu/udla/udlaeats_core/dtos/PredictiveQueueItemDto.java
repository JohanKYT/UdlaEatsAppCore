package ec.edu.udla.udlaeats_core.dtos;

import lombok.Data;

@Data
public class PredictiveQueueItemDto {
    private Long userId;
    private String userName;
    private String userEmail;
    private String targetTime; // La hora real en formato HH:mm calculada por el motor
    private boolean alreadySent;
}