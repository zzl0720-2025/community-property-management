package com.community.management.service;

import com.community.management.entity.User;
import java.util.List;

public interface UserService {

    List<User> getAll();

    User getById(Long id);

    User update(Long id, User updated);

    void delete(Long id);
}
