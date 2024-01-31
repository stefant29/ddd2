package com.dignitas.ddd2.domain;

import java.util.UUID;

public class ATestSamples {

    public static A getASample1() {
        return new A().id("id1").name("name1");
    }

    public static A getASample2() {
        return new A().id("id2").name("name2");
    }

    public static A getARandomSampleGenerator() {
        return new A().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
