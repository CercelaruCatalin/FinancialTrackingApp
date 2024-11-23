select * from "ACCOUNTS";
select * from "SAVINGS";
select * from "EXPENSES";
select * from "INCOMES";
select * from "BUDGETS";
select * from "INC_CATEGORIES";
select * from "EXP_CATEGORIES";

UPDATE "BUDGETS"
SET "AMOUNT"=2851
WHERE "ID_BUDGET"=1;

----------------------------------ACCOUNTS

CREATE TABLE "ACCOUNTS"(
	"A_ID" INT GENERATED ALWAYS AS identity(START WITH 1 INCREMENT BY 1) NOT NULL primary key,
	"LAST_NAME" VARCHAR(50) NOT NULL,
	"FIRST_NAME" VARCHAR(80) NOT NULL,
	"EMAIL" VARCHAR(50) NOT NULL,
	"PASSWORD" VARCHAR(40) NOT NULL
);

----------------SAVINGS

CREATE TABLE "SAVINGS"(
	"ID_SAV" INT GENERATED ALWAYS AS identity(START WITH 1 INCREMENT BY 1) NOT NULL primary key,
	"ID_PERSON" INT NOT NULL,
	"TARGET_AMOUNT" INT NOT NULL,
	"PRESENT_AMOUNT" INT NOT NULL DEFAULT 0,
	CONSTRAINT "POSITIVE_TARGET_AMOUNT" CHECK ("TARGET_AMOUNT" >= 1),
	CONSTRAINT "POSITIVE_PRESENT_AMOUNT" CHECK ("PRESENT_AMOUNT" >= 0),
	CONSTRAINT "FK_ID_PERSON" FOREIGN KEY ("ID_PERSON") REFERENCES "ACCOUNTS"("A_ID")
);

ALTER TABLE "SAVINGS"
ADD "DESCRIPTION" VARCHAR(200) NOT NULL;

----------------------EXPENSES

CREATE TABLE "EXPENSES"(
	"ID_EXP" INT GENERATED ALWAYS AS identity(START WITH 1 INCREMENT BY 1) NOT NULL primary key,
	"ID_PERSON" INT NOT NULL UNIQUE,
	"AMOUNT_PAID" INT NOT NULL,
	"FINAL_DATE" DATE,
	"DESCRIPTION" VARCHAR(200) NOT NULL,
	CONSTRAINT "FINAL_DATE_CHECK" CHECK ("FINAL_DATE">=CURRENT_DATE),
	CONSTRAINT "POSITIVE_AMOUNT_PAID" CHECK ("AMOUNT_PAID" > 0),
	CONSTRAINT "FK_ID_PERSON" FOREIGN KEY ("ID_PERSON") REFERENCES "ACCOUNTS"("A_ID")
	
);

ALTER TABLE "EXPENSES"
DROP CONSTRAINT "EXPENSES_ID_PERSON_key";

ALTER TABLE "EXPENSES"
ADD "E_CATEGORY" VARCHAR(60) NOT NULL;

ALTER TABLE "EXPENSES"
ADD CONSTRAINT "FK_E_CATEGORY"
FOREIGN KEY ("E_CATEGORY")
REFERENCES "EXP_CATEGORIES"("CATEGORY") ON UPDATE CASCADE;

--------------------------INCOMES

CREATE TABLE "INCOMES"(
	"ID_INCOME" INT GENERATED ALWAYS AS identity(START WITH 1 INCREMENT BY 1) PRIMARY KEY,
	"ID_PERSON" INT UNIQUE NOT NULL,
	"AMOUNT_TAKEN" INT NOT NULL,
	"PAYMENT_DATE" DATE,
	"DESCRIPTION" VARCHAR(200) NOT NULL,
	CONSTRAINT "FK_ID_PERSON" FOREIGN KEY ("ID_PERSON") REFERENCES "ACCOUNTS"("A_ID"),
	CONSTRAINT "POSITIVE_AMOUNT_TAKEN" CHECK ("AMOUNT_TAKEN" > 0),
	CONSTRAINT "PAYMENT_DATE_VALABILITY" CHECK ("PAYMENT_DATE" >= CURRENT_DATE)

);

ALTER TABLE "INCOMES"
ADD CONSTRAINT "FK_I_CATEGORY"
FOREIGN KEY ("I_CATEGORY")
REFERENCES "INC_CATEGORIES"("CATEGORY") ON UPDATE CASCADE;

ALTER TABLE "EXPENSES"
DROP CONSTRAINT "FK_E_CATEGORY";

DELETE FROM "INC_CATEGORIES" WHERE "CATEGORY" = 'Bani Primiti';

ALTER TABLE "INCOMES"
ADD "I_CATEGORY" VARCHAR(60) NOT NULL;

-------BUDGETS
	
CREATE TABLE "BUDGETS"(
	"ID_BUDGET" INT  PRIMARY KEY,
	"AMOUNT" INT NOT NULL,
	CONSTRAINT "FK_ID_BUDGET" FOREIGN KEY ("ID_BUDGET") REFERENCES "ACCOUNTS"("A_ID"),
	CONSTRAINT "POSITIVE_AMOUNT" CHECK("AMOUNT" >= 0)

);


-------Expenses CATEGORIES

CREATE TABLE "EXP_CATEGORIES"(
	"ID_CATEGORY" INT GENERATED ALWAYS AS identity(START WITH 1 INCREMENT BY 1) PRIMARY KEY,
	"CATEGORY" VARCHAR(60) NOT NULL UNIQUE
);

INSERT INTO "EXP_CATEGORIES" ("CATEGORY") VALUES('HAINE');

-------Incomes categories
CREATE TABLE "INC_CATEGORIES"(
	"ID_CATEGORY" INT GENERATED ALWAYS AS identity(START WITH 1 INCREMENT BY 1) PRIMARY KEY,
	"CATEGORY" VARCHAR(60) NOT NULL UNIQUE
);

INSERT INTO "INC_CATEGORIES" ("CATEGORY") VALUES('VANZARI');

DELETE FROM "INC_CATEGORIES" WHERE "CATEGORY"= 'UTILITATI';



--------
ALTER TABLE ""
ALTER COLUMN "" TYPE INT USING ""::integer;

-------
ALTER TABLE ""
	ADD CONSTRAINT "" UNIQUE ("");
	
-------

ALTER TABLE ""
DROP CONSTRAINT ... CASCADE;

---------

SELECT "CATEGORIES"."CATEGORY" as category, "EXPENSES"."AMOUNT_PAID" as amount
from "CATEGORIES"
left Join "EXPENSES" ON "CATEGORIES"."CATEGORY"="EXPENSES"."E_CATEGORY"
GROUP BY "CATEGORIES"."CATEGORY", "EXPENSES"."AMOUNT_PAID";


