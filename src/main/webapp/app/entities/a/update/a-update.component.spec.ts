import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IE } from 'app/entities/e/e.model';
import { EService } from 'app/entities/e/service/e.service';
import { AService } from '../service/a.service';
import { IA } from '../a.model';
import { AFormService } from './a-form.service';

import { AUpdateComponent } from './a-update.component';

describe('A Management Update Component', () => {
  let comp: AUpdateComponent;
  let fixture: ComponentFixture<AUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let aFormService: AFormService;
  let aService: AService;
  let eService: EService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AUpdateComponent],
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
      .overrideTemplate(AUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    aFormService = TestBed.inject(AFormService);
    aService = TestBed.inject(AService);
    eService = TestBed.inject(EService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call E query and add missing value', () => {
      const a: IA = { id: 'CBA' };
      const e: IE = { id: 'e63220eb-f1a2-4d57-9dec-4e471d8753cd' };
      a.e = e;

      const eCollection: IE[] = [{ id: 'af63fed4-3263-4547-b28c-02b83c4210a7' }];
      jest.spyOn(eService, 'query').mockReturnValue(of(new HttpResponse({ body: eCollection })));
      const additionalES = [e];
      const expectedCollection: IE[] = [...additionalES, ...eCollection];
      jest.spyOn(eService, 'addEToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ a });
      comp.ngOnInit();

      expect(eService.query).toHaveBeenCalled();
      expect(eService.addEToCollectionIfMissing).toHaveBeenCalledWith(eCollection, ...additionalES.map(expect.objectContaining));
      expect(comp.eSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const a: IA = { id: 'CBA' };
      const e: IE = { id: '2c2c2e48-ff3a-4ab5-a4f9-941d6b52a452' };
      a.e = e;

      activatedRoute.data = of({ a });
      comp.ngOnInit();

      expect(comp.eSSharedCollection).toContain(e);
      expect(comp.a).toEqual(a);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IA>>();
      const a = { id: 'ABC' };
      jest.spyOn(aFormService, 'getA').mockReturnValue(a);
      jest.spyOn(aService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ a });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: a }));
      saveSubject.complete();

      // THEN
      expect(aFormService.getA).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(aService.update).toHaveBeenCalledWith(expect.objectContaining(a));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IA>>();
      const a = { id: 'ABC' };
      jest.spyOn(aFormService, 'getA').mockReturnValue({ id: null });
      jest.spyOn(aService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ a: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: a }));
      saveSubject.complete();

      // THEN
      expect(aFormService.getA).toHaveBeenCalled();
      expect(aService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IA>>();
      const a = { id: 'ABC' };
      jest.spyOn(aService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ a });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(aService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareE', () => {
      it('Should forward to eService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(eService, 'compareE');
        comp.compareE(entity, entity2);
        expect(eService.compareE).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
