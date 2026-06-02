# Weather App – Zadanie 1

**Autor:** Mateusz Olszewski  
**Repozytorium GitHub:** [github.com/mthw1337/weather-app](https://github.com/mthw1337/weather-app)  
**DockerHub:** [hub.docker.com/r/mathew1337/weather-app](https://hub.docker.com/r/mathew1337/weather-app)

---

## Opis aplikacji

Aplikacja webowa napisana w **Node.js**, która umożliwia sprawdzenie aktualnej pogody dla wybranego kraju i miasta. Dane pogodowe pobierane są z darmowego API [Open-Meteo](https://open-meteo.com/) (nie wymaga klucza API).

Po uruchomieniu kontenera aplikacja loguje:
- datę i godzinę uruchomienia,
- imię i nazwisko autora,
- port TCP, na którym nasłuchuje (`3000`).

---

## 1. Kod aplikacji

Aplikacja znajduje się w pliku `server.js`. Przy starcie wypisuje wymagane informacje do logów, a następnie serwuje interfejs webowy na porcie `3000`. Użytkownik wybiera kraj i miasto z predefiniowanej listy, po czym aplikacja wyświetla aktualne dane pogodowe (temperatura, wilgotność, prędkość wiatru).

Szczegóły implementacji zawiera plik `server.js` oraz katalog z plikami frontendowymi.

---

## 2. Dockerfile

Plik `Dockerfile` wykorzystuje **wieloetapowe budowanie obrazu** (multi-stage build):

- **Etap 1 (`builder`)** – instalacja wszystkich zależności (`npm ci`) i ewentualna kompilacja.
- **Etap 2 (finalny)** – kopiowanie wyłącznie plików produkcyjnych (`node_modules`, kod źródłowy) do czystego obrazu bazowego `node:20-alpine`.

Zastosowane optymalizacje:
- obraz bazowy `node:22-alpine` – minimalna wielkość,
- kolejność warstw zoptymalizowana pod cache (najpierw `package.json`, potem kod),
- uruchomienie jako użytkownik `node` (nie root) – bezpieczeństwo,
- dyrektywa `HEALTHCHECK` weryfikująca działanie aplikacji,
- metadane OCI (`org.opencontainers.image.authors`) zgodne ze standardem.

```dockerfile
# syntax=docker/dockerfile:1

FROM node:20-alpine3.19

LABEL org.opencontainers.image.authors="Mateusz Olszewski"

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev \
    && npm cache clean --force

COPY app.js .
COPY views ./views
COPY public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "app.js"]
```

---

## 3. Polecenia

### a) Budowanie obrazu

```bash
docker build -t weather-app:latest .
```

### b) Uruchomienie kontenera

```bash
docker run -d -p 3000:3000 --name weather-app weather-app:latest
```

Aplikacja dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

### c) Odczyt logów (data uruchomienia, autor, port)

```bash
docker logs weather-app
```


### d) Liczba warstw i rozmiar obrazu

```bash
# Rozmiar obrazu
docker images weather-app

# Liczba warstw
docker history weather-app:latest
```

Alternatywnie, szczegółowe informacje o warstwach:

```bash
docker inspect weather-app:latest | jq '.[0].RootFS.Layers | length'
```

---

## Zrzut ekranu

<img width="693" height="564" alt="image" src="https://github.com/user-attachments/assets/55385e5c-f6e4-4b0a-8685-fc7187d44329" />


---

## Użyte technologie

| Technologia | Wersja | Rola |
|---|---|---|
| Node.js | 20 (Alpine) | Środowisko uruchomieniowe |
| Open-Meteo API | – | Dane pogodowe (bez klucza) |
| Docker | – | Konteneryzacja |
