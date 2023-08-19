import bcrypt from 'bcrypt'
import { parse, stringify } from 'envfile'
import fs from 'fs'

const saltRounds = 21
const saltAdding = await bcrypt.genSalt(saltRounds)

const pathToEnvFile = '.env'

fs.readFile(pathToEnvFile, 'utf8', function (err, data) {
  if (err) {
      return console.log(err)
  }
  // this grabs the entire .env file
  const result = parse(data) 
  // this adds a new key to the .env file
  result.SALT_ADD = `${saltAdding}`
  console.log(result)
  
  fs.writeFile(pathToEnvFile, stringify(result), function (err) {
      if (err) {
          return console.log(err)
      }
      // Can be commented or deleted
      console.log("File Saved") 
  })

})
