package com.casamento.domain.post;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.casamento.domain.user.User;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final List<String> ALLOWED_IMAGE_TYPES = List.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif"
    );

    @Value("${app.cloudinary.cloud-name}")
    private String cloudName;
    @Value("${app.cloudinary.api-key}")
    private String apiKey;
    @Value("${app.cloudinary.api-secret}")
    private String apiSecret;
    @Value("${app.upload.max-image-mb}")
    private long maxImageMb;
    @Value("${app.upload.max-video-mb}")
    private long maxVideoMb;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    @PostMapping("/image")
    public ResponseEntity<UploadResponse> uploadImage(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo vazio");
        }
        String contentType = file.getContentType();
        boolean isImage = contentType != null && ALLOWED_IMAGE_TYPES.contains(contentType);
        boolean isOctet = "application/octet-stream".equals(contentType);
        if (!isImage && !isOctet) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tipo não permitido. Envie uma foto (JPEG, PNG, HEIC, etc.)");
        }
        if (file.getSize() > maxImageMb * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Foto maior que " + maxImageMb + "MB");
        }

        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("folder", "casamento/fotos")
        );

        String url = (String) result.get("secure_url");
        return ResponseEntity.ok(new UploadResponse(url, "IMAGE"));
    }

    @PostMapping("/video")
    public ResponseEntity<UploadResponse> uploadVideo(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo vazio");
        }
        String contentType = file.getContentType();
        boolean isVideo = contentType != null && contentType.startsWith("video/");
        // Alguns celulares enviam application/octet-stream — aceitar e confiar no Cloudinary
        boolean isOctet = "application/octet-stream".equals(contentType);
        if (!isVideo && !isOctet) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tipo não permitido. Envie um vídeo (MP4, WebM ou MOV)");
        }
        if (file.getSize() > maxVideoMb * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Vídeo maior que " + maxVideoMb + "MB");
        }

        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "casamento/videos",
                        "resource_type", "video"
                )
        );

        String url = (String) result.get("secure_url");
        return ResponseEntity.ok(new UploadResponse(url, "VIDEO"));
    }

    public record UploadResponse(String url, String mediaType) {}
}
