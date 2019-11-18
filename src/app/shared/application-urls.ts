
import { environment } from '../../environments/environment';

const envUrlAppends = {
    baseApi: environment.url,
    auth: environment.url + '/auth',
    devices: environment.url + '/device',
    areas: environment.url + '/area',
    groups: environment.url + '/group'
};

export const ApplicationUrls = {
    baseApi: envUrlAppends.baseApi,
    device: {
        getAllDevices: envUrlAppends.devices + '/alldevicedata',
        singleDevice: envUrlAppends.devices + '/devicedata',
        addDevice: envUrlAppends.devices + '/add-device',
        deleteDevice: envUrlAppends.devices + '/delete-device',
        deviceByGroupId: envUrlAppends.devices + '/devicebygroup',
        updateMultipleDevices: envUrlAppends.devices + '/updateMultipleDevices'
    },
    area: {
        getAllAreas: envUrlAppends.areas + '/allareas',
        addArea: envUrlAppends.areas + '/addarea'
    },
    groups: {
        getAllGroups: envUrlAppends.groups + '/allgroups',
        addGroup: envUrlAppends.groups + '/addgroup',
        setGroupVoltage: envUrlAppends.groups + '/setgroupvoltage'
    },
    auth: {
        login: envUrlAppends.auth + '/login'
    }
}