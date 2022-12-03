import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { readdirSync } from "fs";
import { join } from "path";


@Controller("")
export class AppController {

    private files: string[];
    private current: string;
    private count: number = 0;

    constructor() {
        this.files = readdirSync(join(process.cwd(), "public", "songs"), { withFileTypes: true }).filter(f => f.isFile()).map(f => f.name);
    }

    @Get("tune.mp3")
    getTune(@Res() res: Response) {
        if(this.count == 0 || this.count == 2){
            this.current = this.files[Math.floor(Math.random() * this.files.length)];
            this.count = 0;
        }
        this.count = this.count + 1;
        return res.sendFile(join(process.cwd(), "public", "songs", this.current));
    }
}