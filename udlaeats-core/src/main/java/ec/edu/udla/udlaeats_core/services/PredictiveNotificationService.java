package ec.edu.udla.udlaeats_core.services;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.LocalDate;

@Service
public class PredictiveNotificationService {

    @Scheduled(cron = "0 * * * * *")
    public void analyzePatternsAndNotify() {
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        LocalTime currentTime = LocalTime.now();
        System.out.println(
                "[CORE PREDICTIVO] Ejecutando analisis para el día: " + today + " a las " + currentTime
        );
 }
}
