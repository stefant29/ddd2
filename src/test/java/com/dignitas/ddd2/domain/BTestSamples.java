package com.dignitas.ddd2.domain;

import java.util.UUID;

public class BTestSamples {

    public static B getBSample1() {
        return new B().id("id1").name("name1");
    }

    public static B getBSample2() {
        return new B().id("id2").name("name2");
    }

    public static B getBRandomSampleGenerator() {
        return new B().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
