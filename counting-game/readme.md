# Counting Game - For StreamElements
Version: 1.2 - 13.04.2023 18:58

## Vorschau

![Screenshot 2023-04-13 20-20-10](https://user-images.githubusercontent.com/31692271/231851970-2ddf8c65-93cc-4390-8f5a-af9f7456cb2a.png)

*Aktuellen Highscore schlagen*

## Impotieren des Widget

**Neues Overlay erstellen**

1. Öffne <https://streamelements.com/dashboard/overlays>.
2. Erstelle ein neues Overlay.
3. Wähle 1080p aus.

**Neues Custom Widget erstellen**

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
***

## Fields
> Rules position

`Standart: Left`

Es gibt folgende  Auswahloptionen: Left, Right, Hidden.

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
