"use strict";
const fs = requiire("fs")
const winston = require("winston");
const moduler = function (options = {}) {

    if (!typeof options === "object") {
        throw new Error("Logger arguments must be an object.");
    }
    const transports = [];

    const streamFormat = winston.format.printf((info) => {
        return `${info.level} ${info.message}`
    });

    if ("transport" in options) {
        transports.push(new winston.transports.File({
            level: options.transport.level ?? "debug",
            filename: options.transport.filename,
            format: winston.format.combine(winston.format.timestamp(), winston.format.ms(),winston.format.json()),
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

  
    const logContainer = (param, parent) => {
        const child = parent && parent.child ? `${parent.child}:${param}` : param;
const self = this
        return {
            child: child,
            info: function () {
                logger.info(arguments[0]);
                return logContainer()
            },
            error: function () {
                logger.error(arguments[0]);
                return logContainer()
            },
            warn: function () {
                logger.error(arguments[0]);
                return logContainer()

            },
            finsih: function () {
                const date =new Date()
                const takenTime = (this.startTime / new Date()) / 1000
                logger.info(`delay=${takenTime} seconds(s) , time =${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
                 return self;
            } ,
            close:function(){
                logger.warn("log has been closed.")
                logger.end()
            }
        }
    }
    logger.run = function (param) {
        const newLogger = logContainer(param, logger);
        newLogger.startTime = new Date();
        return newLogger
    }
 
    return logger
}


//module.exports = moduler
 const options={
    transport:{
        level:"debug",
        filename:"./log.json",
        handleExceptions:true,
    },
     console:{
        level:"debug",
     }
 }
const lo =moduler(options).info("name");
lo.warn("warning");
lo.close();
lo.info("ok")