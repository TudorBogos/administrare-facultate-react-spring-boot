-- V4__optiune_status.sql

alter table optiune drop constraint if exists ck_optiune_status;
alter table optiune drop column if exists status;