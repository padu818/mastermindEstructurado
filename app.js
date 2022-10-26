const { Console } = require("./console");

const console = new Console();

playMasterMind();

function playMasterMind(){
    while(getOption()){
        startGame();
    }
    msgBye();

    function menuMasterMind(){
        let msgMenu = '\n WELCOME TO MASTERMIND \n ';
        msgMenu += '1 ) START GAME \n 2 ) EXIT';
        console.writeln(msgMenu);
    }

    function msgBye(){
        console.writeln('Bye!!');
    }

    function getOption(){    
        menuMasterMind();
        let option;
        do{
            option = console.readNumber('Choose and option ("1" o "2"):');
        }while(!validateChoose(option));
        return option === 1;


        function validateChoose(value){
            let isCorrect = true;
            if (value !== 1 && value !== 2){
                console.writeln(value);
                printMsgErrorChoose();
                isCorrect = false;
            }
            return isCorrect;
        }

        function printMsgErrorChoose(){
            console.writeln('INVALID OPTION, MAKE SURE YOU CHOOSE "1" OR "2"');
        }
    }

    function startGame(){
        const NAME = 0;
        const POINT = 1;
        let players = initializePlayers();
        let turn = 0;
        do{
            startMakeAndBreakCode(players,NAME,POINT, turn);
            turn++;
        }while(isResumed(players, POINT));
        const winner = getWinner(players, POINT);
        printMsgWinner(winner, NAME, POINT);


        function isResumed(listUser, points){
            const MAX_POINT = 10;
            return !askExit() && getMaxPoint(listUser,points) < MAX_POINT;


            function askExit(){
                const valueExit = console.readString('Do you want to continue?(n to exit):'); 
                return 'n' === valueExit || valueExit === 'N';
            }

            function getMaxPoint(listPlayer, points){
                let max = 0;
                for(let item of listPlayer){
                    if(item[points] >= max){
                        max = item[points];
                    }
                }
                return max;
            }    
        }

        function getWinner(listPlayer, points) {
            let indexAndMaxPoint = [0,0];
            for(let item in listPlayer){
                indexAndMaxPoint = isGreater(item[points], indexAndMaxPoint[points]) ? [item, item[points]] : indexAndMaxPoint;
            }
            return listPlayer[indexAndMaxPoint[0]];


            function isGreater(point1, point2){
                return point1 > point2;
            }
        }
            
        function printMsgWinner(winner, name, points){
            const msgWinner = 'The player '+winner[name]+ ' with '+winner[points]+ ' has won the game!!';
            console.writeln(msgWinner);
        }
    
        function initializePlayers(){
            const INITIAL_POINT = 0;
            const PLAYER_SIZE = 2;
            let listOfPlayers =[];
            for(let i = 0; i < PLAYER_SIZE; i++){
                listOfPlayers[i]= [console.readString('Enter the player '+(i+1)+':'), INITIAL_POINT];
            }
            return listOfPlayers;
        }
    
        function startMakeAndBreakCode(listPlayer, names, points, turnPlayer){
            const indexPlayerTurn = turnPlayer % listPlayer.length;
            const codeMaker = proposeSequence(listPlayer[indexPlayerTurn][names]);
            listPlayer[indexPlayerTurn][points] += startAttemptBreaker(codeMaker);
            printPointPlayers(listPlayer, names, points);
           
    
            function printPointPlayers(listPlayers, names, points){
                let msgPointPlayers ='¡WELL DONE! \n';
                for(let item of listPlayers){
                    msgPointPlayers+= 'Player '+item[names]+ ' has '+item[points]+ '  ';
                }
                console.writeln(msgPointPlayers);
            }
            
            function proposeSequence(namePlayer){
                const msgMakerCode = '----MASTERMIND---- \n \n The Player "'+ namePlayer+'" has to propose the sequence.';
                console.writeln(msgMakerCode);
                return chooseTheCombination();
            }
        
            function chooseTheCombination(){
                let condition = false;
                let combination;
                do{
                    combination = console.readString('Propose a combination: ');
                    condition = validateCombination(combination);
                }while(!condition);
                return combination;
            }

            function validateCombination(value){
                const TAM_CODE = 4;
                let isValidate = [isTheSizeRight(value.length, TAM_CODE), true];
                for(let i = 0; isValidate[1] && i < TAM_CODE; i++){
                    isValidate[1] = isTheColorRight(value[i]);
                }
                printErrorValidation(isValidate);
                return isValidate[0] && isValidate[1];
            
                function printErrorValidation(listBoolean){
                    const WRONG_LENGTH = 'Wrong proposed combination length';
                    const WRONG_COLOR = 'Wrong color, they must be: rgybmc';
                    const listError = [WRONG_LENGTH, WRONG_COLOR];
                    let msgError = '';
                    for(let i = 0; i < listBoolean.length; i++){
                        if(!listBoolean[i]){
                            msgError += listError[i]+'\n'; 
                        }
                    }
                    console.write(msgError);
                }
        
                function isTheSizeRight(value){
                    return value === TAM_CODE;
                }
                
                function isTheColorRight(character){
                    const CHARACTER_COLOR = ['r','g','y','b','m','c'];
                    let isInArray = false;
                    for(let i = 0; !isInArray && i < CHARACTER_COLOR.length; i++){
                        isInArray = CHARACTER_COLOR[i] === character;
                    }
                    return isInArray;
                }
            }
            function startAttemptBreaker(code){ 
                let listGuessCode =[];
                let listBlacksAndWhite = [];
                let attempt = 0;
                do{
                    printHistory(listGuessCode, listBlacksAndWhite); 
                    listGuessCode[attempt] = chooseTheCombination();
                    listBlacksAndWhite[attempt] = getBlacksAndWhite(code, listGuessCode[attempt]);
                    attempt++;
                }while(isContinue(listBlacksAndWhite[attempt-1],attempt));
                return attempt;

            
                function isContinue(arrayBlackWhite, iterator){
                    const MAX_ITERATOR = 10;
                    return !isTheBreakerCode(arrayBlackWhite) && iterator < MAX_ITERATOR;

                    function isTheBreakerCode(listBlackWhite){
                        let result = true;
                        for(let i = 0; result && i < listBlackWhite.length; i++){
                            result = listBlackWhite[i] === 'BLACK';
                        }
                        return result;
                    }
                }

                function printHistory(arrayString, arrayBlackWhile){
                    let msg = '\n'+arrayString.length+' attempt(s): \n **** \n';
                    for(let i= 0; i < arrayString.length; i++){
                        msg+= arrayString[i]+' --> '+arrayBlackWhile[i]+' \n';
                    }
                    console.write(msg);
                }
            
                function getBlacksAndWhite(correct, value){
                    let arrayBlackAndWhite = inicializeWithAsterik(correct.length);
                    getBlacks(correct, value);
                    console.writeln(arrayBlackAndWhite);
                    getWhite(correct, value, arrayBlackAndWhite);
                    return arrayBlackAndWhite;
                
                    function inicializeWithAsterik(iteration){
                        let arrayWithAsterisk =[];
                        for(let i = 0; i < iteration; i++){
                            arrayWithAsterisk[i]= '*';
                        }
                        return arrayWithAsterisk;
                    }
                
                    function getBlacks(correct, value){
                        for(let i = 0; i < value.length; i++){
                            if(value[i] === correct[i]){
                                arrayBlackAndWhite[i] = 'BLACK';
                            }
                        }
                    }
                
                    function getWhite(correct, value, arrayValueBlackWhite){
                        let allAppearPositionWhite = inicializeWithAsterik(correct.length);
                        for(let i = 0; i < value.length; i++){
                            if(validateUniqueWhite(correct, value[i], arrayValueBlackWhite[i], allAppearPositionWhite)){
                                arrayValueBlackWhite[i] = 'WHITE';
                            }
                        }
                    
                        function validateUniqueWhite(correct, character, arrayBlackWhite, arrayAppearWhite){
                            let appear = false;
                            for(let j = 0; !appear && j < correct.length; j++){
                                if(character === correct[j] && !isRepeatWhite(arrayBlackWhite, arrayAppearWhite[j])){
                                    appear = true;
                                    arrayAppearWhite[j] = 'WHITE';
                                }
                            }
                            return appear;
                        
                            function isRepeatWhite(black, white){
                                return black === 'BLACK' || white === 'WHITE';
                            }    
                        }
                    }
                }         
            }   
        } 
    }
}