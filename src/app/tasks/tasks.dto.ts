import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class StoreTasksDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsIn([0, 1])
  @ApiPropertyOptional()
  done?: number;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  projectId: string;
}

export class UpdateTasksDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsIn([0, 1])
  @ApiPropertyOptional()
  done?: number;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  projectId?: string;
}
