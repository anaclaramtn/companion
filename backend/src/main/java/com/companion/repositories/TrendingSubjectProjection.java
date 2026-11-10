package com.companion.repositories;

public interface TrendingSubjectProjection {
    Long getSubjectId();
    String getCode();
    String getName();
    long getPostCount();
}
