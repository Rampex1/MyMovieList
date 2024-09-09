# Use an official OpenJDK 22 runtime as a parent image
FROM openjdk:22-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper, .mvn directory, and pom.xml to the container
COPY .mvn/ .mvn/
COPY mvnw* pom.xml ./

# Grant execute permission to the Maven wrapper
RUN chmod +x ./mvnw

# Copy the source code to the container
COPY src ./src

# Run the Maven build
RUN ./mvnw clean package -DskipTests

# Expose the port your app runs on
EXPOSE 8080

# Command to run the Spring Boot application
CMD ["java", "-jar", "target/movies-0.0.1-SNAPSHOT.jar"]
