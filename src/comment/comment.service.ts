import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentRepo: typeof Comment,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  async create(createCommentDto: CreateCommentDto, accessToken: string) {
    try {
      await this.productService.findById(createCommentDto.product_id);
      await this.userService.findOne(createCommentDto.user_id);
      const comment = await this.commentRepo.create(createCommentDto);
      return { message: 'Created successfully', comment };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    const comments = await this.commentRepo.findAll({ include: { all: true } });
    return comments;
  }

  async findOne(id: number) {
    const comment = await this.commentRepo.findByPk(id, {
      include: { all: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found with such id');
    }
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.findOne(id);
    const updated = await this.commentRepo.update(updateCommentDto, {
      where: { id },
      returning: true,
    });
    if (!updated[0]) {
      throw new BadRequestException('Error, please check before you update');
    }
    return {
      message: 'Updated successfully',
      product: updated[1][0].dataValues,
    };
  }

  async remove(id: number) {
    const comment = await this.findOne(id);
    await comment.destroy();
    return { message: 'Deleted successfull' };
  }
}
