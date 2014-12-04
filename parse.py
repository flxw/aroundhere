import re
import urllib.request
import urllib.parse
import time
import json
import pymongo

def getMonumentStub():
  return  {
    '_id' : '-1',
    'addresses': [],
    'description' : '',
    'submonuments': []
  }

def createSubMonument(id, address, rest):
  submonument = getMonumentStub()
  submonument['_id'] = id
  submonument['descriptionExpression'] = rest
  codedAddresses = []

  time.sleep(0.4)

  requString = geolocationUrl + urllib.parse.quote(address.replace(' ', '+') + ',+Berlin')
  getReq     = urllib.request.urlopen(requString)
  resp       = json.loads(getReq.read().decode('utf-8'))

  if response["status"] != "OK":
    print("Geocoding failed for: ", address)
    print("The Geocoding API returned the following status: ", resp["status"])
  else:
    submonument['addresses'].append(response['results'][0]['formatted_address'])
    db_addresses.save({
      'geolocation' : {
        'type': 'Point',
        'coordinates': [float(response['results'][0]['geometry']['location']['lat']), float(response['results'][0]['geometry']['location']['lng'])]
      },
      '_id': response['results'][0]['formatted_address'],
      'belongsToMonument' : submonument['_id']
    })

  return submonument['_id']

addressExpression     = re.compile('^[A-Za-zßäöüÄÖÜ -]+ [0-9]+[A-Z]{0,1}')
addressTextExpression = re.compile('^[A-Za-zßäöüÄÖÜ -]+ ')
descriptionExpression = re.compile('[a-zA-ZäöüÄÖÜ]{3,}[„“()-., a-zA-ZäöüÄÖÜ1-9?/]*$')
monumentIdExpression  = re.compile('^[0-9]{8}$')
subMonumentExpression = re.compile('^([0-9]{8}) - ([A-Za-zßäöüÄÖÜ -]+ [0-9]+[A-Z]{0,1}), (.*)')

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
    monument = getMonumentStub()
    monument['_id'] = currentLine

    while (i < len(listText) and listText[i] != ''):
      i += 1
      currentLine = listText[i]

      if addressExpression.match(currentLine):
        address = addressExpression.match(currentLine).group(0)

        if len(monument['addresses']) == 1:
          if descriptionExpression.findall(currentLine):
            monument['description'] = descriptionExpression.findall(currentLine)[0]
          else:
            failedDescriptionExtractions+=1

        time.sleep(0.4)

        requestString = geolocationUrl + urllib.parse.quote(address.replace(' ', '+') + ',+Berlin')
        getRequest    = urllib.request.urlopen(requestString)
        response      = json.loads(getRequest.read().decode('utf-8'))

        if response["status"] != "OK":
          print("Geocoding failed for: ", address)
          print("The Geocoding API returned the following status: ", response["status"])
          continue
        else:
          monument['addresses'].append(response['results'][0]['formatted_address'])
          db_addresses.save({
            '_id': response['results'][0]['formatted_address'],
            'geolocation' : {
              'type': 'Point',
              'coordinates': [float(response['results'][0]['geometry']['location']['lat']), float(response['results'][0]['geometry']['location']['lng'])]
            },
            'belongsToMonument' : monument['_id']
          })
      elif subMonumentExpression.match(currentLine):
        subMonumentMatch = subMonumentExpression.match(currentLine).groups()
        monument['submonuments'].append(createSubMonument(subMonumentMatch[0], subMonumentMatch[1], subMonumentMatch[2]))

    monument_id = db_monuments.save(monument)

    print('Creating monument' , createdMonuments, end='\r')

print('Failed to extract', failedDescriptionExtractions, 'descriptions')

denkmalliste.close