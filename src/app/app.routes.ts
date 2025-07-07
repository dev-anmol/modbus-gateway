import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'device'
  }, {
    path: 'device',
    loadComponent: () => import('../components/device/device').then(m => m.Device)
  }, {
    path: 'device/:id',
    loadComponent: () => import('../components/add-device/add-device').then(m => m.AddDevice)
  }, {
    path: 'modbus-server',
    pathMatch: 'full',
    loadComponent: () => import('../components/modbus-server/modbus-server').then(m => m.ModbusServer)
  }, {
    path: '**',
    loadComponent: () => import('../components/device/device').then(m => m.Device)
  }
];
