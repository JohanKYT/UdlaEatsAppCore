package ec.edu.udla.udlaeats_core.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "traffic_logs")
@Data
public class TrafficLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A que restaurante pertenece este registro
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private RestaurantInfo restaurant;

    // Nivel de trafico registrado (LOW, MEDIUM, HIGH)
    @Column(nullable = false)
    private String trafficLevel;

    // Día en el que se midio
    @Column(nullable = false)
    private LocalDate recordedDate;

    // Dia para el motor predictivo (ej. THURSDAY)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek recordedDayOfWeek;

    // Hora exacta
    @Column(nullable = false)
    private LocalTime recordedTime;
}
