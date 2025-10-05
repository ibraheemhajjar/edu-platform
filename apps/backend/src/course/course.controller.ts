import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto, CourseIdDto } from './course.dto';
import { StudentIdDto } from '../student/student.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('sync')
  syncToMedusa() {
    return this.courseService.syncToMedusa();
  }

  @Get(':id')
  findOne(@Param() params: CourseIdDto) {
    return this.courseService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: CourseIdDto, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(params.id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param() params: StudentIdDto) {
    return this.courseService.remove(params.id);
  }
}
