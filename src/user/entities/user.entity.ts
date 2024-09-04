import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from 'src/playlist/entities/playlist.entity';
import { Listener } from 'src/listeners/entities/listener.entity';
import { IsEnum } from 'class-validator';

enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToMany(() => Listener, (listener) => listener.user)
  listeners: Listener[];

  @ManyToMany(() => Playlist, (playlist) => playlist.users)
  playlists: Playlist[];
}
