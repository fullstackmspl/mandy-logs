"use strict";
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

    // const combileToString = function(param,parent){
    // if(parent)
    // }
    const logContainer = (param) => {
        const self = this
        return {
            info: function () {
                logger.info(param ? `${param}:${ arguments[0]}`:arguments[0]);
                return self;
            },
            error: function () {
                logger.info(param ? `${param}:${ arguments[0]}`:arguments[0]);
                return self;
            },
            warn: function () {
                logger.info(param ? `${param}:${ arguments[0]}`:arguments[0]);
                return self;
            },
            finsih: function () {
                const date = new Date()
                const takenTime = (this.startTime / new Date()) / 1000
                logger.info(`${param}, delay=${takenTime} seconds(s) , time=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
                return self;
            },
            close: function () {
                logger.warn("log has been closed.")
                logger.end()
            },
            addLogger :addNewLogger,
        }
    }
    logger.run = function (param) {
        const newLogger = logContainer(param);
        newLogger.startTime = new Date();
        return newLogger
    }

    return logger
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
const lo = moduler(options).run("name");
lo.finsih()


module.exports = moduler
