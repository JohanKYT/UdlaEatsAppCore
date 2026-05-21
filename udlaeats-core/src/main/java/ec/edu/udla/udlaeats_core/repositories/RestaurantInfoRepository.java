package ec.edu.udla.udlaeats_core.repositories;

import ec.edu.udla.udlaeats_core.entities.RestaurantInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantInfoRepository extends JpaRepository<RestaurantInfo, Long> {
    List<RestaurantInfo> findByIsVerifiedByAdminFalse();
    List<RestaurantInfo> findByIsVerifiedByAdminTrue();
}
