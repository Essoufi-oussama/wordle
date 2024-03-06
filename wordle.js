const word_url = "https://words.dev-apis.com/word-of-the-day?random=1"
let word = "";
let id = 1;
const loadingDiv = document.querySelector(".info-bar");

const getWord = async () => {
    let isLoading = true;
    setLoading(isLoading);
    const promise = await  fetch(word_url);
    const processedResponse = await promise.json();
    word = processedResponse.word;
    console.log(word);
    isLoading = false;
    setLoading(isLoading);
}

const validateWord = async (wordToCheck, divArray) =>{
    isLoading = true;
    setLoading(isLoading);
    const wordTosubmit = {
        word: wordToCheck
    };
    
    const promise = await fetch("https://words.dev-apis.com/validate-word", {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(wordTosubmit)
            });

    const processedResponse = await promise.json();
    isLoading = false;
    setLoading(isLoading);
    if (processedResponse.validWord){
        if (wordToCheck === word){
            alert("you win!");
            for(let i = 0; i < divArray.length; i++ ){
                divArray[i].style.cssText = "background-color: green; color: white;"
            }
            document.removeEventListener("keydown", keyClick);
        } else {
            for(let i= 0; i < divArray.length; i++){
                if(wordToCheck[i] === word[i] ){
                    divArray[i].style.cssText = "background-color: green;"
                }else if(word.includes(wordToCheck[i])){
                    divArray[i].style.cssText = "background-color: yellow;"
                }else{
                    divArray[i].style.cssText = "background-color: gray;"
                }
            }
            id = id + 1;
            if(id === 7){
                document.removeEventListener("keydown", keyClick);
                alert(`You lose! word was ${word}`);
            }
        }
    } else {
        alert("Invalid Word");       
    }       
}

 window.onload = getWord();

 function keyClick (event) {
    //event gives KeyboardEvent {isTrusted: true, key: '4', code: 'Digit4', location: 0, ctrlKey: false, …}
    // populate th row
    if (!(event.code.includes("Key") || event.code === 'Backspace' || event.code === 'Enter')){
        return 0;
    }
    const test = document.getElementById(id).children;

    // will check if the pressed key is letter and update 

    if (event.code.includes("Key")){
        // i wanted to not do loop if the last div is populated
        if (test[4].innerText !== ''){
            test[4].innerText = event.key;
            return 0;
        }

        for(let i = 0 ; i < test.length; i++){
            if (test[i].innerHTML===''){
                test[i].innerHTML = event.key;
                break;
            }
        }
     } else if (event.code === 'Backspace'){
        for(let i = 0; i < test.length; i++){
            if( i=== 4){
                test[4].innerText = '';
                break;
            } else{
                if (test[i + 1].innerText ==='' && test[i].innerText !== ''){
                    test[i].innerText = '';
                }
            }
        }
     } else if (event.code == 'Enter'){
        // send post request only if last letter of div is right
        if (test[4].innerText !== ''){
            const wordTosubmit = test[0].innerText + test[1].innerText + test[2].innerText + test[3].innerText + test[4].innerText;
            validateWord(wordTosubmit.toLowerCase(), test);
        }
     }
}

function setLoading(isLoading) {
    loadingDiv.classList.toggle("hidden", !isLoading);
}

document.addEventListener("keydown", keyClick);