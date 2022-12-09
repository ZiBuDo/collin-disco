"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let AppController = class AppController {
    constructor() {
        this.songsDir = (0, path_1.resolve)(process.env.SONGS_DIR);
        this.count = 0;
        this.files = (0, fs_1.readdirSync)(this.songsDir, { withFileTypes: true }).filter(f => f.isFile()).map(f => f.name).filter(n => n !== "instructions.txt");
    }
    getTune(res) {
        if (this.count == 0 || this.count == 2) {
            this.current = this.getNewSong();
            this.count = 0;
        }
        this.count = this.count + 1;
        console.log("SENDING", (0, path_1.join)(this.songsDir, this.current), this.count);
        return res.sendFile((0, path_1.join)(this.songsDir, this.current));
    }
    getNewSong() {
        let newSong = this.files[Math.floor(Math.random() * this.files.length)];
        while (newSong === this.current) {
            newSong = this.files[Math.floor(Math.random() * this.files.length)];
        }
        return newSong;
    }
};
__decorate([
    (0, common_1.Get)("tune.mp3"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getTune", null);
AppController = __decorate([
    (0, common_1.Controller)(""),
    __metadata("design:paramtypes", [])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map