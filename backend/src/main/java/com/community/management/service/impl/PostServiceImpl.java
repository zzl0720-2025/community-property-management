package com.community.management.service.impl;

import com.community.management.entity.Comment;
import com.community.management.entity.Post;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.CommentRepository;
import com.community.management.repository.PostRepository;
import com.community.management.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Post getById(Long id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + id));
    }

    @Override
    public Post create(Post post) {
        // TODO: set author from security context
        return postRepository.save(post);
    }

    @Override
    public Comment addComment(Long postId, Comment comment) {
        Post post = getById(postId);
        comment.setPost(post);
        // TODO: set author from security context
        return commentRepository.save(comment);
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
