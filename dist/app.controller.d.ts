import { Response } from "express";
export declare class AppController {
    private songsDir;
    private files;
    private current;
    private previous;
    private timeleft;
    constructor();
    private tick;
    getTune(res: Response): Promise<void>;
    getDuration(): number;
    private getSong;
    private getNewSong;
}
