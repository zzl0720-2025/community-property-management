package com.community.management.dto.maintenance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MaintenanceCreateRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    private String description;

    @Size(max = 100)
    private String location;
}
