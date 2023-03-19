#!/usr/bin/env node
import { cac } from 'cac';
import { resolve } from 'node:path';
import { cwd, exit, env } from 'node:process';
import { pathToFileURL } from 'node:url';
import { emptyDir, pathExists } from 'fs-extra';
import * as f from 'esbuild';
import u from 'fast-glob';
import p from 'lodash.foreach';
import D from 'lodash.map';
import { config } from 'dotenv';
import L from 'node-fetch';
import v from 'ora';
import c from 'ansi-styles';

function w(e="Deploying your files..."){return v({text:e,indent:1})}var _=[{level:"info",color:"cyanBright",prefix:"[INFO]"},{level:"log",color:"greenBright",prefix:"[SUCCESS]"},{level:"warn",color:"yellow",prefix:"[WARNING]"},{level:"error",color:"redBright",prefix:"[ERROR]"}],C=process.argv.slice(2).filter(e=>e==="--debug"),n={_log:function(e,r="info"){let o=_.find(s=>s.level===r);o&&C?console[r](c[o.color].open,o.prefix,e,c[o.color].close):(o==null?void 0:o.level)==="error"&&console[r](c[o.color].open,o.prefix,e,c[o.color].close);},spinner:w};var{_log:i,spinner:O}=n,a=O(),m={};async function T(e){if(e.length)try{i("Processing: "+e),await f.build({entryPoints:[e],allowOverwrite:!0,target:"node16",format:"esm",bundle:!0,minify:!0,outdir:"build",write:!0,packages:"external"});}catch(r){i(r.message,"error");}else throw new TypeError("filePath must be Valid.")}async function N(){let e=await u("build/**/*.js",{absolute:!0,ignore:["node_modules"]}),r=await Promise.all(D(e,async o=>{let s=await import(pathToFileURL(o).href).then(t=>t.default);if(s.data)return s.data.toJSON();if(s.name)return s}));return R(r),r}async function R(e){let r=m.test&&"GUILD_TEST_ID"in env?env.GUILD_TEST_ID:env.GUILD_ID,o=env.BOT_TOKEN;if(r!=null&&r.length&&e.length&&(o!=null&&o.length))try{a.start();let s=await L(`https://discord.com/api/v10/applications/${env.CLIENT_ID}/guilds/${r}/commands`,{method:"PUT",headers:{Authorization:`Bot ${o}`,"Content-Type":"application/json"},body:JSON.stringify(e)}).then(t=>(t.status===200,t.json()));if(Array.isArray(s))p(s,t=>a.succeed("Deployed: /"+t.name)),a.stop(),exit(0);else if(s.retry_after)a.warn(`RATE_LIMIT_EXCEDED (https://discord.com/developers/docs/topics/rate-limits#rate-limits)
Try again in ${Math.floor(s.retry_after)} second(s).`);else if(s.errors){a.stop();let t=s.errors;p(Object.keys(t),b=>{p(t[b]._errors,E=>i(E.message,"error"));});}else i("REQUEST_FAILED","error");}catch(s){a.stop(),i("FATAL: "+s,"error");}else return i('PLease verify your env file, and if "commands" directory exists anywhere in your project with valid commands files',"error"),!1}async function P(){let e=u.stream("**/commands/**/*.{js,cjs,mjs,ts}",{cwd:m.cwd,absolute:!0,ignore:["node_modules"]});e.on("readable",async()=>{e.pause(),await T(e.read().toString()),e.resume();}),e.on("error",r=>i(r,"error")),e.on("end",N);}async function y(e){if(e&&e.cwd&&await pathExists(e.cwd))config({path:resolve(e.cwd,".env"),debug:e.debug}).error?i("PLease verify your .env file.","error"):(m=Object.assign(e,m),await P());else throw i("Please verify cwd.","error"),new TypeError("Options is required.")}var h="2.0.1";var d=cac("discord_deploy");d.command("deploy").option("--debug, -d","run in debug mode.",{default:!1}).option("cwd <dir>","Absolute directory to search for.",{default:cwd()}).option("--test","Enables test mode.",{default:!1}).action(y);d.command("clear","clear esbuild cache.").action(async()=>{try{(await emptyDir("build")).length?n._log("Cleaned successfully.","log"):n._log("Already Cleaned."),exit(0);}catch(e){n._log(e.message,"error"),exit(1);}});d.help();d.version(h);d.parse();
