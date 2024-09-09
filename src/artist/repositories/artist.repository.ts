import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Artist } from "../entities/artist.entity";
import { CreateArtistDto } from "../dtos/create-artist.dto";
import { UpdateArtistDto } from "../dtos/update-artist.dto";



@Injectable()
export class ArtistRepository {
    constructor(
        @InjectRepository(Artist)
        private readonly artistRepo: Repository<Artist>
    ) { }
    async findAll(search?: string) {
        const sql = this.artistRepo.createQueryBuilder('artist')
            .leftJoinAndSelect('artist.albums', 'album')
            .leftJoinAndSelect('album.musics', 'albumHits') 
            .leftJoinAndSelect('artist.musics', 'music');    
    
        if (search) {
            sql.where('artist.artistName LIKE :search', { search: `%${search}%` });
        }
    
        const artists = await sql.getMany();
        return artists

    }
    findOne(id: number) {
        return this.artistRepo.findOneBy({ id })
    }

    create(data: CreateArtistDto) {
        const newArtist = this.artistRepo.create(data)
        return this.artistRepo.save(newArtist)
    }

    update(id: number, data: UpdateArtistDto) {
        return this.artistRepo.update(id, data)
    }

    delete(id: number) {
        return this.artistRepo.delete(id)
    }
   
}
