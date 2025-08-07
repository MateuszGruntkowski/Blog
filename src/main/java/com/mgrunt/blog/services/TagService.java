package com.mgrunt.blog.services;

import com.mgrunt.blog.domain.entities.Tag;

import java.util.List;

public interface TagService {
    List<Tag> getTags();
}
