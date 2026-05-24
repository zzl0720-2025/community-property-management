package com.community.management.service;

import com.community.management.entity.Announcement;
import com.community.management.entity.User;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.AnnouncementRepository;
import com.community.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public List<Announcement> getAll() {
        return announcementRepository.findAllByOrderByPostedAtDesc();
    }

    /**
     * Create an announcement posted by the given admin email.
     * Sets postedBy from the security context so the DB not-null constraint is satisfied.
     */
    public Announcement create(Announcement announcement, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found: " + adminEmail));
        announcement.setPostedBy(admin);
        return announcementRepository.save(announcement);
    }

    public void delete(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Announcement not found: " + id);
        }
        announcementRepository.deleteById(id);
    }
}
