package ec.edu.udla.udlaeats_core.controllers;

import ec.edu.udla.udlaeats_core.dtos.OrderRequestDto;
import ec.edu.udla.udlaeats_core.entities.*;
import ec.edu.udla.udlaeats_core.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private OrderLogRepository orderLogRepository;
    @Autowired
    private RestaurantInfoRepository restaurantRepository;

    @Autowired
    private TrafficLogRepository trafficLogRepository;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequestDto request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        MenuItem item = menuItemRepository.findById(request.getMenuItemId()).orElse(null);

        if (user == null || item == null) return ResponseEntity.badRequest().body("Datos de pedido inválidos.");
        if (item.getStockQuantity() <= 0 || !item.isAvailable()) return ResponseEntity.badRequest().body("Producto agotado.");

        item.setStockQuantity(item.getStockQuantity() - 1);
        if (item.getStockQuantity() == 0) {
            item.setAvailable(false);
        }
        menuItemRepository.save(item);

        OrderLog orderLog = new OrderLog();
        orderLog.setUser(user);
        orderLog.setRestaurant(item.getRestaurant());
        orderLog.setItemName(item.getName());
        orderLog.setOrderDate(LocalDate.now());
        orderLog.setOrderDayOfWeek(LocalDate.now().getDayOfWeek());
        orderLog.setOrderTime(LocalTime.now());
        orderLogRepository.save(orderLog);

        TrafficLog trafficLog = new TrafficLog();
        trafficLog.setRestaurant(item.getRestaurant());
        trafficLog.setRecordedDate(LocalDate.now());
        trafficLog.setRecordedDayOfWeek(LocalDate.now().getDayOfWeek());
        trafficLog.setRecordedTime(LocalTime.now());
        trafficLog.setTrafficLevel(item.getStockQuantity() < 5 ? "HIGH" : "MEDIUM");
        trafficLogRepository.save(trafficLog);

        return ResponseEntity.ok("Pedido registrado. ¡Pasa a retirarlo!");
    }

    @GetMapping("/my-orders/{userId}")
    public ResponseEntity<List<OrderLog>> getMyOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderLogRepository.findByUserIdOrderByOrderDateDescOrderTimeDesc(userId));
    }

    @GetMapping("/restaurant/{userId}/queue")
    public ResponseEntity<List<OrderLog>> getRestaurantQueue(@PathVariable Long userId) {
        RestaurantInfo restaurant = restaurantRepository.findByUserId(userId);
        if (restaurant == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(orderLogRepository.findByRestaurantIdAndStatusOrderByOrderDateAscOrderTimeAsc(restaurant.getId(), "PENDING"));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam String newStatus) {
        OrderLog order = orderLogRepository.findById(orderId).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();

        order.setStatus(newStatus);

        if (newStatus.equals("NO_SHOW")) {
            User user = order.getUser();
            user.setPenaltyPoints(user.getPenaltyPoints() + 1);
            userRepository.save(user);
        }

        orderLogRepository.save(order);
        return ResponseEntity.ok("Estado actualizado a " + newStatus);
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, @RequestParam Long menuItemId) {
        OrderLog order = orderLogRepository.findById(orderId).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();

        if (LocalTime.now().isAfter(order.getOrderTime().plusMinutes(5))) {
            return ResponseEntity.badRequest().body("Han pasado más de 5 minutos, ya no puedes cancelar.");
        }

        order.setStatus("CANCELLED");
        orderLogRepository.save(order);

        MenuItem item = menuItemRepository.findById(menuItemId).orElse(null);
        if (item != null) {
            item.setStockQuantity(item.getStockQuantity() + 1);
            item.setAvailable(true);
            menuItemRepository.save(item);
        }

        return ResponseEntity.ok("Pedido cancelado exitosamente.");
    }
}
