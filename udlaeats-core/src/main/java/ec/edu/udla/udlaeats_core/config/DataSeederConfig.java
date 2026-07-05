/*package ec.edu.udla.udlaeats_core.config;

import ec.edu.udla.udlaeats_core.entities.Role;
import ec.edu.udla.udlaeats_core.entities.User;
import ec.edu.udla.udlaeats_core.repositories.RoleRepository;
import ec.edu.udla.udlaeats_core.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeederConfig {

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepository,  UserRepository userRepository) {
        return args -> {

            if (roleRepository.count() == 0) {
                Role adminRole = new Role();
                adminRole.setRoleName("ADMIN");

                Role userRole = new Role();
                userRole.setRoleName("USER");

                Role restaurantRole = new Role();
                restaurantRole.setRoleName("RESTAURANT");

                roleRepository.saveAll(List.of(adminRole, userRole, restaurantRole));

                System.out.println("Seeder completado: Roles iniciales (ADMIN, USER, RESTAURANT) cargados en la base de datos.");
            } else {
                System.out.println("Los roles ya existen en la base de datos. Se omite la carga inicial.");
            }
            if (!userRepository.existsByEmail("admin.core@udla.edu.ec")) {
                Role adminRole = roleRepository.findByRoleName("ADMIN");
                User adminUser = new User();
                adminUser.setName("Administrador General");
                adminUser.setEmail("admin.core@udla.edu.ec");
                adminUser.setPassword("AdminUdla2026."); // Tambien encripta esto no seas vago
                adminUser.setRole(adminRole);
                adminUser.setPenaltyPoints(0);

                userRepository.save(adminUser);
                System.out.println("Seeder completado: Administrador maestro creado (admin.core@udla.edu.ec).");
            }
        };
    }
}
*/