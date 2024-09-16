import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { AlbumRepository } from './repositories/album.repository';
import { AwsModule } from 'src/aws/aws.module';
import { FilesModule } from 'src/files/files.module';

@Module({
    imports:[TypeOrmModule.forFeature([Album]),AwsModule,FilesModule],
    controllers:[AlbumController],
    providers:[AlbumService, AlbumRepository],
})
export class AlbumModule {}
