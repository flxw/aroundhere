import re

addressExpression     = re.compile('^[A-Za-zßäöüÄÖÜ -]+ [0-9]+[A-Z]{0,1}')
addressTextExpression = re.compile('^[A-Za-zßäöüÄÖÜ -]+ ')
descriptionExpression = re.compile('[a-zA-ZäöüÄÖÜ]{3,}[„“()-., a-zA-ZäöüÄÖÜ1-9?/]*$')
monumentIdExpression  = re.compile('^[0-9]{8}$')
subMonumentExpression = re.compile('^([0-9]{8}) - ([A-Za-zßäöüÄÖÜ -]+ [0-9]+[A-Z]{0,1}), (.*)')

addressCount = 0
currentSuffix = 1
currentFile = open('denkmalliste_day' + str(currentSuffix) + '.txt', 'w')

denkmalliste = open('denkmalliste.txt')
listText = denkmalliste.read()

listText.replace('\r', '')
listText = listText.split('\n')

for i in range(0, len(listText)):
  currentLine = listText[i]

  if addressCount >= 2380:
    currentFile.close()
    currentSuffix += 1
    currentFile = open('denkmalliste_day' + str(currentSuffix) + '.txt', 'w')
    print('Request limit reached for one file at', addressCount)
    addressCount = 0

  if monumentIdExpression.match(currentLine):
    print(currentLine, file=currentFile)
    while (i < len(listText) and listText[i] != ''):
      i += 1
      currentLine = listText[i]
      print(currentLine, file=currentFile)

      if addressExpression.match(currentLine):
        addressCount += 1
      elif subMonumentExpression.match(currentLine):
        addressCount += 1

currentFile.close()