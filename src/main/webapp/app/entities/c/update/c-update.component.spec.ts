import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IA } from 'app/entities/a/a.model';
import { AService } from 'app/entities/a/service/a.service';
import { CService } from '../service/c.service';
import { IC } from '../c.model';
import { CFormService } from './c-form.service';

import { CUpdateComponent } from './c-update.component';

describe('C Management Update Component', () => {
  let comp: CUpdateComponent;
  let fixture: ComponentFixture<CUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cFormService: CFormService;
  let cService: CService;
  let aService: AService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CUpdateComponent],
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
      .overrideTemplate(CUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cFormService = TestBed.inject(CFormService);
    cService = TestBed.inject(CService);
    aService = TestBed.inject(AService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call A query and add missing value', () => {
      const c: IC = { id: 'CBA' };
      const a: IA = { id: '831e5c7c-ab89-4b4f-b0ab-467d14d49b97' };
      c.a = a;

      const aCollection: IA[] = [{ id: 'a2846ae8-44f5-4d2a-bf3d-ba6a9e3e9678' }];
      jest.spyOn(aService, 'query').mockReturnValue(of(new HttpResponse({ body: aCollection })));
      const additionalAS = [a];
      const expectedCollection: IA[] = [...additionalAS, ...aCollection];
      jest.spyOn(aService, 'addAToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ c });
      comp.ngOnInit();

      expect(aService.query).toHaveBeenCalled();
      expect(aService.addAToCollectionIfMissing).toHaveBeenCalledWith(aCollection, ...additionalAS.map(expect.objectContaining));
      expect(comp.aSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const c: IC = { id: 'CBA' };
      const a: IA = { id: '6a89f974-dcb9-4be3-9a66-5d7e45c93721' };
      c.a = a;

      activatedRoute.data = of({ c });
      comp.ngOnInit();

      expect(comp.aSSharedCollection).toContain(a);
      expect(comp.c).toEqual(c);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IC>>();
      const c = { id: 'ABC' };
      jest.spyOn(cFormService, 'getC').mockReturnValue(c);
      jest.spyOn(cService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ c });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: c }));
      saveSubject.complete();

      // THEN
      expect(cFormService.getC).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cService.update).toHaveBeenCalledWith(expect.objectContaining(c));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IC>>();
      const c = { id: 'ABC' };
      jest.spyOn(cFormService, 'getC').mockReturnValue({ id: null });
      jest.spyOn(cService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ c: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: c }));
      saveSubject.complete();

      // THEN
      expect(cFormService.getC).toHaveBeenCalled();
      expect(cService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IC>>();
      const c = { id: 'ABC' };
      jest.spyOn(cService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ c });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cService.update).toHaveBeenCalled();
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
