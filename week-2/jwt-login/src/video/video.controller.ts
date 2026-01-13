import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bullmq';

@Controller('video')
export class VideoController {
    constructor(@InjectQueue('video') private readonly videoQueue: Queue) {}

    @Post('process')
    @UseInterceptors(FileInterceptor('file'))
    async processVideo(@UploadedFile() file: Express.Multer.File) {
        await this.videoQueue.add('process', {fileName: 'video-processing',file: file.buffer, fileType: 'mp4'}, {delay: 2000, priority: 2});
        return {
            message: 'Video processing is added to the queue'
        }
    }

    @Post('compress')
    @UseInterceptors(FileInterceptor('file'))
    async compressVideo(@UploadedFile() file: Express.Multer.File) {
        await this.videoQueue.add('compress', {fileName: 'video-compressing', file: file.buffer, fileType: 'mp5'}, {delay: 1000, priority: 1});
        return {
            message: 'Video compressing is added to the queue'
        }
    }
}
