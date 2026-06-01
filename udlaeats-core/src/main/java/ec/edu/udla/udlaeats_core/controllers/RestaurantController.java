package ec.edu.udla.udlaeats_core.controllers;

import ec.edu.udla.udlaeats_core.dtos.MenuItemRequestDto;
import ec.edu.udla.udlaeats_core.entities.MenuItem;
import ec.edu.udla.udlaeats_core.entities.RestaurantInfo;
import ec.edu.udla.udlaeats_core.repositories.MenuItemRepository;
import ec.edu.udla.udlaeats_core.repositories.RestaurantInfoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantInfoRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @PostMapping("/menu")
    public ResponseEntity<?> addMenuItem(@Valid @RequestBody MenuItemRequestDto request) {
        RestaurantInfo restaurant = restaurantRepository.findById(request.getRestaurantId()).orElse(null);
        if (restaurant == null) return ResponseEntity.badRequest().body("Restaurante no encontrado.");

        MenuItem newItem = new MenuItem();
        newItem.setRestaurant(restaurant);
        newItem.setName(request.getName());
        newItem.setDescription(request.getDescription());
        newItem.setPrice(request.getPrice());
        newItem.setStockQuantity(request.getStockQuantity());
        newItem.setImageUrl(request.getImageUrl());
        newItem.setAvailable(true);

        menuItemRepository.save(newItem);
        return ResponseEntity.status(HttpStatus.CREATED).body("Platillo agregado al menú.");
    }

    @GetMapping("/{restaurantId}/menu")
    public ResponseEntity<List<MenuItem>> getRestaurantMenu(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId));
    }

    @PatchMapping("/menu/{itemId}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Long itemId, @RequestParam int newStock) {
        MenuItem item = menuItemRepository.findById(itemId).orElse(null);
        if (item == null) return ResponseEntity.notFound().build();

        item.setStockQuantity(newStock);
        if (newStock <= 0) item.setAvailable(false);

        menuItemRepository.save(item);
        return ResponseEntity.ok("Stock actualizado a: " + newStock);
    }
}
