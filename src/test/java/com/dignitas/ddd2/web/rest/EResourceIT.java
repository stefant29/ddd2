package com.dignitas.ddd2.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dignitas.ddd2.IntegrationTest;
import com.dignitas.ddd2.domain.E;
import com.dignitas.ddd2.repository.ERepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/es";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ERepository eRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEMockMvc;

    private E e;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static E createEntity(EntityManager em) {
        E e = new E().name(DEFAULT_NAME);
        return e;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static E createUpdatedEntity(EntityManager em) {
        E e = new E().name(UPDATED_NAME);
        return e;
    }

    @BeforeEach
    public void initTest() {
        e = createEntity(em);
    }

    @Test
    @Transactional
    void createE() throws Exception {
        int databaseSizeBeforeCreate = eRepository.findAll().size();
        // Create the E
        restEMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(e)))
            .andExpect(status().isCreated());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeCreate + 1);
        E testE = eList.get(eList.size() - 1);
        assertThat(testE.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createEWithExistingId() throws Exception {
        // Create the E with an existing ID
        e.setId("existing_id");

        int databaseSizeBeforeCreate = eRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(e)))
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllES() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        // Get all the eList
        restEMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(e.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getE() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        // Get the e
        restEMockMvc
            .perform(get(ENTITY_API_URL_ID, e.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(e.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingE() throws Exception {
        // Get the e
        restEMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingE() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        int databaseSizeBeforeUpdate = eRepository.findAll().size();

        // Update the e
        E updatedE = eRepository.findById(e.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedE are not directly saved in db
        em.detach(updatedE);
        updatedE.name(UPDATED_NAME);

        restEMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedE.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedE))
            )
            .andExpect(status().isOk());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
        E testE = eList.get(eList.size() - 1);
        assertThat(testE.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(
                put(ENTITY_API_URL_ID, e.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(e))
            )
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(e))
            )
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(e)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEWithPatch() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        int databaseSizeBeforeUpdate = eRepository.findAll().size();

        // Update the e using partial update
        E partialUpdatedE = new E();
        partialUpdatedE.setId(e.getId());

        restEMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedE.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedE))
            )
            .andExpect(status().isOk());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
        E testE = eList.get(eList.size() - 1);
        assertThat(testE.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateEWithPatch() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        int databaseSizeBeforeUpdate = eRepository.findAll().size();

        // Update the e using partial update
        E partialUpdatedE = new E();
        partialUpdatedE.setId(e.getId());

        partialUpdatedE.name(UPDATED_NAME);

        restEMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedE.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedE))
            )
            .andExpect(status().isOk());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
        E testE = eList.get(eList.size() - 1);
        assertThat(testE.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, e.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(e))
            )
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(e))
            )
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(e)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteE() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        int databaseSizeBeforeDelete = eRepository.findAll().size();

        // Delete the e
        restEMockMvc.perform(delete(ENTITY_API_URL_ID, e.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
