import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IA } from 'app/entities/a/a.model';
import { AService } from 'app/entities/a/service/a.service';
import { DService } from '../service/d.service';
import { ID } from '../d.model';
import { DFormService } from './d-form.service';

import { DUpdateComponent } from './d-update.component';

describe('D Management Update Component', () => {
  let comp: DUpdateComponent;
  let fixture: ComponentFixture<DUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dFormService: DFormService;
  let dService: DService;
  let aService: AService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), DUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dFormService = TestBed.inject(DFormService);
    dService = TestBed.inject(DService);
    aService = TestBed.inject(AService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call A query and add missing value', () => {
      const d: ID = { id: 'CBA' };
      const a: IA = { id: '9d2c14c4-a4d8-4487-9630-b097881049b5' };
      d.a = a;

      const aCollection: IA[] = [{ id: '5b323e83-d9af-4069-8178-88925e3fa030' }];
      jest.spyOn(aService, 'query').mockReturnValue(of(new HttpResponse({ body: aCollection })));
      const additionalAS = [a];
      const expectedCollection: IA[] = [...additionalAS, ...aCollection];
      jest.spyOn(aService, 'addAToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ d });
      comp.ngOnInit();

      expect(aService.query).toHaveBeenCalled();
      expect(aService.addAToCollectionIfMissing).toHaveBeenCalledWith(aCollection, ...additionalAS.map(expect.objectContaining));
      expect(comp.aSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const d: ID = { id: 'CBA' };
      const a: IA = { id: '7f87b35c-ca1d-4702-97ba-1368a070cbd8' };
      d.a = a;

      activatedRoute.data = of({ d });
      comp.ngOnInit();

      expect(comp.aSSharedCollection).toContain(a);
      expect(comp.d).toEqual(d);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ID>>();
      const d = { id: 'ABC' };
      jest.spyOn(dFormService, 'getD').mockReturnValue(d);
      jest.spyOn(dService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ d });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: d }));
      saveSubject.complete();

      // THEN
      expect(dFormService.getD).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dService.update).toHaveBeenCalledWith(expect.objectContaining(d));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ID>>();
      const d = { id: 'ABC' };
      jest.spyOn(dFormService, 'getD').mockReturnValue({ id: null });
      jest.spyOn(dService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ d: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: d }));
      saveSubject.complete();

      // THEN
      expect(dFormService.getD).toHaveBeenCalled();
      expect(dService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ID>>();
      const d = { id: 'ABC' };
      jest.spyOn(dService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ d });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareA', () => {
      it('Should forward to aService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(aService, 'compareA');
        comp.compareA(entity, entity2);
        expect(aService.compareA).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
