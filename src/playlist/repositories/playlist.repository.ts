import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from '../entities/playlist.entity';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { UpdatePlaylistDto } from '../dto/update-playlist.dto';
import { Music } from 'src/music/entities/music.entity';

@Injectable()
export class PlaylistRepository {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}

  async createPlaylist(
    createPlaylistDto: CreatePlaylistDto,
    musics: Music[] = [],
  ): Promise<Playlist> {
    const newPlaylist = this.playlistRepository.create({
      name: createPlaylistDto.name,
      description: createPlaylistDto.description,
      musics: musics,
    });
    return await this.playlistRepository.save(newPlaylist);
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistRepository.find({ relations: ['musics'] });
  }

  async findOne(id: number): Promise<Playlist> {
    return this.playlistRepository.findOne({
      where: { id },
      relations: ['musics'],
    });
  }

  async update(
    id: number,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    await this.playlistRepository.update(id, updatePlaylistDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.playlistRepository.delete(id);
  }
}
