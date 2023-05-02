 const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min)) +min;

 }

 const app = vue.createApp({
    data() {
        return{
            warriorHealth: 100,
            dragonHealth: 100,
            numOfSpecialAttack: 3,
            numOfHeal: 3,
            winner: null,
            battleLogMessage: [],
            swordSlash: new Audio('../sounds/sword_slash.mp3'),
            dragonBreath: new Audio('../sounds/dragon_breath.mp3'),
            healEffect: new Audio('../sounds/heal_effect.mp3'),
            specialAttackEffect: new Audio('../sounds/special_attack.mp3'),
        }
    },
    watch: {
        warriorHealth(value){
            if(value <= 0 && this.dragonHealth <= 0){
                //draw
                this.winner = 'draw';
            }
            else if(value <= 0) {
                this.winner = 'dragon';
            }
        },
        dragonHealth(value){
            if(value <= 0 && this.warriorHealth <= 0){
                //draw
                this.winner = 'draw';
            }
            else if(value <= 0) {
                this.winner = 'warrior';
            }
        },
    },
    computed: {
        warriorHealthBar () {
            if(this.warriorHealth < 0) {
                return {warrior: '0%'};
            }
            else{
                if(this.warriorHealth <= 50){
                    return {warrior: this.warriorHealth + '%', background: 'red'}
                }else{
                    return {width: this.warriorHealth + '%'};
                }
            }
        },
        dragonHealthBar () {
            if(this.dragonHealth < 0) {
                return {warrior: '0%'};
            }
            else{
                if(this.dragonHealth <= 50){
                    return {warrior: this.dragonHealth + '%', background: 'red'}
                }else{
                    return {width: this.dragonHealth + '%'};
                }
            }
        },
    },
    methods: {
        startFight() {
           this.warriorHealth= 100;
           this.dragonHealth= 100;
           this.numOfSpecialAttack= 3;
           this.numOfHeal= 3;
           this.winner= null;
           this.battleLogMessage= [];
        },
        attackDragon() {
            const attackDamage = getRandomValue(6, 15);
            //check if dragon healthbar is greater than zero first 
            if(this.dragonHealth - attackDamage < 0){
                this.dragonHealth = 0;
            }else {
                this.dragonHealth -= attackDamage;
            }
            this.swordSlash.play();
            this.addBattleLog('warrior' , 'attack', attackDamage);
            this.attackWarrior();
        },
        attackWarrior(){
            const attackDamage = getRandomValue(8, 20);
            //check if Warrior healthbar is greater than zero first 
            if(this.warriorHealth - attackDamage < 0){
                this.warriorHealth = 0;
            }else {
                this.warriorHealth -= attackDamage;
            }
            setTimeout(() => {
                this.dragonBreath.play();
                setTimeout(() => {
                    this.dragonBreath.pause();
                }, 2000)
            }, 0);
            this.addBattleLog('dragon', 'attack', attackDamage)
        },
        specialAttack() {
            this.numOfSpecialAttack --;
            const attackDamage = getRandomValue(10, 25);
            if(this.dragonHealth - attackDamage < 0){
                this.dragonHealth = 0;
            }else{
                this.specialAttackEffect.play();
                this.dragonHealth -= attackDamage;
            }
            this.addBattleLog('warrior', 'special-attack', attackDamage);
            this.attackWarrior();
        },
        heal() {
            this.numOfHeal --;
            const healValue = getRandomValue(10, 25);
            if(this.warriorHealth + healValue > 100){
                this.warriorHealth = 100;
            }else{
                this.warriorHealth += healValue;
            }
            this.healEffect.play();
            this.addBattleLog('warrior', 'special', healValue);
            this.attackWarrior();
        },
        forfeit() {
            this.winner = 'dragon'
        },
        addBattleLog(who, what, value){
            this.battleLogMessage.unshift({
                attacker: who,
                actionType: what,
                actionValue: value,
            });
        }
    }
 })

 app.mount('#game')