import Keycloak = require('keycloak-connect');
import session = require('express-session');
import { logger } from './logger';

var keycloak: any;


export function initKeycloak() {
    if (keycloak) {
        
        logger.warning("trying to init keycloak again!");
        return keycloak;
    } 
    else {
        
        logger.info("initializing keycloak");
        var memoryStore = new session.MemoryStore();
        keycloak = new Keycloak({ store: memoryStore });

        logger.info(keycloak.getConfig());
        return keycloak;
    }
}

export function getKeycloak() {
    if (!keycloak){

        logger.error('keycloak has not been initialized. please called init first.');
    } 
    return keycloak;
}
