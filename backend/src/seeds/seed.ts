import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { Region } from '../modules/system-admin/entities/region.entity';
import { Seed, CropType, WaterRequirement } from '../modules/seeds/entities/seed.entity';
import { AiModel, AiModelType } from '../modules/ai-admin/entities/ai-model.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    console.log('🌱 Starting seeding...');

    // 1. Regions
    const regionRepo = dataSource.getRepository(Region);
    const regions = [
        { name: 'Dakar', code: 'DK', country: 'Sénégal', climateZone: 'Sahélien', averageRainfall: 450.00 },
        { name: 'Thiès', code: 'TH', country: 'Sénégal', climateZone: 'Sahélien', averageRainfall: 500.00 },
        { name: 'Saint-Louis', 'code': 'SL', country: 'Sénégal', climateZone: 'Sahélien', averageRainfall: 350.00 },
        { name: 'Kaolack', code: 'KL', country: 'Sénégal', climateZone: 'Soudano-Sahélien', averageRainfall: 600.00 },
        { name: 'Ziguinchor', code: 'ZG', country: 'Sénégal', climateZone: 'Soudano-Guinéen', averageRainfall: 1200.00 },
    ];

    for (const regionData of regions) {
        const exists = await regionRepo.findOneBy({ code: regionData.code });
        if (!exists) {
            await regionRepo.save(regionRepo.create(regionData));
            console.log(`Region ${regionData.name} created`);
        }
    }

    // 2. Admin User
    const userRepo = dataSource.getRepository(User);
    const adminEmail = 'admin@agriai.sn';
    const adminExists = await userRepo.findOneBy({ email: adminEmail });

    if (!adminExists) {
        const passwordHash = await bcrypt.hash('Admin@123', 10);
        const adminUser = userRepo.create({
            email: adminEmail,
            passwordHash,
            firstName: 'Admin',
            lastName: 'System',
            role: UserRole.SUPER_ADMIN,
            isVerified: true,
        });
        await userRepo.save(adminUser);
        console.log('Admin user created');
    }

    // 3. Seeds
    const seedRepo = dataSource.getRepository(Seed);
    const seedsData = [
        {
            name: 'Z-45 Ultra Power',
            varietyCode: 'Z45-UP',
            cropType: CropType.CORN,
            description: 'Maïs hybride haute performance avec résistance à la sécheresse',
            yieldPotential: 14.20,
            growthCycleDays: 110,
            waterRequirement: WaterRequirement.MEDIUM,
            optimalSoilType: 'clay',
            optimalPhMin: 6.0,
            optimalPhMax: 7.5,
            droughtResistant: true,
            nitrogenEfficient: true,
            pricePerKg: 12500,
            supplier: 'AgroTech Seeds',
            isActive: true,
        },
        {
            name: 'Amber Wave X',
            varietyCode: 'AWX-01',
            cropType: CropType.WHEAT,
            description: 'Blé tendre hivernal à haute teneur en protéines',
            yieldPotential: 9.50,
            growthCycleDays: 240,
            waterRequirement: WaterRequirement.MEDIUM,
            optimalSoilType: 'loamy',
            optimalPhMin: 6.5,
            optimalPhMax: 7.5,
            droughtResistant: false,
            nitrogenEfficient: false,
            pricePerKg: 8000,
            supplier: 'GrainMaster',
            isActive: true,
        },
        {
            name: 'GreenGold S-1',
            varietyCode: 'GGS1',
            cropType: CropType.SOYBEAN,
            description: 'Soja fixateur d\'azote avec haute teneur en huile',
            yieldPotential: 4.80,
            growthCycleDays: 135,
            waterRequirement: WaterRequirement.MEDIUM,
            optimalSoilType: 'loamy',
            optimalPhMin: 6.0,
            optimalPhMax: 7.0,
            droughtResistant: false,
            nitrogenEfficient: true,
            pricePerKg: 15000,
            supplier: 'BioSeeds Inc',
            isActive: true,
        },
        {
            name: 'Helios Sun-8',
            varietyCode: 'HS8',
            cropType: CropType.SUNFLOWER,
            description: 'Tournesol tolérant au Sclérotinia',
            yieldPotential: 3.20,
            growthCycleDays: 105,
            waterRequirement: WaterRequirement.LOW,
            optimalSoilType: 'sandy',
            optimalPhMin: 6.0,
            optimalPhMax: 7.5,
            droughtResistant: true,
            nitrogenEfficient: false,
            pricePerKg: 10000,
            supplier: 'SunCrop Ltd',
            isActive: true,
        }
    ];

    for (const seedData of seedsData) {
        const exists = await seedRepo.findOneBy({ varietyCode: seedData.varietyCode });
        if (!exists) {
            await seedRepo.save(seedRepo.create(seedData));
            console.log(`Seed ${seedData.name} created`);
        }
    }

    // 4. AI Model
    const aiModelRepo = dataSource.getRepository(AiModel);
    const modelVersion = 'v2.4';
    const modelExists = await aiModelRepo.findOneBy({ name: 'Seed Recommendation Engine', version: modelVersion });

    if (!modelExists) {
        await aiModelRepo.save(aiModelRepo.create({
            name: 'Seed Recommendation Engine',
            version: modelVersion,
            modelType: AiModelType.RECOMMENDATION,
            description: 'Modèle de recommandation de semences basé sur Random Forest',
            accuracy: 94.50,
            isActive: true,
            trainingDate: new Date(),
        }));
        console.log('AI Model created');
    }

    console.log('✅ Seeding complete!');
    await app.close();
}

bootstrap();
