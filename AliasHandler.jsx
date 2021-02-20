const fs = require('fs')
const path = require('path')
const aliasPath = path.join(__dirname, 'aliases.json')

class AliasHandler {
    constructor() {this.initAliases()}
    initAliases = () => {if (!fs.existsSync(aliasPath)) fs.writeFileSync(aliasPath, JSON.stringify({}, null, '\t'))}
    getAliases = () => {
	    this.initAliases()
	    return JSON.parse(fs.readFileSync(aliasPath))
    }
    getAlias = (aliasName) => {
	    let alias
	    try {alias = this.getAliases()[aliasName]}
        catch {return null}
	    return alias
    }
    setAlias = (number,alias) => {
	    this.initAliases()
	    let aliases
	    try {aliases = this.getAliases()}
        catch {return}
	    aliases[alias] = number
	    fs.writeFileSync(aliasPath, JSON.stringify(aliases, null, '\t'))
    }
    deleteAlias = (aliasName) => {
        this.initAliases()
        let aliases
	    try {aliases = this.getAliases()}
        catch {return}
        if(this.getAlias(aliasName))delete aliases[aliasName]
        fs.writeFileSync(aliasPath, JSON.stringify(aliases, null, '\t'))
    }
}

module.exports = AliasHandler
