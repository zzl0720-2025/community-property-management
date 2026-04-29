package com.community.management.service;

import com.community.management.entity.Announcement;
import java.util.List;

public interface AnnouncementService {

    List<Announcement> getAll();

    Announcement create(Announcement announcement);

    void delete(Long id);
}
