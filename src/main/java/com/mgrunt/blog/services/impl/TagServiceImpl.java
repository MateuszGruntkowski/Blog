package com.mgrunt.blog.services.impl;

import com.mgrunt.blog.domain.entities.Tag;
import com.mgrunt.blog.repositories.TagRepository;
import com.mgrunt.blog.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    public List<Tag> getTags() {
        return tagRepository.findAllWithPostCount();
    }
}
