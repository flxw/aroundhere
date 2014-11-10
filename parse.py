import re
import urllib.request
import time
import json

addressExpression = re.compile('^[A-Za-zßäöüÄÖÜ -]+ [0-9]+[A-Z]{0,1}')
addressTextExpression = re.compile('^[A-Za-zßäöüÄÖÜ -]+ ')
descriptionExpression = re.compile('[a-zA-ZäöüÄÖÜ]{3,}[„“()-., a-zA-ZäöüÄÖÜ1-9]*$')
monumentIdExpression  = re.compile('^[0-9]{8}$')

createdMonuments = 0
failedDescriptionExtractions = 0
geolocationUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAYfnpR4oWhEB6dnCb2Qr2puVPjsLt8j2I&address='

denkmalliste = open('denkmalliste.txt')
listText = denkmalliste.read()

listText.replace('\r', '')
listText = listText.split('\n')

for i in range(0, len(listText)):
  currentLine = listText[i]

  if monumentIdExpression.match(currentLine):
    print('matched id', currentLine)
    createdMonuments += 1
    monument = {
      'numericIdentifier' : int(currentLine),
      'addresses': [],
      'description' : ''
    }

    while (i < len(listText) and listText[i] != ''):
      i += 1
      currentLine = listText[i]

      if addressExpression.match(currentLine):
        monument['addresses'].append(addressExpression.match(currentLine).group(0))

        if len(monument['addresses']) == 1:
          if descriptionExpression.findall(currentLine):
            monument['description'] = descriptionExpression.findall(currentLine)[0]
          else:
            print('FAILED TO EXTRACT DESCRIPTION FROM: ' +  currentLine)
            failedDescriptionExtractions+=1

   #     time.sleep(0.5)

  #      getRequest = urllib.request.urlopen(geolocationUrl + address.replace(' ', '+') + ',+Berlin')
 #       response   = json.loads(getRequest.read().decode('utf-8'))
#
 #       if response["status"] != "OK":
#          print("Geocoding failed for: ", address)
#          print("The Geocoding API returned the following status: ", response["status"])
#          continue


    print(monument)

    if createdMonuments > 2:
      break

denkmalliste.close