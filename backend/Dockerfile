# Stage 1: Build stage using Maven with JDK 17 (for compatibility)
FROM maven:3.8.7-openjdk-17-slim AS build

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

# Stage 2: Runtime stage using JDK 22
FROM openjdk:22-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/movies-0.0.1-SNAPSHOT.jar /app/movies-0.0.1-SNAPSHOT.jar

# Expose the port
EXPOSE 8080

# Command to run the Spring Boot application
CMD ["java", "-jar", "movies-0.0.1-SNAPSHOT.jar"]
