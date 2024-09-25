import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Music } from 'src/music/entities/music.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Listener {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  musicId:number

  @CreateDateColumn({nullable:true})
  createdAt: Date;

  @ManyToOne(() => Music, (music) => music.listeners, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  music: Music;

}
