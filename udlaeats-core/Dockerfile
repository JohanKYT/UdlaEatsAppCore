# ETAPA 1: Construcción
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .

# TRUCO MAESTRO: Borramos el archivo corrupto y lo creamos limpio en Linux puro
RUN rm -f src/main/resources/application.properties
RUN echo 'spring.application.name=udlaeats-core' > src/main/resources/application.properties
RUN echo 'spring.datasource.url=${DB_URL}' >> src/main/resources/application.properties
RUN echo 'spring.datasource.username=${DB_USER}' >> src/main/resources/application.properties
RUN echo 'spring.datasource.password=${DB_PASSWORD}' >> src/main/resources/application.properties
RUN echo 'spring.datasource.driver-class-name=org.postgresql.Driver' >> src/main/resources/application.properties
RUN echo 'spring.jpa.hibernate.ddl-auto=update' >> src/main/resources/application.properties
RUN echo 'spring.jpa.show-sql=true' >> src/main/resources/application.properties
RUN echo 'server.port=${PORT:8080}' >> src/main/resources/application.properties

RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]