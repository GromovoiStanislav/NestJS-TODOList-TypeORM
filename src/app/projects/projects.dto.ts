import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class StoreProjectsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty()
  name: string;
}

export class UpdateProjectsDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional()
  name?: string;
}
