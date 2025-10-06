import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto, StudentIdDto, EnrollmentDto } from './student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: StudentIdDto) {
    return this.studentService.findOne(params.id);
  }

  @Patch(':id')
  update(@Param() params: StudentIdDto, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(params.id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param() params: StudentIdDto) {
    return this.studentService.remove(params.id);
  }

  @Post('enroll')
  enroll(@Body() enrollmentDto: EnrollmentDto) {
    return this.studentService.enroll(enrollmentDto.studentId, enrollmentDto.courseId);
  }

  @Post('enroll-from-order')
  async enrollFromOrder(@Body() body: { studentId: string; courseIds: string[] }) {
    return this.studentService.enrollFromOrder(body.studentId, body.courseIds);
  }
}
