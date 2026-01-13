import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { BullModule } from '@nestjs/bullmq';
import { VideoProcessor } from './video.worker';
import { VideoQueueEventListener } from './video-queue.events';

@Module({
  imports: [BullModule.registerQueue({ name: 'video' })],
  controllers: [VideoController],
  providers: [VideoProcessor, VideoQueueEventListener]
})
export class VideoModule {}
