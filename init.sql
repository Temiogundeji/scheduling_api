-- Patient's Table

CREATE TABLE "patients"
(
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    role_id integer DEFAULT 3 references roles (id) ON DELETE CASCADE,
    patient_fname varchar(120) NOT NULL,
    patient_lname varchar(120) NOT NULL,
    email varchar(120) UNIQUE NOT NULL,
    pwd varchar(120) NOT NULL,
    patient_img varchar(120) NOT NULL,
    genotype varchar(120) NOT NULL,
    blood_group varchar(120) NOT NULL,
    frequent_ailment text NOT NULL,
    created_date timestamp,
    modified_date timestamp
);

-- Doctor's Table 
CREATE TABLE "doctors" (
    id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    role_id integer DEFAULT 2 references roles (id) ON DELETE CASCADE,
    doctor_fname varchar(120) NOT NULL,
    doctor_lname varchar(120) NOT NULL,
    doctor_img varchar(120) NOT NULL,
    email varchar(120) NOT NULL,
    pwd varchar(120) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_date timestamp NOT NULL,
    modified_date timestamp NOT NULL
);

-- Appointment's Table 
CREATE TABLE "appointments" 
(
    id SERIAL NOT NULL PRIMARY KEY,
    doctor_id integer NOT NULL REFERENCES doctors (id) ON DELETE CASCADE,
    patient_id integer NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    complaint text NOT NULL,
    appointment_status integer DEFAULT 0,
    appointment_date DATE NOT NULL,
    created_at timestamp NOT NULL
);

CREATE TABLE "Message"
(
    message_id integer NOT NULL PRIMARY KEY,
    message_body text NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL
);

CREATE TABLE "Admin"
(
    admin_id integer NOT NULL PRIMARY KEY,
    admin_username varchar(120) NOT NULL,
    admin_pwd varchar(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
    id SERIAL NOT NULL PRIMARY KEY,
    patient_fname varchar(120) NOT NULL,
    patient_lname varchar(120) NOT NULL,
    email varchar(120) NOT NULL,
    pwd varchar(120) NOT NULL,
    genotype varchar(120) NOT NULL,
    blood_group varchar(120) NOT NULL,
    frequent_ailment text NOT NULL,
    created_date timestamp,
    modified_date timestamp
);
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL NOT NULL PRIMARY KEY,
    doctor_id integer NOT NULL,
    patient_id integer NOT NULL,
    complaint text NOT NULL,
    appointment_status boolean NOT NULL,
    appointment_date timestamp NOT NULL,
    created_date timestamp NOT NULL,
    modified_date timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS doctors (
    id integer NOT NULL PRIMARY KEY,
    doctor_fname varchar(120) NOT NULL,
    doctor_lname varchar(120) NOT NULL,
    email varchar(120) NOT NULL,
    pwd varchar(120) NOT NULL,
    specialization varchar(120) NOT NULL,
    img varchar(120) NOT NULL,
    start_time timestamp NOT NULL,
    end_time timestamp NOT NULL,
    role_id,
    created_date timestamp NOT NULL,
    modified_date timestamp NOT NULL
);
