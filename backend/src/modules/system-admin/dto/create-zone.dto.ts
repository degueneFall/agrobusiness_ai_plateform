import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateZoneDto {
    @IsString()
    nomZone: string;

    @IsNumber()
    idRegion: number;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    altitude?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    superficieHa?: number;

    @IsOptional()
    @IsString()
    typeZone?: string;
}
