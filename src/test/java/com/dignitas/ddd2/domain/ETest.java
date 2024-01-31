package com.dignitas.ddd2.domain;

import static com.dignitas.ddd2.domain.ATestSamples.*;
import static com.dignitas.ddd2.domain.ETestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.dignitas.ddd2.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ETest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(E.class);
        E e1 = getESample1();
        E e2 = new E();
        assertThat(e1).isNotEqualTo(e2);

        e2.setId(e1.getId());
        assertThat(e1).isEqualTo(e2);

        e2 = getESample2();
        assertThat(e1).isNotEqualTo(e2);
    }

    @Test
    void aTest() throws Exception {
        E e = getERandomSampleGenerator();
        A aBack = getARandomSampleGenerator();

        e.addA(aBack);
        assertThat(e.getAs()).containsOnly(aBack);
        assertThat(aBack.getE()).isEqualTo(e);

        e.removeA(aBack);
        assertThat(e.getAs()).doesNotContain(aBack);
        assertThat(aBack.getE()).isNull();

        e.as(new HashSet<>(Set.of(aBack)));
        assertThat(e.getAs()).containsOnly(aBack);
        assertThat(aBack.getE()).isEqualTo(e);

        e.setAs(new HashSet<>());
        assertThat(e.getAs()).doesNotContain(aBack);
        assertThat(aBack.getE()).isNull();
    }
}
