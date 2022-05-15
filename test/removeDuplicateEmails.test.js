const removeDuplicatedEmails = require('../src/removeDuplicates') 
const { faker } = require('@faker-js/faker')
const { performance } = require('perf_hooks')

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateEmailListWithDuplicates(numberOfEntries) {
    let email = []
    for(i = 0; i <=numberOfEntries/2; i++ ) {
          email[i] = faker.internet.email()
  }
  email = email.concat(email)
  shuffleArray(email)
  return email
  }   

function isOrderPreserved(originalList, modifiedList){
    let validElements = new Set()
    let j = 0
    let i = 0
    while (i < originalList.length ) {
        if (validElements.has(originalList[i])) {
            i++
        } else if (j == modifiedList.length) { // reached end of modified list, no match found
            return false
        } else if (originalList[i] == modifiedList[j]) {
            validElements.add(originalList[i])
            i++
            j++           
        } else {
            return false
        }
    }
    return true
}

test('list remains in the original order',
() => {
// arrange    
let emailsWithDuplicates = generateEmailListWithDuplicates(10)

// act
let uniqueEmails = removeDuplicatedEmails(emailsWithDuplicates)

// assert
expect(isOrderPreserved(emailsWithDuplicates, uniqueEmails)).toBe(true, 'list must preserve the original order')
})

test('function can handle 100,000 email addresses containing 50% randomly placed duplicates in under 1 second ',
() => {
   
// arrange   
let emailsWithDuplicates = generateEmailListWithDuplicates(100000)

// act
let startTime = performance.now()
removeDuplicatedEmails(emailsWithDuplicates)
let endTime = performance.now()
let executionTime = endTime - startTime

// assert
expect(executionTime).toBeLessThan(1000, `function took ${executionTime} ms, which is more than 1 second`)
})