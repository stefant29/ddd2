package com.dignitas.ddd2.repository;

import com.dignitas.ddd2.domain.E;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the E entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ERepository extends JpaRepository<E, String> {}
