import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';
import { SearchQueryDto } from 'src/search/dtos/search-query.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll(@Query() searchQueryDto: SearchQueryDto) {
    return this.artistService.findAll(searchQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistService.update(Number(id), updateArtistDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.artistService.delete(Number(id));
  }
}
