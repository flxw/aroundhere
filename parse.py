import re
import urllib.request
import urllib.parse
import time
import json
import pymongo

addressExpression = re.compile('^[A-Za-zßäöüÄÖÜ -]+ [0-9]+[A-Z]{0,1}')
addressTextExpression = re.compile('^[A-Za-zßäöüÄÖÜ -]+ ')
descriptionExpression = re.compile('[a-zA-ZäöüÄÖÜ]{3,}[„“()-., a-zA-ZäöüÄÖÜ1-9?/]*$')
monumentIdExpression  = re.compile('^[0-9]{8}$')

createdMonuments = 0
failedDescriptionExtractions = 0
geolocationUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAYfnpR4oWhEB6dnCb2Qr2puVPjsLt8j2I&address='

denkmalliste = open('denkmalliste.txt')
listText = denkmalliste.read()

listText.replace('\r', '')
listText = listText.split('\n')

dbclient = pymongo.MongoClient('localhost', 27017)
db = dbclient.test
db_monuments = db.monuments
db_addresses = db['addresses']

for i in range(0, len(listText)):
  currentLine = listText[i]

  if monumentIdExpression.match(currentLine):
    createdMonuments += 1
    geocodedAddresses = []
    monument = {
      'numericIdentifier' : int(currentLine),
      'addresses': [],
      'description' : ''
    }


    while (i < len(listText) and listText[i] != ''):
      i += 1
      currentLine = listText[i]

      if addressExpression.match(currentLine):
        address = addressExpression.match(currentLine).group(0)
        monument['addresses'].append(address)

        if len(monument['addresses']) == 1:
          if descriptionExpression.findall(currentLine):
            monument['description'] = descriptionExpression.findall(currentLine)[0]
          else:
            print('FAILED TO EXTRACT DESCRIPTION FROM: ' +  currentLine)
            failedDescriptionExtractions+=1

        time.sleep(0.5)

        requestString = geolocationUrl + urllib.parse.quote(address.replace(' ', '+') + ',+Berlin')
        getRequest    = urllib.request.urlopen(requestString)
        response      = json.loads(getRequest.read().decode('utf-8'))

        if response["status"] != "OK":
          print("Geocoding failed for: ", address)
          print("The Geocoding API returned the following status: ", response["status"])
          continue
        else:
          geocodedAddresses.append({
            'geolocation' : {
              'type': 'Point',
              'coordinates': [float(response['results'][0]['geometry']['location']['lat']), float(response['results'][0]['geometry']['location']['lng'])]
            },
            'formatted': response['results'][0]['formatted_address']
          })

    monument_id = db_monuments.insert(monument)
    print('Inserted monument with id ', monument_id)

    for geocodedAddress in geocodedAddresses:
      db_addresses.insert({
        'geolocation' : geocodedAddress['geolocation'],
        'formatted' : geocodedAddress['formatted'],
        'belongsToMonument' : monument_id
      })
      print('Inserted geocode for monument ', monument_id, ' with address ', geocodedAddress['formatted'])

denkmalliste.close