package ec.edu.udla.udlaeats_core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UdlaeatsCoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(UdlaeatsCoreApplication.class, args);
	}

}
