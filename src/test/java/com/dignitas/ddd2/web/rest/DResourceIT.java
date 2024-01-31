package com.dignitas.ddd2.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dignitas.ddd2.IntegrationTest;
import com.dignitas.ddd2.domain.D;
import com.dignitas.ddd2.repository.DRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private DRepository dRepository;

    @Mock
    private DRepository dRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDMockMvc;

    private D d;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static D createEntity(EntityManager em) {
        D d = new D().name(DEFAULT_NAME);
        return d;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static D createUpdatedEntity(EntityManager em) {
        D d = new D().name(UPDATED_NAME);
        return d;
    }

    @BeforeEach
    public void initTest() {
        d = createEntity(em);
    }

    @Test
    @Transactional
    void createD() throws Exception {
        int databaseSizeBeforeCreate = dRepository.findAll().size();
        // Create the D
        restDMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(d)))
            .andExpect(status().isCreated());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeCreate + 1);
        D testD = dList.get(dList.size() - 1);
        assertThat(testD.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createDWithExistingId() throws Exception {
        // Create the D with an existing ID
        d.setId("existing_id");

        int databaseSizeBeforeCreate = dRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(d)))
            .andExpect(status().isBadRequest());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDS() throws Exception {
        // Initialize the database
        dRepository.saveAndFlush(d);

        // Get all the dList
        restDMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(d.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDSWithEagerRelationshipsIsEnabled() throws Exception {
        when(dRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(dRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDSWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(dRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(dRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getD() throws Exception {
        // Initialize the database
        dRepository.saveAndFlush(d);

        // Get the d
        restDMockMvc
            .perform(get(ENTITY_API_URL_ID, d.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(d.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingD() throws Exception {
        // Get the d
        restDMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingD() throws Exception {
        // Initialize the database
        dRepository.saveAndFlush(d);

        int databaseSizeBeforeUpdate = dRepository.findAll().size();

        // Update the d
        D updatedD = dRepository.findById(d.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedD are not directly saved in db
        em.detach(updatedD);
        updatedD.name(UPDATED_NAME);

        restDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedD.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedD))
            )
            .andExpect(status().isOk());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeUpdate);
        D testD = dList.get(dList.size() - 1);
        assertThat(testD.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingD() throws Exception {
        int databaseSizeBeforeUpdate = dRepository.findAll().size();
        d.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, d.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(d))
            )
            .andExpect(status().isBadRequest());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchD() throws Exception {
        int databaseSizeBeforeUpdate = dRepository.findAll().size();
        d.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(d))
            )
            .andExpect(status().isBadRequest());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamD() throws Exception {
        int databaseSizeBeforeUpdate = dRepository.findAll().size();
        d.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(d)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDWithPatch() throws Exception {
        // Initialize the database
        dRepository.saveAndFlush(d);

        int databaseSizeBeforeUpdate = dRepository.findAll().size();

        // Update the d using partial update
        D partialUpdatedD = new D();
        partialUpdatedD.setId(d.getId());

        restDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedD.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedD))
            )
            .andExpect(status().isOk());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeUpdate);
        D testD = dList.get(dList.size() - 1);
        assertThat(testD.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateDWithPatch() throws Exception {
        // Initialize the database
        dRepository.saveAndFlush(d);

        int databaseSizeBeforeUpdate = dRepository.findAll().size();

        // Update the d using partial update
        D partialUpdatedD = new D();
        partialUpdatedD.setId(d.getId());

        partialUpdatedD.name(UPDATED_NAME);

        restDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedD.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedD))
            )
            .andExpect(status().isOk());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeUpdate);
        D testD = dList.get(dList.size() - 1);
        assertThat(testD.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingD() throws Exception {
        int databaseSizeBeforeUpdate = dRepository.findAll().size();
        d.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, d.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(d))
            )
            .andExpect(status().isBadRequest());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchD() throws Exception {
        int databaseSizeBeforeUpdate = dRepository.findAll().size();
        d.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(d))
            )
            .andExpect(status().isBadRequest());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamD() throws Exception {
        int databaseSizeBeforeUpdate = dRepository.findAll().size();
        d.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(d)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the D in the database
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteD() throws Exception {
        // Initialize the database
        dRepository.saveAndFlush(d);

        int databaseSizeBeforeDelete = dRepository.findAll().size();

        // Delete the d
        restDMockMvc.perform(delete(ENTITY_API_URL_ID, d.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<D> dList = dRepository.findAll();
        assertThat(dList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
