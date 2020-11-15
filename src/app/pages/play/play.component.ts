import { ArrayType } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {


  public card_types = [
    {
      id: "1",
      name: "Spade",
      type: "2",
      color: 'black',
      icon: "assets/images/spade.png"
    },
    {
      id: "2",
      name: "Heart",
      type: "1",
      color: 'red',
      icon: "assets/images/heart.png"
    },
    {
      id: "3",
      name: "Diamond",
      type: "1",
      color: 'red',
      icon: "assets/images/diamond.png"
    },
    {
      id: "4",
      name: "Club",
      type: "2",
      color: 'black',
      icon: "assets/images/club.png"
    }
  ];
  public _gameCards = [
    {
      name:7,
      value: 7
    },
    {
      name:8,
      value: 8
    },
    {
      name:9,
      value: 9
    },
    {
      name:10,
      value: 10
    },
    {
      name: "J",
      value: 11
    },
    {
      name: "Q",
      value: 12
    },
    {
      name: "K",
      value: 13
    },
    {
      name: "A",
      value: 14
    },
  ];

  private thisGameCards = [];
  public trump:any = {};

  private bot_players = [
    {
      'name': 'Chathura',
      cards : []
    },
    {
      'name': 'Prabath',
      cards : []
    },
    {
      'name': 'Thilina',
      cards : []
    },
    {
      'name': 'Ishan',
      cards : []
    },
    {
      'name': 'Sajith',
      cards : []
    }
  ];
  public team_count = 2;
  public player_for_each_team = 2;
  public player_count = 4;
  public starting_player;

  public teams = [0,1,0,1];
  public team_players = [];
  public _virtual_team_players = [];
  public _team1_points = 10;
  public _team2_points = 10;

  public _card_spreding_times = 2;

  public gameRound = 1;
  public tableCards:any = [];
  public turnPosition = 0;
  public maxTurns = 8;
  public historyOftheTurns = [];
  public winnersOftheTurn;
  public winnersOftheTurns = [];
  public winnerOveral;
  public finalWinner;

  public error:any;
  public myPlayingPosition = 1;
  public isMyChance:boolean = false;

  public cardImageBbasePath = 'assets/themes/default/cards.png'
  private scaleFactor = .2;

  public me = {
    name: 'Dan',
    id: undefined,
    team: undefined,
    cards : []
  }
  
  constructor(private _router:Router) {
  }

  ngOnInit(): void {
    this.startGame();
  }

  private startGame(){

    this.winnerOveral = undefined;
    this.winnersOftheTurn = undefined;

    this.player_count = this.team_count * this.player_for_each_team;

    /* My position will vary from 0 - 3 */
    //this.myTurnPosition = 2; //this._pickRandomNumber(this.team_count * this.player_for_each_team);

    this._card_spreding_times = this.player_for_each_team == 1 ? 4 : 2;

    this.maxTurns = this.player_for_each_team == 1 ? this._gameCards.length * 2 : this._gameCards.length;

    /* Create teams & players */
    this.myPlayingPosition = this.gameRound % this.player_count;
    console.log(`myPlayingPosition - ${this.myPlayingPosition}`, this.gameRound, this.player_count)

    /* const myTeamPosition = this._pickRandomNumber((this.team_count * this.player_for_each_team)-1);
    console.log(`myTeamPosition ${myTeamPosition}`);
    for (let i = 0; i < (this.team_count * this.player_for_each_team); i++) {
      if (i == myTeamPosition){
        this.me.team = this.teams[i];
        this.me.id = i;
        this.team_players.push(this.me);
      } else {
        let player:any = this.bot_players.splice(this._pickRandomNumber(this.bot_players.length), 1)[0];
        player.team = this.teams[i];
        player.id = i;
        this.team_players.push(player);
      }
    } */

    /* add me */
    this.me.team = this.teams[0];
    this.me.id = 0;
    this.team_players.push(this.me);

    /* pick 3 computer players */
    for (let i = 1; i < this.player_count; i++) {
      let player:any = this.bot_players.splice(this._pickRandomNumber(this.bot_players.length), 1)[0];
      player.team = this.teams[i];
      player.id = i;
      this.team_players.push(player);
    }

    /* Get random trump */
    this.trump = this.card_types[this._pickRandomNumber(this.card_types.length)];

    console.log(this.trump);

    /* Take all cards */
    for (let i = 0; i < this.card_types.length; i++) {
      for (let j = 0; j < this._gameCards.length; j++) {
          
        this.thisGameCards.push({
          type: this.card_types[i],
          card: this._gameCards[j]
        });

      }
    }

    this._spredCards();
    this.startTurn();
  }

  private _spredCards(){
    let weHaveATrump = false;

    /* Shuffel cards */
    this.thisGameCards = this._shuffle(this.thisGameCards);

    this._addCardImages(this.thisGameCards);

    /* Giving random cards for players */
    for (let i = 0; i < this._card_spreding_times; i++) {
      console.log(i);
      this.team_players.forEach(player => {
        let cards:any = this.thisGameCards.splice(0, 4);
        player.cards = player.cards.concat(cards);

        if (player.team == this.me.team) {
          cards.forEach(card => {
            if (card.type.id == this.trump.id) weHaveATrump = true;
          });
        }

      });
    }

    this._virtual_team_players = new Array().concat(this.team_players);
    this.rotateVirtualPlayers();

    /* Rotate players according to myposition */

    /* If we don't have a trump. Do re-shuffel */
    if (!weHaveATrump) this._spredCards();
  }

  private rotateVirtualPlayers(){
    if (this._virtual_team_players[this.myPlayingPosition] != this.me){
      this.rightRotatebyOne(this._virtual_team_players);
      this.rotateVirtualPlayers();
    }
    return this._virtual_team_players;
  }

  private _addCardImages(cards){
    /* Add game card images */
    cards.forEach((card:any) => {

      const imgW = 4200;
      const imgH = 1650;

      let sX = imgW*this.scaleFactor;
      let sY = imgH*this.scaleFactor;

      let w = (imgW/14)*this.scaleFactor;
      let x = (card.card.value == 14 ? 1 : card.card.value) * w;
      let h = (imgH/4)*this.scaleFactor;
      let y = (card.type.id - 1) * h
      
      card.imgX = x;
      card.imgWidth = w;
      card.imgY = y;
      card.imgHeight = h;
      card.scaleX = sX;
      card.scaleY = sY;
    });
  }

  private startTurn(){
    setTimeout(() => {
      this.resetTurn();
      this.continueTurn();
    }, 1000);
  }

  private _pickRandomNumber(length):any {
    const i = Math.floor(length * Math.random());
    return i;
  }

  private _shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  private resetTurn(){
    this.tableCards = [];
    this.turnPosition = 0;
    this.winnersOftheTurn = undefined;
    this.error = false;
  }

  public put(cardIndex, card){
    if (!this.isMyChance) return;
    
    this.error = false; // clear the error in each attempt

    /* Check against the table card */
    /* If no cards in the table, skipping. Else - */
    if (this.tableCards.length > 0){
      let firstCardType = this.tableCards[0].card.type;

      /* if sametype OK to put. Else */
      if (firstCardType.id != card.type.id){
        let sameTypeCards = this.me.cards.filter(c => { return c.type.id == firstCardType.id});

        /* Same type card availablr */
        if (sameTypeCards.length > 0){
          this.error = `Please put same type (${firstCardType.name}) card.`;
          return;
        }
      }
    }

    this.me.cards.splice(cardIndex,1);

    this.tableCards.push({
      user: this.me,
      card: card
    });
    this.turnPosition++;
    this.isMyChance = false;
    this.continueTurn();
  }

  private continueTurn(){
    if (this.turnPosition == this.player_count) this.resetTurn();

    for (let i = this.turnPosition; i < this._virtual_team_players.length; i++) {
      let player = this._virtual_team_players[i];
      
      /* If this is my turn */
      if (this.turnPosition == this.myPlayingPosition) {
        this.isMyChance = true;
        return;
      }
      
      this.turnPosition++;

      /* If not me */
      if (player != this.me){

        let theCard:any = {};

        /* Check if this is the first turn */
        if (this.tableCards.length != 0){

          /* Check rules */
          let startType = this.tableCards[0].card.type.id;
          let sameTypeCards = player.cards.filter((x) => { if (x.type.id == startType) return x });

          /* If having same type cards, lets pick a one. */
          if (sameTypeCards.length > 0){

            /* If this is the only one */
            if (sameTypeCards.length == 1){
              theCard = sameTypeCards[0];

            } else{
              
              /* Lets pick the best one */
              theCard = this.checkAgainstTable(sameTypeCards);
            }
          } else {

            /* Check for trumps */
            let trumpCards = player.cards.filter((x) => { if (x.type.id == this.trump.type.id) return x });

            if (trumpCards.length > 0){

              /* If this is the only one */
              if (trumpCards.length == 1){
                theCard = trumpCards[0];

              } else{
                
                /* Lets pick the best one */
                theCard = this.checkAgainstTable(trumpCards);
              }
            } else {

              /* Pick any other card */
              theCard = this.checkAgainstTable(player.cards);
            }
          }

        } else {

          /* Randomly pick a card */
          theCard = player.cards[this._pickRandomNumber(player.cards.length)];
        }

        const index = player.cards.indexOf(theCard);
        player.cards.splice(index, 1)

        this.tableCards.push({
          user: player,
          card: theCard
        });
      }
    };

    /* End the session */
    if (this.turnPosition ==this.player_count){
      this.historyOftheTurns.push(this.tableCards);

      const cards = this.tableCards.sort((a,b)=>{ return a.card.card.value - b.card.card.value});

      this.winnersOftheTurn = (cards[cards.length - 1].user.team + 1);
      this.winnersOftheTurns.push(this.winnersOftheTurn);
    }

    /* Check if the game over */
    if (this.maxTurns == this.winnersOftheTurns.length){

      /* finding the overall winner */
      let _team1_wins = 0
      let _team2_wins = 0;
      this.winnersOftheTurns.forEach(wins => {
        wins == 0 ? _team1_wins++ : _team2_wins++;
      });
      if (_team1_wins > _team2_wins){
        this.winnerOveral = 1;
        this._team2_points--;
      } else if (_team1_wins > _team2_wins) {
        this.winnerOveral = 'Draw';
      } else {
        this.winnerOveral = 2;
        this._team1_points--;
      }

      /* End of the game */
      if (this._team1_points == 0 || this._team2_points == 0){
        if (this._team1_points > this._team2_points){
          this.finalWinner = 1;
        } else {
          this.finalWinner = 2;
        }
        Swal.fire({
          title: "Game Over!",
          text: this.finalWinner == this.me.team ? "Your team won the game!" : "Your team loose. They won the game!",
        });
        
      } else {
        Swal.fire({
          title: "Round completed.",
          text: (this.winnerOveral == this.me.team+1 ? "Your team won last round." : "Sorry, they won last round.")+ " Do you wont to play next round ?",
          showCancelButton: true,
          confirmButtonText: 'Yes, let\'s play!',
          cancelButtonText: 'No, im running out :('
        }).then((result) => {
          if (result.value) {
            this.gameRound++;
            this.startGame();
            this.startTurn();
        } else {
            this._router.navigate(['/']);
          }
        })
      }

    } else {

      /* Start the next turn */
      this.startTurn();
    }
  }

  /* Pick a best card against table */
  private checkAgainstTable(cards){
    let tableHightestValue = 0;
    this.tableCards.forEach(card => {
      tableHightestValue = Math.max(tableHightestValue, card.card.card.value);
    });

    /* Check if player has higher value one */
    let allLargerCards = cards.filter(card => { if (card.card.value > tableHightestValue) return card; });
    if (allLargerCards.length == 1){
      return allLargerCards[0];
    } else if (allLargerCards.length > 1){

      allLargerCards.sort((a,b)=>{ return a.card.value - b.card.value});
      return allLargerCards.pop();
      //return allLargerCards[this._pickRandomNumber(allLargerCards)];
    } else {

      /* else send the lowest value card */
      let allLowestCards = cards.filter(card => { if (card.card.value < tableHightestValue) return card });
      if (allLowestCards.length == 1){
        return allLowestCards[0];
      } else if (allLowestCards.length > 1){
  
        allLowestCards.sort((a,b)=>{return a.card.value - b.card.value});
        return allLowestCards.shift();
        //return allLowestCards[this._pickRandomNumber(allLowestCards)];
      } else {
        return false;
      }

    }
  }





  public getRandRotation(){
    return this._pickRandomNumber(15) - this._pickRandomNumber(15);
  }

  private leftRotatebyOne(arr):any
  {
    const temp = arr.splice(0, 1);
    arr.push(temp[0]);
  }

  private rightRotatebyOne(arr):any
  {
    const temp = arr.pop()
    arr.unshift(temp);
  }

}
