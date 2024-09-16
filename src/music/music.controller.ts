import { Controller, Post, UploadedFiles, UseInterceptors, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dtos/create-music.dto';
import { UpdateMusicDto } from './dtos/update-music.dto';
import { Role } from 'src/auth/guard/enum/role.enum';
import { Roles } from 'src/auth/guard/jwt-roles.guard';


const ffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfprobePath(ffprobePath);
@Controller('music')
export class MusicController {
  constructor(
    private readonly musicService: MusicService,
    private readonly filesService: FilesService,
  ) {}

  @Roles(Role.USER, Role.ADMIN)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'musicAudio', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ])
  )
  async create(
    @UploadedFiles()
    files: {
      musicAudio?: any;
      coverImage?: Express.Multer.File[];
    },
    @Body() createMusicDto: CreateMusicDto,
  ) {
    let duration: number | undefined;
    
    duration = await new Promise<number>((resolve, reject) => {
      ffmpeg.ffprobe('https://reroapp-bucket.s3.amazonaws.com/NF_-_The_Search_CeeNaija.com_.mp3', (err, metadata) => {
        if (err) {
          return reject(err);
        }
        resolve(metadata.format.duration);
      });
    });
    if (files.musicAudio && files.musicAudio[0]) {
      const musicAudio = files.musicAudio[0];
      createMusicDto.musicAudio = (await this.filesService.uploadFile(musicAudio)).url;

      try {
        duration = await this.filesService.extractAudioDuration(musicAudio.buffer);
      } catch (error) {
        console.error('Error extracting audio duration:', error);
      }
    }

    if (files.coverImage && files.coverImage[0]) {
      const uploadedCover = await this.filesService.uploadFile(files.coverImage[0]);
      createMusicDto.coverImage = uploadedCover.url;
    }
    const durationString = duration ? this.formatDuration(duration) : undefined;
    return this.musicService.create(createMusicDto, durationString);
  }

  private formatDuration(durationInSeconds: number): string {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get()
  findAll() {
    return this.musicService.findAll();
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicService.findOne(Number(id));
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
    return this.musicService.update(Number(id), updateMusicDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicService.remove(Number(id));
  }
}
