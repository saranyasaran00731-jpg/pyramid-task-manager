import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('api/tasks')
export class AppController {
  private tasks: any[] = [];

  @Get()
  getTasks() {
    return this.tasks;
  }

  @Post()
  createTask(@Body() task: any) {
    const newTask = {
      id: Date.now(),
      ...task,
    };

    this.tasks.push(newTask);

    return newTask;
  }
}