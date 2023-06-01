import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class StoreTasksDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiPropertyOptional()
  done: number;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  projectId: string;
}

export class UpdateTasksDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiPropertyOptional()
  description: string;

  @IsOptional()
  @ApiPropertyOptional()
  done: number;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  @ApiPropertyOptional()
  projectId: string;
}
