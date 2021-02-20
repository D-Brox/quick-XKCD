const { Plugin } = require('powercord/entities')
const { inject, uninject } = require('powercord/injector')
const { React, getModule, getModuleByDisplayName} = require('powercord/webpack')
const AliasHandler = new (require('./AliasHandler.jsx'))()


module.exports = class XKCD extends Plugin {
    async startPlugin () {
        powercord.api.commands.registerCommand({
            command: 'XKCD',
            alias: 'xkcd',
            description: 'Quick XKCD link',
            usage: '{c} [ args ]',
            executor: (args) => {
                let number=args[0]          
                if(isNaN(parseInt(args[0]))){
                    number = AliasHandler.getAlias(args[0].toLowerCase())
                    if(number === null){
                        return {
                            send: false,
                            result: "Please insert a number or a valid alias"
                        }
                    }
                }     
                return {
                    send: true,
                    result: 'https://xkcd.com/'+number+'/'
                }
            }
        })
        powercord.api.commands.registerCommand({
            command: 'XKCD.manage',
            alias: 'xkcd.manage',
            description: 'Manage your aliases',
            usage: '{c} [ args ]',
            executor: (args) => {             
                switch(args[0]){               
                    case 'add':
                        if(!args[1]) return {
                            send: false,
                            result: 'Please input a number and an alias'
                        }
                        AliasHandler.setAlias(args[1],args[2])
                        return {
                            send: false,
                            result: 'Alias **'+args[1]+' <- '+args[2].toLowerCase()+'** added'
                        }
                        break
                    case 'del':
                        let alias = AliasHandler.getAlias(args[1].toLowerCase())
                        if(alias===null)return {
                            send: false,
                            result: '```\nNot an alias.\n```'
                        }
                        AliasHandler.deleteAlias(args[1].toLowerCase())
                        return {
                            send: false,
                            result: 'Alias **'+args[1].toLowerCase()+'** deleted'
                        }
                        break
                    case 'list':
                        let aliases = AliasHandler.getAliases()
                        let out = ''
	                    for(let i = 0; i < Object.keys(aliases).length; i++) {	        
                            let alias = Object.keys(aliases)[i]
                            out+= '**'+alias+'**: '+aliases[alias]+'\n'
                        }
                        let result = {
                            type: 'rich',
                            title: 'List of aliases:',
                            description: out
                        };     
                        return {
                            send: false,
                            result
                        }
                        break
                }
            },
            autocomplete: (args) => {
			    if (args.length !== 1) {
				    return false;
			    }
                let options = {
                    list: 'Lists all XKCD link aliases saved',
                    add: 'Adds a XKCD link alias. Input number and alias.',
                    del: 'Deletes a XKCD link alias. Input alias.'
                }
			    return {
				    commands: Object.keys(options)
					    .filter((option) => option.includes(args[0].toLowerCase()))
					    .map((option) => ({
						    command: option,
						    description: options[option],
					    })),
				    header: 'Quick XKCD',
			    };
		    }
        }) 
    }
    
    pluginWillUnload () {
        powercord.api.commands.unregisterCommand('XKCD')
    }
}
