package com.community.management.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum BookingStatus {
    PENDING, APPROVED, REJECTED, CANCELLED;

    @JsonValue
    public String toLower() { return name().toLowerCase(); }

    @JsonCreator
    public static BookingStatus fromString(String value) {
        if (value == null) return null;
        return BookingStatus.valueOf(value.toUpperCase());
    }
}
