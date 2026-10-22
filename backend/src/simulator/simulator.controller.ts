import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SimulatorService, SimulatorState } from './simulator.service';

@Controller('api/simulator')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  @Get('state')
  getState(): SimulatorState {
    return this.simulatorService.getState();
  }

  @Post('update')
  updateVariables(@Body() partial: Partial<SimulatorState>): SimulatorState {
    return this.simulatorService.updateVariables(partial);
  }

  @Post('preset/:preset')
  applyPreset(@Param('preset') preset: any): SimulatorState {
    return this.simulatorService.applyPreset(preset);
  }

  @Post('hardware/toggle/:key')
  toggleHardware(@Param('key') key: any): SimulatorState {
    return this.simulatorService.toggleHardware(key);
  }
}
