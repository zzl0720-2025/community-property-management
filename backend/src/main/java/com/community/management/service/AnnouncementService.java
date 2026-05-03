package com.community.management.service;

import com.community.management.entity.Announcement;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public List<Announcement> getAll() {
        return announcementRepository.findAllByOrderByPostedAtDesc();
    }

    public Announcement create(Announcement announcement) {
        // TODO: set postedBy from security context
        return announcementRepository.save(announcement);
    }

    public void delete(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Announcement not found: " + id);
        }
        announcementRepository.deleteById(id);
    }
}
