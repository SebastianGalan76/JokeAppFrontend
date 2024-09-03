import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QueueService<T> {
  private queue: T[] = [];

  enqueue(item: T): void {
    this.queue.push(item);
  }

  enqueueAll(item: T[]){
    this.queue.push(...item);
  }

  dequeue(): T | undefined {
    return this.queue.shift();
  }

  peek(): T | undefined {
    return this.queue[0];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}