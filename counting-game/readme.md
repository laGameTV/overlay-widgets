# Counting Game - For StreamElements

Version: 1.4 - 05.12.2025

- [Vorschau](#vorschau)
- [Impotieren des Widget](#impotieren-des-widget)
  - [Neues Overlay erstellen](#neues-overlay-erstellen)
  - [Neues Custom Widget erstellen](#neues-custom-widget-erstellen)
- [Fields](#fields)
- [Commands](#commands)
- [To-Do](#to-do)

## Vorschau

![Screenshot 2023-04-13 20-20-10](https://user-images.githubusercontent.com/31692271/231851970-2ddf8c65-93cc-4390-8f5a-af9f7456cb2a.png)
_Aktuellen Highscore schlagen_

---

## Impotieren des Widget

### Neues Overlay erstellen

1. Öffne <https://streamelements.com/dashboard/overlays>.
2. Erstelle ein neues Overlay.
3. Wähle 1080p aus.

### Neues Custom Widget erstellen

4. Erstelle ein neues **Custom Widget**.
5. Ändere die Größe auf `1920x1080px`.
6. Öffne den Overlay Editor.
7. Kopiere die einzelnen Inhalte aus `/code` in die jeweiligen Kategorien.

```
.html        -> HTML
.css         -> CSS
.js          -> JS
fields.json  -> FIELDS
data.json    -> DATA
```

---

## Fields

> Background color

`Standart: #0b0b0b80`

Die Farbe des Hintergrunds.

> Rules position

`Standart: Left`

Es gibt folgende Auswahloptionen: Left, Right, Hidden.

Die Optionen "Left" und "Right" geben die Position an. Mit "Hidden" kannst du die Regeln komplett verstecken.

![chrome_3qi64fCEYg](https://user-images.githubusercontent.com/31692271/231838666-cdd01058-45f5-4546-9409-6ae74b93347f.png)

> Banned users (comma seperated)

`Standart: Streamelements`

Alle Nutzer die in dieser Liste stehen werden vom Widget ignoriert. Die Namen sind mit einem Komma (,) getrennt.

> Reveal chatter who broke the steak

`Standart: Aktiviert`

Wenn aktiviert wird wenn eine Person die falsche oder eine doppelte Zahl sendet wird der Name dieser Person angezeigt.

![reveal-chatter](https://user-images.githubusercontent.com/31692271/231840058-16067789-fa23-4c79-a43e-7b4b9cf29f92.png)

> Reset Highscore

Setzt wenn man es anklickt den Highscore auf 0 zurück.

## Commands

Die folgenden Befehle können nur von Moderatoren und dem Broadcaster genutzt werden:

- `!counter reset`  
  Setzt den Zähler und alle Highscores zurück.
- `!counter set <zahl>`  
  Setzt den aktuellen Zähler auf die angegebene Zahl. (Dies beeinflusst NICHT direkt den Highscore, sondern erst, wenn die darauf folgende Zahl gesendet wird)
- `!counter alltime <zahl>`  
  Setzt den All-Time Highscore manuell.
- `!counter today <zahl>`  
  Setzt den Tages-Highscore manuell.

## To-Do

- [x] Fields Option für Background Color
