const jsonfile = require('jsonfile')
const moment = require('moment')
const SimpleGit = require('simple-git')
const random = require('random')

const FILE_PATH = './data.json'
const makeCommit = n => {
    if(n === 0){
        return SimpleGit().push()
    }
    const x = random.int(0,54)
    const y = random.int(0,6)
    const Date = moment().subtract(1,'y').add(1,'d').add(x,'w').add(y,'d').format()
    console.log(Date)
    const data = {
        date: Date
    }
    jsonfile.writeFile(FILE_PATH,data, () => {
        SimpleGit().add(FILE_PATH).commit(Date,{'--date': Date},makeCommit.bind(this, --n))
    })
}
makeCommit(2000)