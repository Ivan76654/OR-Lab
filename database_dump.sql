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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: league; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.league (
    league_id integer NOT NULL,
    league_rank smallint NOT NULL,
    league_name character varying(50) DEFAULT 'test'::character varying NOT NULL
);


ALTER TABLE public.league OWNER TO postgres;

--
-- Name: leagues_leagueid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.league ALTER COLUMN league_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.leagues_leagueid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: player; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player (
    player_id integer NOT NULL,
    player_first_name character varying(50) NOT NULL,
    player_last_name character varying(50) NOT NULL,
    date_of_birth date NOT NULL,
    elo_rank integer NOT NULL,
    team_id integer
);


ALTER TABLE public.player OWNER TO postgres;

--
-- Name: players_playerid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.player ALTER COLUMN player_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.players_playerid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team (
    team_id integer NOT NULL,
    team_name character varying(255) NOT NULL,
    founded date NOT NULL,
    league_id integer
);


ALTER TABLE public.team OWNER TO postgres;

--
-- Name: teams_teamid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.team ALTER COLUMN team_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.teams_teamid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: league; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.league (league_id, league_rank, league_name) FROM stdin;
1	1	1. Liga
\.


--
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player (player_id, player_first_name, player_last_name, date_of_birth, elo_rank, team_id) FROM stdin;
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
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team (team_id, team_name, founded, league_id) FROM stdin;
1	Knežija	2022-08-21	1
2	Jarun	2021-03-13	1
3	Purgeri	2023-01-07	1
4	Peščenica	2022-10-05	1
5	Maksimir	2020-07-02	1
6	Doktori	2023-09-17	1
\.


--
-- Name: leagues_leagueid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leagues_leagueid_seq', 2, true);


--
-- Name: players_playerid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_playerid_seq', 1, false);


--
-- Name: teams_teamid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_teamid_seq', 1, false);


--
-- Name: league pkleagueid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.league
    ADD CONSTRAINT pkleagueid PRIMARY KEY (league_id);


--
-- Name: player pkplayerid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT pkplayerid PRIMARY KEY (player_id);


--
-- Name: team pkteamid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT pkteamid PRIMARY KEY (team_id);


--
-- Name: league uniqueleaguerank; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.league
    ADD CONSTRAINT uniqueleaguerank UNIQUE (league_rank);


--
-- Name: team uniqueteamname; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT uniqueteamname UNIQUE (team_name);


--
-- Name: team fkteamleaugeid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT fkteamleaugeid FOREIGN KEY (league_id) REFERENCES public.league(league_id);


--
-- Name: player fkteamplayerid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT fkteamplayerid FOREIGN KEY (team_id) REFERENCES public.team(team_id);


--
-- PostgreSQL database dump complete
--

