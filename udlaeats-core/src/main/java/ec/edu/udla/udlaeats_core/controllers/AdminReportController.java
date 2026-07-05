package ec.edu.udla.udlaeats_core.controllers;

import ec.edu.udla.udlaeats_core.repositories.OrderLogRepository;
import ec.edu.udla.udlaeats_core.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderLogRepository orderLogRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSystemSummary() {
        // Implementación de lógica de agregación
        long totalUsers = userRepository.count();
        long totalOrders = orderLogRepository.count();

        // Creación del objeto JSON dinámico de respuesta
        Map<String, Object> jsonResponse = new HashMap<>();
        jsonResponse.put("status", "success");
        jsonResponse.put("timestamp", System.currentTimeMillis());

        Map<String, Long> data = new HashMap<>();
        data.put("totalRegisteredUsers", totalUsers);
        data.put("totalHistoricalOrders", totalOrders);
        data.put("averageOrdersPerUser", totalUsers > 0 ? (totalOrders / totalUsers) : 0);

        jsonResponse.put("data", data);

        return ResponseEntity.ok(jsonResponse);
    }
}