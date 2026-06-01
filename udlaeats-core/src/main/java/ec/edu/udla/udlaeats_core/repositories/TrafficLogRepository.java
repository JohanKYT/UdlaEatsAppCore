package ec.edu.udla.udlaeats_core.repositories;

import ec.edu.udla.udlaeats_core.entities.TrafficLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface TrafficLogRepository extends JpaRepository<TrafficLog, Long> {
    List<TrafficLog> findTop3ByRestaurantIdAndRecordedDayOfWeekOrderByRecordedDateDesc(Long restaurantId, DayOfWeek dayOfWeek);
    List<TrafficLog> findTop3ByRestaurantIdOrderByRecordedDateDesc(Long restaurantId);
}
