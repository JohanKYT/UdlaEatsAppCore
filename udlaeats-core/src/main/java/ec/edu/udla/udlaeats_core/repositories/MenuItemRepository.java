package ec.edu.udla.udlaeats_core.repositories;

import ec.edu.udla.udlaeats_core.entities.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
}
