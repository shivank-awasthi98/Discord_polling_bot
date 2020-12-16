const Dicord = require('discord.js');


const client = new Dicord.Client();

client.once('ready',() => {
    console.log('Ready!');
});


client.login(process.env.serect_key)

poll_started_flag = false
valid_responce_flag = false
voted = []
active = []
arg_dict = {}

client.on('message',(message) => {
   

    
    
    
    
    //timeout function
   function  calculateResult(){
        for (const [key, value] of Object.entries(arg_dict)) {
            server_channel.send(`${key} got ${value} votes`)
            
        
          }
          server_channel.send("!reset")
    }
    





    //reset command
    if((message.content.startsWith("!reset")&& message.channel.type=="text" )){
        console.log("reset started")
        poll_started_flag = false
        voted = []
        active = []
        for (var member in arg_dict) delete arg_dict[member];
        console.log(poll_started_flag,voted,active,arg_dict)
    }








    //poll command
    if((message.content.startsWith("!poll")&& message.channel.type=="text" )){
        

        channel_id = message.member.voice.channel.id
        server_channel = message.channel
        
        
        
        
        args = message.content.slice("!".length).trim().split(' ');
        command = args.shift().toLowerCase();
        if (!args.length){
            message.channel.send("please provide options for the poll ")
            return 
        }

        message.channel.send("starting poll for currently active members of voice chat declaring result in 120 secs")
        poll_started_flag = !poll_started_flag
        
        //creating a dictionary for counting votes        
        for(game of args){
            arg_dict[game] = 0
        }

        //getting active session memvers * needs improvement *
        
        channel = client.channels.cache.get(channel_id)
        for (const [memberID, member] of channel.members){
            active.push(memberID)
            client.users.cache.get(memberID).send(`a poll has started please vote with your option ${Object.keys(arg_dict).map(function (key) {
                return "!" + key +"  "  }).join("")} `)
        }
        
        //starting timeout
          timer = setTimeout(function(){
              calculateResult()
            
            
        },30000)           
                                        
    }
    //annonymys polling on dms
    if((message.content.startsWith("!")&& message.channel.type == "dm")){
        
        user_id = message.channel.recipient.id
        //check to see if any active polls exists
        if(poll_started_flag){
            if(voted.includes(user_id)){
                message.channel.send("you already voted")
            }
            else{

            
            //creating seprate commands for each options
            for ( [key, value] of Object.entries(arg_dict)) {
                

                //check to see if voter actually voted
               
                                 
                    //assiginng vote
                    if((message.content.startsWith(`!${key}`) && active.includes(user_id))){
                        voted.push(user_id)
                        
                        arg_dict[key] = value+1
                        message.channel.send(`voted for ${key}`)
                        valid_responce_flag =  true
                    }

                    
                    

                    //check to see of the user is eligible to vote or not
                    
                }

                if(!valid_responce_flag){
                
                    message.channel.send(" Vote was not counted please choose a valid responce")
                }

                if(voted.length==active.length){
                    
                    clearTimeout(timer)
                    calculateResult()
                }
            }

        }
        else{
            message.channel.send("No active pole ")
        }             
    }
    
})
