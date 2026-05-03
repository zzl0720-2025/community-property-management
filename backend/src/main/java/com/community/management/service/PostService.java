package com.community.management.service;

import com.community.management.entity.Comment;
import com.community.management.entity.Post;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.CommentRepository;
import com.community.management.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post getById(Long id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + id));
    }

    public Post create(Post post) {
        // TODO: set author from security context
        return postRepository.save(post);
    }

    public Comment addComment(Long postId, Comment comment) {
        Post post = getById(postId);
        comment.setPost(post);
        // TODO: set author from security context
        return commentRepository.save(comment);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
