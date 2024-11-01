#!/usr/bin/env node
'use strict'

import chalk from 'chalk'
import boxen from 'boxen'
import clear from 'clear'
import inquirer from 'inquirer'
import Enquirer from 'enquirer'
import open from 'open'
import terminalImage from 'terminal-image';
import term from 'terminal-kit';
import got from 'got';
import playSound from 'play-sound'
import {username} from 'username';
import fetch from 'node-fetch';
import clipboardy from "clipboardy";
import bluebird from "bluebird";

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';

// clear the terminal before showing the npx card ==========================================================================

clear()

// =========================================================================================================================

let user;
try {
    user = await username();
} catch (err) {
    console.log(err)
}

// =========================================================================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let resumePath = "./assets/resume.png"
let resumeFile = path.resolve(__dirname, `${resumePath}`)
const resume = await got ("https://github.com/derrickchen03/resume/blob/main/resume.png?raw=true").buffer();



// const poemFetch = await fetch('https://raw.githubusercontent.com/s-alad/sa1ad/main/poem.txt');
// const poemText = await poemFetch.text();

// const alphaAudio = await fetch('https://raw.githubusercontent.com/s-alad/sa1ad/main/assets/alpha.mp3');

// =========================================================================================================================
process.stdin.resume();
function exitHandler() {
    process.exit();
}
process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
// =========================================================================================================================

const data = {
    name: chalk.bold.green('@derrick'),
    github: chalk.hex('#787878')('derrickchen03'),
    npx: chalk.hex('#787878')('npx derrick'),
    email: chalk.hex('#787878')('derrick.chen03@gmail.com'),

    labelGitHub: chalk.hex('#9E9E9E').bold('git:'),
    labelEmail: chalk.hex('#9E9E9E').bold('eml:'),
    labelCard: chalk.hex('#9E9E9E').bold('npm:')
};

const card = boxen(
    [
        `${data.name}`,
        ``,
        `${data.labelGitHub} ${data.github}`,
        `${data.labelCard} ${data.npx}`,
        `${data.labelEmail} ${data.email}`,
        ``,
    ].join("\n"),
    {
        margin: 0,
        padding: { top: 1, bottom: 1, right: 2, left: 2 },
        borderStyle: "double",
        borderColor: "white"
    }
);


console.log(card);
console.log()
// =========================================================================================================================

async function OpenInBrowser() {
    let x = await Enquirer.prompt({
        type: "toggle",
        name: "browser",
        message: "Opening in browser, continue?\n",
        default: true
    });

    if (x.browser === false) {
        return;
    }
    
    console.log("Opening...")
    await open('mailto:derrick.chen03@gmail.com?body=To%20Derrick,%0A%0A', {wait: false});
    bluebird.delay(3000)
    console.log("Opened!")
    console.log("If that did not work, please retry with clipboard.")
}

async function CopyToClipboard() {
    let y = await Enquirer.prompt({
        type: "toggle",
        name: "clipboard",
        message: "Copying to clipboard, continue?\n",
        default: true
    });

    if (y.clipboard === false) {
        return;
    }

    console.log("Copying...");
    clipboardy.writeSync("derrick.chen03@gmail.com");
    bluebird.delay(3000)
    console.log("Copied!");
}

async function emailHandler(s) {
    if (s === "- exit") {
        return;
    }

    if (s === "browser") {
        await OpenInBrowser();
    } 

    else if (s === "clipboard") {
        await CopyToClipboard();
    }
}



// =========================================================================================================================

const options = {
    type: "list",
    name: 'actions',
    message: 'select action',
    choices: [
        {name: "| Resume", value: async () => {console.log("resume");}},
        {name: "| Github", value: async () => {console.log("github");}},
        {name: "| Website", value: async () => {console.log("website");}},
        {name: "| Email Me?", value: async () => {
            const emailAnswer = await inquirer.prompt(eOptions);
            await emailHandler(emailAnswer.emailActions);
        }},
        '- exit'
    ]
};

const eOptions = {
    type: "list",
    name: 'emailActions',
    message: 'select action',
    choices: [
        {name: "| Open in Browser", value: "browser"},
        {name: "| Copy to Clipboard", value: "clipboard"},
        "- exit"
    ]
};

// =========================================================================================================================

function main() {
    inquirer.prompt(options).then(async answer => {
        if (answer.actions == "- exit") {
            return;
        } 
        else {
            console.log('-'.repeat(40))
            await answer.actions();
            console.log('-'.repeat(40))

            await Enquirer.prompt({
                type: "toggle",
                name: "again",
                message: "exit?",
                default: false
            }).then(answer => {
                if (answer.again == false) {
                    main();
                }
            });
        }
    });
}

main();