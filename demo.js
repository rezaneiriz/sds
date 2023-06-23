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
    'greeting': [/\bhello\b/i, /\bhi\b/i, /\bhi there\b/i],
    'health': [/\bhow are you\b/i, /\bhow is it going\b/i, /\bhow are things\b/i]
}

let responsesObj = {
    'greeting':[
        'Hi there',
        'Hello',
        'Howdy'
    ],
    'health': [
        'I\'m fine! You?',
        'Pretty good, thanks!',
        'I have no complaints'
    ]
}

function testKeyword(keyword){
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
    let keyword = testKeyword(message)
    if (keyword){
        let res = pick(responsesObj[keyword])
        receiveMessage(res)
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