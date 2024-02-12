import { Component, OnInit } from '@angular/core';
import { BotConnectorService } from '../services/bot-connector.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

  userInputJson: string = "";

  pollRunning: boolean = false;


  constructor(private botConnectorService: BotConnectorService) {
    let name = localStorage.getItem("name");
    if (name === null) {
      localStorage.setItem("name", "default");
      name = "default";
    }

    this.botConnectorService.sendToStream("streamdeck", {
      "type": "enable",
      "name": name,
      "value": true
    });
  }



  sendEvent() {
   this.botConnectorService.sendToStream("streamdeck", JSON.parse(this.userInputJson));
  }

  startPrediction() {
    this.botConnectorService.sendToStream("predictions", {
        "description": "DOES HOOJ WIN?",
        "optionOne": "YES",
        "optionTwo": "NO",
        "duration": 120,
        "optionOnePoints": 5000,
        "optionTwoPoints": 4000,
        "endTime": "",
        "acceptingEntries": true,
        "ended": false
    });
  }

  endPrediction() {
    this.botConnectorService.sendToStream("predictions", {
        "ended": true
    });
  }

  startPoll() {
    this.pollRunning = true;
    this.botConnectorService.sendToStream("polls", {
      "title": "Favorite mod?",
      "options": [
        "Penflash",
        "Lily",
        "Noodabooda",
        "Brad"
      ]
    });
  }

  sendSubscription() {
    this.botConnectorService.sendToStream("subs", {
      "message": "Thank you for subscribing!"
    });
  }

  endPoll() {
    this.pollRunning = false;
    this.botConnectorService.sendToStream("polls", {
      "enabled": false
    });
  }

  spotifyLogin() {
    this.botConnectorService.sendToStream("streamdeck", {
      "type": "spotify",
      "name": "login",
      "value": true,
    })
  }

  spotifyStop() {
    this.botConnectorService.sendToStream("streamdeck", {
      "type": "spotify",
      "name": "stop",
      "value": true,
    })
  }

  ngOnInit(): void {
    this.sendFakeMessageOnTimer();
  }

  sendFakeMessageOnTimer() {
    // Every 500ms, send a fake message
    setInterval(() => {
      this.botConnectorService.sendToStream("chat-message", this.createFakeMessage());
    }, 500);
  }

  createFakeMessage() {
    // Generate a random message in the exact shape of the above sample
    const randomMessage = {
      "content": this.randomMessages[Math.floor(Math.random() * this.randomMessages.length)],
      // Random name
      "displayName": this.randomNames[Math.floor(Math.random() * this.randomNames.length)],
      "roles": [],
      "stickers": [],
      "emojis": [],
      "mentions": [],
      // Random 1-5 integer
      "author_id": Math.floor(Math.random() * 5000) + 1,

      // Random between "discord" and "twitch"
      "platform": "discord",
      "isNA": true,
      "isT3": true,
      "stickerURL": "",
      "badges": [],
      // Random color that's not black
      "authorColor": `rgb(${Math.floor(Math.random() * 125) + 125}, ${Math.floor(Math.random() * 125) + 125}, ${Math.floor(Math.random() * 125) + 125})`,
      "renderHeader": true,
      "chatMessage": {
        "chunks": [
          {
            "type": 0,
            "content": "random message"
          }
        ],
        "imgChunkCount": 0,
        "textChunkCount": 1
      }
    }

    // If poll is running, change content of message to be a random integer 1-4
    if (this.pollRunning) {
      randomMessage.content = "" + (Math.floor(Math.random() * 4) + 1);
    }

    return randomMessage;
  }

  randomMessages: string[] = [
      "Hey coach, any tips for Jett mains?",
      "What's the best crosshair setup for Viper?",
      "Coach, can you review my gameplay video?",
      "Do you prefer Phoenix or Reyna in ranked games?",
      "How to improve aim with the Operator?",
      "What's your opinion on Killjoy's nerf in the latest patch?",
      "I'm stuck in Bronze, any advice to climb the ranks?",
      "Coach, can you show us your favorite Omen tricks?",
      "Is there a specific sensitivity setting you recommend?",
      "What's your take on the latest agent addition, Skye?",
      "Opinion on the Vandal vs. Phantom debate?",
      "How to play Raze aggressively without overcommitting?",
      "Do you think Valorant should add more agents faster?",
      "Best recon bolt spots on Ascent?",
      "Thoughts on playing Cypher on attack?",
      "What are the essential skills to master for competitive play?",
      "Tell us your favorite Valorant agent backstory.",
      "Do you have any plans for a sub-tournament?",
      "Is Sage still a must-pick for a balanced team comp?",
      "How to maximize turret placement on Bind?",
      "What's your strategy for climbing through Diamond and beyond?",
      "Any cool Phoenix wallbang spots you can share?",
      "What's the secret to mastering Reyna's Leer ability?",
      "Tell us about your favorite Valorant map lore.",
      "Best aim training routines for aspiring pros?",
      "How to hold down mid control on Split effectively?",
      "Can you explain the perfect Brimstone smokes for Haven?",
      "Remember to keep the chat respectful and follow the rules, folks!",
      "Share your thoughts on potential map rotations in Valorant.",
      "How do you stay calm and focused during a losing streak?",
      "Coach, should I always dash into engagements with Jett?",
      "Do you think Sage's healing should be buffed or nerfed?",
      "Best ways to use Viper's Snakebite for zone control?",
      "Can you break down your thought process during clutch moments?",
      "How to counter Raze's explosive playstyle?",
      "Share your favorite map callouts and strategies!",
      "What's the most important aspect of team coordination in Valorant?",
      "Thoughts on the recent Jett balance changes?",
      "How to approach retakes as a defender with a man disadvantage?",
      "In your opinion, who's the most versatile agent in Valorant?",
      "What's your take on the 'agent tier list' in the community?",
      "How to deal with smurfs and boosters in ranked games?",
      "Share some tips for placing Cypher's Spycam effectively.",
      "Which agent has the coolest skins in your opinion?",
      "How to encourage better teamwork in solo queue games?",
      "Any predictions on upcoming Valorant esports rosters?"
  ]

  randomNames: string[] = [
    "TSM PixelPanda",
    "TSM RogueRunner",
    "TSM MysticMerlin",
    "TSM NovaNinja",
    "TSM CyberCoyote",
    "TSM AstralArcher",
    "TSM BlazeBandit",
    "TSM CosmicCrafter",
    "TSM DigitalDruid",
    "TSM EchoEagle",
    "TSM FrostFalcon",
    "TSM GlowingGamer",
    "TSM HazardHawk",
    "TSM IronImpulse",
    "TSM JadeJester",
    "TSM KnightlyKoala",
    "TSM LunarLynx",
    "TSM MysticMongoose",
    "TSM NebulaNomad",
    "TSM OasisOcelot",
    "TSM PhantomPhoenix",
    "TSM QuantumQuokka",
    "TSM RetroRaccoon",
    "TSM SolarSphinx",
    "TSM ThunderTiger",
    "TSM UltraUnicorn",
    "TL VividVulture",
    "TL WarpWolf",
    "TL XenonXylophone",
    "TL YonderYak",
    "TL ZodiacZebra",
    "TL ArcaneAlpaca",
    "TL BinaryBear",
    "TL CrimsonChameleon",
    "TL DazzlingDolphin",
    "TL EtherealElephant",
    "TL FlamingFox",
    "TL GalacticGiraffe",
    "TL HolographicHippo",
    "TL InfiniteIguana",
    "TL JubilantJackal",
    "TL KineticKangaroo",
    "TL LegendaryLlama",
    "TL MagneticMoose",
    "TL NeonNewt",
    "TL OmniscientOtter",
    "TL PrismaticPenguin",
    "TL QuirkyQuail",
    "TL RadiantRhino",
    "TL StellarStingray",
    "TL TwilightTurtle"]

}
