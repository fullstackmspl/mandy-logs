"use strict";
const winston = require("winston");
const moduler = function (options = {}) {

     return function(ctx){
        if (!typeof options === "object") {
            throw new Error("Logger arguments must be an object.");
        }
        const transports = [];
    
    
    
        if ("transport" in options) {
            transports.push(new winston.transports.File({
                level: options.transport.level ?? "debug",
                filename: options.transport.filename,
                format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), winston.format.json()),
                maxSize: options.transport.maxSize ?? 5000000,
                maxFile: options.transport.maxFile ?? 5,
                handleExceptions: true,
            }))
        }
    
        if ("console" in options) {
            transports.push(
                new winston.transports.Console({
                    level: options.console.level ?? "info",
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.ms(),
                        winston.format.simple(),
                    ),
                    handleExceptions: true,
                })
            )
        }
        if ("http" in options) {
            transports.push(new winston.transports.Http({
                level: options.http.level ?? "warn",
                format: winston.format.combine(
                    winston.format.colorize(),
                    // winston.format.simple(),
                    winston.format.json(),
                    winston.format.simple()
                )
            }))
        }
    
        const logger = winston.createLogger({
            exitOnError: false,
            level: options.level ?? "debug",
            transports,
        });
    
    
        const addNewLogger = function (options) {
            if (!typeof options === "object") {
                throw new SyntaxError("add logger argument must an object")
            }
            winston.add(new winston.transports[`${options.type}`]({
                level: options.level,
                format: winston.format.combine(winston.format.simple(), winston.format.json())
            }))
        };
    
    
        logger.on("finish", function () {
            logger.info("Logs ended.")
        });
    
        const logContainer = (param) => {
            const self = this
            return {
                logs: function () {
                    logger.info(arguments[0])
                },
                info: function () {
                    logger.info(ctx ? `${ctx}:${arguments[0]}` : arguments[0]);
                     return self
                },
                error: function () {
                    logger.error(ctx ? `${ctx}:${arguments[0]}` : arguments[0]);
                },
                warn: function () {
                    logger.warn(param ? `${param}:${arguments[0]}` : arguments[0]);
                },
                finish: function () {
                    const date = new Date()
                    const takenTime = (this.startTime / new Date()) / 1000
                    logger.info(`${param}, delay=${takenTime} seconds(s) , time=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
                },
                close: function () {
                    logger.warn("log has been closed.")
                    logger.end()
                },
                addLogger: addNewLogger,
            }
        }
         const logg = logContainer()
         logg.run = function (param) {
            const newLogger = logContainer(param);
            newLogger.startTime = new Date();
            return newLogger
        }
    
        return logg
     }
    
}


const options = {
    transport: {
        level: "debug",
        filename: "./log.json",
        handleExceptions: true,
    },
    console: {
        level: "debug",
    }
}
const lo = moduler(options)();
// lo.warn("subb");
// console.log(lo.info("subb"))

const lp=lo.run("this is my console");
lp.finsih()
module.exports = moduler
