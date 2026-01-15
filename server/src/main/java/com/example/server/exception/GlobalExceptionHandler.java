package com.example.server.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.authentication.BadCredentialsException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleNotFound(NotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "not_found");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> errors = new HashMap<>();
        for (var e : ex.getBindingResult().getAllErrors()) {
            String field = e instanceof FieldError fe ? fe.getField() : e.getObjectName();
            errors.put(field, e.getDefaultMessage());
        }
        Map<String, Object> body = new HashMap<>();
        body.put("error", "validation_failed");
        body.put("details", errors);
        return ResponseEntity.badRequest().body(body);
    }

    // Xử lý lỗi đăng nhập (Sai pass, Account locked/banned/inactive)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "authentication_failed");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }
}