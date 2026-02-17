import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { SoilType, PlotStatus } from '../entities/plot.entity';

export class CreatePlotDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  areaHectares: number;

  @IsOptional()
  @IsNumber()
  regionId?: number;

  @IsOptional()
  coordinates?: any;

  @IsOptional()
  @IsEnum(SoilType)
  soilType?: SoilType;

  @IsOptional()
  @IsNumber()
  soilPh?: number;

  @IsOptional()
  @IsNumber()
  ndviScore?: number;

  @IsOptional()
  @IsEnum(PlotStatus)
  status?: PlotStatus;
}
