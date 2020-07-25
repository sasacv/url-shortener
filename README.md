# URL-Shortener

## Voraussetzungen
Um den URL-Shortener starten zu können, wird Docker benötigt.  
  
Stellen Sie sicher, dass kein lokaler Webserver auf Port 80 läuft.  

## Service starten
Laden Sie das Repository herunter.  
  
Öffnen Sie ein Terminal und navigieren Sie in das heruntergeladene Repository in den Ordner src.   
  
Geben Sie folgenden Befehl ein, um den Service zu starten  
 ``` 
 docker-compose up -d
 ``` 
**Beachten Sie, dass der erste Start etwas Zeit in Anspruch nehmen kann.**  
  
Um den Service wieder zu beenden, geben Sie folgenden Befehl ein
```
docker-compose stop
```
Möchten Sie den Service vollständig entfernen, geben Sie folgenden Befehl ein
```
docker-compose down --rmi local -v 
```
**Beachten Sie: Durch diesen Befehl werden ebenfalls sämtliche gespeicherte Kurzlinks gelöscht**

## Service nutzen
Um den URL-Shortener nutzen zu können, starten Sie zunächst, wie oben beschrieben, den Service.  
  
Öffnen Sie danach einen Browser und geben Sie folgende URL ein: [http://localhost](http://localhost).  
  
Sollte die Seite nicht erreichbar sein, warten Sie und versuchen Sie es nach ein paar Minuten erneut.  
  
Ist die Seite erreichbar, können Sie den URL-Shortener nutzen. Folgen Sie hierzu den Anweisungen auf der Seite.  
