import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Music } from './entities/music.entity';
import { Repository } from 'typeorm';
import { CreateMusicDto } from './dtos/create-music.dto';
import { UpdateMusicDto } from './dtos/update-music.dto';

@Injectable()
export class MusicRepository {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
  ) {}

  CreateMusic(data: CreateMusicDto) {
    const newMusic = new Music();

    newMusic.name = data.name;
    newMusic.url = data.url;

    return this.musicRepository.save(newMusic);
  }

  findAll() {
    return this.musicRepository.find();
  }

  findOne(id: number) {
    return this.musicRepository.findOneBy({ id });
  }

  create(data: Object) {}

  remove(id: number) {
    return this.musicRepository.delete(id);
  }

  update(id: number, data: UpdateMusicDto) {
    return `updates ${data} on id ${id}`;
  }
}
