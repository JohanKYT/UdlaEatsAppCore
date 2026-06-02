package ec.edu.udla.udlaeats_core.services;

import ec.edu.udla.udlaeats_core.entities.*;
import ec.edu.udla.udlaeats_core.repositories.NotificationRepository;
import ec.edu.udla.udlaeats_core.repositories.OrderLogRepository;
import ec.edu.udla.udlaeats_core.repositories.TrafficLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PredictiveNotificationService {
    @Autowired
    private OrderLogRepository orderLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private TrafficLogRepository trafficLogRepository;

    @Scheduled(cron = "0 * * * * *")
    public void scheduledAnalyze() {
        analyzePatternsAndNotify(false);
    }

    public void forceDemoExecution() {
        analyzePatternsAndNotify(true);
    }
    public void analyzePatternsAndNotify(boolean isDemoMode) {
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        LocalTime currentTime = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        List<OrderLog> historicalOrders = orderLogRepository.findByOrderDayOfWeek(today);
        List<User> usersToAnalyze = orderLogRepository.findDistinctUsersByOrderDayOfWeek(today);

        for (User user : usersToAnalyze) {
            List<OrderLog> userHistory = orderLogRepository.findByUserIdAndOrderDayOfWeek(user.getId(), today);

            if (userHistory.isEmpty()) continue;

            List<String> top2Items = getTopTwoItems(userHistory);
            String itemsString = String.join(" o ", top2Items);

            LocalTime habitualTime = getHabitualTimeBlock(userHistory);
            RestaurantInfo favoriteRestaurant = getMostFrequentRestaurant(userHistory);
            Long restaurantId = favoriteRestaurant.getId();

            String predictedTraffic = predictTrafficForToday(restaurantId, today);

            int minutesAhead = predictedTraffic.equalsIgnoreCase("HIGH") ? 30 : 15;
            LocalTime notificationTime = habitualTime.minusMinutes(minutesAhead);

            if (isDemoMode || currentTime.equals(notificationTime)) {
                String urgencyPhrase = predictedTraffic.equalsIgnoreCase("LOW")
                        ? "¡El restaurante está casi vacío, córrele!"
                        : "Va a haber fila pronto, anticípate.";

                String alertMessage = "¡Hola " + user.getName() + "! El restaurante está abierto. Sueles pedir "
                        + itemsString + " en " + favoriteRestaurant.getCampusLocation() + " a esta hora. " + urgencyPhrase;

                Notification newNotification = new Notification();
                newNotification.setUser(user);
                newNotification.setMessage(alertMessage);
                newNotification.setRecommendedItems(itemsString);
                newNotification.setConverted(false);
                notificationRepository.save(newNotification);

                System.out.println(
                        "Notificación predictiva enviada a: " + user.getEmail() + " | Modo Demo: " + isDemoMode
                );
            }
        }
    }
    private List<String> getTopTwoItems(List<OrderLog> history) {
        Map<String, Integer> frequencyMap = new HashMap<>();
        for (OrderLog log : history) {
            frequencyMap.put(log.getItemName(), frequencyMap.getOrDefault(log.getItemName(), 0) + 1);
        }
        return frequencyMap.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(2)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private String predictTrafficForToday(Long restaurantId, DayOfWeek today) {
        int highTrafficScore = 0;
        List<TrafficLog> pastSameDays = trafficLogRepository.findTop3ByRestaurantIdAndRecordedDayOfWeekOrderByRecordedDateDesc(restaurantId, today);
        for (TrafficLog log : pastSameDays) { if (log.getTrafficLevel().equalsIgnoreCase("HIGH")) highTrafficScore++; }

        List<TrafficLog> recentDays = trafficLogRepository.findTop3ByRestaurantIdOrderByRecordedDateDesc(restaurantId);
        for (TrafficLog log : recentDays) { if (log.getTrafficLevel().equalsIgnoreCase("HIGH")) highTrafficScore++; }

        return (highTrafficScore >= 2) ? "HIGH" : "LOW";
    }
    private LocalTime getHabitualTimeBlock(List<OrderLog> history) {
        Map<LocalTime, Integer> timeBlocks = new HashMap<>();

        for (OrderLog log : history) {
            LocalTime time = log.getOrderTime();

            int roundedMinute = (time.getMinute() < 30) ? 0 : 30;
            LocalTime block = LocalTime.of(time.getHour(), roundedMinute);

            timeBlocks.put(block, timeBlocks.getOrDefault(block, 0) + 1);
        }

        return timeBlocks.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(history.getFirst().getOrderTime()); // Fallback de seguridad
    }

    private RestaurantInfo getMostFrequentRestaurant(List<OrderLog> history) {
        Map<RestaurantInfo, Integer> restCount = new HashMap<>();
        for (OrderLog log : history) {
            restCount.put(log.getRestaurant(), restCount.getOrDefault(log.getRestaurant(), 0) + 1);
        }
        return restCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(history.getFirst().getRestaurant());
    }
}
