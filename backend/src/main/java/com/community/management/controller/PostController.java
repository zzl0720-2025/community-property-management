package com.community.management.controller;

import com.community.management.entity.Comment;
import com.community.management.entity.Post;
import com.community.management.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * PostController — discussion board threads and comments.
 *
 * GET    /api/posts               → list all posts
 * GET    /api/posts/{id}          → get post + comments
 * POST   /api/posts               → create post
 * POST   /api/posts/{id}/comments → add comment to post
 * DELETE /api/posts/{id}          → delete post
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<List<Post>> getAll() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Post> create(@RequestBody Post post) {
        return ResponseEntity.ok(postService.create(post));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long id,
                                              @RequestBody Comment comment) {
        return ResponseEntity.ok(postService.addComment(id, comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
