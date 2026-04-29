package com.community.management.repository;

import com.community.management.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    // Latest announcements first — used for dashboard feed
    List<Announcement> findAllByOrderByPostedAtDesc();
}
