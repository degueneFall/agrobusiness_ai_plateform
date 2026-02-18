import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { Region } from '../modules/system-admin/entities/region.entity';
import { Zone } from '../modules/system-admin/entities/zone.entity';
import { Seed, CropType, WaterRequirement } from '../modules/seeds/entities/seed.entity';
import { AiModel, AiModelType } from '../modules/ai-admin/entities/ai-model.entity';
import { Plot, SoilType } from '../modules/plots/entities/plot.entity';
import { Notification, NotificationType, NotificationPriority } from '../modules/notifications/entities/notification.entity';
import { AiRecommendation, RecommendationType } from '../modules/ai-compatibility/entities/ai-recommendation.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    console.log('🌱 Starting seeding...');

    // 1. Regions
    const regionRepo = dataSource.getRepository(Region);
    const regions = [
        { name: 'Dakar', country: 'Sénégal' },
        { name: 'Thiès', country: 'Sénégal' },
        { name: 'Saint-Louis', country: 'Sénégal' },
        { name: 'Kaolack', country: 'Sénégal' },
        { name: 'Ziguinchor', country: 'Sénégal' },
    ];

    for (const regionData of regions) {
        const exists = await regionRepo.findOneBy({ name: regionData.name });
        if (!exists) {
            await regionRepo.save(regionRepo.create(regionData));
            console.log(`Region ${regionData.name} created`);
        }
    }

    // 2. Admin & Agronomist Users
    const userRepo = dataSource.getRepository(User);
    const adminEmail = 'admin@agriai.sn';
    let adminUser = await userRepo.findOneBy({ email: adminEmail });
    if (!adminUser) {
        const passwordHash = await bcrypt.hash('Admin@123', 10);
        adminUser = userRepo.create({
            email: adminEmail,
            passwordHash,
            firstName: 'Admin',
            lastName: 'System',
            role: UserRole.SUPER_ADMIN,
            // isVerified: true, // Removed from entity
        });
        await userRepo.save(adminUser);
        console.log('Admin user created');
    }

    const agronomeEmail = 'agronome@agriai.sn';
    let agronomeUser = await userRepo.findOneBy({ email: agronomeEmail });
    if (!agronomeUser) {
        const passwordHash = await bcrypt.hash('Agronome@123', 10);
        agronomeUser = userRepo.create({
            email: agronomeEmail,
            passwordHash,
            firstName: 'Agronome',
            lastName: 'Demo',
            role: UserRole.AGRONOMIST,
            // isVerified: true, // Removed from entity
        });
        await userRepo.save(agronomeUser);
        console.log('Agronomist user created');
    }

    const adminId = adminUser.id;
    const dakar = await regionRepo.findOneBy({ name: 'Dakar' });
    const thies = await regionRepo.findOneBy({ name: 'Thiès' });

    // 1b. Zones (New requirement as Plots link to Zones)
    const zoneRepo = dataSource.getRepository(Zone);
    let dakarZone = await zoneRepo.findOneBy({ nomZone: 'Zone Dakar Nord' });
    if (dakar && !dakarZone) {
        dakarZone = zoneRepo.create({ nomZone: 'Zone Dakar Nord', idRegion: dakar.id, typeZone: 'agricole' });
        await zoneRepo.save(dakarZone);
        console.log('Zone Dakar Nord created');
    }
    let thiesZone = await zoneRepo.findOneBy({ nomZone: 'Zone Thiès Ouest' });
    if (thies && !thiesZone) {
        thiesZone = zoneRepo.create({ nomZone: 'Zone Thiès Ouest', idRegion: thies.id, typeZone: 'maraicher' });
        await zoneRepo.save(thiesZone);
        console.log('Zone Thiès Ouest created');
    }

    // Plots for admin
    const plotRepo = dataSource.getRepository(Plot);
    const plotCount = await plotRepo.count({ where: { userId: adminId } });
    if (plotCount === 0 && dakarZone && thiesZone) {
        const plotsData = [
            { name: 'Parcelle A-102 (Maïs)', areaHectares: 15.4, regionId: dakarZone.id }, // Using regionId to hold zoneId as we might have mapped it or just use zone property if possible, but create expects object. 
            // Wait, Plot entity has 'regionId' property mapped to 'id_zone' column. So passing regionId here effectively sets id_zone. 
            // But we should be careful. 'regionId' in Plot entity (line 28) maps to 'id_zone'. 
            // So if we pass dakarZone.id to regionId property, it will work.
            { name: 'Vignoble Nord B-205', areaHectares: 8.2, regionId: thiesZone.id },
            { name: 'Verger Sud C-301', areaHectares: 22.1, regionId: dakarZone.id },
        ];
        // Removed: soilType, soilPh, ndviScore (not in DB)
        for (const p of plotsData) {
            await plotRepo.save(plotRepo.create({ ...p, userId: adminId }));
        }
        console.log('Plots created');
    }

    const seedRepo = dataSource.getRepository(Seed);

    // Notifications for admin
    const notifRepo = dataSource.getRepository(Notification);
    const notifCount = await notifRepo.count({ where: { userId: adminId } });
    if (notifCount === 0) {
        const notifs = [
            { type: NotificationType.IRRIGATION, title: 'Alerte Irrigation : Champ 42', message: "L'analyse IA indique une chute critique d'humidité en Zone C. Automatisation activée (Secteur 4-8).", priority: NotificationPriority.HIGH },
            { type: NotificationType.ALERT, title: 'Anomalie de Ravageurs Détectée', message: 'La reconnaissance par drone identifie un risque de grappes de pucerons dans les parcelles de blé Nord-Est.', priority: NotificationPriority.MEDIUM },
            { type: NotificationType.RECOMMENDATION, title: 'Sync. Santé des Sols Quotidienne', message: 'Ingestion des données satellites terminée. Moyenne NDVI stable à 0.72 (+0.01 vs hier).', priority: NotificationPriority.LOW },
        ];
        for (const n of notifs) {
            await notifRepo.save(notifRepo.create({ ...n, userId: adminId }));
        }
        console.log('Notifications created');
    }

    // AI Recommendations (plot + seed)
    const recRepo = dataSource.getRepository(AiRecommendation);
    const recCount = await recRepo.count();
    if (recCount === 0) {
        const plots = await plotRepo.find({ where: { userId: adminId }, take: 3 });
        const seeds = await seedRepo.find({ take: 4 });
        if (plots.length && seeds.length) {
            await recRepo.save(recRepo.create({
                plotId: plots[0].id,
                seedId: seeds[0].id,
                compatibilityScore: 88,
                recommendationType: RecommendationType.OPTIMAL,
                expectedYield: 14.2,
                confidenceLevel: 0.88,
                modelVersion: 'v2.4',
            }));
            await recRepo.save(recRepo.create({
                plotId: plots[0].id,
                seedId: seeds[1].id,
                compatibilityScore: 72,
                recommendationType: RecommendationType.SUITABLE,
                expectedYield: 9.5,
                confidenceLevel: 0.85,
                modelVersion: 'v2.4',
            }));
            console.log('AI Recommendations created');
        }
    }

    // 3. Seeds
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
