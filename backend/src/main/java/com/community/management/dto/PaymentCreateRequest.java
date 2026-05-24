package com.community.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO for admin creating a payment record for a resident.
 * Maps the Admin panel form fields to the Payment entity.
 */
@Data
public class PaymentCreateRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    /** Fee type / description (e.g. "Property Management Fee") */
    @NotBlank(message = "Fee type is required")
    private String type;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    /** Optional due date as an ISO date string (YYYY-MM-DD). */
    private String dueDate;

    /** "unpaid" maps to PENDING; "paid" maps to PAID. Defaults to PENDING. */
    private String status;
}
