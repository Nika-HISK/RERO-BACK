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
      musics: musics,
    });
    return await this.playlistRepository.save(newPlaylist);
  }

  async findAll(): Promise<Playlist[]> {
    return await this.playlistRepository.createQueryBuilder('playlist')
    .leftJoinAndSelect('playlist.musics', 'music')
    .leftJoinAndSelect('music.artist', 'artist')
    .getMany()

  }

  async findOne(id: number): Promise<Playlist> {
    return await this.playlistRepository.findOne({
      where: { id },
      relations: ['musics'],
    });
  }

  async update(
    id: number,
    updatePlaylistDto: UpdatePlaylistDto,
    musics: Music[] = [],
  ): Promise<Playlist> {
    const existingPlaylist = await this.findOne(id);
    if (!existingPlaylist) {
      throw new Error('Playlist not found');
    }

    const updatedPlaylist = {
      ...existingPlaylist,
      name: updatePlaylistDto.name ?? existingPlaylist.name,

      musics: musics.length > 0 ? musics : existingPlaylist.musics,
    };

    return await this.playlistRepository.save(updatedPlaylist);
  }

  async delete(id: number): Promise<void> {
    await this.playlistRepository.delete(id);
  }
}
