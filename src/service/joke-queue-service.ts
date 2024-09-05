import { Injectable } from '@angular/core';
import { JokeDto } from '../model/JokeDto';
import { QueueService } from './queue-service';

@Injectable({
  providedIn: 'root',
})
export class JokeQueueService extends QueueService<JokeDto> {
  updateJoke(item: JokeDto): void {
    this.queue.forEach((currentItem, index) => {
      if (currentItem.id === item.id) {
        this.queue[index] = item;
      }
    });
  }
}