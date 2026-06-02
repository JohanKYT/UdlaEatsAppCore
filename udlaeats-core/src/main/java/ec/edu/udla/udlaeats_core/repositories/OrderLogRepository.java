package ec.edu.udla.udlaeats_core.repositories;

import ec.edu.udla.udlaeats_core.entities.OrderLog;
import ec.edu.udla.udlaeats_core.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface OrderLogRepository extends JpaRepository<OrderLog, Long> {
    List<OrderLog> findByOrderDayOfWeek(DayOfWeek dayOfWeek);
    List<OrderLog> findByUserIdAndOrderDayOfWeek(Long userId, DayOfWeek dayOfWeek);
    List<OrderLog> findByUserIdOrderByOrderDateDescOrderTimeDesc(Long userId);
    List<OrderLog> findByRestaurantIdAndStatusOrderByOrderDateAscOrderTimeAsc(Long restaurantId, String status);
    @Query("SELECT DISTINCT o.user FROM OrderLog o WHERE o.orderDayOfWeek = :dayOfWeek")
    List<User> findDistinctUsersByOrderDayOfWeek(@Param("dayOfWeek") DayOfWeek dayOfWeek);

}
