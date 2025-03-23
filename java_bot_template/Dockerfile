# Use Maven image to build
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app

# Copy ONLY java_bot_template
COPY . /app/java_bot_template/

# Change directory to java_bot_template
WORKDIR /app/java_bot_template

# Build the JAR with dependencies
RUN mvn clean package

# Use OpenJDK to run the JAR
FROM openjdk:17
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/java_bot_template/target/java_bot_template-1.0-SNAPSHOT.jar /app/app.jar

# Run the Java application
CMD ["java", "-jar", "app.jar"]
