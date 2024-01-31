package com.dignitas.ddd2.repository;

import com.dignitas.ddd2.domain.C;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the C entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CRepository extends JpaRepository<C, String> {}
