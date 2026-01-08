-- V3__auth.sql

create table admin (
  id bigserial primary key,
  email text not null unique,
  parola_hash text not null,
  created_at timestamptz not null default now()
);

alter table candidat
  add column parola_hash text;