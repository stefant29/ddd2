package com.dignitas.ddd2.domain;

import static com.dignitas.ddd2.domain.ATestSamples.*;
import static com.dignitas.ddd2.domain.CTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.dignitas.ddd2.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(C.class);
        C c1 = getCSample1();
        C c2 = new C();
        assertThat(c1).isNotEqualTo(c2);

        c2.setId(c1.getId());
        assertThat(c1).isEqualTo(c2);

        c2 = getCSample2();
        assertThat(c1).isNotEqualTo(c2);
    }

    @Test
    void aTest() throws Exception {
        C c = getCRandomSampleGenerator();
        A aBack = getARandomSampleGenerator();

        c.setA(aBack);
        assertThat(c.getA()).isEqualTo(aBack);

        c.a(null);
        assertThat(c.getA()).isNull();
    }
}
