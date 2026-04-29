package com.community.management.service.impl;

import com.community.management.entity.Announcement;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.AnnouncementRepository;
import com.community.management.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    @Override
    public List<Announcement> getAll() {
        return announcementRepository.findAllByOrderByPostedAtDesc();
    }

    @Override
    public Announcement create(Announcement announcement) {
        // TODO: set postedBy from security context
        return announcementRepository.save(announcement);
    }

    @Override
    public void delete(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Announcement not found: " + id);
        }
        announcementRepository.deleteById(id);
    }
}
