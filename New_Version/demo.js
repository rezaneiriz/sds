let nextAction = undefined
let userName = null
let country = null
let grandKeyWord = null
let convStep = 0
let asked = false
let mistakes = 0
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
    converse(message)
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
const conFlow = {
    greeting: ['Hallo, apa kabar?'],
    name: ['Siapa nama Anda?', 'Siapa Namanya?'],
    country: ['Anda berasal dari mana?', 'Mbak {name} berasal dari mana?'],
    residence: ['Apa Anda tinggal di dekat kampus?', 'Apa Mbak Sinta tinggal di dekat kampus?', 'Apa Anda tinggal di dekat kampus, {name}?', 'Apa Mbak Sinta tinggal di dekat kampus, {name}?'],
    hobby: ['Apa hobi Anda berolahraga, {name}?', 'Apa hobi Anda berolahraga?'],
    farewell: ['Oh, begitu. Terima kasih. Sampai jumpa.', 'Oh, begitu. Terima kasih. Sampai jumpa, {name}.']

}
let keywordObj = {
    greeting: /(baik|baik, terima kasih)/i,
    name: /(kenalkan, nama saya|saya|Nama saya|\w+)/i,
    country: /(saya berasal dari|\w+|saya dari)/i,
    residence: /(tinggal di)/i,//I suggest adding more setnence such as, "No, I don't lieve there," or "No, I live at X"
    hobby: /(ya|tidak)/i,
    farewell: /(sampai jumpa|sampai nanti)/i
}

let followups = {
    greeting: {search: /(dan anda|apa kabar)/i, response: ['Baik.', 'Terima kasih.'], action: null},
    name: {search: /(siapa nama anda|dan anda|siapa namanya)/i, response: ['Nama saya Ida.', 'Saya Ida.', 'Ida'], action: catchName},
    country: {search: /(anda dari mana|dan anda dari mana|dan Anda)/i, response: ['Saya dari Indonesia.', 'Indonesia'], action: catchCountry},
    residence: {search: /(anda tinggal di mana|mbak Ida tinggal di mana|dan anda|dan)/i, response: ['Saya juga tinggal di dekat kampus.'], action: null},
    hobby: {search: /(hobi anda apa|dan anda)/i, response: ['Hobi saya membaca buku.'], action: null}
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
receiveMessage(pick(Object.values(conFlow)[0]).replace("{name}", userName))

function converse(message){
    if (Object.values(keywordObj)[convStep].test(message) == true){
        if (Object.values(followups)[convStep].action != null){
            console.log('first fired')
            Object.values(followups)[convStep].action(message)   
        }
        if (Object.values(followups)[convStep].search.test(message)== true){
            receiveMessage(pick(Object.values(followups)[convStep].response))
            console.log('second fired')
        }
        convStep++
        if (convStep < Object.keys(conFlow).length){
            receiveMessage(pick(Object.values(conFlow)[convStep]).replace("{name}", userName))
            console.log('third fired')
        }
    }
    else{
        if (mistakes < 3){
            receiveMessage("I'm sorry! I didn't catch you.")
            mistakes++
        }
        else{
            convStep++
            if (convStep < Object.keys(conFlow).length){
                receiveMessage("OK, let's move on")
                receiveMessage(pick(Object.values(conFlow)[convStep]))
            }
            else{
                receiveMessage("OK, let's stop here. Thank you!")
            }
        }
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

function catchName(sentence){
    const regex = /(?<=kenalkan, nama saya\s|saya\s|nama saya\s)\b\w+\b/i
    if(sentence.match(regex) != null){
        userName = sentence.match(regex)[0]
    }
    else{
        const regex2 = /\b\w+\b(?=.*)/i
        userName = sentence.match(regex2)[0]
    }
}

function catchCountry(sentence){
    const regex = /(?<=saya berasal dari\s|saya dari\s)\b\w+\b/i
    if(sentence.match(regex) == null){
        country = sentence
    }
    else{
        country = sentence.match(regex)[0]
    }
}