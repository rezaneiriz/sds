let regex = /\b\w+\b(?=.*)/i
let sentence = "Reza, dan anda?"
console.log(sentence.match(regex)[0])