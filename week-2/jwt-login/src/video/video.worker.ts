import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('video', {concurrency: 2})
export class VideoProcessor extends WorkerHost{
    async process(job: Job){
        const totalSteps = 5;
        
        switch (job.name) {
            case 'compress':
                console.log('Started Compress Task');
                await this.runTaskWithProgress(job, totalSteps);
                break;
            
            case 'process':
                console.log('Started Process Task');
                await this.runTaskWithProgress(job, totalSteps);
                break;
                
            default:
                console.log(`Unknown job name ${job.name}`);
                break;    
        }
    }

    async runTaskWithProgress(job: Job, totalSteps: number){
        for (let step = 0; step < totalSteps; step++){
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const progress = Math.round((step / totalSteps) * 100);
            await job.updateProgress(progress);
        }
    }

    @OnWorkerEvent('active')
    onAdded(job: Job) {
        console.log(`Job Started : ${job.id}`);
    }

    @OnWorkerEvent('progress')
    onProgress(job: Job){
        console.log(`Job Progress: ${job.id} has completed ${job.progress}%`)
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        console.log(`Job Completed: ${job.id}`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job) {
        console.log(`Job Failed: ${job.id}`);
    }
}


