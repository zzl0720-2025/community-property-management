package com.community.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.time.LocalDateTime;

/**
 * Comment entity — a reply to a Post in the discussion board.
 * The back-reference to Post is @JsonIgnore to prevent infinite serialization loops.
 */
@Data
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonIgnore                          // Breaks the Post ↔ Comment circular reference in JSON
    @ToString.Exclude                    // Prevents StackOverflow in Lombok toString
    @EqualsAndHashCode.Exclude           // Prevents StackOverflow in Lombok equals/hashCode
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
}
