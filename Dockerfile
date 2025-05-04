# Use an official JDK 21 runtime as base image
FROM eclipse-temurin:21-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy your JAR file into the container
COPY bambu-web-runner.jar app.jar

# Set environment variables for Quarkus
ENV quarkus.http.host=0.0.0.0
ENV quarkus.http.port=8080

# Expose the HTTP port
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
