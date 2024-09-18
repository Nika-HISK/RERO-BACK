import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../entities/album.entity';
import { CreateAlbumDto } from '../dtos/create-album.dto';
import { UpdateAlbumDto } from '../dtos/update-album.dto';

@Injectable()
export class AlbumRepository {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
  ) {}

  async findAll(search?: string) {
    const queryBuilder = this.albumRepo
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.musics', 'music')
      .leftJoinAndSelect('album.artist', 'artist');
  
    if (search) {
      queryBuilder.where('album.name LIKE :search', { search: `%${search}%` });
    }
  
    const albums = await queryBuilder.getMany();
    return albums;
  }
  
  async findOne(id: number) {
    const album = await this.albumRepo
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.musics', 'music')
      .leftJoinAndSelect('album.artist', 'artist')
      .where('album.id = :id', { id })
      .getOne();
  
    return album;
  }

  delete(id: number) {
    return this.albumRepo.softDelete(id);
  }

  create(data: CreateAlbumDto) {
    const newAlbum = this.albumRepo.create(data);
    return this.albumRepo.save(newAlbum);
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return this.albumRepo.update(id, updateAlbumDto);
  }
}
