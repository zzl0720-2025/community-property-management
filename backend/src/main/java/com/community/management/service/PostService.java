package com.community.management.service;

import com.community.management.entity.Comment;
import com.community.management.entity.Post;
import java.util.List;

public interface PostService {

    List<Post> getAllPosts();

    Post getById(Long id);

    Post create(Post post);

    Comment addComment(Long postId, Comment comment);

    void deletePost(Long id);
}
