-- V2__status_constraints.sql

alter table dosar
  add constraint ck_dosar_status
  check (status in ('IN_LUCRU', 'TRIMIS', 'VALIDAT'));

alter table optiune
  add constraint ck_optiune_status
  check (status is null or status in ('ADMIS', 'LISTA_ASTEPTARE', 'RESPINS'));
