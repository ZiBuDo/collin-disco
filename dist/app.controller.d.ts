import { Response } from "express";
export declare class AppController {
    private songsDir;
    private files;
    private current;
    private count;
    constructor();
    getTune(res: Response): void;
    private getNewSong;
}
