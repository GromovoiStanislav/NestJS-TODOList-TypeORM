import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class StoreProjectsDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty()
  name: string;
}

export class UpdateProjectsDto {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiPropertyOptional()
  name: string;
}
