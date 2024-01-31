package com.dignitas.ddd2.domain;

import java.util.UUID;

public class CTestSamples {

    public static C getCSample1() {
        return new C().id("id1").name("name1");
    }

    public static C getCSample2() {
        return new C().id("id2").name("name2");
    }

    public static C getCRandomSampleGenerator() {
        return new C().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
