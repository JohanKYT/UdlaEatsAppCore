package ec.edu.udla.udlaeats_core.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.LocalDate;

@Entity
@Table(name = "order_logs")
@Data
public class OrderLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private RestaurantInfo restaurant;

    // Guardamos que pidio
    @Column(nullable = false)
    private String itemName;

    // Comparar patrones (Ej: "THURSDAY")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek orderDayOfWeek;

    // Fecha exacta
    @Column(nullable = false)
    private LocalDate orderDate;

    // Hora a la que suele hacer el pedido
    @Column(nullable = false)
    private LocalTime orderTime;

}