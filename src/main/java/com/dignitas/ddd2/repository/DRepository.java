package com.dignitas.ddd2.repository;

import com.dignitas.ddd2.domain.D;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the D entity.
 */
@Repository
public interface DRepository extends JpaRepository<D, String> {
    default Optional<D> findOneWithEagerRelationships(String id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<D> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<D> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select d from D d left join fetch d.a", countQuery = "select count(d) from D d")
    Page<D> findAllWithToOneRelationships(Pageable pageable);

    @Query("select d from D d left join fetch d.a")
    List<D> findAllWithToOneRelationships();

    @Query("select d from D d left join fetch d.a where d.id =:id")
    Optional<D> findOneWithToOneRelationships(@Param("id") String id);
}
