
-- Extensions
-- ----------------------------------------------------
create extension if not exists "uuid-ossp";


-- Tables and views
-- ----------------------------------------------------

-- Message header
drop table if exists public.t_message_header cascade;
create table public.t_message_header(
    pk uuid default uuid_generate_v4() primary key,
    message_id text,
    correlation_id text,
    time_sent text,
    instance_id text,
    tenant_id text,
    meter_operator_id text,
    external_market_participant_id text,
    routing_key_service_bus text,
    routing_key_extern text
);

drop view if exists public.v_message_header cascade;
create view public.v_message_header as
select
    pk "pk",
    message_id "messageId",
    correlation_id "correlationId",
    time_sent "timeSent",
    instance_id "instanceId",
    tenant_id "tenantId",
    meter_operator_id "meterOperatorId",
    external_market_participant_id "externalMarketParticipantId",
    routing_key_service_bus "routingKeyServiceBus",
    routing_key_extern "routingKeyExtern"
from public.t_message_header;


-- Measurement
drop table if exists public.t_measurement cascade;
create table public.t_measurement(
    pk uuid default uuid_generate_v4() primary key,
    obis text,
    capture_period text,
    entry_timestamp text,
    entry_value text,
    entry_scaler integer,
    entry_unit text,
    entry_status text
);

drop view if exists public.v_measurement cascade;
create view public.v_measurement as
select
    pk "pk",
    obis "obis",
    capture_period "capturePeriod",
    entry_timestamp "entryTimestamp",
    entry_value "entryValue",
    entry_scaler "entryScaler",
    entry_unit "entryUnit",
    entry_status "entryStatus"
from public.t_measurement;


-- Meter data
drop table if exists public.t_meter_data cascade;
create table public.t_meter_data(
    pk uuid default uuid_generate_v4() primary key,
    message_header_fk uuid,
    smgw_id text,
    logical_device_id text,
    measurement_fk uuid,
    raw_data text,
    foreign key (message_header_fk) references public.t_message_header (pk) on delete cascade on update cascade,
    foreign key (measurement_fk) references public.t_measurement (pk) on delete cascade on update cascade
);

drop view if exists public.v_meter_data cascade;
create view public.v_meter_data as
select
    pk "pk",
    message_header_fk "messageHeaderFK",
    smgw_id "smgwId",
    logical_device_id "logicalDeviceId",
    measurement_fk "measurementFK",
    raw_data "rawData"
from public.t_meter_data;