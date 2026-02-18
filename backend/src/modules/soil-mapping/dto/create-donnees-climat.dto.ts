import { IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateDonneesClimatDto {
    @IsNumber()
    idZone: number;

    @IsOptional()
    @IsNumber()
    temperature?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    pluviometrie?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    humidite?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(24)
    ensoleillement?: number;

    @IsOptional()
    @IsNumber()
    idClimat?: number;

    @IsDateString()
    dateMesure: string;
}
