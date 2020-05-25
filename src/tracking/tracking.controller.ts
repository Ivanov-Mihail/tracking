import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GeoPointDTO } from 'src/db/dto/geo_point.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { TrackingService } from './tracking.service';

@UseGuards(AuthGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingSvc:TrackingService) {

  }

  @Post('locations') // localhost:3001/tracking/location
  async SaveDriverReport( @Body('data') locations: GeoPointDTO[], @Body('id') id: number){
      await this.trackingSvc.SaveDriverReports(locations, id);
  }

  @Get('locations') // localhost:3001/tracking/location
  async GetDriverReports(@Query('driver_id') driverId:number, @Query('start_date') startDate:string, @Query('end_date') endDate:string) {
    const dbPoints =  await this.trackingSvc.GetDriverReports(driverId, startDate, endDate);
    const result:GeoPointDTO[] = [];
    for(let i = 0; i < dbPoints.length; i++){
      result.push(await GeoPointDTO.fromDbPoint(dbPoints[i]));
    }
    return {data:result};
  }
}
