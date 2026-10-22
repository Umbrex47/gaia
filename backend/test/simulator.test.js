const test = require('node:test');
const assert = require('node:assert');
const { SimulatorService } = require('../dist/simulator/simulator.service');

test('SimulatorService - Initial state and autonomous valve trigger', (t) => {
  const service = new SimulatorService();
  const initial = service.getState();
  assert.strictEqual(initial.soilMoisture, 42);
  assert.strictEqual(initial.actuators.valveOpen, false);

  // Trigger moisture drop
  const updated = service.updateVariables({ soilMoisture: 18 });
  assert.strictEqual(updated.actuators.valveOpen, true);
  assert.strictEqual(updated.eventLogs[0].agent, 'HydroAgent');
  assert.strictEqual(updated.eventLogs[0].type, 'action');
});

test('SimulatorService - Sentinel drone pest dispatch', (t) => {
  const service = new SimulatorService();
  // Install drone
  service.updateVariables({ installedHardware: { drone: true } });
  
  // Trigger pest infestation
  const updated = service.updateVariables({ pestPressure: 45 });
  assert.strictEqual(updated.actuators.droneFlying, true);
  assert.strictEqual(updated.actuators.droneMission, 'spraying_biocontrol');
  assert.strictEqual(updated.eventLogs[0].agent, 'SentinelAgent');
});

test('SimulatorService - Weather Presets', (t) => {
  const service = new SimulatorService();
  const drought = service.applyPreset('drought');
  assert.strictEqual(drought.weatherPreset, 'drought');
  assert.strictEqual(drought.temperature, 36);

  const frost = service.applyPreset('frost');
  assert.strictEqual(frost.weatherPreset, 'frost');
  assert.strictEqual(frost.temperature, 2);
});
