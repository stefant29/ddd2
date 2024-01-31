package com.dignitas.ddd2.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A E.
 */
@Entity
@Table(name = "e")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class E implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "e")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "e", "bs" }, allowSetters = true)
    private Set<A> as = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public E id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public E name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<A> getAs() {
        return this.as;
    }

    public void setAs(Set<A> as) {
        if (this.as != null) {
            this.as.forEach(i -> i.setE(null));
        }
        if (as != null) {
            as.forEach(i -> i.setE(this));
        }
        this.as = as;
    }

    public E as(Set<A> as) {
        this.setAs(as);
        return this;
    }

    public E addA(A a) {
        this.as.add(a);
        a.setE(this);
        return this;
    }

    public E removeA(A a) {
        this.as.remove(a);
        a.setE(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof E)) {
            return false;
        }
        return getId() != null && getId().equals(((E) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "E{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
