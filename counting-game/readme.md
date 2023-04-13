# Counting Game - For StreamElements
Version: 1.2 - 13.04.2023 18:58

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
| ![chrome_xn4lFvM0zQ](https://user-images.githubusercontent.com/31692271/231838719-1a8b7df6-108d-4c77-8264-beaa631bac99.png) | ![chrome_ypjFSErDfJ](https://user-images.githubusercontent.com/31692271/231838800-16ab8d3f-2cf7-479c-b5ac-e59db213d3af.png) |

> Reset Highscore

Setzt wenn man es anklickt den Highscore auf 0 zurück.
