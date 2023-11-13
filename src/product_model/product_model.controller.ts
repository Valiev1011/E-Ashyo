import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductModelService } from './product_model.service';
import { CreateProductModelDto } from './dto/create-product_model.dto';
import { UpdateProductModelDto } from './dto/update-product_model.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ProductModel')
@Controller('product-model')
export class ProductModelController {
  constructor(private readonly productModelService: ProductModelService) {}

  @ApiOperation({ summary: 'Create a new model' })
  @Post('create')
  create(@Body() createProductModelDto: CreateProductModelDto) {
    return this.productModelService.create(createProductModelDto);
  }

  @ApiOperation({ summary: 'Get all models' })
  @Get('get-all')
  findAll() {
    return this.productModelService.findAll();
  }

  @ApiOperation({ summary: 'Get model by Id' })
  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.productModelService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update model by Id' })
  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateProductModelDto: UpdateProductModelDto,
  ) {
    return this.productModelService.update(+id, updateProductModelDto);
  }

  @ApiOperation({ summary: 'Delete model by Id' })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.productModelService.remove(+id);
  }
}