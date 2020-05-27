import Keycloak = require('keycloak-connect');
import session = require('express-session');
import { logger } from './logger';
import { config } from './config'

var keycloak: any;


export function initKeycloak() {
    if (keycloak) {
        
        logger.warning("trying to init keycloak again!");
        return keycloak;
    } 
    else {
        
        var memoryStore = new session.MemoryStore();
        if (process.env.NODE_ENV === 'production') {
            logger.info("initializing keycloak production");
            logger.info({ keycloakConfig: config.keycloak.prod })
            keycloak = new Keycloak({ store: memoryStore }, config.keycloak.prod);            
        } else {
            logger.info("initializing keycloak develop");
            logger.info({ keycloakConfig: config.keycloak.dev })
            keycloak = new Keycloak({ store: memoryStore }, config.keycloak.dev);
        }

        return keycloak;
    }
}

export function getKeycloak() {
    if (!keycloak){

        logger.error('keycloak has not been initialized. please called init first.');
    } 
    return keycloak;
}
