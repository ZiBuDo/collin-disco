import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { readdirSync } from "fs";
import { join, resolve } from "path";


@Controller("")
export class AppController {

    private songsDir: string = resolve(process.env.SONGS_DIR);
    private files: string[];
    private current: string;
    private count: number = 0;

    constructor() {
        this.files = readdirSync(this.songsDir, { withFileTypes: true }).filter(f => f.isFile()).map(f => f.name).filter(n => n !== "instructions.txt");
    }

    @Get("tune.mp3")
    getTune(@Res() res: Response) {
        if(this.count == 0 || this.count == 2){
            this.current = this.getNewSong();
            this.count = 0;
        }
        this.count = this.count + 1;
        return res.sendFile(join(this.songsDir, this.current));
    }

    private getNewSong(){
        let newSong = this.files[Math.floor(Math.random() * this.files.length)];
        while(newSong === this.current){
            newSong = this.files[Math.floor(Math.random() * this.files.length)];
        }
        return newSong;
    }
}