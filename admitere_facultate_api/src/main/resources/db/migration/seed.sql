-- seed.sql
-- Development seed data for the "Admitere la facultate" project (PostgreSQL)

-- Needed for bcrypt hashing in SQL (crypt/gen_salt)
create extension if not exists pgcrypto;

-- Wipe existing data (order matters due to foreign keys)
truncate table optiune restart identity;
truncate table dosar restart identity;
truncate table candidat restart identity;
truncate table program_studiu restart identity;
truncate table facultate restart identity;
truncate table admin restart identity;

-- Facultati
insert into facultate (id, nume) values
  (1, 'Facultatea de Informatica'),
  (2, 'Facultatea de Biologie'),
  (3, 'Facultatea de Inginerie');

select setval(pg_get_serial_sequence('facultate', 'id'), (select max(id) from facultate));

-- Programe de studiu
insert into program_studiu (id, facultate_id, nume, locuri_buget, locuri_taxa) values
  (1, 1, 'Informatica',   1, 2),
  (2, 3, 'Calculatoare',  1, 1),
  (3, 2, 'Microbiologie', 2, 3);

select setval(pg_get_serial_sequence('program_studiu', 'id'), (select max(id) from program_studiu));

-- Admin initial (parola: parola)
insert into admin (id, email, parola_hash)
values (1, 'admin@local', crypt('parola', gen_salt('bf')));

select setval(pg_get_serial_sequence('admin', 'id'), (select max(id) from admin));

-- Candidati (parola: parola pentru toti)
insert into candidat (id, nume, prenume, email, parola_hash) values
  (1,  'Bogos',    'Tudor',    'tudor@local',                 crypt('parola', gen_salt('bf'))),
  (2,  'Popescu',  'Andrei',   'andrei@exemplu',              crypt('parola', gen_salt('bf'))),
  (3,  'Mocanu',   'Diana',    'diana@exemplu',               crypt('parola', gen_salt('bf'))),
  (4,  'Mocanu',   'Elena',    'elena@exemplu',               crypt('parola', gen_salt('bf'))),
  (5,  'Dinu',     'Teodora',  'teodora@exemplu',             crypt('parola', gen_salt('bf'))),
  (6,  'Dragusin', 'Radu',     'radu@exemplu',                crypt('parola', gen_salt('bf'))),
  (7,  'Bogos',    'Janeta',   'janeta@local',                crypt('parola', gen_salt('bf'))),
  (8,  'Ionescu',  'Ana',      'ana.ionescu@exemplu',         crypt('parola', gen_salt('bf'))),
  (9,  'Marin',    'Vlad',     'vlad.marin@exemplu',          crypt('parola', gen_salt('bf'))),
  (10, 'Georgescu','Ioana',    'ioana.georgescu@exemplu',     crypt('parola', gen_salt('bf'))),
  (11, 'Dobre',    'Alex',     'alex.dobre@exemplu',          crypt('parola', gen_salt('bf'))),
  (12, 'Rusu',     'Bianca',   'bianca.rusu@exemplu',         crypt('parola', gen_salt('bf'))),
  (13, 'Popa',     'Sorin',    'sorin.popa@exemplu',          crypt('parola', gen_salt('bf'))),
  (14, 'Matei',    'Cristina', 'cristina.matei@exemplu',      crypt('parola', gen_salt('bf'))),
  (15, 'Ilie',     'Paul',     'paul.ilie@exemplu',           crypt('parola', gen_salt('bf'))),
  (16, 'Enache',   'Larisa',   'larisa.enache@exemplu',       crypt('parola', gen_salt('bf'))),
  (17, 'Neagu',    'Robert',   'robert.neagu@exemplu',        crypt('parola', gen_salt('bf')));

select setval(pg_get_serial_sequence('candidat', 'id'), (select max(id) from candidat));

-- Dosare (toate VALIDAT)
insert into dosar (candidat_id, status, medie) values
  (1,  'VALIDAT', 9.60),
  (2,  'VALIDAT', 9.05),
  (3,  'VALIDAT', 8.90),
  (4,  'VALIDAT', 8.40),
  (5,  'VALIDAT', 9.20),
  (6,  'VALIDAT', 8.70),
  (7,  'VALIDAT', 8.95),
  (8,  'VALIDAT', 9.12),
  (9,  'VALIDAT', 8.66),
  (10, 'VALIDAT', 9.45),
  (11, 'VALIDAT', 8.95),
  (12, 'VALIDAT', 8.40),
  (13, 'VALIDAT', 9.05),
  (14, 'VALIDAT', 8.78),
  (15, 'VALIDAT', 8.22),
  (16, 'VALIDAT', 9.00),
  (17, 'VALIDAT', 8.50);

select setval(pg_get_serial_sequence('dosar', 'id'), (select max(id) from dosar));

-- Optiuni (fara coloana status in optiune)
-- program_id: 1=Informatica, 2=Calculatoare, 3=Microbiologie
insert into optiune (dosar_id, program_id, prioritate)
select d.id, x.program_id, x.prioritate
from dosar d
join candidat c on c.id = d.candidat_id
join (
  values
    ('tudor@local',                 1, 1),
    ('tudor@local',                 2, 2),
    ('tudor@local',                 3, 3),

    ('andrei@exemplu',              1, 1),
    ('andrei@exemplu',              3, 2),

    ('diana@exemplu',               2, 1),
    ('diana@exemplu',               1, 2),

    ('elena@exemplu',               3, 1),
    ('elena@exemplu',               1, 2),

    ('teodora@exemplu',             1, 1),
    ('teodora@exemplu',             2, 2),

    ('radu@exemplu',                2, 1),
    ('radu@exemplu',                3, 2),

    ('janeta@local',                3, 1),
    ('janeta@local',                2, 2),

    ('ana.ionescu@exemplu',         1, 1),
    ('ana.ionescu@exemplu',         2, 2),

    ('vlad.marin@exemplu',          2, 1),
    ('vlad.marin@exemplu',          1, 2),

    ('ioana.georgescu@exemplu',     1, 1),
    ('ioana.georgescu@exemplu',     3, 2),

    ('alex.dobre@exemplu',          3, 1),
    ('alex.dobre@exemplu',          1, 2),

    ('bianca.rusu@exemplu',         3, 1),
    ('bianca.rusu@exemplu',         2, 2),

    ('sorin.popa@exemplu',          1, 1),
    ('sorin.popa@exemplu',          2, 2),
    ('sorin.popa@exemplu',          3, 3),

    ('cristina.matei@exemplu',      2, 1),
    ('cristina.matei@exemplu',      3, 2),

    ('paul.ilie@exemplu',           1, 1),
    ('paul.ilie@exemplu',           3, 2),

    ('larisa.enache@exemplu',       2, 1),
    ('larisa.enache@exemplu',       1, 2),

    ('robert.neagu@exemplu',        3, 1),
    ('robert.neagu@exemplu',        1, 2)
) as x(email, program_id, prioritate)
  on x.email = c.email;

select setval(pg_get_serial_sequence('optiune', 'id'), (select max(id) from optiune));
