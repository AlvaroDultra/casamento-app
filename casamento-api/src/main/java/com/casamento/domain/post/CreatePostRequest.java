package com.casamento.domain.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreatePostRequest {

    @Size(max = 2000)
    private String caption;

    @NotBlank
    private String mediaUrl;

    @NotBlank
    @Pattern(regexp = "IMAGE|VIDEO", message = "mediaType deve ser IMAGE ou VIDEO")
    private String mediaType;
}
