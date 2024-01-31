package com.dignitas.ddd2.domain;

import static com.dignitas.ddd2.domain.ATestSamples.*;
import static com.dignitas.ddd2.domain.DTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.dignitas.ddd2.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(D.class);
        D d1 = getDSample1();
        D d2 = new D();
        assertThat(d1).isNotEqualTo(d2);

        d2.setId(d1.getId());
        assertThat(d1).isEqualTo(d2);

        d2 = getDSample2();
        assertThat(d1).isNotEqualTo(d2);
    }

    @Test
    void aTest() throws Exception {
        D d = getDRandomSampleGenerator();
        A aBack = getARandomSampleGenerator();

        d.setA(aBack);
        assertThat(d.getA()).isEqualTo(aBack);

        d.a(null);
        assertThat(d.getA()).isNull();
    }
}
