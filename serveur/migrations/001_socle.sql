-- v7.9.0 · Le socle partagé : comptes, réservations, tables, affectations, clients, réglages, journal.
-- Les heures sont des minutes depuis minuit, le jour où le service commence (un service qui passe minuit continue
-- au-delà de 1440). Les dates sont des dates de Moineville (Europe/Paris), jamais des instants.
create extension if not exists btree_gist;
create extension if not exists pgcrypto;

create type role_equipe as enum ('direction', 'accueil', 'edition');
create type origine_resa as enum ('site', 'telephone', 'equipe');
-- demande : reçue, pas encore confirmée, ne retient aucune capacité.
-- confirmee, arrivee : retiennent une capacité (une table affectée). absente, annulee, refusee : la libèrent.
create type statut_resa as enum ('demande', 'confirmee', 'arrivee', 'absente', 'annulee', 'refusee');
create type genre_affectation as enum ('technique', 'placement');

create table comptes (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  nom text not null,
  role role_equipe not null,
  mot_de_passe text not null,                  -- scrypt : « scrypt$N$r$p$sel$hache », jamais le mot de passe
  actif boolean not null default true,
  cree_le timestamptz not null default now()
);

create table sessions (
  jeton_hache text primary key,                -- sha256 du jeton ; le jeton lui-même n'est que dans le cookie
  compte_id uuid not null references comptes(id) on delete cascade,
  cree_le timestamptz not null default now(),
  expire_le timestamptz not null,
  vue_le timestamptz not null default now()
);
create index sessions_compte on sessions(compte_id);

create table tentatives_connexion (
  id bigserial primary key,
  email text not null,
  origine text not null,                       -- sha256 de l'adresse, pas l'adresse
  reussie boolean not null,
  quand timestamptz not null default now()
);
create index tentatives_recentes on tentatives_connexion(email, quand);

-- Les réglages : « reservation » (services, semaine, horizon, délai, couverts, durées, marges : à valider par le
-- restaurant), « equipe » (ce que le restaurant change : semaine, fermetures, services fermés ou complets,
-- ouvertures exceptionnelles). Le moteur commun (assets/js/disponibilites.js) lit les deux, côté serveur aussi.
create table reglages (
  cle text primary key,
  valeur jsonb not null,
  version integer not null default 1,
  modifie_le timestamptz not null default now(),
  modifie_par uuid references comptes(id)
);

create table tables_salle (
  id text primary key,
  zone text not null,
  places integer not null check (places > 0),
  forme text not null default 'carree',
  plan jsonb not null default '{}',            -- position sur le plan (x, y, l, h, note)
  saison int4range,                            -- mois ouverts [6,10) pour la terrasse ; null : toute l'année
  active boolean not null default true
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  nom text not null default '',
  prenom text not null default '',
  telephone text,                              -- normalisé : +33612345678 ; null si inconnu
  telephone_saisi text not null default '',
  email text,
  habitue boolean not null default false,
  allergies text[] not null default '{}',
  note text not null default '',
  version integer not null default 1,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
-- Deux fiches ne partagent pas le même téléphone ; deux homonymes sans téléphone restent deux fiches.
create unique index clients_telephone on clients(telephone) where telephone is not null;

create table reservations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,              -- la référence donnée au client : R-AAMMJJ-XXXX
  origine origine_resa not null,
  statut statut_resa not null,
  jour date not null,
  service text not null,
  heure_min integer not null check (heure_min between 0 and 1439),
  duree_min integer not null check (duree_min between 15 and 600),
  couverts integer not null check (couverts between 1 and 500),
  client_id uuid references clients(id),
  nom text not null default '',
  prenom text not null default '',
  telephone text not null default '',
  email text not null default '',
  espace_souhaite text not null default '',    -- un souhait du client, pas une garantie
  table_souhaitee text not null default '',    -- idem : la table demandée sur le plan du site
  note_client text not null default '',
  note_equipe text not null default '',
  derogation text not null default '',         -- pourquoi une règle a été levée par la direction ('' : aucune)
  version integer not null default 1,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now(),
  cree_par uuid references comptes(id)
);
create index reservations_jour on reservations(jour, service);
create index reservations_modif on reservations(modifie_le);

-- L'affectation effective d'une table : ce qui garantit la capacité. « technique » : posée par le serveur à la
-- confirmation pour qu'aucune table ne soit promise deux fois ; « placement » : choisie par l'équipe.
-- La contrainte d'exclusion est la garantie dure : deux affectations ne se chevauchent jamais sur une table un même jour.
create table affectations (
  reservation_id uuid primary key references reservations(id) on delete cascade,
  table_id text not null references tables_salle(id),
  jour date not null,
  plage int4range not null,
  genre genre_affectation not null,
  exclude using gist (table_id with =, jour with =, plage with &&)
);
create index affectations_jour on affectations(jour);

-- Une même demande répétée (double clic, reprise réseau) ne crée qu'une réservation.
create table idempotence (
  cle text primary key,
  empreinte text not null,                     -- sha256 du contenu : la même clé avec un autre contenu est refusée
  reservation_id uuid references reservations(id) on delete cascade,
  cree_le timestamptz not null default now()
);

create table journal (
  id bigserial primary key,
  quand timestamptz not null default now(),
  compte_id uuid references comptes(id),
  role text not null default 'public',
  action text not null,
  cible text not null default '',
  cible_id text not null default '',
  detail jsonb not null default '{}'
);
create index journal_cible on journal(cible, cible_id);
create index journal_quand on journal(quand);

-- Les changements à suivre par les autres sessions : un numéro qui ne fait que monter.
create sequence changements;
create table suivi (
  numero bigint primary key default nextval('changements'),
  quoi text not null,                          -- 'reservation', 'reglages', 'client'
  id text not null,
  quand timestamptz not null default now()
);
