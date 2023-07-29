let nextAction = undefined
let userName = null
let country = null
let grandKeyWord = null
receiveMessage('Hallo, apa kabar?')
function sendMessage(){
    let message = document.querySelector('#message-box').value;
    let messageWrapper = document.createElement('div')
    messageWrapper.classList.add('parent')
    let messageSelf = document.createElement('span')
    messageSelf.classList.add('user')
    messageSelf.innerHTML = message
    messageWrapper.appendChild(messageSelf)
    document.querySelector('#chat-space').appendChild(messageWrapper)
    document.querySelector('#message-box').value = ''
    document.querySelector('#chat-space').scrollTo(0, document.querySelector('#chat-space').scrollHeight);
    convEngine(message)
    document.querySelector('#chat-space').scrollTo(0, document.querySelector('#chat-space').scrollHeight);
}

function receiveMessage(message){
    let messageWrapper = document.createElement('div')
    let messageSelf = document.createElement('span')
    messageSelf.classList.add('system')
    messageSelf.innerHTML = message
    messageWrapper.appendChild(messageSelf)
    document.querySelector('#chat-space').appendChild(messageWrapper)
}

let keywordObj = {
    'greeting': [/\bhallo,? apa kabar\b/i, /\bhallo\b/i, /\bapa kabar\b/i, /\bdan anda\b/i],
    'name': [/\bSiapa nama anda\b/i, /\bdan anda\b/i, /\bsiapa namanya\b/i],
    'greetres': [/\bbaik\b/i, /\bbaik,? terima kasih\b/i],
    'country':[/\banda dari mana\b/i, /\bdan anda dari mana\b/i, /\bdan anda\b/i],
    'residence':[/\bapa anda tinggal di dekat kampus\b/i, /\banda tinggal di dekat kampus\b/i],
    'hobbies':[/\bapa hobi anda\b/i, /\bhobi anda apa\b/i,/\bhobinya apa\b/i],
    'closing':[/\bsampai juma\b/i,/\bsampai nanti\b/i]

}

let responsesObj = {
    'greeting':{
        responses:
        ['Baik', 'Baik, terima kasih'],
        followups: [
            'Siapa nama anda?',
            'Siapa Namanya?'
        ],
        action: detectName
    },
    'name': {
        responses: [
        'Nama saya Ida.',
        'Ida',
        'Kenalkan, nama saya Ida',
        'Saya Ida.'
        ],
        followups: [
            'Anda berasal dari mana?',
            `${userName} berasal dari mana?`
        ],
        action: detecCountry
    },
    'greetres': {
        responses: [
            'Siapa nama anda?',
            'Siapa Namanya?'
        ],
        followups: undefined,
        action: detectName
    },
    'country':{
        responses:['Saya dari Indonesia.', 'Indonesia.', 'Dari Indonesia']
    },
    'residence':{
        responses:['Ya.','Ya, saya tinggal di dekat kampus']
    },
    'hobbies':{
        responses:['Hobi saya membaca.','Hobi saya jalan-jalan']
    },
    'closing':{
        responses:['Sampai nanti.','Sampai jumpa']

    }
}

function testKeyword(keyword){
    if (userName != null){
        delete keywordObj['greeting']
    }
    if (country != null){
        delete keywordObj['name']
    }
    for (let key of Object.keys(keywordObj)){
        for (let myVal of keywordObj[key]){
            if (myVal.test(keyword)){
                return key;
            }
        }
    }
    return undefined;
}

function convEngine(message){
    if (nextAction != undefined){
        nextAction(message)
        return
    }
    let keyword = testKeyword(message)
    if (keyword){
        let res = pick(responsesObj[keyword].responses)
        receiveMessage(res)
        if (responsesObj[keyword].followups != undefined){
            receiveMessage(pick(responsesObj[keyword].followups))
        }
        if (responsesObj[keyword].action != undefined){
            nextAction = responsesObj[keyword].action
        }
    }
    else{
        receiveMessage("I don't know what to say.")
    }
}

function pick(myarr){
    let rand = Math.floor(Math.random() * myarr.length);
    return myarr[rand]
}

function send(e){
    if (e.keyCode == 13){
        e.preventDefault()
        sendMessage()
    }
}

function detectName(phrase){
    nextAction = undefined
    let reg = /(kenalkan,? nama\s| saya\s | nama saya\s)?(\w+)/i
    userName = phrase.match(reg)[2]
    console.log(userName)
    receiveMessage('Senang bertemu dengan Anda, ' + userName + '! Anda berasal dari mana?')
}
function detecCountry(phrase){
    nextAction = undefined
    let reg = /(saya berasal dari\s| saya dari\s)?(\w+)/i
    country = phrase.match(reg)[2]
}