# Stage 1: Build stage using Maven with JDK 17
FROM maven:3.9.5-eclipse-temurin-17-focal AS build
# Set the working directory inside the container
WORKDIR /app
# Copy the Maven wrapper, .mvn directory, and pom.xml to the container
COPY .mvn/ .mvn/
COPY mvnw* pom.xml ./
# Grant execute permission to the Maven wrapper
RUN chmod +x ./mvnw
# Download Maven dependencies based on pom.xml
RUN ./mvnw dependency:go-offline
# Copy the source code to the container
COPY src ./src
# Build the application
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime stage using JDK 17
FROM maven:3.9.5-eclipse-temurin-17-focal
# Set working directory inside the container
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/pom.xml ./
COPY --from=build /app/src ./src
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]