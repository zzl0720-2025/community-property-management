package com.community.management.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum BookingStatus {
    PENDING, APPROVED, REJECTED, CANCELLED;

    @JsonValue
    public String toLower() { return name().toLowerCase(); }
}
