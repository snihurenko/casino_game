class GameMachine {
    constructor(number = 1000){
        this.number = number;
    }
    get getMoney(){
        return this.number
    }
    takeMoney(number){
        if (number > this.number){
            alert(`Not enough money in machine. Only ${this.number} available`)
        } else {
            this.number -= number;
            alert('Money taken from machine');
        }
    }
    putMoney(number){
        this.number += number;
    }
    playGame(number){
        if (this.number >= number * 3){
            this.putMoney(number);
            const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
            const digits = randomNumber.toString().split('');
    
            const counts = {};
            digits.forEach(digit => { 
                counts[digit] = (counts[digit] || 0) + 1 
            });
    
            let win = 0;
            Object.values(counts).forEach(count => {
                if (count === 2){
                    win = number * 2
                }
                if (count === 3){
                    win = number * 3
                } 
            })
    
            if (win === 0){
                alert('I am sorry. You lost this game')
            } else {
                this.number -= win;
                alert(`Congratulations! You win! You have ${win} money on balance now`);
            }
            return win
        } else {
            alert('This machine has not enough funds to play game. Admin should add money to machine');
        }
    }
};

class Casino {
    gameMachinesAll = [];
    money = 0;
    constructor(name){
        this.name = name;
    }
    get getMoney(){
        this.gameMachinesAll.forEach(elem => {
            this.money += elem.number
        })
        return this.money
    }
    get getMachineCount(){
        if (this.gameMachinesAll.length === null){
            return 0
        } else {
            return this.gameMachinesAll.length;
        }
    }
};

class User {
    constructor(name, money){
        this.name = name;
        if (money > 0){
            this.money = money;
        }
    }
    play(gameMachine){
        if (this.money > 0){
            const result = gameMachine.playGame(this.money);  
            this.money = result;
        } else {
            alert(`${this.name} has not enough money to play`)
        }
    }
};

class SuperAdmin extends User {
    casino = '';
    constructor(name, money){
        super(name, money)
    }
    createCasino(name){
        if (name === ''){
            name = 'New Casino';
        }
        this.casino = new Casino(name);
    }
    addMoneyCasino(money){
        if (money === ''){
            money = 10000;
        } else if (money < 0) {
            alert('Please enter valid amount');
            return false
        }
        this.casino.money += money;
        alert(`$${money} added to the casino`);
    }
    takeMoneyCasino(money){
        if (money !== ''){
            money = +money;
            let moneyGather = +money;
            let takenMoney = 0;
            let sum = 0;

            const sortedMachines = this.casino.gameMachinesAll.sort((a, b) => (a.number > b.number) ? -1 : 1);

            for (let i = 0; i < sortedMachines.length; i++){
                if (sortedMachines[i].number > money){
                    takenMoney = money;
                    sortedMachines[i].number -= money;

                } else if (sortedMachines[i].number < money){
                    takenMoney = sortedMachines[i].number;
                    sortedMachines[i].number -= takenMoney;
                } 

                sum += takenMoney;
                if (!(sum === moneyGather)){
                    money -= takenMoney;   
                } else {
                    return sum
                }
            }
    
            if (sum < moneyGather) {
                let emptyMachine = 0;
                sortedMachines.forEach(item => {
                    if (item.number === 0){
                        emptyMachine++;
                    }
                })
        
                if (emptyMachine === sortedMachines.length){
                    alert('Not enough money in machines')
                }   
                return sum
            }

        } else {
            alert('Please choose sum to be taken');
            return null
        }
    }
    createGameMachine(money){
        if (money === ''){
            money = 1000;
        }
        if (this.casino.money < money){
            alert('Casino has not enough funds to create machine');
            return;
        } else {
            money = parseFloat(money)
            const gameMachine = new GameMachine(money);
            this.casino.gameMachinesAll.push(gameMachine)
            this.casino.money -= money;
            alert('New machine is created');
        }
    }
    addMoneyGameMachine(machine, money){
        if (money === ''){
            money = 1000;
        }
        if (machine === ''){
            machine = 0;
        }

        this.casino.gameMachinesAll[machine].putMoney(money);
        alert('Money added to machine');
    }
    deleteGameMachine(machine){
        if (this.casino.gameMachinesAll[machine]){
            const moneyLeft = this.casino.gameMachinesAll[machine].number;
            this.casino.gameMachinesAll.splice(machine, 1);
            const moneyTransfer = +Math.floor(moneyLeft / this.casino.gameMachinesAll.length);

            this.casino.gameMachinesAll.forEach(machine => {
                machine.number += moneyTransfer
            });
            alert('One machine was deleted');
        } else {
            alert('Please choose correct machine that should be deleted');
            return 0
        }
    }
};

let admin;
const adminForm = document.getElementById('admin-form'),
    createCasino = document.getElementById('createCasino'),
    getMachineCount = document.getElementById('getMachineCount'),
    addMoneyCasino = document.getElementById('addMoneyCasino'),
    takeMoneyCasino = document.getElementById('takeMoneyCasino'),
    createMachine = document.getElementById('createMachine'),
    deleteMachine = document.getElementById('deleteMachine'),
    addMoneyMachine = document.getElementById('addMoneyMachine'),
    takeMoneyMachine = document.getElementById('takeMoneyMachine'),
    casinoParams = document.getElementById('casinoParams'),
    machineParamsMoney = document.getElementById('machineParamsMoney'),
    machineBalance = document.getElementById('machine_balance'),
    userName = document.getElementById('user_name'),
    userMoney = document.getElementById('user_money'),
    userPlay = document.getElementById('userPlay'),
    adminPlay = document.getElementById('adminPlay'),
    adminName = document.getElementById('admin_name'),
    adminMoney = document.getElementById('admin_money');

let machineParamsNumber = document.getElementById('machineParamsNumber');

admin = new SuperAdmin('adminName', 1000);

adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = adminName.value;
    const money = adminMoney.value;
    admin = new SuperAdmin(name, money);
});

const isAnyCasino = () => {
    if (admin.casino === '') {
        alert('Please create casino first');
        return false;
    } else {
        return true;
    }
};

const isAnyMachine = () => {
    if (admin.casino.gameMachinesAll.length === 0) {
        alert('Please create machine first');
        return false;
    } else {
        return true;
    }
};

adminPlay.addEventListener('click', () => {
    if (adminName.value !== '' && adminMoney.value !== ''){
        if (isAnyCasino() && isAnyMachine()){
            const name = adminName.value;
            const money = parseFloat(adminMoney.value);
        
            const adminUser = new SuperAdmin(name, money);
            adminUser.play(admin.casino.gameMachinesAll[0]);
            machineBalance.value = admin.casino.gameMachinesAll[0].number;
            if (adminUser.money === 0){
                adminMoney.value = '';
            } else {
                adminMoney.value = adminUser.money;
            }
        }
    } else {
        alert('Please enter admin details first');
    }
});

//user 
userPlay.addEventListener('click', () => {
    if (userName.value !== '' && userMoney.value !== ''){
        if (isAnyCasino() && isAnyMachine()){
            const name = userName.value;
            const money = parseFloat(userMoney.value);
        
            const user = new User(name, money);
            user.play(admin.casino.gameMachinesAll[0]);
            machineBalance.value = admin.casino.gameMachinesAll[0].number;
            if (user.money === 0){
                userMoney.value = '';
            } else {
                userMoney.value = user.money;
            }
        }
    } else {
        alert('Please enter user details first');
    }
});

//casino
createCasino.addEventListener('click', () => {
    admin.createCasino(casinoParams.value);
    alert(`Casino ${casinoParams.value} is created`);
    casinoParams.value = '';
});

getMachineCount.addEventListener('click', () => {
    if (isAnyCasino()){
        const result = admin.casino.getMachineCount;
        alert(`There are ${result} machines`);
    }
});

addMoneyCasino.addEventListener('click', () => {
    if (isAnyCasino()){
        let money = 0;
        if (casinoParams.value !== ''){
            money = parseFloat(casinoParams.value)
        } else {
            money = 1000;
        }
        admin.addMoneyCasino(money);
    }
    casinoParams.value = '';
});

takeMoneyCasino.addEventListener('click', () => {
    if (isAnyCasino()){
        const sum = admin.takeMoneyCasino(casinoParams.value);
        if (sum !== 0 && sum !== null) {
            alert(`$${sum} were taken from the casino machines`);
        } 
    }
    casinoParams.value = '';
    if (admin.casino.gameMachinesAll.length !== 0){
        machineBalance.value = admin.casino.gameMachinesAll[0].number;
    } else {
        machineBalance.value = 0;
    }
});

//machine
createMachine.addEventListener('click', () => {
    if (isAnyCasino()){
        admin.createGameMachine(machineParamsMoney.value);
        if (admin.casino.gameMachinesAll.length !== 0){
            machineBalance.value = admin.casino.gameMachinesAll[0].number;
        }
    }
    machineParamsMoney.value = '';
});

deleteMachine.addEventListener('click', () => {
    if (isAnyCasino() && isAnyMachine() &&  machineParamsNumber.value !== ''){
        const number = +machineParamsNumber.value - 1;
        admin.deleteGameMachine(number);
    } else {
        alert('Please choose machine you want to delete');
    }
    machineParamsNumber.value = '';
    if (admin.casino.gameMachinesAll.length !== 0){
        machineBalance.value = admin.casino.gameMachinesAll[0].number;
    } else {
        machineBalance.value = 0;
    }
});

addMoneyMachine.addEventListener('click', () => {
    if (isAnyCasino() && isAnyMachine()){
        if (machineParamsNumber.value === ''){
            machineParamsNumber.value = 1;
        } 
        if (machineParamsMoney.value === ''){
            alert('Please specify money to add');
            return;
        } 
        const number = parseFloat(machineParamsNumber.value) - 1;
        const money = parseFloat(machineParamsMoney.value);
        admin.addMoneyGameMachine(number, money);
        
    }
    machineParamsNumber.value = '';
    machineParamsMoney.value = '';
    machineBalance.value = admin.casino.gameMachinesAll[0].number;
});

takeMoneyMachine.addEventListener('click', () => {
    if (isAnyCasino() && isAnyMachine()){
        let machineNumber = 0;
        if (machineParamsNumber.value === ''){
            machineNumber = 1;
        } else {
            machineNumber = parseFloat(machineParamsNumber.value);
        }
        if (machineParamsMoney.value === ''){
            alert('Please specify amount of money you want to take');
            return 0;
        }
        const number = machineNumber - 1;
        const money = parseFloat(machineParamsMoney.value);
        admin.casino.gameMachinesAll[number].takeMoney(money);
    }
    machineParamsNumber.value = '';
    machineParamsMoney.value = '';
    machineBalance.value = admin.casino.gameMachinesAll[0].number;
});




