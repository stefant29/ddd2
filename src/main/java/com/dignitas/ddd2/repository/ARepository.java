package com.dignitas.ddd2.repository;

import com.dignitas.ddd2.domain.A;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the A entity.
 */
@Repository
public interface ARepository extends JpaRepository<A, String> {
    default Optional<A> findOneWithEagerRelationships(String id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<A> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<A> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select a from A a left join fetch a.e", countQuery = "select count(a) from A a")
    Page<A> findAllWithToOneRelationships(Pageable pageable);

    @Query("select a from A a left join fetch a.e")
    List<A> findAllWithToOneRelationships();

    @Query("select a from A a left join fetch a.e where a.id =:id")
    Optional<A> findOneWithToOneRelationships(@Param("id") String id);
}
