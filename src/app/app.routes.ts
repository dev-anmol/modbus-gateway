import { Routes } from '@angular/router';
import { Device } from '../components/device/device';
import { ModbusServer } from '../components/modbus-server/modbus-server';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'device'
  }, {
    path: 'device',
    loadComponent: () => import('../components/device/device').then(m => m.Device)
  }, {
    path: 'modbus-server',
    pathMatch: 'full',
    loadComponent: () => import('../components/modbus-server/modbus-server').then(m => m.ModbusServer)
  }, {
    path: '**',
    loadComponent: () => import('../components/device/device').then(m => m.Device)
  }
];
