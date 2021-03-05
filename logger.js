const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;
const date = new Date();
const fs = require('fs')

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

try {
    if (fs.existsSync("./logs")) {
      console.log("Logger directory exists")
    } else {
      console.log("Directory does not exist. Creating now...")
      fs.mkdir("./logs", function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Logger directory created! moving on...")
        }
      })
    }
  } catch(e) {
    console.log("An error occurred." + e)
  }

function getFullDate(){
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    let hours = date.getHours()
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let fullDate = day + "-" + month + "-" + year + "_" + hours + "-" + minutes + "-" + seconds
    return fullDate;
}

fs.rename('./logs/latest.log', "./logs/" + getFullDate() + ".log", function (error){
    if(error) console.log(error)
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: 'MerolBot' }),
    timestamp(),
    myFormat
  ),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: './logs/latest.log' }),
    new winston.transports.Console(),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;