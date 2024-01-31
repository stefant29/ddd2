package com.dignitas.ddd2.domain;

import java.util.UUID;

public class DTestSamples {

    public static D getDSample1() {
        return new D().id("id1").name("name1");
    }

    public static D getDSample2() {
        return new D().id("id2").name("name2");
    }

    public static D getDRandomSampleGenerator() {
        return new D().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
