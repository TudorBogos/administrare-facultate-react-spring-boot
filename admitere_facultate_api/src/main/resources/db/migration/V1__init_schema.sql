-- V1__init_schema.sql

create table facultate (
  id bigserial primary key,
  nume text not null unique
);

create table program_studiu (
  id bigserial primary key,
  facultate_id bigint not null references facultate(id),
  nume text not null,
  locuri_buget int not null,
  locuri_taxa int not null,
  constraint uq_program_facultate_nume unique (facultate_id, nume)
);

create table candidat (
  id bigserial primary key,
  nume text not null,
  prenume text not null,
  email text not null unique
);

create table dosar (
  id bigserial primary key,
  candidat_id bigint not null references candidat(id),
  status text not null,
  medie numeric(4,2),
  created_at timestamptz not null default now(),
  constraint ck_dosar_status check (status in ('IN_LUCRU', 'TRIMIS', 'VALIDAT'))
);

create table optiune (
  id bigserial primary key,
  dosar_id bigint not null references dosar(id),
  program_id bigint not null references program_studiu(id),
  prioritate int not null,
  status text,
  constraint uq_optiune_dosar_prioritate unique (dosar_id, prioritate),
  constraint uq_optiune_dosar_program unique (dosar_id, program_id),
  constraint ck_optiune_status check (status is null or status in ('ADMIS', 'LISTA_ASTEPTARE', 'RESPINS'))
);

create index idx_program_studiu_facultate_id on program_studiu(facultate_id);
create index idx_dosar_candidat_id on dosar(candidat_id);
create index idx_optiune_dosar_id on optiune(dosar_id);
create index idx_optiune_program_id on optiune(program_id);