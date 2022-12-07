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
        transports.push(new winston.transport.File({
            level: options.transport.level ?? "debug",
            filename: options.transport.filename,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            maxSize: options.transport.maxSize ?? 5000000,
            maxFile: options.transport.maxFile ?? 5,
            handleExceptions: true,
        }))
    }

    if ("console" in options) {
        transports.push(
            new winston.transport.Console({
                level: options.console.level ?? "debug",
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.ms(),
                    winston.format.simple(),
                    streamFormat,
                    winston.format.json(),),
                handleExceptions: true,
            })
        )
    }
    if ("http" in options) {
        transports.push(new winston.transports.Http({
            level: options.http.level ?? "warn",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                winston.format.json()
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
        winston.add(new winston.transport[`${options.type}`]({
            level: options.level,
            format: winston.format.combine(winston.format.simple(), winston.format.json())
        }))
    };


    logger.on("finish", function () {
        logger.info("Logs ended.")
    });

    const combineMessage = function (arg, parent) {
        // if (typeof arg === "string") {
        //     arg = parent ? `${parent}:${arg}` : arg
        // } else if (typeof arg === "object") {
        //     Array.unShift.apply(this, arg, parent)
        // }
        // return arg
    }
    const logContainer = (param, parent) => {
        const child = parent && parent.child ? `${parent.child}:${param}` : param;

        return {
            child: child,
            info: function () {
                logger.info(arguments[0])
            },
            error: function () {
                logger.error(arguments[0])
            },
            warn: function () {
                logger.error(arguments[0])
            },
            finsih: function () {
                const takenTime = (this.startTime / new Date()) / 1000
                logger.info(`delay=${takenTime} seconds(s)`)
            }
        }
    }
    logger.run = function (param) {
        const newLogger = logContainer(param, logger);
        newLogger.startTime = new Date();
    }
    return logger
}


module.exports = moduler
console.log(moduler())