import { IsNumber, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateDonneesSolDto {
    @IsNumber()
    idParcelle: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(14)
    ph?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    azote?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    phosphore?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    potassium?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    humidite?: number;

    @IsOptional()
    @IsNumber()
    idSol?: number;

    @IsDateString()
    dateMesure: string;
}
