const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
        this.list=[]
    }

    async srart(msg) {
        this.mode="main";
        const text = this.loadMessage("main");
        await  this.sendImage("main")
        await this.sendText(text)
        // add menu
        await this.showMainMenu({
            "start":"главное меню бота",
            "profile":"генерация Tinder-профиля",
            "opener":"сообщение для знакомства 🥰",
            "message":"переписка от вашего имени 😈",
            "date":"переписка со звездами 🔥",
            "gpt":"Общение с ИИ",
            "html":"Демонстрация html"
        })
    }
    async html(msg) {
        await this.sendHTML('<h3 style="color: #1a73e8">Hello</h3>', msg);
        const html  = this.loadHtml("main")
        await this.sendHTML(html, {theme:"dark"});
    }

    async gpt(msg) {
        this.mode="gpt";
        const text = this.loadMessage("gpt");
        await  this.sendImage("gpt")
        await  this.sendText(text)
    }
    async gptDialog(msg) {
        await  this.sendText(" ИИ")
        const text = msg.text;
        const  myMessage = await this.sendText(" Ваше сообщение передано чату GPT. ожидайте..")
       const  answer = await chatgpt.sendQuestion("Ответь на вопрос",text)
           //await  this.sendText(answer)
        await this.editText(myMessage,answer)
    }
    async date(msg) {
        this.mode="date";
        const text = this.loadMessage("date");
        await  this.sendImage("date")
        await  this.sendTextButtons(text,{
            "date_grande": "Ариана Гранде",
            "date_robbie": "Марго Робби",
            "date_zendaya": "Зендея",
            "date_gosling": "Райан Гослинг",
            "date_hardy": "Том Харди",
        })
    }
    async dateButton(callbakQuery) {
        const query = callbakQuery.data;
        await this.sendImage(query)
        await  this.sendText("Отличный выбор, пригласи девушку за 5 сообщений")
        const promt=this.loadPrompt(query)
        chatgpt.setPrompt(promt)

    }
    async dateDialog(msg) {
        const text = msg.text;
        const  myMessage = await this.sendText("Девушка набирает сообщение...")
        const  answer = await chatgpt.addMessage(text)
        await  this.editText(myMessage,answer)
    }
    async message(msg) {
        this.mode="message";
        const text = this.loadMessage("message");
        await  this.sendImage("message")
        await  this.sendTextButtons(text,{
            "message_next": "Следующее сообщение",
            "message_date": "Пригласить на свидание",
        })
    }
    async messageButton(callbakQuery) {
        const query = callbakQuery.data;
        const promt = this.loadPrompt(query)
        const userChatHistory = this.list.join("\n\n")
        const  myMessage = await this.sendText("чат GPT думает над ответом")
        const  answer = await chatgpt.sendQuestion(promt,userChatHistory)
        await  this.editText(myMessage,answer)

    }
    async messageDialog(msg) {
        const text = msg.text;
        this.list.push(text)

    }
   async hello(msg){
        if (this.mode === "gpt") {
            await this.gptDialog(msg);
        }else if (this.mode === "date") {
           await this.dateDialog(msg);
        }else if (this.mode === "message") {
            await this.messageDialog(msg);
        }else {
           const text = msg.text;
           await this.sendText("<b>Hello !</b>")
           await this.sendText("Hello World!" + text)
           await this.sendImage("avatar_main")
           await this.sendTextButtons("Какая у вас тема в Телеграмм", {
               "theme_light": "Светлая",
               "theme_dark": "Темная",

           })
       }
   }

   async helloButton(callbakQuery){
        const query = callbakQuery.data;
        if (query === "theme_light")
            await this.sendText("Светлая тема")
       else  if (query === "theme_dark")
            await this.sendText("Темная тема")
   }

}
const  chatgpt = new ChatGptService("60Et7Jza9bA4ePGiBCDOJFkblB3TLxR3EqTzYJuFUFITcRHp");
const bot = new MyTelegramBot("7399956767:AAHVAfzBjCCXwXK5e-6uT_l5_v4JoRpSWSE");
bot.onCommand(/\/start/,bot.srart)
bot.onCommand(/\/html/,bot.html)
bot.onCommand(/\/gpt/,bot.gpt)
bot.onCommand(/\/date/,bot.date)
bot.onCommand(/\/message/,bot.message)
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^date_.*/,bot.dateButton)
bot.onButtonCallback(/^message_.*/,bot.messageButton)
bot.onButtonCallback(/^.*/,bot.helloButton)