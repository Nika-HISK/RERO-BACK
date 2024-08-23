import { Music } from 'src/music/entities/music.entity';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PlaylistRepository } from './repositories/playlist.repository';
import { MusicService } from 'src/music/music.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly musicService: MusicService,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const musicEntities: Music[] = [];

    if (createPlaylistDto.musics && createPlaylistDto.musics.length > 0) {
      for (const musicDto of createPlaylistDto.musics) {
        let music: Music;

        if (musicDto.id) {
          music = await this.musicService.findOne(musicDto.id);
          if (!music) {
            throw new Error(`Music not found for ID: ${musicDto.id}`);
          }
        }
        musicEntities.push(music);
      }
    }
    return this.playlistRepository.createPlaylist(
      createPlaylistDto,
      musicEntities,
    );
  }
  async update(
    id: number,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    let musicEntities: Music[] = [];

    if (updatePlaylistDto.musics && updatePlaylistDto.musics.length > 0) {
      for (const musicDto of updatePlaylistDto.musics) {
        let music: Music;

        if (musicDto.id) {
          music = await this.musicService.findOne(musicDto.id);
          if (!music) {
            throw new Error(`Music not found for ID: ${musicDto.id}`);
          }
        } else {
          music = await this.musicService.create(musicDto);
        }

        musicEntities.push(music);
      }
    }

    return this.playlistRepository.update(id, updatePlaylistDto, musicEntities);
  }

  async findOne(id: number): Promise<Playlist> {
    return this.playlistRepository.findOne(id);
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistRepository.findAll();
  }

  async delete(id: number): Promise<void> {
    await this.playlistRepository.delete(id);
  }
}
