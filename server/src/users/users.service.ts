import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/**
 * UsersService
 *
 * This service provides functionality for managing users.
 */
@Injectable()
export class UsersService {
  private readonly adminSecret: string;

  /**
   * Constructor
   *
   * @param usersRepository - User repository
   */
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Finds all users
   *
   * @returns all users
   */
  async findAll() {
    return await this.usersRepository.find();
  }

  /**
   * Finds a user by id
   *
   * @param id - user id
   * @returns found user
   * @throws NotFoundException if user not found
   */
  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  /**
   * Creates a new user
   *
   * @param user - user to create
   * @returns created user
   */
  async create(user: Partial<User>) {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  /**
   * Updates a user
   *
   * @param id - user id
   * @param updateUserDto - user to update
   * @returns updated user
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    await this.validateUniqueness(updateUserDto);

    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return await this.usersRepository.save(updatedUser);
  }

  /**
   * Removes a user
   *
   * @param id - user id
   */
  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  /**
   * Validates uniqueness of user
   *
   * @param dto - user to validate
   * @throws ConflictException if user with email already exists
   */
  async validateUniqueness(dto: CreateUserDto | UpdateUserDto) {
    const { email } = dto;

    const isEmailExists = await this.usersRepository.existsBy({ email });

    if (isEmailExists) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
  }

  /**
   * Finds a user by email
   *
   * @param email - user email
   * @returns found user
   * @throws NotFoundException if user not found
   */
  async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Converts user to response DTO
   *
   * @param user - user to convert
   * @returns converted user
   */
  toResponseDto(user: User) {
    const { password, ...result } = user;
    return result;
  }
}
