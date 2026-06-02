# ETAPA 1: Construcción
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Asegúrate de que el nombre del jar coincida con lo que genera tu pom.xml
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]