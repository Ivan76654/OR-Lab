--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: orLab; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "orLab" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Croatian_Croatia.1250';


ALTER DATABASE "orLab" OWNER TO postgres;

\connect "orLab"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: leagues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leagues (
    leagueid integer NOT NULL,
    leaguerank smallint NOT NULL,
    numberofteams smallint NOT NULL
);


ALTER TABLE public.leagues OWNER TO postgres;

--
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    playerid integer NOT NULL,
    playerfirstname character varying(50) NOT NULL,
    playerlastname character varying(50) NOT NULL,
    dateofbirth date NOT NULL,
    elorank integer NOT NULL,
    teamid integer
);


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    teamid integer NOT NULL,
    teamname character varying(255) NOT NULL,
    founded date NOT NULL,
    leagueid integer
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Data for Name: leagues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leagues (leagueid, leaguerank, numberofteams) FROM stdin;
1	1	6
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (playerid, playerfirstname, playerlastname, dateofbirth, elorank, teamid) FROM stdin;
1	Matija	Perić	2000-04-03	1201	1
2	Valentina	Pavletić	1997-05-09	1145	1
3	Benjamin	Novaković	1977-08-27	1554	1
4	Marina	Petrović	1978-08-22	1387	2
5	Danijel	Kovačević	1983-03-29	1296	2
6	Tin	Radić	1985-01-21	1380	2
7	Vice	Dragović	1985-08-22	1210	3
8	Lena	Franić	1986-01-22	1497	3
9	Ivana	Perković	2003-07-26	1475	3
10	Dorotea	Vuković	1994-06-02	1287	4
11	Gabriel	Nikolić	1987-10-01	1089	4
12	Viktor	Srna	1997-04-03	1262	4
13	Stipe	Dragić	1994-04-01	1192	5
14	Mia	Neretljak	2001-12-24	1526	5
15	Nora	Vincetić	1987-12-30	1130	5
16	David	Radić	2001-09-03	1003	6
17	Vid	Adamić	1986-07-25	1540	6
18	Marko	Kovačić	1995-04-01	1378	6
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (teamid, teamname, founded, leagueid) FROM stdin;
1	Knežija	2022-08-21	1
2	Jarun	2021-03-13	1
3	Purgeri	2023-01-07	1
4	Peščenica	2022-10-05	1
5	Maksimir	2020-07-02	1
6	Doktori	2023-09-17	1
\.


--
-- Name: leagues pkleagueid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leagues
    ADD CONSTRAINT pkleagueid PRIMARY KEY (leagueid);


--
-- Name: players pkplayerid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT pkplayerid PRIMARY KEY (playerid);


--
-- Name: teams pkteamid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT pkteamid PRIMARY KEY (teamid);


--
-- Name: leagues uniqueleaguerank; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leagues
    ADD CONSTRAINT uniqueleaguerank UNIQUE (leaguerank);


--
-- Name: teams uniqueteamname; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT uniqueteamname UNIQUE (teamname);


--
-- Name: teams fkteamleaugeid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT fkteamleaugeid FOREIGN KEY (leagueid) REFERENCES public.leagues(leagueid);


--
-- Name: players fkteamplayerid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT fkteamplayerid FOREIGN KEY (teamid) REFERENCES public.teams(teamid);


--
-- PostgreSQL database dump complete
--

