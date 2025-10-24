import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/**
 * UsersService
 * This service provides functionality for managing users.
 */
@Injectable()
export class UsersService {
  /**
   * Constructor
   * @param usersRepository User repository
   */
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Finds all users
   * @returns All users
   */
  async findAll() {
    return await this.usersRepository.find();
  }

  /**
   * Finds a user by id
   * @param id User id
   * @returns Found user
   * @throws NotFoundException - if user not found
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
   * @param user User to create
   * @returns Created user
   */
  async create(user: Partial<User>) {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  /**
   * Updates a user
   * @param id User id
   * @param updateUserDto User to update
   * @returns Updated user
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const isEmailChanged = updateUserDto.email !== user.email;
    if (isEmailChanged && updateUserDto.email) {
      await this.validateEmail(updateUserDto.email);
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = await this.generateHashedPassword(updateUserDto.password);
    }

    return await this.usersRepository.save(user);
  }

  /**
   * Removes a user
   * @param id User id
   */
  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  /**
   * Validates uniqueness of user email
   * @param email User email
   * @throws ConflictException - if user with email already exists
   */
  async validateEmail(email: string) {
    const isEmailExists = await this.usersRepository.existsBy({
      email,
    });

    if (isEmailExists) {
      throw new ConflictException(`User with email ${email} already exists`);
    }
  }

  /**
   * Finds a user by email
   * @param email User email
   * @returns Found user
   * @throws NotFoundException - if user not found
   */
  async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Generates a hashed password for a given password.
   * Uses bcrypt's genSalt() and hash() functions to generate the hashed password.
   * @param password Password to hash
   * @returns Hashed password
   */
  async generateHashedPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
