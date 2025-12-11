package com.example.fashion.security;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.exceptions.CodeGenerationException; // THÊM IMPORT
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TwoFactorService {

    private final CodeGenerator codeGenerator;
    private final CodeVerifier codeVerifier;

    public TwoFactorService() {
        this.codeGenerator = new DefaultCodeGenerator();
        TimeProvider timeProvider = new SystemTimeProvider();
        this.codeVerifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
    }

    public String generateSecret() {
        return new DefaultSecretGenerator().generate();
    }

    public String getQrCodeUrl(String secret, String email) {
        return "otpauth://totp/" + email + "?secret=" + secret + "&issuer=FashionShop";
    }

    public boolean verify(String secret, String code) {
        return codeVerifier.isValidCode(secret, code);
    }

    public String generateCode(String secret) {
        try {
            return codeGenerator.generate(secret, Instant.now().getEpochSecond() / 30);
        } catch (CodeGenerationException e) {
            throw new RuntimeException("Failed to generate 2FA code", e);
        }
    }
}