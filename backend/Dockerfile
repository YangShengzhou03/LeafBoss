FROM maven:3.8-openjdk-17 AS builder
WORKDIR /app
RUN echo '<?xml version="1.0" encoding="UTF-8"?>' > /app/settings.xml && \
  echo '<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">' >> /app/settings.xml && \
  echo '  <mirrors>' >> /app/settings.xml && \
  echo '    <mirror>' >> /app/settings.xml && \
  echo '      <id>aliyunmaven</id>' >> /app/settings.xml && \
  echo '      <name>阿里云中央仓库</name>' >> /app/settings.xml && \
  echo '      <url>https://maven.aliyun.com/repository/public</url>' >> /app/settings.xml && \
  echo '      <mirrorOf>central</mirrorOf>' >> /app/settings.xml && \
  echo '    </mirror>' >> /app/settings.xml && \
  echo '    <mirror>' >> /app/settings.xml && \
  echo '      <id>aliyun-spring</id>' >> /app/settings.xml && \
  echo '      <name>阿里云 Spring 仓库</name>' >> /app/settings.xml && \
  echo '      <url>https://maven.aliyun.com/repository/spring</url>' >> /app/settings.xml && \
  echo '      <mirrorOf>spring-milestones,spring-snapshots</mirrorOf>' >> /app/settings.xml && \
  echo '    </mirror>' >> /app/settings.xml && \
  echo '  </mirrors>' >> /app/settings.xml && \
  echo '</settings>' >> /app/settings.xml
COPY pom.xml ./
RUN mvn dependency:go-offline -B --settings /app/settings.xml
COPY src ./src
RUN mvn package -DskipTests -B --settings /app/settings.xml

FROM openjdk:17-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]