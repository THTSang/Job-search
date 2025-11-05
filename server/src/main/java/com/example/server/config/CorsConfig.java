package com.example.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
  private final List<String> allowedOrigins;

  public CorsConfig(@Value("${app.cors.allowed-origins:*}") String allowedOriginsProperty) {
    this.allowedOrigins = Arrays.stream(allowedOriginsProperty.split(","))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .collect(Collectors.toList());
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    var registration = registry.addMapping("/**")
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .exposedHeaders("Location")
        .allowCredentials(false)
        .maxAge(3600);

    if (allowedOrigins.size() == 1 && "*".equals(allowedOrigins.get(0))) {
      registration.allowedOriginPatterns("*");
    } else {
      registration.allowedOrigins(allowedOrigins.toArray(new String[0]));
    }
  }
}
