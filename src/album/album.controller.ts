import { Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dtos/create-album.dto';
import { UpdateAlbumDto } from './dtos/update-album.dto';

@Controller('album')
export class AlbumController {

    constructor(private readonly AlbumService: AlbumService) { }

    @Post()
    create(@Body() createAlbumDto: CreateAlbumDto) {
        return this.AlbumService.create(createAlbumDto)
    }

    @Get()
    findAll() {
        return this.AlbumService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.AlbumService.findOne(Number(id))
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
        return this.AlbumService.update(Number(id), updateAlbumDto)
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.AlbumService.delete(Number(id))
    }

}
