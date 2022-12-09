import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { readdirSync } from "fs";
import getAudioDurationInSeconds from "get-audio-duration";
import { join, resolve } from "path";


@Controller("")
export class AppController {

    private songsDir: string = resolve(process.env.SONGS_DIR);
    private files: string[];
    private current: string;
    private timeleft: number = 0;

    constructor() {
        this.files = readdirSync(this.songsDir, { withFileTypes: true }).filter(f => f.isFile()).map(f => f.name).filter(n => n !== "instructions.txt");
        this.tick();
    }

    private tick(){
        setTimeout(() => {
            this.timeleft = this.timeleft - 1;
            this.tick();
        }, 1000);
    }

    @Get("tune.mp3")
    async getTune(@Res() res: Response) {
        const song = await this.getSong();
        console.log("SENDING", join(this.songsDir, song));
        res.sendFile(join(this.songsDir, song));
    }

    @Get("duration")
    getDuration(){
        return this.timeleft;
    }

    private async getSong(): Promise<string> {
        if(!this.current){
            this.current = await this.getNewSong();
        }
        return this.current;
    }

    private async getNewSong(): Promise<string>{
        let newSong = this.files[Math.floor(Math.random() * this.files.length)];
        while(newSong === this.current){
            newSong = this.files[Math.floor(Math.random() * this.files.length)];
        }
        const duration = await getAudioDurationInSeconds(join(this.songsDir, newSong));
        this.timeleft = duration;
        setTimeout(() => {
            this.current = null;
        }, (duration) * 1000);
        return newSong;
    }
}