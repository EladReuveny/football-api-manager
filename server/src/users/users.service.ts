import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/**
 * UsersService
 * This service provides functionality for managing users.
 */
@Injectable()
export class UsersService {
  private readonly baseCacheKey = 'users';

  /**
   * Constructor
   * @param usersRepository User repository
   * @param redisService Redis service
   */
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Gets a user's profile by ID.
   * @param id User ID
   * @returns Found user's profile
   */
  async getProfile(id: number) {
    const user = await this.findOne(id);
    const { password, ...result } = user;

    return result as Partial<User>;
  }

  /**
   * Get all users with pagination.
   *
   * @param {PaginationQueryDto} query - The pagination query parameters.
   * @returns The paginated list of users.
   */
  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;

    const cached = await this.redisService.get<PaginationResponseDto<User>>(
      `${this.baseCacheKey}:page=${page}:limit=${limit}`,
    );
    if (cached) {
      return cached;
    }

    const offset = (page - 1) * limit;

    const [items, total] = await this.usersRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    const totalPages = Math.ceil(total / limit);

    const response = {
      items,
      currentPage: page,
      limit,
      totalItems: total,
      totalPages,
    } as PaginationResponseDto<User>;

    await this.redisService.set(
      `${this.baseCacheKey}:page=${page}:limit=${limit}`,
      response,
    );

    return response;
  }

  /**
   * Finds a user by id
   * @param id User id
   * @returns Found user
   * @throws NotFoundException - if user not found
   */
  async findOne(id: number) {
    const cached = await this.redisService.get<User>(
      `${this.baseCacheKey}:${id}`,
    );
    if (cached) {
      return cached;
    }

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.redisService.set(`${this.baseCacheKey}:${id}`, user);

    return user;
  }

  /**
   * Creates a new user
   * @param user User to create
   * @returns Created user
   */
  async create(user: Partial<User>) {
    const newUser = this.usersRepository.create(user);
    await this.redisService.invalidateByPattern(`${this.baseCacheKey}*`);
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

    const isPasswordUpdateIncomplete =
      (updateUserDto.newPassword && !updateUserDto.confirmPassword) ||
      (!updateUserDto.newPassword && updateUserDto.confirmPassword);
    if (isPasswordUpdateIncomplete) {
      throw new BadRequestException(
        'New password and confirm password must be provided together',
      );
    }
    if (updateUserDto.newPassword && updateUserDto.confirmPassword) {
      const isPasswordEqual =
        updateUserDto.newPassword === updateUserDto.confirmPassword;
      if (!isPasswordEqual) {
        throw new BadRequestException(
          'New password and confirm password must be the same',
        );
      }
      user.password = await this.generateHashedPassword(
        updateUserDto.newPassword,
      );
    }

    await this.redisService.invalidateByPattern(`${this.baseCacheKey}*`);

    return await this.usersRepository.save(user);
  }

  /**
   * Removes a user
   * @param id User id
   */
  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    await this.redisService.invalidateByPattern(`${this.baseCacheKey}*`);
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

  /**
   * Saves a user.
   * @param user The user to save
   * @returns The saved user
   */
  async save(user: User) {
    return await this.usersRepository.save(user);
  }
}
