
-- Extensions
-- ----------------------------------------------------

create extension if not exists "uuid-ossp";


-- Tables and views
-- ----------------------------------------------------

-- Message header
create table if not exists public.t_message_header(
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
create table if not exists public.t_measurement(
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
create table if not exists public.t_meter_data(
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


-- Meter data total set
drop view if exists public.v_meter_data_set;
create view public.v_meter_data_set as
select
    meda.pk,
    meda.smgw_id,
    meda.logical_device_id,
    meda.raw_data,
    mehe.message_id,
    mehe.correlation_id,
    mehe.time_sent,
    mehe.instance_id,
    mehe.tenant_id,
    mehe.meter_operator_id,
    mehe.external_market_participant_id,
    mehe.routing_key_service_bus ,
    mehe.routing_key_extern,
    meas.obis,
    meas.capture_period,
    meas.entry_timestamp,
    meas.entry_value,
    meas.entry_scaler,
    meas.entry_unit,
    meas.entry_status
from t_meter_data meda
left join public.t_message_header mehe on meda.message_header_fk = mehe.pk
left join public.t_measurement meas on meda.measurement_fk = meas.pk;


-- Users
create table if not exists public.t_users (
	pk uuid primary key default uuid_generate_v4(),
	name text unique not null,
	password text not null,
	company text,
	created_at timestamp default now(),
	email text,
	is_admin boolean default false
);

drop view if exists public.v_users;
create view public.v_users as
select
	pk "pk",
	name "name",
	password "password",
	company "company",
	created_at "createdAt",
	email "email",
	is_admin "isAdmin"
from public.t_users;

insert into public.t_users ( name, password, is_admin ) values ('oli', 'a-bcrypt-$2b$-hashed-password', true);
insert into public.t_users (name, password, is_admin ) values ('enbw', 'a-bcrypt-$2b$-hashed-password', false);
