# aeb-task-next

Mit POST JSON Datei erhalten, bestimmte mandatoryFields untersuchen. Falls der Wert im Feld nicht stimmt, alle sammeln und error mit fehlenden Feldern zurück geben.

### Vorgehen
- JSON per Postman schicken, ist im req.body enthalten
- body-parser musste zum Parsen noch installiert werden
- Zugriff auf Felder in der JSON, die überprüft werden müssen zunächst hardgecodet (input["boxPackingRequest"]["messageHeader"] - nur hier nötig, deswegen nicht dynamisch)
- Manche Einträge der mandatoryFields Liste haben Punkttrennung -> weiter in die JSON reingehen (key mit "." splitten, über alle Einträge iterieren bis am Ende der Wert kein Objekt mehr ist)
- Falls gesplittet wurde, Keys speichern und am Ende zusammen führen
- Ganze mandatoryFields Liste wird durchgegangen, ist der Wert am Ende KEIN String oder NULL, wird letzter Key der missingFields Liste hinzugefügt
- MissingFields wird am Ende zurück gegeben, bei Länge 0 ist alles gut, sobald etwas drin ist wird ein Error geworfen mit der Liste an fehlenden Einträgen
