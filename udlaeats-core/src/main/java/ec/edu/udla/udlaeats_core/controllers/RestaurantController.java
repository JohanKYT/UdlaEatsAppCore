package ec.edu.udla.udlaeats_core.controllers;

import ec.edu.udla.udlaeats_core.dtos.MenuItemRequestDto;
import ec.edu.udla.udlaeats_core.entities.MenuItem;
import ec.edu.udla.udlaeats_core.entities.RestaurantInfo;
import ec.edu.udla.udlaeats_core.entities.User;
import ec.edu.udla.udlaeats_core.repositories.MenuItemRepository;
import ec.edu.udla.udlaeats_core.repositories.RestaurantInfoRepository;
import ec.edu.udla.udlaeats_core.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantInfoRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/menu")
    public ResponseEntity<?> addMenuItem(@Valid @RequestBody MenuItemRequestDto request) {

        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("Usuario no encontrado.");

        RestaurantInfo restaurant = restaurantRepository.findByUserId(user.getId());
        if (restaurant == null) {
            restaurant = new RestaurantInfo();
            restaurant.setUser(user);
            restaurant.setCampusLocation(user.getCampus() != null ? user.getCampus() : "UDLA");
            restaurant.setPhoneNumber(user.getPhone() != null ? user.getPhone() : "S/N");

            try {
                restaurant.setOpenTime(LocalTime.parse(user.getOpeningTime()));
                restaurant.setCloseTime(LocalTime.parse(user.getClosingTime()));
            } catch (Exception e) {
                restaurant.setOpenTime(LocalTime.of(7, 0));
                restaurant.setCloseTime(LocalTime.of(19, 30));
            }

            restaurant.setVerifiedByAdmin(true);
            restaurantRepository.save(restaurant);
        }

        MenuItem newItem = new MenuItem();
        newItem.setRestaurant(restaurant);
        newItem.setName(request.getName());
        newItem.setDescription(request.getDescription());
        newItem.setPrice(request.getPrice());
        newItem.setStockQuantity(request.getStockQuantity());
        newItem.setImageUrl(request.getImageUrl());
        newItem.setCategory(request.getCategory());
        newItem.setAvailable(true);

        menuItemRepository.save(newItem);
        return ResponseEntity.status(HttpStatus.CREATED).body("Platillo agregado al menú.");
    }

    @GetMapping("/{userId}/menu")
    public ResponseEntity<List<MenuItem>> getRestaurantMenu(@PathVariable Long userId) {
        RestaurantInfo restaurant = restaurantRepository.findByUserId(userId);
        if (restaurant == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(menuItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurant.getId()));
    }

    @PatchMapping("/menu/{itemId}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Long itemId, @RequestParam int newStock) {
        MenuItem item = menuItemRepository.findById(itemId).orElse(null);
        if (item == null) return ResponseEntity.notFound().build();

        item.setStockQuantity(newStock);
        if (newStock <= 0) {
            item.setAvailable(false);
        } else {
            item.setAvailable(true);
        }

        menuItemRepository.save(item);
        return ResponseEntity.ok("Stock actualizado a: " + newStock);
    }

    @GetMapping("/menu/all")
    public ResponseEntity<List<MenuItem>> getAllAvailableMenus() {
        return ResponseEntity.ok(menuItemRepository.findByIsAvailableTrue());
    }

    @PutMapping("/menu/{itemId}")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long itemId, @Valid @RequestBody MenuItemRequestDto request) {
        MenuItem item = menuItemRepository.findById(itemId).orElse(null);
        if (item == null) return ResponseEntity.notFound().build();

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setStockQuantity(request.getStockQuantity());
        item.setImageUrl(request.getImageUrl());
        item.setCategory(request.getCategory());
        item.setAvailable(request.getStockQuantity() > 0);

        menuItemRepository.save(item);
        return ResponseEntity.ok("Platillo actualizado correctamente.");
    }
}