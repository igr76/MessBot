const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
    }

    async srart(msg) {
        const text = this.loadMessage("main");
        await  this.sendImage("main")
        await this.sendText(text)
    }

    async html(msg) {
        await this.sendHTML('<h3 style="color: #1a73e8">Hello</h3>', msg);
    }
   async hello(msg){
       const text = msg.text;
       await this.sendText("<b>Hello !</b>")
       await this.sendText("Hello World!"+ text)
       await  this.sendImage("avatar_main")
       await this.sendTextButtons("Какая у вас тема в Телеграмм",{
           "theme_light":"Светлая",
           "theme_dark":"Темная",

       })
   }

   async helloButton(callbakQuery){
        const query = callbakQuery.data;
        if (query === "theme_light")
            await this.sendText("Светлая тема")
       else  if (query === "theme_dark")
            await this.sendText("Темная тема")
   }

}

const bot = new MyTelegramBot("7399956767:AAHVAfzBjCCXwXK5e-6uT_l5_v4JoRpSWSE");
bot.onCommand(/\/start/,bot.srart)
bot.onCommand(/\/html/,bot.html)
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^.*/,bot.helloButton)