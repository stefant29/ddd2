package com.dignitas.ddd2.domain;

import java.util.UUID;

public class ETestSamples {

    public static E getESample1() {
        return new E().id("id1").name("name1");
    }

    public static E getESample2() {
        return new E().id("id2").name("name2");
    }

    public static E getERandomSampleGenerator() {
        return new E().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}
